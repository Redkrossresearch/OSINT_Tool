import type { GraphStorage, StoredRelationship } from '../services/graph.service.js';
import {
  queryOptions,
  traverse,
  validateId,
  type GraphResult,
  type QueryOptions,
} from './traversal.js';

/**
 * Unweighted BFS, up to five hops by default. Arrays follow source-to-target path
 * order; ties follow sorted relationship IDs. Missing/disconnected endpoints
 * return null; an existing source equal to target yields one node and no edges.
 */
export async function findPath(
  storage: GraphStorage,
  source: string,
  target: string,
  options: QueryOptions = {},
): Promise<GraphResult | null> {
  const start = validateId(source);
  const end = validateId(target);
  const validated = queryOptions(options, 5);
  return storage.transaction(async (tx) => {
    const state = await traverse(tx, start, validated, end);
    if (!state.entities.has(end)) return null;
    const entities = [state.entities.get(end)!];
    const relationships: StoredRelationship[] = [];
    let cursor = end;
    while (cursor !== start) {
      const parent = state.parents.get(cursor)!;
      relationships.push(parent.edge);
      entities.push(state.entities.get(parent.from)!);
      cursor = parent.from;
    }
    return structuredClone({
      entities: entities.reverse(),
      relationships: relationships.reverse(),
    });
  });
}
