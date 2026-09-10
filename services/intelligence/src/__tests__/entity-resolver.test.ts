import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Entity } from '@osint-tool/entities';
import { ObservationSchema } from '../../../../packages/schemas/src/observation.js';
import { extractEntities } from '../services/entity-extractor.js';
import { scoreConfidence } from '../services/confidence-scorer.js';
import {
  levenshteinDistance,
  MAX_COMPARISON_LENGTH,
  resolveEntities,
  type ResolutionInput,
} from '../services/entity-resolver.js';

function input(entity: Entity, id = 'a'): ResolutionInput {
  return {
    entity,
    origin: {
      id,
      evidence_id: `evidence-${id}`,
      source_ref: {
        connector_name: `source-${id}`,
        query: 'public records',
        timestamp: new Date('2026-09-01T00:00:00Z'),
        parameters: {},
      },
    },
  };
}
const person = (name: string, aliases?: string[]): Entity => ({
  type: 'person',
  confidence: 0.7,
  attributes: { name, ...(aliases === undefined ? {} : { aliases }) },
});
const company = (name: string, domain?: string): Entity => ({
  type: 'company',
  confidence: 0.9,
  attributes: { name, ...(domain === undefined ? {} : { domain }) },
});
const compare = (a: Entity, b: Entity) => resolveEntities(input(a), input(b, 'b'));

describe('Levenshtein distance', () => {
  for (const [a, b, expected] of [
    ['same', 'same', 0],
    ['kitten', 'sitting', 3],
    ['', 'abc', 3],
    ['abc', '', 3],
    ['', '', 0],
    ['😀a', '😀b', 1],
    ['😀', '', 1],
  ] as const) {
    it(`${JSON.stringify(a)} to ${JSON.stringify(b)} = ${expected}`, () => {
      assert.equal(levenshteinDistance(a, b), expected);
      assert.equal(levenshteinDistance(b, a), expected);
    });
  }
  it('rejects oversized inputs instead of truncating', () => {
    assert.throws(
      () => levenshteinDistance('a'.repeat(MAX_COMPARISON_LENGTH + 1), 'a'),
      RangeError,
    );
  });
});

