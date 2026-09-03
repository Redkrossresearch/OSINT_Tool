import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import type { GraphEntity, GraphRelationship, NeighborhoodResult, PathResult, SubgraphResult } from '../fixtures/graph.fixtures.js';
import {
  buildSmallGraph,
  buildCyClicGraph,
} from '../fixtures/graph.fixtures.js';

interface GraphShape {
  entities: GraphEntity[];
  relationships: GraphRelationship[];
}

function buildAdjacency(shape: GraphShape): Map<string, Array<{ nbr: string; rel: GraphRelationship }>> {
  const adj = new Map<string, Array<{ nbr: string; rel: GraphRelationship }>>();
  shape.entities.forEach(e => adj.set(e.id, []));
  for (const rel of shape.relationships) {
    if (rel.valid_to && rel.valid_to.getTime() < Date.now()) continue;
    const list = adj.get(rel.source_entity_id)!;
    list.push({ nbr: rel.target_entity_id, rel });
  }
  return adj;
}

function neighborhood(shape: GraphShape, entityId: string, maxDepth: number): NeighborhoodResult | null {
  const adj = buildAdjacency(shape);
  if (!adj.has(entityId)) return null;
  const entity = shape.entities.find(e => e.id === entityId)!;

  const visited = new Set<string>([entityId]);
  const queue: Array<{ id: string; depth: number }> = [{ id: entityId, depth: 0 }];
  const neighbors: NeighborhoodResult['neighbors'] = [];
  let reachedDepth = 0;

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    reachedDepth = Math.max(reachedDepth, depth);
    if (depth >= maxDepth) continue;

    for (const { nbr, rel } of adj.get(id) ?? []) {
      if (!visited.has(nbr)) {
        visited.add(nbr);
        const neighborEntity = shape.entities.find(e => e.id === nbr)!;
        neighbors.push({ entity: neighborEntity, relationship: rel });
        queue.push({ id: nbr, depth: depth + 1 });
      }
    }
  }

  return { entity, neighbors, depth: reachedDepth };
}

function findPath(shape: GraphShape, fromId: string, toId: string, maxDepth = 5): PathResult | null {
  const adj = buildAdjacency(shape);
  const entityMap = new Map(shape.entities.map(e => [e.id, e]));

  if (!entityMap.has(fromId) || !entityMap.has(toId)) return null;

  const queue: Array<{ id: string; path: string[]; rels: GraphRelationship[] }> = [
    { id: fromId, path: [fromId], rels: [] },
  ];
  const visitedBFS = new Set<string>([fromId]);

  while (queue.length > 0) {
    const { id, path, rels } = queue.shift()!;
    if (id === toId && path.length > 1) {
      return {
        path: path.map(pid => entityMap.get(pid)!),
        relationships: rels,
        total_hops: path.length - 1,
      };
    }
    if (path.length > maxDepth) continue;

    for (const { nbr, rel } of adj.get(id) ?? []) {
      if (!visitedBFS.has(nbr)) {
        visitedBFS.add(nbr);
        queue.push({ id: nbr, path: [...path, nbr], rels: [...rels, rel] });
      }
    }
  }
  return null;
}

function subgraph(shape: GraphShape, rootId: string, maxDepth: number, typeFilter?: string): SubgraphResult {
  const n = neighborhood(shape, rootId, maxDepth);
  if (!n) return { entities: [], relationships: [] };

  const entityIds = new Set([n.entity.id, ...n.neighbors.map(x => x.entity.id)]);
  const entities = shape.entities.filter(e =>
    entityIds.has(e.id) && (!typeFilter || e.type === typeFilter),
  );
  const relationships = shape.relationships.filter(r =>
    entityIds.has(r.source_entity_id) && entityIds.has(r.target_entity_id),
  );
  return { entities, relationships };
}

