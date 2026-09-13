import type { GraphStorage } from '../services/graph.service.js';
import {
  graphResult,
  queryOptions,
  traverse,
  validateId,
  type GraphResult,
  type QueryOptions,
} from './traversal.js';

export type { GraphResult, QueryOptions } from './traversal.js';

/** Root plus its N-hop neighborhood (default one hop); unknown roots return empty arrays. */
export async function neighborhood(
  storage: GraphStorage,
  root: string,
  options: QueryOptions = {},
): Promise<GraphResult> {
  const id = validateId(root);
  const validated = queryOptions(options, 1);
  return storage.transaction(async (tx) => graphResult(await traverse(tx, id, validated)));
}
