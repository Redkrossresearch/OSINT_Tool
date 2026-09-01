import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { EvidenceMetadataType, ObservationSchema } from '@osint-tool/schemas';

import { NormalizationError, type NormalizationInput } from '../normalizer.js';
import { WebNormalizer } from '../web.normalizer.js';

const normalizer = new WebNormalizer();
const connectorName = 'web-page-fetcher';

const baseInput = (rawData: unknown, overrides: Partial<NormalizationInput> = {}) => ({
  sourceType: 'web' as const,
  rawData,
  connectorName,
  query: 'https://example.com',
  ...overrides,
});

describe('WebNormalizer', () => {
  it('normalizes raw web page data into a valid observation', () => {
    const [observation] = normalizer.normalize(
      baseInput({ url: 'https://example.com', title: 'Example', http_status: 200 }),
    );

    assert.equal(observation?.type, EvidenceMetadataType.WEB_PAGE);
    assert.equal(observation?.data.type, EvidenceMetadataType.WEB_PAGE);
    assert.equal(observation?.data.url, 'https://example.com');
    assert.equal(observation?.data.title, 'Example');
    assert.equal(observation?.source_ref.query, 'https://example.com');
    assert.ok(observation && ObservationSchema.safeParse(observation).success);
  });

  it('applies a confidence override', () => {
    const [observation] = normalizer.normalize(
      baseInput(
        { url: 'https://example.com', title: 'Example' },
        { confidence: 0.25 },
      ),
    );

    assert.equal(observation?.confidence, 0.25);
  });

  it('rejects raw data that does not match the web page metadata shape', () => {
    assert.throws(
      () => normalizer.normalize(baseInput({ url: 'not-a-url' })),
      (error: unknown) =>
        error instanceof NormalizationError && error.message.includes('web normalization failed'),
    );
  });
});