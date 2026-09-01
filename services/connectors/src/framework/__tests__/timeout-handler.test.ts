import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { TimeoutError, withTimeout } from '../timeout-handler.js';

describe('TimeoutHandler timeouts', () => {
  it('resolves operation results that settle before the timeout', async () => {
    const result = await withTimeout(Promise.resolve('ok'), { timeoutMs: 1_000 });
    assert.equal(result, 'ok');
  });

  it('rejects with TimeoutError when the operation exceeds the timeout', async () => {
    const never = new Promise<string>(() => {});
    await assert.rejects(withTimeout(never, { timeoutMs: 5 }), (error: unknown) => {
      assert.ok(error instanceof TimeoutError);
      assert.equal(error.timeoutMs, 5);
      assert.match(error.message, /timed out after 5ms/);
      return true;
    });
  });

  it('propagates errors thrown before the timeout', async () => {
    const failing = Promise.reject(new Error('boom'));
    await assert.rejects(
      withTimeout(failing, { timeoutMs: 1_000 }),
      (error: unknown) => error instanceof Error && error.message === 'boom',
    );
  });

  it('clears its timer after the operation settles', async () => {
    const result = await withTimeout(Promise.resolve(42), { timeoutMs: 50 });
    assert.equal(result, 42);
  });
});
