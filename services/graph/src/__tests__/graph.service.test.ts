import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import type { GraphEntity, GraphRelationship } from './fixtures/graph.fixtures.js';
import {
  alice,
  acmeCorp,
  reactTech,
  buildSmallGraph,
  buildCyClicGraph,
} from './fixtures/graph.fixtures.js';

interface GraphStore {
  entities: Map<string, GraphEntity>;
  relationships: GraphRelationship[];
  removedRelationships: string[];
}

function createStore(): GraphStore {
  const g = buildSmallGraph();
  const entities = new Map<string, GraphEntity>();
  g.entities.forEach(e => entities.set(e.id, e));
  return { entities, relationships: [...g.relationships], removedRelationships: [] };
}

function addEntity(store: GraphStore, entity: GraphEntity): void {
  store.entities.set(entity.id, entity);
}

function updateEntityAttrs(store: GraphStore, id: string, attrs: Record<string, unknown>): void {
  const e = store.entities.get(id);
  if (!e) throw new Error(`entity ${id} not found`);
  e.attributes = { ...e.attributes, ...attrs };
}

function removeEntity(store: GraphStore, id: string): void {
  store.entities.delete(id);
  store.relationships = store.relationships.filter(
    r => r.source_entity_id !== id && r.target_entity_id !== id,
  );
}

function addRelationship(store: GraphStore, rel: GraphRelationship): void {
  if (!store.entities.has(rel.source_entity_id) || !store.entities.has(rel.target_entity_id)) {
    throw new Error('relationship references missing entity');
  }
  store.relationships.push(rel);
}

function describeRelationship(store: GraphStore, id: string): void {
  store.relationships = store.relationships.map(r => {
    if (r.id === id) return { ...r, valid_to: new Date() };
    return r;
  });
  store.removedRelationships.push(id);
}

describe('GraphStorage', () => {

  describe('entity CRUD', () => {
    it('adds an entity and retrieves it', () => {
      const store = createStore();
      addEntity(store, reactTech);
      const found = store.entities.get('ent-050');
      assert.equal(found?.id, 'ent-050');
      assert.equal(found?.canonical_name, 'React');
    });

    it('updates entity attributes and persists', () => {
      const store = createStore();
      updateEntityAttrs(store, 'ent-001', { role: 'lead' });
      const updated = store.entities.get('ent-001');
      assert.equal(updated?.attributes.role, 'lead');
      assert.ok(updated?.attributes.emails?.length, 'existing attributes preserved');
    });

    it('removes entity and its relationships', () => {
      const store = createStore();
      const beforeCount = store.relationships.length;
      removeEntity(store, 'ent-001');

      assert.equal(store.entities.has('ent-001'), false);
      const touched = store.relationships.filter(
        r => r.source_entity_id === 'ent-001' || r.target_entity_id === 'ent-001',
      );
      assert.equal(touched.length, 0);

      const removedCount = beforeCount - store.relationships.length;
      assert.ok(removedCount >= 1, 'relationships involving removed entity should be removed');
    });

    it('adding duplicate entity id overwrites', () => {
      const store = createStore();
      const duplicate = { ...alice, canonical_name: 'Alice Updated' };
      addEntity(store, duplicate);
      assert.equal(store.entities.get('ent-001')?.canonical_name, 'Alice Updated');
    });
  });

  describe('relationship CRUD', () => {
    it('adds relationship between existing entities', () => {
      const store = createStore();
      addRelationship(store, {
        id: 'rel-x1', source_entity_id: 'ent-001', target_entity_id: 'ent-050',
        type: 'USES', confidence: 0.8, evidence_id: 'ev-x1',
        valid_from: new Date(), valid_to: null, attributes: {},
      });
      assert.ok(store.relationships.some(r => r.id === 'rel-x1'));
    });

    it('rejects relationship referencing a missing entity', () => {
      const store = createStore();
      assert.throws(() => addRelationship(store, {
        id: 'rel-x2', source_entity_id: 'ent-999', target_entity_id: 'ent-001',
        type: 'OWNS', confidence: 0.8, evidence_id: 'ev-x2',
        valid_from: new Date(), valid_to: null, attributes: {},
      }));
    });

    it('deactivates relationship by setting valid_to', () => {
      const store = createStore();
      describeRelationship(store, 'rel-001');
      const rel = store.relationships.find(r => r.id === 'rel-001');
      assert.ok(rel?.valid_to instanceof Date, 'valid_to should be set');
    });
  });

  describe('temporal relationships', () => {
    it('sets valid_from on creation', () => {
      const store = createStore();
      const created = store.relationships.find(r => r.id === 'rel-001');
      assert.ok(created?.valid_from instanceof Date);
    });

    it('distinguishes active vs historical relationships', () => {
      const store = createStore();
      const active = store.relationships.filter(r => r.valid_to === null);
      const historical = store.relationships.filter(r => r.valid_to !== null);

      assert.ok(active.length > 0, 'at least one active relationship');
      assert.ok(historical.length > 0, 'at least one historical relationship (rel-009)');
      assert.equal(active.some(r => r.id === 'rel-009'), false, 'historical rel should not be active');
    });

    it('preserves evidence_id linkage', () => {
      const store = createStore();
      for (const rel of store.relationships) {
        assert.ok(rel.evidence_id && rel.evidence_id.length > 0, 'every relationship must have evidence_id');
      }
    });
  });

  describe('graph integrity (ADR-005)', () => {
    it('every relationship references existing entities', () => {
      const store = createStore();
      for (const rel of store.relationships) {
        assert.ok(store.entities.has(rel.source_entity_id),
          `missing source entity for ${rel.id}`);
        assert.ok(store.entities.has(rel.target_entity_id),
          `missing target entity for ${rel.id}`);
      }
    });

    it('every entity has required ADR-005 fields', () => {
      const store = createStore();
      for (const [id, e] of store.entities) {
        assert.ok(e.type, `${id} missing type`);
        assert.ok(e.canonical_name, `${id} missing canonical_name`);
        assert.ok(e.attributes, `${id} missing attributes`);
        assert.ok(typeof e.confidence === 'number', `${id} missing confidence`);
        assert.ok(e.created_at instanceof Date, `${id} missing created_at`);
      }
    });

    it('cyclic graph has no broken references', () => {
      const cyc = buildCyClicGraph();
      const ids = new Set(cyc.entities.map(e => e.id));
      for (const rel of cyc.relationships) {
        assert.ok(ids.has(rel.source_entity_id));
        assert.ok(ids.has(rel.target_entity_id));
      }
    });
  });
});
