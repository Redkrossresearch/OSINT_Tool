import type { GraphStorage } from '../services/graph.service.js';
import { neighborhood, type GraphResult, type QueryOptions } from './neighborhood.js';

/** Induced graph on nodes reachable within depth; includes edges between boundary nodes. */
export async function subgraph(
  storage: GraphStorage,
  root: string,
  options: QueryOptions = {},
): Promise<GraphResult> {
  return neighborhood(storage, root, options);
}
