import { EvidenceRefSchema } from '@osint-tool/entities';
import {
  isRelationshipActive,
  type GraphTransaction,
  type StoredEntity,
  type StoredRelationship,
} from '../services/graph.service.js';

export interface QueryOptions {
  depth?: number;
  /** Snapshot time; defaults to now. Historical queries use the same validity rule. */
  at?: Date;
}

export interface GraphResult {
  entities: StoredEntity[];
  relationships: StoredRelationship[];
}

export const MAX_DEPTH = 5;

export function validateId(id: string): string {
  return EvidenceRefSchema.parse({ kind: 'evidence', id }).id;
}

export function queryOptions(options: QueryOptions, defaultDepth: number) {
  const depth = options.depth === undefined ? defaultDepth : options.depth;
  if (!Number.isInteger(depth) || depth < 0 || depth > MAX_DEPTH) {
    throw new RangeError('Depth must be an integer between 0 and 5');
  }
  const at = options.at === undefined ? new Date() : options.at;
  if (!(at instanceof Date) || !Number.isFinite(at.getTime())) {
    throw new TypeError('Expected a valid query Date');
  }
  return { depth, at: new Date(at.getTime()) };
}

export function byId(a: { id: string }, b: { id: string }): number {
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/**
 * One BFS inside the caller's scoped transaction. The storage contract provides
 * incident edges, so connectivity is undirected; returned edge direction remains
 * unchanged. Evidence endpoints are not entities and cannot be traversal steps.
 * No batch API is available: cache each entity lookup and scan each visited node
 * once. Depth limits hops, not graph width; adapter performance remains T3-008 work.
 */
export async function traverse(
  tx: GraphTransaction,
  root: string,
  options: { depth: number; at: Date },
  destination?: string,
) {
  const cache = new Map<string, StoredEntity | null>();
  const get = async (id: string) => {
    if (!cache.has(id)) cache.set(id, await tx.getEntity(id));
    return cache.get(id) ?? null;
  };
  const entities = new Map<string, StoredEntity>();
  const edges = new Map<string, StoredRelationship>();
  const parents = new Map<string, { from: string; edge: StoredRelationship }>();
  const first = await get(root);
  if (!first || (destination !== undefined && !(await get(destination)))) {
    return { entities, edges, parents };
  }
  entities.set(root, first);
  const queue = [{ id: root, depth: 0 }];
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index];
    if (destination !== undefined && current.id === destination) break;
    // Graph extraction scans the boundary for induced edges, but never follows
    // them to a new node. Pathfinding does not need those boundary scans.
    if (destination !== undefined && current.depth === options.depth) continue;
    const adjacent = (await tx.relationshipsForEntity(current.id)).slice().sort(byId);
    for (const edge of adjacent) {
      const { source, target } = edge.relationship;
      if (source.kind !== 'entity') continue;
      if (source.id !== current.id && target.id !== current.id) {
        throw new Error('Storage returned a non-incident relationship');
      }
      if (!isRelationshipActive(edge, options.at)) continue;
      edges.set(edge.id, edge);
      if (current.depth === options.depth) continue;
      const other = source.id === current.id ? target : source;
      const node = await get(other.id);
      if (!node) throw new Error('Relationship entity not found');
      const currentNode = entities.get(current.id)!;
      const currentRef = source.id === current.id ? source : target;
      if (node.entity.type !== other.type || currentNode.entity.type !== currentRef.type) {
        throw new Error('Entity reference type mismatch');
      }
      if (entities.has(other.id)) continue;
      entities.set(other.id, node);
      parents.set(other.id, { from: current.id, edge });
      queue.push({ id: other.id, depth: current.depth + 1 });
    }
  }
  return { entities, edges, parents };
}

export function graphResult(state: Awaited<ReturnType<typeof traverse>>): GraphResult {
  return structuredClone({
    entities: [...state.entities.values()].sort(byId),
    relationships: [...state.edges.values()]
      .filter(
        ({ relationship: { source, target } }) =>
          source.kind === 'entity' &&
          state.entities.has(source.id) &&
          state.entities.has(target.id),
      )
      .sort(byId),
  });
}
