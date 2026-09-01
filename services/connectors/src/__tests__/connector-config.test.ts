import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateConnectorConfig } from '../framework/connector-config.js';

describe('validateConnectorConfig', () => {
  it('applies default timeout and retry values', () => {
    const config = validateConnectorConfig({});
    assert.equal(config.timeoutMs, 30_000);
    assert.equal(config.maxRetries, 3);
    assert.deepEqual(config.options, {});
  });

  it('accepts a full valid configuration', () => {
    const config = validateConnectorConfig({
      timeoutMs: 5_000,
      maxRetries: 2,
      rateLimit: { requestsPerInterval: 1, intervalMs: 2_000 },
      options: { userAgent: 'test' },
    });
    assert.equal(config.timeoutMs, 5_000);
    assert.equal(config.maxRetries, 2);
    assert.equal(config.rateLimit?.requestsPerInterval, 1);
    assert.equal(config.rateLimit?.intervalMs, 2_000);
    assert.equal(config.options.userAgent, 'test');
  });

  it('rejects an invalid timeout', () => {
    assert.throws(() => validateConnectorConfig({ timeoutMs: -1 }));
  });

  it('rejects an invalid maxRetries exceeding the limit', () => {
    assert.throws(() => validateConnectorConfig({ maxRetries: 10 }));
  });

  it('rejects a rate limit with a zero interval', () => {
    assert.throws(() =>
      validateConnectorConfig({ rateLimit: { requestsPerInterval: 1, intervalMs: 0 } }),
    );
  });
});
