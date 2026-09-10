import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { EntitySchema, RelationshipSchema, type EntityType } from '@osint-tool/entities';
import { ObservationSchema } from '../../../../packages/schemas/src/observation.js';
import {
  extractRelationships,
  type RelationshipCandidate,
} from '../services/relationship-extractor.js';

function observation(text: unknown = '') {
  return ObservationSchema.parse({
    id: 'obs-1',
    evidence_id: 'evidence-existing',
    type: 'WEB_PAGE',
    data: { text },
    confidence: 0.8,
    timestamp: '2026-09-10T00:00:00Z',
    source_ref: {
      connector_name: 'web-search',
      query: 'example',
      timestamp: '2026-09-10T00:00:00Z',
      parameters: {},
    },
  });
}
function candidate(type: EntityType, name: string, id = name): RelationshipCandidate {
  const attributes =
    type === 'domain'
      ? { domain: name }
      : type === 'ip' || type === 'email'
        ? { address: name }
        : type === 'url'
          ? { url: name }
          : { name };
  return {
    entity: EntitySchema.parse({ type, attributes, confidence: 0.7 }),
    ref: { kind: 'entity', type, id },
  };
}
const person = candidate('person', 'Alice');
const company = candidate('company', 'Acme');
const domain = candidate('domain', 'acme.com');
const ip = candidate('ip', '192.0.2.1');
const technology = candidate('technology', 'React');
const edges = (text: string, candidates: RelationshipCandidate[]) =>
  extractRelationships(observation(text), candidates).filter((edge) => edge.type !== 'MENTIONS');

