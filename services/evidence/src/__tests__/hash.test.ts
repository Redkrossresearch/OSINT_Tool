import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { computeHash, verifyHash } from '../lib/hash.js';

describe('evidence hashing', () => {
  it('returns the same hash for the same content', () => {
    assert.equal(computeHash('content'), computeHash('content'));
  });

  it('returns the same hash for JSON with different key order', () => {
    assert.equal(computeHash('{"b":2,"a":1}'), computeHash('{"a":1,"b":2}'));
  });

  it('returns different hashes for different content', () => {
    assert.notEqual(computeHash('first'), computeHash('second'));
  });

  it('detects tampered content', () => {
    const hash = computeHash('original');

    assert.equal(verifyHash('original', hash), true);
    assert.equal(verifyHash('tampered', hash), false);
  });

  it('handles empty content', () => {
    const hash = computeHash('');

    assert.equal(hash.length, 64);
    assert.equal(verifyHash('', hash), true);
  });
});
