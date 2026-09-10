import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  resolveEntities,
  levenshteinDistance,
  MAX_COMPARISON_LENGTH,
  type ResolutionInput,
} from '../services/entity-resolver.js';
import {
  identicalLabels,
  personInput,
  resolutionInput,
} from './fixtures/resolution-edge-cases.fixtures.js';

describe('T3-015 supplementary resolution edges', () => {
  it('permits fuzzy comparison exactly at the UTF-16 length limit', () => {
    const a = 'A'.repeat(MAX_COMPARISON_LENGTH);
    const b = `${a.slice(0, -1)}B`;
    assert.equal(levenshteinDistance(a, b), 1);
    const result = resolveEntities(personInput(a, 'left'), personInput(b, 'right'));
    assert.equal(result.method, 'fuzzy');
    assert.equal(result.evidence[0].similarity, 1 - 1 / MAX_COMPARISON_LENGTH);
    assert.equal(result.confidence, 0.7 + 0.2 * (1 - 1 / MAX_COMPARISON_LENGTH));
  });

  it('applies the limit to either operand but retains exact oversized identities', () => {
    const oversized = 'A'.repeat(MAX_COMPARISON_LENGTH + 1);
    assert.throws(() => levenshteinDistance('A', oversized), RangeError);
    const skipped = resolveEntities(personInput('B', 'left'), personInput(oversized, 'right'));
    assert.equal(skipped.method, 'none');
    assert.deepEqual(skipped.evidence, []);
    assert.match(skipped.reason, /length limit/);
    const exact = resolveEntities(personInput(oversized, 'left'), personInput(oversized, 'right'));
    assert.equal(exact.method, 'exact');
    assert.equal(exact.evidence[0].values[0].length, MAX_COMPARISON_LENGTH + 1);
  });

  it('counts emoji modifiers and joiners as code points rather than graphemes', () => {
    assert.equal(levenshteinDistance('👍🏽', '👍'), 1);
    assert.equal(levenshteinDistance('👩‍💻', '👩'), 2);
    const result = resolveEntities(personInput('😀A', 'left'), personInput('😀B', 'right'));
    assert.equal(result.evidence[0].similarity, 0.5);
    assert.equal(result.confidence, 0.7 + 0.2 * 0.5);
    const boundary = '😀'.repeat(MAX_COMPARISON_LENGTH / 2);
    assert.equal(levenshteinDistance(boundary, ''), MAX_COMPARISON_LENGTH / 2);
    assert.throws(() => levenshteinDistance(`${boundary}A`, ''), RangeError);
  });

  it('normalizes and deduplicates multiple overlapping aliases while retaining originals', () => {
    const left = personInput('Alice', 'left', [' José ', 'Jose\u0301', 'Shared', 'Shared']);
    const right = personInput('Bob', 'right', ['Shared', 'José', 'José']);
    const result = resolveEntities(left, right);
    assert.deepEqual(
      result.evidence.filter((entry) => entry.field === 'aliases').map((entry) => entry.values),
      [
        ['José', 'José'],
        ['Shared', 'Shared'],
      ],
    );
    assert.equal(result.method, 'shared_attribute');
    assert.equal(result.confidence, 0.8);
    assert.deepEqual(result.originals, [left.entity, right.entity]);
    assert.deepEqual(result.source, [left.origin, right.origin]);
  });

  it('uses a shared domain even when name similarity is zero, without approving a merge', () => {
    const left = resolutionInput(
      { type: 'company', confidence: 0.9, attributes: { name: 'AAA', domain: 'example.com' } },
      'left',
    );
    const right = resolutionInput(
      { type: 'company', confidence: 0.9, attributes: { name: 'ZZZ', domain: 'example.com' } },
      'right',
    );
    const result = resolveEntities(left, right);
    assert.equal(result.evidence.find((entry) => entry.kind === 'fuzzy')?.similarity, 0);
    assert.equal(result.status, 'candidate');
    assert.equal(result.confidence, 0.8);
    assert.equal(result.meetsMergeScoreRequirement, false);
    assert.equal(result.requiresHumanConfirmation, true);
    assert.ok(result.reason.trim());
  });

  it('rejects identical labels across every supplied distinct entity type', () => {
    for (const left of identicalLabels)
      for (const right of identicalLabels) {
        if (left.type === right.type) continue;
        const result = resolveEntities(
          resolutionInput(left, 'left'),
          resolutionInput(right, 'right'),
        );
        assert.equal(result.status, 'none');
        assert.equal(result.confidence, 0);
        assert.deepEqual(result.evidence, []);
        assert.equal(result.meetsMergeScoreRequirement, false);
      }
  });

  it('rejects malformed nested right-hand provenance instead of replacing it', () => {
    const changes: Array<(input: ResolutionInput) => void> = [
      (input) => {
        input.origin.evidence_id = '';
      },
      (input) => {
        input.origin.source_ref.connector_name = '';
      },
      (input) => {
        input.origin.source_ref.query = '';
      },
      (input) => {
        input.origin.source_ref.timestamp = new Date(NaN);
      },
    ];
    for (const change of changes) {
      const right = personInput('Alice', 'right');
      change(right);
      assert.throws(() => resolveEntities(personInput('Alice', 'left'), right));
    }
  });

  it('rejects out-of-range and infinite confidence on either entity', () => {
    for (const confidence of [-0.01, 1.01, Infinity, -Infinity]) {
      const invalid = personInput('Alice', 'invalid');
      invalid.entity.confidence = confidence;
      const valid = personInput('Alice', 'valid');
      assert.throws(() => resolveEntities(invalid, valid));
      assert.throws(() => resolveEntities(valid, invalid));
    }
  });

  it('detaches nested alias and provenance arrays, evidence values and successive results', () => {
    const left = personInput('Alice', 'left', ['Shared']);
    const right = personInput('Bob', 'right', ['Shared']);
    const snapshot = structuredClone([left, right]);
    const first = resolveEntities(left, right);
    const second = resolveEntities(left, right);
    const tags = first.source[1].source_ref.parameters.filters;
    assert.ok(
      typeof tags === 'object' && tags !== null && 'tags' in tags && Array.isArray(tags.tags),
    );
    tags.tags.push('changed');
    const original = first.originals[0];
    assert.equal(original.type, 'person');
    if (original.type === 'person') original.attributes.aliases?.push('changed');
    first.evidence[0].values[0] = 'changed';
    assert.deepEqual([left, right], snapshot);
    assert.deepEqual(resolveEntities(left, right), second);
    assert.notDeepEqual(first, second);
  });
});
