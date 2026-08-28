import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { SourceRefSchema } from '../src/source.js';

describe('SourceRefSchema', () => {
  it('accepts a valid source reference', () => {
    const result = SourceRefSchema.safeParse({
      connector_name: 'web-search',
      query: 'example.com',
      timestamp: new Date(),
      parameters: {
        limit: 10,
      },
    });

    assert.equal(result.success, true);
  });

  it('rejects a source reference without connector_name', () => {
    const result = SourceRefSchema.safeParse({
      query: 'example.com',
      timestamp: new Date(),
      parameters: {},
    });

    assert.equal(result.success, false);
  });
});