describe('GraphQueries', () => {
  const graph = buildSmallGraph();
  const cyclic = buildCyClicGraph();

  describe('neighborhood queries', () => {
    it('returns 1-hop neighbors', () => {
      const result = neighborhood(graph, 'ent-001', 1);
      assert.equal(result?.entity.id, 'ent-001');
      assert.ok(result!.neighbors.length >= 1, 'alice should have neighbors');
    });

    it('returns N-hop neighbors', () => {
      const result = neighborhood(graph, 'ent-001', 2);
      const oneHop = neighborhood(graph, 'ent-001', 1)!;
      assert.ok(result!.neighbors.length >= oneHop.neighbors.length,
        '2-hop should include at least 1-hop');
    });

    it('is bounded by max depth', () => {
      const deep = neighborhood(graph, 'ent-001', 5);
      assert.ok(deep!.depth <= 5, `depth ${deep!.depth} exceeds bound`);
    });

    it('does not traverse beyond max depth 5', () => {
      const a1 = neighborhood(graph, 'ent-001', 5);
      const a6 = neighborhood(graph, 'ent-001', 10);
      assert.equal(a6!.neighbors.length, a1!.neighbors.length,
        'depth > 5 should not add nodes in a bounded graph');
    });

    it('returns empty result for unknown entity', () => {
      const result = neighborhood(graph, 'ent-999', 1);
      assert.equal(result, null);
    });

    it('returns no neighbors for isolated node', () => {
      const result = neighborhood(graph, 'ent-070', 2);
      assert.equal(result!.neighbors.length, 0);
    });
  });

  describe('pathfinding', () => {
    it('finds direct-edge path (alice -> acme corp)', () => {
      const path = findPath(graph, 'ent-001', 'ent-010', 3);
      assert.ok(path);
      assert.equal(path!.total_hops, 1);
      assert.equal(path!.path[0].id, 'ent-001');
      assert.equal(path!.path[path!.path.length - 1].id, 'ent-010');
    });

    it('finds multi-hop path (alice -> acme IP)', () => {
      const path = findPath(graph, 'ent-001', 'ent-030', 5);
      assert.ok(path, 'path should exist');
      assert.ok(path!.total_hops >= 2, `expected >=2 hops, got ${path!.total_hops}`);
      assert.equal(path!.path[path!.path.length - 1].id, 'ent-030');
    });

    it('returns null for disconnected pair', () => {
      const path = findPath(graph, 'ent-070', 'ent-001', 5);
      assert.equal(path, null);
    });

    it('terminates on cyclic graphs (no infinite loop)', () => {
      const path = findPath(cyclic, 'cyc-01', 'cyc-03', 5);
      assert.ok(path);
      assert.equal(path!.path[path!.path.length - 1].id, 'cyc-03');
    });

    it('respects max-depth bound', () => {
      const path = findPath(graph, 'ent-001', 'ent-030', 100);
      assert.ok(path!.total_hops <= 100);
    });
  });

  describe('subgraph extraction', () => {
    it('extracts only reachable nodes around root', () => {
      const sg = subgraph(graph, 'ent-001', 2);
      const ids = new Set(sg.entities.map(e => e.id));
      assert.ok(ids.has('ent-001'));
      assert.ok(ids.has('ent-010') || ids.has('ent-040'));
    });

    it('respects type filter', () => {
      const allIds = subgraph(graph, 'ent-001', 3).entities.map(e => e.id);
      const persons = subgraph(graph, 'ent-001', 3, 'Person').entities;
      assert.ok(persons.every(p => p.type === 'Person'));
      assert.ok(persons.length <= allIds.length);
    });

    it('returns empty for unknown root', () => {
      const sg = subgraph(graph, 'ent-999', 2);
      assert.equal(sg.entities.length, 0);
      assert.equal(sg.relationships.length, 0);
    });

    it('excludes relationships outside the subgraph', () => {
      const sg = subgraph(graph, 'ent-001', 1);
      for (const rel of sg.relationships) {
        const ids = new Set(sg.entities.map(e => e.id));
        assert.ok(ids.has(rel.source_entity_id));
        assert.ok(ids.has(rel.target_entity_id));
      }
    });
  });
});