describe('T3-007 relationship extraction', () => {
  const cases = [
    ['OWNS', 'owns', person, domain],
    ['OWNS', 'owns', company, ip],
    ['WORKS_FOR', 'works for', person, company],
    ['USES', 'uses', company, technology],
    ['HOSTED_ON', 'is hosted on', domain, ip],
    ['REGISTERED_TO', 'is registered to', domain, company],
    ['RESOLVES_TO', 'resolves to', domain, ip],
  ] as const;
  for (const [type, verb, source, target] of cases) {
    it(`extracts and validates ${type} with supplied IDs and evidence`, () => {
      const input = observation(`${source.ref.id} ${verb} ${target.ref.id}.`);
      const result = extractRelationships(input, [source, target]);
      assert.equal(result.length, 3);
      assert.equal(result[2].type, type);
      assert.deepEqual(result[2].source, source.ref);
      assert.deepEqual(result[2].target, target.ref);
      assert.equal(result[2].confidence, 0.7 * 0.9);
      for (const edge of result) {
        assert.equal(RelationshipSchema.safeParse(edge).success, true);
        assert.deepEqual(edge.evidence, [{ kind: 'evidence', id: input.evidence_id }]);
      }
    });
  }
  it('emits MENTIONS from evidence, not from observation or entity IDs', () => {
    const result = extractRelationships(observation('Alice'), [person]);
    assert.deepEqual(result, [
      {
        type: 'MENTIONS',
        source: { kind: 'evidence', id: 'evidence-existing' },
        target: person.ref,
        confidence: 0.7,
        evidence: [{ kind: 'evidence', id: 'evidence-existing' }],
      },
    ]);
  });
  it('preserves opaque caller IDs rather than deriving them from labels', () => {
    const a = candidate('person', 'Alice', 'existing-entity-42');
    const b = candidate('company', 'Acme', 'existing-entity-99');
    const result = edges('Alice works for Acme', [a, b]);
    assert.equal(result[0].source.id, 'existing-entity-42');
    assert.equal(result[0].target.id, 'existing-entity-99');
  });
  it('supports literal mentions for all existing entity types', () => {
    const repository: RelationshipCandidate = {
      entity: EntitySchema.parse({
        type: 'repository',
        confidence: 0.7,
        attributes: { name: 'project', owner: 'alice', url: 'https://example.com/project' },
      }),
      ref: { kind: 'entity', type: 'repository', id: 'repository-existing' },
    };
    for (const [text, item] of [
      ['Alice', person],
      ['Acme', company],
      ['acme.com', domain],
      ['192.0.2.1', ip],
      ['React', technology],
      ['alice@example.com', candidate('email', 'alice@example.com')],
      ['https://example.com', candidate('url', 'https://example.com')],
      ['Paris', candidate('location', 'Paris')],
      ['https://example.com/project', repository],
    ] as const) {
      const result = extractRelationships(observation(text), [item]);
      assert.equal(result.length, 1, text);
      assert.equal(result[0].type, 'MENTIONS');
      assert.deepEqual(result[0].target, item.ref);
    }
  });
  it('rejects schema-incompatible semantic edges', () => {
    assert.deepEqual(edges('Acme works for Alice', [person, company]), []);
    assert.deepEqual(edges('acme.com uses React', [domain, technology]), []);
  });
  it('does not infer strong semantics from unsupported, negated, qualified or quoted clauses', () => {
    for (const text of [
      'Alice does not own Acme',
      'Alice might own Acme',
      'If Alice owns Acme',
      'Alice owns Acme allegedly',
      'Alice owns Acme?',
      '"Alice owns Acme"',
      'Alice dislikes Acme',
      'Alice previously works for Acme',
    ]) {
      assert.deepEqual(edges(text, [person, company]), [], text);
    }
  });
  it('uses only weak association for adjacent neutral co-occurrence', () => {
    for (const text of ['Alice and Acme', 'Alice, Acme', 'Alice & Acme']) {
      const result = edges(text, [person, company]);
      assert.deepEqual(
        result.map((edge) => edge.type),
        ['ASSOCIATED_WITH'],
      );
      assert.equal(result[0].confidence, 0.7 * 0.5);
    }
    for (const text of [
      'Alice\nAcme',
      'Alice; Acme',
      'Alice. Acme',
      `Alice${' '.repeat(81)}Acme`,
    ]) {
      assert.deepEqual(edges(text, [person, company]), []);
    }
  });
  it('supports confidence boundaries without clamping or auto-accept policy', () => {
    for (const confidence of [0, 0.5, 1]) {
      const input = { ...observation('Alice'), confidence };
      const result = extractRelationships(input, [
        { ...person, entity: { ...person.entity, confidence: 1 } },
      ]);
      assert.equal(result[0].confidence, confidence);
    }
    assert.throws(() => extractRelationships({ ...observation(), confidence: 1.01 }, []));
  });
  it('deduplicates exact edges and supplied candidates, preserving deterministic output', () => {
    const input = observation('Alice works for Acme. Alice works for Acme.');
    input.data.title = 'Alice works for Acme';
    const expected = extractRelationships(input, [person, company]);
    assert.equal(expected.length, 3);
    assert.deepEqual(extractRelationships(input, [company, person, person]), expected);
  });
  it('skips ambiguous names rather than selecting an arbitrary ID', () => {
    const other = { ...person, ref: { ...person.ref, id: 'another-alice' } };
    const result = extractRelationships(observation('Alice works for Acme'), [
      person,
      other,
      company,
    ]);
    assert.deepEqual(
      result.map((edge) => edge.target.id),
      ['Acme'],
    );
  });
  it('validates association kinds/types/IDs and conflicting ID assignments', () => {
    assert.throws(() => extractRelationships(observation(), [{ ...person, ref: company.ref }]));
    assert.throws(() =>
      extractRelationships(observation(), [{ ...person, ref: { ...person.ref, id: '' } }]),
    );
    assert.throws(() =>
      extractRelationships(observation(), [
        person,
        { ...company, ref: { ...company.ref, id: person.ref.id } },
      ]),
    );
    // Deliberately malformed runtime input without weakening the production contract.
    assert.throws(() =>
      extractRelationships(
        observation(),
        JSON.parse('[{"entity":{},"ref":{"kind":"evidence","id":"x"}}]'),
      ),
    );
    assert.throws(() => extractRelationships(observation(), JSON.parse('null')));
  });
  it('rejects invalid observations and missing evidence IDs', () => {
    assert.throws(() => extractRelationships({ ...observation(), evidence_id: '' }, [person]));
    assert.throws(() => extractRelationships(JSON.parse('null'), [person]));
  });
  it('ignores insufficient, nested and unsupported fields', () => {
    for (const text of ['', null, 42, { text: 'Alice works for Acme' }]) {
      assert.deepEqual(extractRelationships(observation(text), [person, company]), []);
    }
    const input = observation();
    input.data.other = 'Alice works for Acme';
    assert.deepEqual(extractRelationships(input, [person, company]), []);
    assert.deepEqual(extractRelationships(observation('Alice works for Acme'), []), []);
  });
  it('scans the existing text fields without substring identity guesses', () => {
    for (const field of ['title', 'text', 'content', 'description', 'url']) {
      const input = observation();
      input.data[field] = 'Alice works for Acme';
      assert.equal(extractRelationships(input, [person, company]).length, 3);
    }
    assert.deepEqual(extractRelationships(observation('Malice Alice2 xAlice'), [person]), []);
  });
  it('does not mutate caller inputs or schemas and returns fresh references', () => {
    const input = observation('Alice works for Acme');
    const candidates = [person, company];
    const before = structuredClone({ input, candidates });
    const result = extractRelationships(input, candidates);
    result[0].target.id = 'changed';
    assert.deepEqual({ input, candidates }, before);
    assert.equal(EntitySchema.safeParse(person.entity).success, true);
  });
  it('bounds text, candidates and mention processing', () => {
    assert.throws(() => extractRelationships(observation('x'.repeat(32001)), []), RangeError);
    assert.throws(
      () =>
        extractRelationships(
          observation(),
          Array.from({ length: 129 }, () => person),
        ),
      RangeError,
    );
    assert.throws(
      () => extractRelationships(observation('Alice '.repeat(2049)), [person]),
      RangeError,
    );
  });
});
