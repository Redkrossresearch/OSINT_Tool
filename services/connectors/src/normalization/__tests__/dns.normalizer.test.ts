import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { EvidenceMetadataType, ObservationSchema } from '@osint-tool/schemas';

import { NormalizationError, type NormalizationInput } from '../normalizer.js';
import { DnsNormalizer } from '../dns.normalizer.js';

const normalizer = new DnsNormalizer();
const connectorName = 'dns-lookup';

const baseInput = (rawData: unknown, overrides: Partial<NormalizationInput> = {}) => ({
  sourceType: 'dns' as const,
  rawData,
  connectorName,
  query: 'example.com',
  ...overrides,
});

describe('DnsNormalizer', () => {
  it('produces one observation per DNS record', () => {
    const observations = normalizer.normalize(
      baseInput([
        { record_type: 'A', record_name: 'example.com', ttl: 300 },
        { record_type: 'MX', record_name: 'example.com' },
        { record_type: 'AAAA', record_name: 'example.com', ttl: 600 },
      ]),
    );

    assert.equal(observations.length, 3);
    for (const observation of observations) {
      assert.equal(observation.type, EvidenceMetadataType.DNS_RECORD);
      assert.equal(observation.data.type, EvidenceMetadataType.DNS_RECORD);
      assert.equal(observation.data.record_name, 'example.com');
      assert.equal(observation.source_ref.connector_name, connectorName);
      assert.ok(ObservationSchema.safeParse(observation).success);
    }

    const types = observations.map((observation) => observation.data.record_type);
    assert.deepEqual(types, ['A', 'MX', 'AAAA']);
  });

  it('accepts a single DNS record', () => {
    const observations = normalizer.normalize(
      baseInput({ record_type: 'A', record_name: 'example.com' }),
    );

    assert.equal(observations.length, 1);
    assert.equal(observations[0]?.data.record_type, 'A');
  });

  it('applies a confidence override to every observation', () => {
    const observations = normalizer.normalize(
      baseInput(
        [
          { record_type: 'A', record_name: 'example.com' },
          { record_type: 'NS', record_name: 'example.com' },
        ],
        { confidence: 0.99 },
      ),
    );

    for (const observation of observations) {
      assert.equal(observation.confidence, 0.99);
    }
  });

  it('rejects raw data that does not match the DNS record shape', () => {
    assert.throws(
      () => normalizer.normalize(baseInput({ record_type: 'ABCD', record_name: 'example.com' })),
      (error: unknown) =>
        error instanceof NormalizationError && error.message.includes('dns normalization failed'),
    );
  });
});