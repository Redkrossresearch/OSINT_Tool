import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { TokenBucketRateLimiter, type RateLimitEvent, type RateLimiter } from '../rate-limiter.js';

describe('TokenBucketRateLimiter rate limit enforcement', () => {
  it('grants up to the configured capacity per interval immediately', async () => {
    const limiter: RateLimiter = new TokenBucketRateLimiter({
      requestsPerInterval: 3,
      intervalMs: 10_000,
    });

    const started = Date.now();
    await Promise.all([limiter.acquire(), limiter.acquire(), limiter.acquire()]);
    const elapsed = Date.now() - started;

    assert.equal(limiter.pending, 0);
    assert.ok(elapsed < 1_000, `expected immediate grants, took ${elapsed}ms`);
  });
});

describe('TokenBucketRateLimiter queueing', () => {
  it('queues requests when the bucket is empty and releases them spaced by the interval', async () => {
    const limiter: TokenBucketRateLimiter = new TokenBucketRateLimiter({
      requestsPerInterval: 1,
      intervalMs: 60,
    });

    const completions: number[] = [];
    const start = Date.now();
    const all = Promise.all([
      limiter.acquire().then(() => completions.push(Date.now() - start)),
      limiter.acquire().then(() => completions.push(Date.now() - start)),
      limiter.acquire().then(() => completions.push(Date.now() - start)),
    ]);

    assert.ok(limiter.pending >= 2, 'subsequent requests should be queued');

    await all;
    assert.equal(limiter.pending, 0);
    assert.equal(completions.length, 3);

    const max = Math.max(...completions);
    assert.ok(max >= 100, `expected spacing over ~2 intervals, max completion was ${max}ms`);
    assert.deepEqual(
      [...completions].sort((a, b) => a - b),
      completions,
    );
  });

  it('reports queue depth via the pending property', async () => {
    const limiter: TokenBucketRateLimiter = new TokenBucketRateLimiter({
      requestsPerInterval: 1,
      intervalMs: 60,
    });

    const waiters = [limiter.acquire(), limiter.acquire(), limiter.acquire()];
    assert.ok(limiter.pending >= 2);
    await Promise.all(waiters);
  });
});

describe('TokenBucketRateLimiter configurability', () => {
  it('takes connector-specific limits from the config', async () => {
    const events: RateLimitEvent[] = [];
    const limiter = new TokenBucketRateLimiter(
      { requestsPerInterval: 1, intervalMs: 50 },
      { connectorName: 'web-fetch', onRateLimit: (event) => events.push(event) },
    );

    const first = limiter.acquire();
    const second = limiter.acquire();
    assert.equal(limiter.pending, 1);

    await first;
    assert.equal(limiter.pending, 1);
    await second;

    assert.equal(limiter.connectorName, 'web-fetch');
    assert.ok(events.some((event) => event.type === 'granted'));
    assert.ok(events.some((event) => event.type === 'queued'));
    assert.ok(events.every((event) => event.connectorName === 'web-fetch'));
  });
});

describe('TokenBucketRateLimiter dispose', () => {
  it('releases all queued waiters on dispose', async () => {
    const limiter = new TokenBucketRateLimiter({ requestsPerInterval: 1, intervalMs: 10_000 });

    let released = 0;
    limiter.acquire();
    const waiter = limiter.acquire().then(() => {
      released += 1;
    });
    assert.equal(limiter.pending, 1);

    limiter.dispose();
    await waiter;
    assert.equal(released, 1);
    assert.equal(limiter.pending, 0);
  });
});