describe('T3-005 resolution', () => {
  it('returns exact normalized evidence and both origins without changing extraction confidence', () => {
    const result = compare(person(' José Smith '), person('Jose\u0301 Smith'));
    assert.equal(result.method, 'exact');
    assert.equal(result.status, 'candidate');
    assert.equal(result.confidence, 1);
    assert.equal(result.evidence[0].kind, 'exact');
    assert.ok(result.reason.length);
    assert.deepEqual(
      result.source.map((origin) => origin.evidence_id),
      ['evidence-a', 'evidence-b'],
    );
    assert.equal(result.originals[0].confidence, 0.7);
    assert.equal(result.meetsMergeScoreRequirement, true);
  });
  it('preserves official name casing and internal whitespace rules', () => {
    for (const [a, b] of [
      ['John Smith', 'john smith'],
      ['John  Smith', 'John Smith'],
      ['ACME', 'acme'],
    ]) {
      assert.notEqual(compare(person(a), person(b)).method, 'exact');
    }
  });
  it('scores a typo using Levenshtein and ADR-004, independently of extraction auto-accept', () => {
    const result = compare(person('John Smith'), person('Jon Smith'));
    assert.equal(result.method, 'fuzzy');
    assert.equal(result.evidence[0].distance, 1);
    assert.equal(result.evidence[0].similarity, 0.9);
    assert.equal(result.confidence, 0.7 + 0.2 * 0.9);
    assert.equal(result.status, 'candidate');
  });
  it('does not classify different names as exact or manufacture a fuzzy rejection threshold', () => {
    assert.equal(compare(person('John Smith'), person('Alice Williams')).method, 'fuzzy');
    const result = compare(person('A'), person('Z'));
    assert.equal(result.confidence, 0);
    assert.equal(result.status, 'none');
  });
  it('rejects cross-type identity', () => {
    const result = compare(person('John Smith'), {
      type: 'ip',
      confidence: 1,
      attributes: { address: '203.0.113.10' },
    });
    assert.equal(result.status, 'none');
    assert.equal(result.method, 'none');
    assert.equal(result.confidence, 0);
  });
  it('records a shared company domain together with fuzzy name evidence', () => {
    const result = compare(
      company('Acme Corporation', ' EXAMPLE.COM. '),
      company('Acme Corp', 'example.com'),
    );
    assert.equal(result.method, 'shared_attribute');
    assert.equal(result.confidence, 0.8);
    assert.equal(result.meetsMergeScoreRequirement, false);
    assert.equal(result.requiresHumanConfirmation, true);
    assert.ok(
      result.evidence.some((item) => item.field === 'domain' && item.kind === 'shared_attribute'),
    );
    assert.ok(result.evidence.some((item) => item.kind === 'fuzzy'));
  });
  it('retains exact support and conflicting company domains for human review', () => {
    const result = compare(company('Acme', 'example.com'), company('Acme', 'other.com'));
    assert.equal(result.status, 'conflict');
    assert.equal(result.confidence, 0);
    assert.equal(result.requiresHumanConfirmation, true);
    assert.deepEqual(
      result.evidence.map((item) => item.kind),
      ['exact', 'conflict'],
    );
  });
  it('deduplicates shared aliases without treating them as unique identifiers', () => {
    const result = compare(person('John Smith', ['J. Smith', 'J. Smith']), person('J. Smith'));
    assert.equal(result.method, 'shared_attribute');
    assert.equal(result.evidence.filter((item) => item.field === 'aliases').length, 1);
    assert.equal(result.requiresHumanConfirmation, true);
  });
  it('handles absent optional attributes and empty alias arrays', () => {
    assert.equal(compare(person('Alice', []), person('Alice')).method, 'exact');
    assert.equal(compare(company('Acme'), company('Acme')).method, 'exact');
  });
  for (const [a, b] of [
    [
      { type: 'ip', confidence: 1, attributes: { address: '2001:0DB8:0:0:0:0:0:1' } },
      { type: 'ip', confidence: 1, attributes: { address: '2001:db8::1' } },
    ],
    [
      { type: 'ip', confidence: 1, attributes: { address: '203.0.113.10' } },
      { type: 'ip', confidence: 1, attributes: { address: '203.0.113.10' } },
    ],
    [
      { type: 'domain', confidence: 1, attributes: { domain: 'Example.COM.' } },
      { type: 'domain', confidence: 1, attributes: { domain: 'example.com' } },
    ],
    [
      { type: 'email', confidence: 1, attributes: { address: 'John@Example.COM' } },
      { type: 'email', confidence: 1, attributes: { address: 'john@example.com' } },
    ],
  ] satisfies [Entity, Entity][]) {
    it(`matches normalized ${a.type} identifiers`, () =>
      assert.equal(compare(a, b).method, 'exact'));
  }
  it('does not fuzzily match URL paths or different IP addresses', () => {
    assert.equal(
      compare(
        { type: 'url', confidence: 1, attributes: { url: 'https://example.com/A' } },
        { type: 'url', confidence: 1, attributes: { url: 'https://example.com/a' } },
      ).status,
      'none',
    );
    assert.equal(
      compare(
        { type: 'ip', confidence: 1, attributes: { address: '203.0.113.10' } },
        { type: 'ip', confidence: 1, attributes: { address: '203.0.113.11' } },
      ).status,
      'none',
    );
  });
  it('exposes version conflicts and does not match on version alone', () => {
    const tech = (name: string, version: string): Entity => ({
      type: 'technology',
      confidence: 1,
      attributes: { name, version },
    });
    assert.equal(compare(tech('React', '1'), tech('React', '2')).status, 'conflict');
    assert.notEqual(compare(tech('A', '1'), tech('Z', '1')).method, 'shared_attribute');
  });
  it('matches coordinates but preserves country conflicts', () => {
    const location = (name: string, country: string): Entity => ({
      type: 'location',
      confidence: 1,
      attributes: { name, country, coordinates: { latitude: 1, longitude: 2 } },
    });
    assert.equal(compare(location('A', 'X'), location('B', 'X')).method, 'shared_attribute');
    assert.equal(compare(location('A', 'X'), location('B', 'Y')).status, 'conflict');
  });
  it('uses repository owner/name and exposes conflicting URLs', () => {
    const repo = (url: string): Entity => ({
      type: 'repository',
      confidence: 1,
      attributes: { owner: 'alice', name: 'project', url },
    });
    assert.equal(
      compare(repo('https://example.com/a'), repo('https://example.com/a')).method,
      'exact',
    );
    assert.equal(
      compare(repo('https://example.com/a'), repo('https://example.com/b')).status,
      'conflict',
    );
  });
  it('skips oversized fuzzy comparisons but still considers shared identifiers', () => {
    const long = 'A'.repeat(MAX_COMPARISON_LENGTH + 1);
    assert.equal(compare(person(long), person('B')).status, 'none');
    assert.equal(
      compare(company(long, 'example.com'), company('B', 'example.com')).method,
      'shared_attribute',
    );
  });
  it('is deterministic, leaves inputs intact, and returns detached audit data', () => {
    const a = input(person('John Smith', ['J. Smith']));
    const b = input(person('Jon Smith'), 'b');
    const originals = structuredClone([a, b]);
    const result = resolveEntities(a, b);
    assert.deepEqual(result, resolveEntities(a, b));
    assert.deepEqual([a, b], originals);
    result.source[0].source_ref.timestamp.setFullYear(2000);
    result.originals[0].confidence = 0;
    assert.deepEqual([a, b], originals);
  });
  it('validates provenance and confidence instead of manufacturing replacements', () => {
    const a = input(person('John Smith'));
    a.origin.id = '';
    assert.throws(() => resolveEntities(a, input(person('John Smith'))));
    assert.throws(() =>
      compare({ ...person('John Smith'), confidence: NaN }, person('John Smith')),
    );
  });
  it('integrates T3-003 output and T3-004 confidence without applying extraction merge policy', () => {
    const observation = ObservationSchema.parse({
      ...input(person('Alice Smith')).origin,
      type: 'WEB_PAGE',
      data: { text: 'Name: Alice Smith' },
      confidence: 1,
      timestamp: '2026-09-01',
    });
    const entity = extractEntities(observation)[0];
    entity.confidence = scoreConfidence({
      sourceReliability: 0.5,
      patternStrength: 0.5,
      contextStrength: 0.5,
    });
    const result = resolveEntities(
      { entity, origin: observation },
      input(person('Alice Smith'), 'b'),
    );
    assert.equal(result.confidence, 1);
    assert.equal(result.originals[0].confidence, 0.5);
    assert.equal(result.source[0].id, observation.id);
  });
  it('keeps scores bounded and every candidate auditable', () => {
    for (const a of ['John Smith', 'J', '李', 'José', '!!!']) {
      for (const b of ['Jon Smith', 'J', '王', 'Jose\u0301', '???']) {
        const result = compare(person(a), person(b));
        assert.ok(result.confidence >= 0 && result.confidence <= 1);
        if (result.status === 'candidate') {
          assert.ok(result.evidence.length && result.reason.length);
          assert.equal(result.source.length, 2);
          assert.equal(result.originals.length, 2);
        }
      }
    }
  });
});
