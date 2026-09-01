import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { EvidenceMetadataType, ObservationSchema } from '@osint-tool/schemas';

import { NormalizationError, type NormalizationInput } from '../normalizer.js';
import { GithubNormalizer } from '../github.normalizer.js';

const normalizer = new GithubNormalizer();
const connectorName = 'github-public-connector';

const baseInput = (rawData: unknown, overrides: Partial<NormalizationInput> = {}) => ({
  sourceType: 'github' as const,
  rawData,
  connectorName,
  query: 'octocat',
  ...overrides,
});

describe('GithubNormalizer', () => {
  it('normalizes raw GitHub data into a valid observation', () => {
    const [observation] = normalizer.normalize(
      baseInput({ repository: 'octocat/Hello-World', data_category: 'repo' }),
    );

    assert.equal(observation?.type, EvidenceMetadataType.GITHUB_DATA);
    assert.equal(observation?.data.type, EvidenceMetadataType.GITHUB_DATA);
    assert.equal(observation?.data.repository, 'octocat/Hello-World');
    assert.equal(observation?.data.data_category, 'repo');
    assert.equal(observation?.source_ref.connector_name, connectorName);
    assert.ok(observation && ObservationSchema.safeParse(observation).success);
  });

  it('applies a confidence override', () => {
    const [observation] = normalizer.normalize(
      baseInput(
        { repository: 'octocat/Hello-World', data_category: 'repo' },
        { confidence: 0.5 },
      ),
    );

    assert.equal(observation?.confidence, 0.5);
  });

  it('rejects raw data that does not match the GitHub metadata shape', () => {
    assert.throws(
      () => normalizer.normalize(baseInput({ repository: 'octocat/Hello-World' })),
      (error: unknown) =>
        error instanceof NormalizationError && error.message.includes('github normalization failed'),
    );
  });
});