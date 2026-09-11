import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Entity, PersonEntity, Relationship } from '@osint-tool/entities';
import {
  GraphService,
  isRelationshipActive,
  type GraphStorage,
  type GraphTransaction,
  type StoredEntity,
  type StoredRelationship,
} from '../services/graph.service.js';

// Test-only storage mechanics. All graph decisions are exercised through GraphService.
class TestStorage implements GraphStorage {
  entities = new Map<string, StoredEntity>();
  relationships = new Map<string, StoredRelationship>();
  evidence = new Set(['evidence-1']);
  private pending: Promise<unknown> = Promise.resolve();

  transaction<T>(operation: (tx: GraphTransaction) => Promise<T>): Promise<T> {
    const result = this.pending.then(async () => {
      const entities = structuredClone(this.entities);
      const relationships = structuredClone(this.relationships);
      const result = await operation({
        getEntity: async (id) => entities.get(id) ?? null,
        insertEntity: async (value) => {
          assert.ok(!entities.has(value.id));
          entities.set(value.id, value);
        },
        updateEntity: async (value) => {
          entities.set(value.id, value);
        },
        deleteEntity: async (id) => {
          entities.delete(id);
        },
        getRelationship: async (id) => relationships.get(id) ?? null,
        insertRelationship: async (value) => {
          assert.ok(!relationships.has(value.id));
          relationships.set(value.id, value);
        },
        updateRelationship: async (value) => {
          relationships.set(value.id, value);
        },
        relationshipsForEntity: async (id) =>
          [...relationships.values()].filter(
            ({ relationship: r }) =>
              r.target.id === id || (r.source.kind === 'entity' && r.source.id === id),
          ),
        evidenceExists: async (id) => this.evidence.has(id),
      });
      this.entities = entities;
      this.relationships = relationships;
      return result;
    });
    this.pending = result.catch(() => undefined);
    return result;
  }
}

const start = new Date('2026-09-01T00:00:00Z');
const end = new Date('2026-09-02T00:00:00Z');
const person = (): PersonEntity => ({
  type: 'person',
  confidence: 0.8,
  attributes: { name: 'Alice', aliases: ['A'] },
});
const company = (): Entity => ({ type: 'company', confidence: 1, attributes: { name: 'Acme' } });
const relationship = (): Relationship => ({
  type: 'WORKS_FOR',
  source: { kind: 'entity', id: 'person-1', type: 'person' },
  target: { kind: 'entity', id: 'company-1', type: 'company' },
  confidence: 0.9,
  evidence: [{ kind: 'evidence', id: 'evidence-1' }],
});
async function setup() {
  const storage = new TestStorage();
  const service = new GraphService(storage, () => new Date(start));
  await service.addEntity('person-1', person());
  await service.addEntity('company-1', company());
  return { storage, service };
}

