import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { retry, RetriesExhaustedError, type RetryEvent } from '../retry-handler.js';

const MIN_BACKOFF = 1_000;
const MAX_BACKOFF = 8_000;

describe('RetryHandler exponential backoff', () => {
  it('retries with exponential backoff until the operation succeeds', async () => {
    let count = 0;
    const events: RetryEvent[] = [];
    const timestamps: number[] = [];

    const result = await retry(
      async () => {
        count += 1;
        timestamps.push(Date.now());
        if (count < 3) throw new Error('transient');
        return 'done';
      },
      {
        maxRetries: 3,
        connectorName: 'test',
        onRetry: (event) => events.push(event),
      },
    );

    assert.equal(result, 'done');
    assert.equal(count, 3);
    assert.equal(events.length, 2);
    assert.ok(events.every((event) => event.connectorName === 'test'));

    const firstGap = (timestamps[1] ?? 0) - (timestamps[0] ?? 0);
    const secondGap = (timestamps[2] ?? 0) - (timestamps[1] ?? 0);
    assert.ok(firstGap >= MIN_BACKOFF, `expected ~1s gap, got ${firstGap}ms`);
    assert.ok(secondGap >= 2 * MIN_BACKOFF, `expected ~2s gap, got ${secondGap}ms`);
    assert.ok(secondGap <= MAX_BACKOFF + 100, `unexpectedly large gap ${secondGap}ms`);
  });
});

describe('RetryHandler max retries', () => {
  it('throws RetriesExhaustedError after exhausting the configured retries', async () => {
    let count = 0;
    await assert.rejects(
      retry(
        async () => {
          count += 1;
          throw new Error('persistent');
        },
        { maxRetries: 2, baseDelayMs: 5, maxBackoffMs: 20 },
      ),
      (error: unknown) => {
        assert.ok(error instanceof RetriesExhaustedError);
        assert.equal(error.attempts, 3);
        assert.ok(error.cause instanceof Error && error.cause.message === 'persistent');
        assert.match(error.message, /exhausted 2 retries/);
        return true;
      },
    );
    assert.equal(count, 3);
  });

  it('returns immediately on success without retrying', async () => {
    let count = 0;
    const result = await retry(
      async () => {
        count += 1;
        return 'ok';
      },
      { maxRetries: 5 },
    );
    assert.equal(result, 'ok');
    assert.equal(count, 1);
  });
});

describe('RetryHandler retryability', () => {
  it('propagates non-retryable errors without retrying', async () => {
    let count = 0;
    const boom = new Error('boom');
    await assert.rejects(
      retry(
        async () => {
          count += 1;
          throw boom;
        },
        { maxRetries: 3, isRetryable: (error) => error !== boom },
      ),
      (error: unknown) => error === boom,
    );
    assert.equal(count, 1);
  });
  it('reports backoff duration through retry events', async () => {
    let count = 0;
    const events: RetryEvent[] = [];
    await assert.rejects(
      retry(
        async () => {
          count += 1;
          throw new Error('x');
        },
        { maxRetries: 2, baseDelayMs: 5, maxBackoffMs: 20, onRetry: (event) => events.push(event) },
      ),
      (error: unknown) => error instanceof RetriesExhaustedError,
    );
    assert.equal(count, 3);
    assert.equal(events.length, 2);
    assert.equal(events[0]?.backoffMs, 5);
    assert.equal(events[1]?.backoffMs, 10);
  });
});
