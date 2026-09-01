import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { EvidenceMetadataType, ObservationSchema } from '@osint-tool/schemas';

import { NormalizationError, type NormalizationInput } from '../normalizer.js';
import { SearchNormalizer } from '../search.normalizer.js';

const normalizer = new SearchNormalizer();
const connectorName = 'web-search';

const baseInput = (rawData: unknown, overrides: Partial<NormalizationInput> = {}) => ({
  sourceType: 'search' as const,
  rawData,
  connectorName,
  query: 'example',
  ...overrides,
});

describe('SearchNormalizer', () => {
  it('produces one observation per search result', () => {
    const observations = normalizer.normalize(
      baseInput([
        {
          engine: 'duckduckgo',
          query: 'example',
          result_position: 1,
          total_results: 12,
          source_url: 'https://example.com',
        },
        {
          engine: 'duckduckgo',
          query: 'example',
          result_position: 2,
          source_url: 'https://example.org',
        },
      ]),
    );

    assert.equal(observations.length, 2);
    for (const observation of observations) {
      assert.equal(observation.type, EvidenceMetadataType.SEARCH_RESULT);
      assert.equal(observation.data.type, EvidenceMetadataType.SEARCH_RESULT);
      assert.equal(observation.data.engine, 'duckduckgo');
      assert.equal(observation.source_ref.connector_name, connectorName);
      assert.ok(ObservationSchema.safeParse(observation).success);
    }

    const positions = observations.map((observation) => observation.data.result_position);
    assert.deepEqual(positions, [1, 2]);
  });

  it('accepts a single search result', () => {
    const observations = normalizer.normalize(
      baseInput({ engine: 'duckduckgo', query: 'example', source_url: 'https://example.com' }),
    );

    assert.equal(observations.length, 1);
    assert.equal(observations[0]?.data.source_url, 'https://example.com');
  });

  it('applies a confidence override to every observation', () => {
    const observations = normalizer.normalize(
      baseInput(
        [
          { engine: 'duckduckgo', query: 'example' },
          { engine: 'google', query: 'example' },
        ],
        { confidence: 0.3 },
      ),
    );

    for (const observation of observations) {
      assert.equal(observation.confidence, 0.3);
    }
  });

  it('rejects raw data that does not match the search result shape', () => {
    assert.throws(
      () => normalizer.normalize(baseInput({ result_position: 1 })),
      (error: unknown) =>
        error instanceof NormalizationError && error.message.includes('search normalization failed'),
    );
  });
});