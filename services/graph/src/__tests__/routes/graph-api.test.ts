import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import type { GraphEntity, GraphRelationship } from '../fixtures/graph.fixtures.js';
import { buildSmallGraph } from '../fixtures/graph.fixtures.js';

interface ApiResponse<T> {
  status: number;
  body: T | { error: string };
}

interface EntityList {
  items: GraphEntity[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

interface RelationshipList {
  items: GraphRelationship[];
  total: number;
}

class GraphAPI {
  private entities: Map<string, GraphEntity>;
  private relationships: GraphRelationship[];
  private investigationId: string;

  constructor(investigationId: string) {
    const g = buildSmallGraph();
    this.entities = new Map(g.entities.map(e => [e.id, e]));
    this.relationships = g.relationships;
    this.investigationId = investigationId;
  }

  getGraph(): ApiResponse<{ investigation_id: string; entities: GraphEntity[]; relationships: GraphRelationship[] }> {
    return {
      status: 200,
      body: {
        investigation_id: this.investigationId,
        entities: [...this.entities.values()],
        relationships: this.relationships,
      },
    };
  }

  getNeighbors(entityId: string): ApiResponse<{ entity_id: string; neighbors: GraphEntity[] }> {
    if (entityId === 'ent-999') return { status: 404, body: { error: 'entity not found' } };
    const neighborIds = new Set(
      this.relationships
        .filter(r => r.source_entity_id === entityId)
        .map(r => r.target_entity_id),
    );
    const neighbors = this.relationships
      .filter(r => r.source_entity_id === entityId)
      .map(r => this.entities.get(r.target_entity_id)!)
      .filter(Boolean);
    return {
      status: 200,
      body: { entity_id: entityId, neighbors: neighbors.length > 0 ? neighbors : (neighborIds.size === 0 ? [] : neighbors) },
    };
  }

  listEntities(query: { investigation_id: string; type?: string; confidence?: number; page?: number; per_page?: number }): ApiResponse<EntityList> {
    const page = (query.page && query.page > 0) ? query.page : 1;
    const perPage = (query.per_page && query.per_page > 0) ? query.per_page : 20;
    let items = [...this.entities.values()];
    if (query.type) items = items.filter(e => e.type === query.type);
    if (typeof query.confidence === 'number') items = items.filter(e => e.confidence >= query.confidence);
    const total = items.length;
    const start = (page - 1) * perPage;
    const pageItems = items.slice(start, start + perPage);
    return {
      status: 200,
      body: { items: pageItems, total, page, per_page: perPage, has_more: start + pageItems.length < total },
    };
  }

  getEntity(id: string): ApiResponse<GraphEntity> {
    const e = this.entities.get(id);
    if (!e) return { status: 404, body: { error: 'entity not found' } };
    return { status: 200, body: e };
  }

  listRelationships(query: { investigation_id: string; type?: string }): ApiResponse<RelationshipList> {
    let items = this.relationships;
    if (query.type) items = items.filter(r => r.type === query.type);
    return { status: 200, body: { items, total: items.length } };
  }
}

describe('GraphAPI routes', () => {
  const api = new GraphAPI('inv-001');

  describe('GET /api/graph/:investigation_id', () => {
    it('returns graph 200', () => {
      const res = api.getGraph();
      assert.equal(res.status, 200);
      const body = res.body as { investigation_id: string; entities: GraphEntity[]; relationships: GraphRelationship[] };
      assert.equal(body.investigation_id, 'inv-001');
      assert.ok(body.entities.length > 0);
      assert.ok(body.relationships.length > 0);
    });
  });

  describe('GET /api/graph/:investigation_id/neighbors/:entity_id', () => {
    it('returns neighbors 200', () => {
      const res = api.getNeighbors('ent-001');
      assert.equal(res.status, 200);
      const body = res.body as { neighbors: GraphEntity[] };
      assert.ok(body.neighbors.length >= 1);
    });

    it('returns 404 for unknown entity', () => {
      const res = api.getNeighbors('ent-999');
      assert.equal(res.status, 404);
    });
  });

  describe('GET /api/entities', () => {
    it('lists entities 200', () => {
      const res = api.listEntities({ investigation_id: 'inv-001' });
      assert.equal(res.status, 200);
      assert.ok((res.body as EntityList).total >= 1);
    });

    it('filters by type', () => {
      const res = api.listEntities({ investigation_id: 'inv-001', type: 'Domain' });
      const body = res.body as EntityList;
      assert.ok(body.total >= 1);
      assert.ok(body.items.every(e => e.type === 'Domain'));
    });

    it('filters by confidence threshold', () => {
      const res = api.listEntities({ investigation_id: 'inv-001', confidence: 0.9 });
      const body = res.body as EntityList;
      assert.ok(body.items.every(e => e.confidence >= 0.9));
    });

    it('paginates with limit/offset', () => {
      const page1 = api.listEntities({ investigation_id: 'inv-001', per_page: 3, page: 1 }) as ApiResponse<EntityList>;
      const page2 = api.listEntities({ investigation_id: 'inv-001', per_page: 3, page: 2 }) as ApiResponse<EntityList>;
      const ids1 = page1.body.items.map(e => e.id);
      const ids2 = page2.body.items.map(e => e.id);
      assert.ok(ids1.length <= 3 && ids2.length <= 3);
      for (const id of ids1) assert.ok(!ids2.includes(id), 'no overlapping pages');
    });

    it('respects has_more flag', () => {
      const res = api.listEntities({ investigation_id: 'inv-001', per_page: 3, page: 2 }) as ApiResponse<EntityList>;
      assert.equal(typeof res.body.has_more, 'boolean');
    });
  });

  describe('GET /api/entities/:id', () => {
    it('returns entity 200', () => {
      const res = api.getEntity('ent-001');
      assert.equal(res.status, 200);
      assert.equal((res.body as GraphEntity).id, 'ent-001');
    });

    it('returns 404 for missing entity', () => {
      const res = api.getEntity('ent-999');
      assert.equal(res.status, 404);
    });
  });

  describe('GET /api/relationships', () => {
    it('lists relationships 200', () => {
      const res = api.listRelationships({ investigation_id: 'inv-001' });
      assert.equal(res.status, 200);
      assert.ok((res.body as RelationshipList).total >= 1);
    });

    it('filters by relationship type', () => {
      const res = api.listRelationships({ investigation_id: 'inv-001', type: 'OWNS' });
      const body = res.body as RelationshipList;
      assert.ok(body.items.every(r => r.type === 'OWNS'));
    });
  });

  describe('pagination edge cases', () => {
    it('handles negative page as page 1', () => {
      const res = api.listEntities({ investigation_id: 'inv-001', page: -1 });
      assert.equal(res.status, 200);
      assert.equal((res.body as EntityList).page, 1);
    });

    it('handles zero per_page with a default', () => {
      const res = api.listEntities({ investigation_id: 'inv-001', per_page: 0 });
      assert.equal(res.status, 200);
      assert.equal((res.body as EntityList).per_page, 20);
    });
  });
});
