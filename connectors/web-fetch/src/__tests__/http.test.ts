import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { SsrfError } from '../ssrf.js';
import { redirectHop } from '../http.js';

describe('redirectHop', () => {
  it('returns undefined for non-redirect responses', () => {
    const next = redirectHop('https://example.com/', 200, undefined, 5, 0);
    assert.equal(next, undefined);
  });

  it('resolves relative redirect locations against the current URL', () => {
    const next = redirectHop('https://example.com/start', 302, '/moved', 5, 0);
    assert.equal(next, 'https://example.com/moved');
  });

  it('accepts absolute redirect locations for http(s)', () => {
    const next = redirectHop(
      'https://example.com/start',
      301,
      'http://other.example.net/target',
      5,
      0,
    );
    assert.equal(next, 'http://other.example.net/target');
  });

  it('rejects redirects to non-http(s) schemes', () => {
    assert.throws(
      () => redirectHop('https://example.com/start', 302, 'file:///etc/passwd', 5, 0),
      (error: unknown) => error instanceof SsrfError && error.reason === 'BLOCKED_SCHEME',
    );
  });

  it('enforces the maximum number of redirect hops', () => {
    assert.throws(
      () => redirectHop('https://example.com/start', 302, 'https://example.com/x', 3, 3),
      (error: unknown) => error instanceof SsrfError && error.reason === 'TOO_MANY_REDIRECTS',
    );
    // One fewer hop is fine.
    const next = redirectHop('https://example.com/start', 302, 'https://example.com/x', 3, 2);
    assert.equal(next, 'https://example.com/x');
  });
});