describe('T3-009 GraphService', () => {
  it('stores and retrieves validated entities without generating IDs', async () => {
    const { service, storage } = await setup();
    assert.deepEqual(await service.getEntity('person-1'), { id: 'person-1', entity: person() });
    assert.equal(storage.entities.size, 2);
    await assert.rejects(service.addEntity('', person()));
  });

  it('merges attribute patches and preserves confidence and other attributes', async () => {
    const { service } = await setup();
    await service.updateEntityAttributes('person-1', { name: 'Alice B' });
    assert.deepEqual((await service.getEntity('person-1'))?.entity, {
      ...person(),
      attributes: { name: 'Alice B', aliases: ['A'] },
    });
    await assert.rejects(service.updateEntityAttributes('person-1', { name: '' }));
    await assert.rejects(service.updateEntityAttributes('person-1', { aliases: undefined }));
    await assert.rejects(service.updateEntityAttributes('person-1', { unknown: true }));
    assert.deepEqual((await service.getEntity('person-1'))?.entity.attributes, {
      name: 'Alice B',
      aliases: ['A'],
    });
  });

  it('removes an unconnected entity and handles missing records deterministically', async () => {
    const { service } = await setup();
    await service.removeEntity('person-1');
    assert.equal(await service.getEntity('person-1'), null);
    assert.equal(await service.getRelationship('missing'), null);
    await assert.rejects(service.removeEntity('person-1'), /Entity not found/);
    await assert.rejects(service.updateEntityAttributes('missing', {}), /Entity not found/);
    await assert.rejects(service.removeRelationship('missing'), /Relationship not found/);
  });

  it('rejects duplicate IDs including concurrent requests across service instances', async () => {
    const storage = new TestStorage();
    const results = await Promise.allSettled([
      new GraphService(storage).addEntity('same', person()),
      new GraphService(storage).addEntity('same', company()),
    ]);
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
    assert.equal(storage.entities.size, 1);
  });

  it('stores relationships with confidence, evidence, and deterministic start time', async () => {
    const { service } = await setup();
    const saved = await service.addRelationship('r', relationship());
    assert.deepEqual(saved, {
      id: 'r',
      relationship: relationship(),
      valid_from: start,
      valid_to: null,
    });
    assert.deepEqual(await service.getRelationship('r'), saved);
    await assert.rejects(service.addRelationship('r', relationship()), /already exists/);
  });

  it('validates both endpoint existence, types, and supporting evidence', async () => {
    const { service, storage } = await setup();
    for (const endpoint of ['source', 'target'] as const) {
      const input = relationship();
      input[endpoint].id = 'missing';
      await assert.rejects(service.addRelationship('r', input), /entity not found/);
    }
    const wrongType = relationship();
    wrongType.source = { kind: 'entity', id: 'company-1', type: 'person' };
    await assert.rejects(service.addRelationship('r', wrongType), /type mismatch/);
    const invalid = relationship();
    invalid.type = 'HOSTED_ON';
    await assert.rejects(service.addRelationship('r', invalid));
    storage.evidence.clear();
    await assert.rejects(service.addRelationship('r', relationship()), /Evidence not found/);
    assert.equal(storage.relationships.size, 0);
  });

  it('supports MENTIONS evidence endpoints without treating evidence as an entity', async () => {
    const { service, storage } = await setup();
    const input: Relationship = {
      ...relationship(),
      type: 'MENTIONS',
      source: { kind: 'evidence', id: 'evidence-1' },
    };
    await service.addRelationship('r', input);
    assert.deepEqual((await service.getRelationship('r'))?.relationship.source, input.source);
    storage.evidence.clear();
    await assert.rejects(service.addRelationship('other', input), /Evidence not found/);
  });

  it('preserves supplied temporal values and distinguishes future, active, and historical records', async () => {
    const { service } = await setup();
    const saved = await service.addRelationship('r', relationship(), {
      valid_from: start,
      valid_to: end,
    });
    assert.equal(isRelationshipActive(saved, new Date(start.getTime() - 1)), false);
    assert.equal(isRelationshipActive(saved, start), true);
    assert.equal(isRelationshipActive(saved, new Date(end.getTime() - 1)), true);
    assert.equal(isRelationshipActive(saved, end), false);
    assert.deepEqual((await service.getRelationship('r'))?.valid_to, end);
  });

  it('deactivates without deleting history or endpoints and is idempotent', async () => {
    const { service } = await setup();
    await service.addRelationship('r', relationship());
    const closed = await service.removeRelationship('r', end);
    assert.deepEqual(closed.valid_to, end);
    assert.deepEqual(await service.removeRelationship('r', new Date('2027-01-01Z')), closed);
    assert.ok(await service.getEntity('person-1'));
    assert.ok(await service.getEntity('company-1'));
    assert.deepEqual(await service.getRelationship('r'), closed);
    await assert.rejects(service.removeEntity('person-1'), /has relationships/);
    await assert.rejects(service.removeEntity('company-1'), /has relationships/);
  });

  it('rejects invalid dates and reversed intervals without writing', async () => {
    const { service, storage } = await setup();
    await assert.rejects(
      service.addRelationship('r', relationship(), { valid_from: new Date(NaN) }),
    );
    await assert.rejects(
      service.addRelationship('r', relationship(), { valid_from: end, valid_to: start }),
    );
    assert.equal(storage.relationships.size, 0);
    await service.addRelationship('r', relationship(), { valid_from: end });
    await assert.rejects(service.removeRelationship('r', start), /must not precede/);
    assert.equal((await service.getRelationship('r'))?.valid_to, null);
  });

  it('never aliases caller input, returned objects, dates, or storage objects', async () => {
    const { service, storage } = await setup();
    const input = person();
    const pending = service.addEntity('new', input);
    input.attributes.name = 'Changed';
    const created = await pending;
    assert.equal(created.entity.type, 'person');
    if (created.entity.type !== 'person') throw new Error('Expected person');
    created.entity.attributes.name = 'Changed again';
    assert.deepEqual((await service.getEntity('new'))?.entity, person());
    const patch = { aliases: ['B'] };
    const updating = service.updateEntityAttributes('new', patch);
    patch.aliases.push('C');
    await updating;
    assert.deepEqual((await service.getEntity('new'))?.entity.attributes, {
      name: 'Alice',
      aliases: ['B'],
    });
    const from = new Date(start);
    const edge = relationship();
    const adding = service.addRelationship('r', edge, { valid_from: from });
    from.setTime(0);
    edge.evidence.length = 0;
    const result = await adding;
    result.valid_from.setTime(0);
    result.relationship.evidence.length = 0;
    const read = await service.getRelationship('r');
    assert.deepEqual(read?.valid_from, start);
    assert.equal(read?.relationship.evidence.length, 1);
    read!.valid_from.setTime(0);
    assert.deepEqual(storage.relationships.get('r')?.valid_from, start);
  });

  it('rejects malformed entity and relationship data', async () => {
    const { service } = await setup();
    await assert.rejects(service.addEntity('bad', { ...person(), confidence: NaN }));
    await assert.rejects(service.addRelationship('bad', { ...relationship(), confidence: 2 }));
    await assert.rejects(
      service.updateEntityAttributes('person-1', null as unknown as Record<string, unknown>),
    );
  });

  it('uses the injected clock for deactivation and propagates adapter failures', async () => {
    const { storage, service } = await setup();
    await service.addRelationship('r', relationship());
    const later = new GraphService(storage, () => new Date(end));
    assert.deepEqual((await later.removeRelationship('r')).valid_to, end);
    const failure = new Error('storage unavailable');
    const broken = new GraphService({
      transaction: async () => {
        throw failure;
      },
    });
    await assert.rejects(broken.getEntity('id'), (error) => error === failure);
  });
});
