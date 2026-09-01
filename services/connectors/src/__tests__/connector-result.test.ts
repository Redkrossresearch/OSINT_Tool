import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { Observation } from '@osint-tool/schemas';

import {
  ConnectorResultErrorSchema,
  ConnectorResultSchema,
  ConnectorResultSuccessSchema,
  parseConnectorResult,
} from '../framework/connector-result.js';

const observation = (): Observation => ({
  id: 'obs-1',
  evidence_id: 'ev-1',
  type: 'DNS_RECORD',
  data: {},
  confidence: 1,
  source_ref: {
    connector_name: 'dns',
    query: 'example.com',
    timestamp: new Date(),
    parameters: {},
  },
  timestamp: new Date(),
});

const metadata = {
  connector_name: 'dns-rdap',
  query: 'example.com',
  timestamp: new Date('2026-08-31T00:00:00.000Z'),
  duration_ms: 42,
};

describe('ConnectorResultSuccessSchema', () => {
  it('validates a successful result with observations and metadata', () => {
    const result = ConnectorResultSuccessSchema.parse({
      ok: true,
      metadata,
      observations: [observation()],
    });
    assert.equal(result.ok, true);
    assert.equal(result.observations.length, 1);
    assert.equal(result.metadata.connector_name, 'dns-rdap');
  });

  it('accepts an empty observations array', () => {
    const result = ConnectorResultSuccessSchema.parse({ ok: true, metadata, observations: [] });
    assert.equal(result.observations.length, 0);
  });
});

describe('ConnectorResultErrorSchema', () => {
  it('validates a failed result with an error detail', () => {
    const result = ConnectorResultErrorSchema.parse({
      ok: false,
      metadata,
      error: { code: 'RETRIES_EXHAUSTED', message: 'failed to collect', cause: 'network' },
    });
    assert.equal(result.ok, false);
    assert.equal(result.error.code, 'RETRIES_EXHAUSTED');
    assert.equal(result.error.cause, 'network');
  });

  it('allows an error without a cause', () => {
    const result = ConnectorResultErrorSchema.parse({
      ok: false,
      metadata,
      error: { code: 'RATE_LIMITED', message: 'blocked' },
    });
    assert.equal(result.error.cause, undefined);
  });
});

describe('ConnectorResultSchema', () => {
  it('is a discriminated union that rejects an ambiguous result', () => {
    assert.throws(() =>
      ConnectorResultSchema.parse({
        metadata,
        observations: [],
      }),
    );
  });

  it('rejects invalid metadata', () => {
    assert.throws(() =>
      ConnectorResultSchema.parse({
        ok: true,
        metadata: { ...metadata, duration_ms: -1 },
        observations: [],
      }),
    );
  });
});

describe('parseConnectorResult', () => {
  it('parses and returns a valid success result', () => {
    const result = parseConnectorResult({ ok: true, metadata, observations: [observation()] });
    assert.equal(result.ok, true);
    assert.equal(result.observations.length, 1);
  });

  it('parses and returns a valid error result', () => {
    const result = parseConnectorResult({
      ok: false,
      metadata,
      error: { code: 'TIMEOUT', message: 'timed out' },
    });
    assert.equal(result.ok, false);
    assert.equal(result.error.code, 'TIMEOUT');
  });

  it('throws for malformed input', () => {
    assert.throws(() => parseConnectorResult({ ok: true, metadata: {}, observations: [] }));
  });
});
