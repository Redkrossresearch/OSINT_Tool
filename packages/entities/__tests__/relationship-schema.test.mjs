import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  EntitySchema,
  EntityRefSchema,
  EvidenceRefSchema,
  RELATIONSHIP_CONSTRAINTS,
  RELATIONSHIP_TYPES,
  RelationshipSchema,
  RelationshipTypeSchema,
} from '@osint-tool/entities';

const types = [
  'OWNS',
  'WORKS_FOR',
  'USES',
  'HOSTED_ON',
  'REGISTERED_TO',
  'MENTIONS',
  'ASSOCIATED_WITH',
  'RESOLVES_TO',
];
const entities = [
  'person',
  'company',
  'domain',
  'ip',
  'email',
  'url',
  'repository',
  'technology',
  'location',
];
const entity = (type, id = 'entity-1') => ({ kind: 'entity', id, type });
const evidence = { kind: 'evidence', id: 'evidence-1' };
const relationship = (
  type = 'WORKS_FOR',
  source = entity('person'),
  target = entity('company', 'entity-2'),
) => ({
  type,
  source,
  target,
  confidence: 0.92,
  evidence: [evidence],
});

// Independent specification oracle: do not derive expectations from the production map.
const expected = {
  OWNS: [
    ['person', 'company'],
    ['domain', 'ip', 'company'],
  ],
  WORKS_FOR: [['person'], ['company']],
  USES: [['person', 'company'], ['technology']],
  HOSTED_ON: [['domain'], ['ip']],
  REGISTERED_TO: [['domain'], ['person', 'company']],
  MENTIONS: [['evidence'], entities],
  ASSOCIATED_WITH: [entities, entities],
  RESOLVES_TO: [['domain'], ['ip']],
};

describe('relationship types and constraints', () => {
  it('exports exactly the eight required types and matching constraints', () => {
    assert.deepEqual(RELATIONSHIP_TYPES, types);
    assert.deepEqual(Object.keys(RELATIONSHIP_CONSTRAINTS), types);
    assert.deepEqual(
      EntitySchema.options.map((schema) => schema.shape.type.value),
      entities,
    );
    for (const type of types) {
      assert.equal(RelationshipTypeSchema.parse(type), type);
      assert.deepEqual([...RELATIONSHIP_CONSTRAINTS[type].source], expected[type][0]);
      assert.deepEqual([...RELATIONSHIP_CONSTRAINTS[type].target], expected[type][1]);
    }
  });

  for (const type of types) {
    for (const sourceType of [...entities, 'evidence']) {
      for (const targetType of entities) {
        const valid =
          expected[type][0].includes(sourceType) && expected[type][1].includes(targetType);
        it(`${valid ? 'accepts' : 'rejects'} ${type}: ${sourceType} → ${targetType}`, () => {
          const input = relationship(
            type,
            sourceType === 'evidence' ? evidence : entity(sourceType),
            entity(targetType, 'entity-2'),
          );
          const result = RelationshipSchema.safeParse(input);
          assert.equal(result.success, valid);
          if (result.success) assert.deepEqual(result.data, input);
        });
      }
    }
  }

  it('reports endpoint paths and understandable cross-field errors', () => {
    const result = RelationshipSchema.safeParse(
      relationship('WORKS_FOR', entity('company'), entity('person')),
    );
    assert.equal(result.success, false);
    assert.deepEqual(
      result.error.issues.map((issue) => issue.path),
      [['source'], ['target']],
    );
    assert.ok(
      result.error.issues.every(
        (issue) =>
          issue.message === 'WORKS_FOR requires source type person and target type company.',
      ),
    );
  });

  it('allows self references without inventing a business restriction', () => {
    assert.equal(
      RelationshipSchema.safeParse(
        relationship('ASSOCIATED_WITH', entity('person'), entity('person')),
      ).success,
      true,
    );
  });
});

describe('relationship fields and reference validation', () => {
  for (const confidence of [0, 0.5, 1]) {
    it(`accepts confidence ${confidence}`, () => {
      assert.equal(RelationshipSchema.safeParse({ ...relationship(), confidence }).success, true);
    });
  }
  for (const confidence of [-0.01, 1.01, NaN, Infinity, -Infinity, '0.5', null, undefined]) {
    it(`rejects confidence ${String(confidence)}`, () => {
      assert.equal(RelationshipSchema.safeParse({ ...relationship(), confidence }).success, false);
    });
  }

  it('requires all relationship fields', () => {
    for (const field of ['type', 'source', 'target', 'confidence', 'evidence']) {
      const input = relationship();
      delete input[field];
      assert.equal(RelationshipSchema.safeParse(input).success, false, field);
    }
  });

  it('requires structured evidence references but permits empty and duplicate evidence', () => {
    for (const refs of [[], [evidence, evidence]]) {
      const input = { ...relationship(), evidence: refs };
      assert.deepEqual(RelationshipSchema.parse(input), input);
    }
    for (const refs of [
      null,
      'evidence-1',
      {},
      ['evidence-1'],
      [entity('person')],
      [{ kind: 'evidence', id: '' }],
    ]) {
      assert.equal(
        RelationshipSchema.safeParse({ ...relationship(), evidence: refs }).success,
        false,
      );
    }
  });

  it('rejects malformed IDs and unknown reference fields', () => {
    for (const schema of [EntityRefSchema, EvidenceRefSchema]) {
      const ref = schema === EntityRefSchema ? entity('person') : evidence;
      for (const id of ['', null, undefined, 42, {}, []]) {
        assert.equal(schema.safeParse({ ...ref, id }).success, false);
      }
      assert.equal(schema.safeParse({ ...ref, extra: true }).success, false);
      assert.deepEqual(schema.parse(ref), ref);
    }
    for (const field of ['source', 'target']) {
      for (const ref of [
        null,
        {},
        'entity-1',
        { ...entity('person'), id: '' },
        { ...entity('person'), kind: 'unknown' },
      ]) {
        assert.equal(
          RelationshipSchema.safeParse({ ...relationship(), [field]: ref }).success,
          false,
        );
      }
    }
  });

  it('rejects unknown entity types and incorrect casing at either endpoint', () => {
    for (const type of ['unknown', 'Person', 'Evidence', 'evidence', '', undefined]) {
      for (const field of ['source', 'target']) {
        assert.equal(
          RelationshipSchema.safeParse({
            ...relationship('ASSOCIATED_WITH'),
            [field]: entity(type),
          }).success,
          false,
        );
      }
    }
  });

  it('represents MENTIONS evidence solely through the evidence endpoint kind', () => {
    assert.deepEqual(
      RelationshipSchema.parse(relationship('MENTIONS', evidence)),
      relationship('MENTIONS', evidence),
    );
    assert.equal(
      RelationshipSchema.safeParse(relationship('MENTIONS', { ...evidence, type: 'evidence' }))
        .success,
      false,
    );
    for (const type of types) {
      assert.equal(
        RelationshipSchema.safeParse(relationship(type, evidence, evidence)).success,
        false,
      );
    }
  });

  it('rejects unsupported relationship types, unknown fields, and non-objects', () => {
    for (const type of ['UNKNOWN_RELATIONSHIP', 'works_for', '', 1, null]) {
      assert.equal(RelationshipTypeSchema.safeParse(type).success, false);
      assert.equal(RelationshipSchema.safeParse({ ...relationship(), type }).success, false);
    }
    for (const input of [null, [], 'relationship', {}, { ...relationship(), extra: true }]) {
      assert.equal(RelationshipSchema.safeParse(input).success, false);
    }
  });
});
