import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  DEFAULT_CONFIDENCE,
  NormalizationError,
  buildObservation,
  isSourceType,
  resolveConfidence,
  type NormalizationInput,
} from '../normalizer.js';

const baseInput = (): NormalizationInput => ({
  sourceType: 'github',
  rawData: {},
  connectorName: 'github-public-connector',
  query: 'octocat',
});

describe('isSourceType', () => {
  it('accepts every supported source type', () => {
    for (const sourceType of ['github', 'web', 'dns', 'certificate', 'search'] as const) {
      assert.equal(isSourceType(sourceType), true);
    }
  });

  it('rejects unknown source types', () => {
    assert.equal(isSourceType('martian'), false);
    assert.equal(isSourceType(42), false);
    assert.equal(isSourceType(undefined), false);
  });
});

describe('DEFAULT_CONFIDENCE', () => {
  it('provides a valid confidence for every source type', () => {
    for (const [sourceType, confidence] of Object.entries(DEFAULT_CONFIDENCE)) {
      assert.ok(
        Number.isFinite(confidence) && confidence >= 0 && confidence <= 1,
        `${sourceType} confidence ${confidence} is out of the 0..1 range`,
      );
    }
  });
});

describe('resolveConfidence', () => {
  it('uses the source type default when no override is given', () => {
    for (const sourceType of ['github', 'web', 'dns', 'certificate', 'search'] as const) {
      assert.equal(resolveConfidence({ ...baseInput(), sourceType }), DEFAULT_CONFIDENCE[sourceType]);
    }
  });

  it('honors an in-range confidence override', () => {
    assert.equal(resolveConfidence({ ...baseInput(), confidence: 0.42 }), 0.42);
    assert.equal(resolveConfidence({ ...baseInput(), confidence: 0 }), 0);
    assert.equal(resolveConfidence({ ...baseInput(), confidence: 1 }), 1);
  });

  it('rejects an out-of-range confidence override', () => {
    assert.throws(
      () => resolveConfidence({ ...baseInput(), confidence: 1.5 }),
      (error: unknown) =>
        error instanceof NormalizationError && error.message.includes('between 0 and 1'),
    );
    assert.throws(
      () => resolveConfidence({ ...baseInput(), confidence: -0.1 }),
      NormalizationError,
    );
  });
});

describe('buildObservation', () => {
  it('populates source_ref from the normalization input', () => {
    const timestamp = new Date('2026-01-01T00:00:00.000Z');
    const observation = buildObservation(
      { ...baseInput(), timestamp, parameters: { api_version: 'v3' } },
      'GITHUB_DATA',
      { category: 'repo' },
    );

    assert.equal(observation.type, 'GITHUB_DATA');
    assert.deepEqual(observation.data, { category: 'repo' });
    assert.equal(observation.source_ref.connector_name, 'github-public-connector');
    assert.equal(observation.source_ref.query, 'octocat');
    assert.equal(observation.source_ref.timestamp, timestamp);
    assert.deepEqual(observation.source_ref.parameters, { api_version: 'v3' });
    assert.equal(observation.timestamp, timestamp);
    assert.ok(observation.id.length > 0);
    assert.ok(observation.evidence_id.length > 0);
  });

  it('defaults parameters to an empty object when omitted', () => {
    const observation = buildObservation(baseInput(), 'GITHUB_DATA', {});
    assert.deepEqual(observation.source_ref.parameters, {});
  });

  it('defaults the timestamp to now when omitted', () => {
    const before = new Date().getTime();
    const observation = buildObservation(baseInput(), 'GITHUB_DATA', {});
    const after = new Date().getTime();
    assert.ok(observation.timestamp.getTime() >= before);
    assert.ok(observation.timestamp.getTime() <= after);
  });
});