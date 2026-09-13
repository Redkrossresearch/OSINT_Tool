import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type {
  GraphStorage,
  GraphTransaction,
  StoredEntity,
  StoredRelationship,
} from '../../services/graph.service.js';
import { neighborhood } from '../../queries/neighborhood.js';
import { findPath } from '../../queries/pathfinding.js';
import { subgraph } from '../../queries/subgraph.js';

const at = new Date('2026-09-11T00:00:00Z');
const past = new Date('2026-09-01T00:00:00Z');
const future = new Date('2026-10-01T00:00:00Z');

// Only storage mechanics live here: no traversal or pathfinding in the test double.
class Fixture implements GraphStorage {
  entities = new Map<string, StoredEntity>();
  edges: StoredRelationship[] = [];
  gets: string[] = [];
  scans: string[] = [];
  transactions = 0;

  constructor(ids: string[], connections: [string, string, string][] = []) {
    for (const id of ids)
      this.entities.set(id, {
        id,
        entity: { type: 'person', confidence: 1, attributes: { name: id } },
      });
    for (const [id, source, target] of connections)
      this.edges.push({
        id,
        relationship: {
          type: 'ASSOCIATED_WITH',
          source: { kind: 'entity', id: source, type: 'person' },
          target: { kind: 'entity', id: target, type: 'person' },
          confidence: 0.8,
          evidence: [{ kind: 'evidence', id: 'evidence' }],
        },
        valid_from: new Date(past),
        valid_to: null,
      });
  }

  async transaction<T>(operation: (tx: GraphTransaction) => Promise<T>): Promise<T> {
    this.transactions++;
    const write = async () => {
      throw new Error('Queries must not write');
    };
    return operation({
      getEntity: async (id) => {
        this.gets.push(id);
        return this.entities.get(id) ?? null;
      },
      relationshipsForEntity: async (id) => {
        this.scans.push(id);
        return this.edges.filter(
          ({ relationship: { source, target } }) =>
            (source.kind === 'entity' && source.id === id) || target.id === id,
        );
      },
      getRelationship: async (id) => this.edges.find((edge) => edge.id === id) ?? null,
      evidenceExists: async () => true,
      insertEntity: write,
      updateEntity: write,
      deleteEntity: write,
      insertRelationship: write,
      updateRelationship: write,
    });
  }
}

const ids = (values: { id: string }[]) => values.map(({ id }) => id);
const graph = () =>
  new Fixture(
    ['A', 'B', 'C', 'D', 'Z'],
    [
      ['ab', 'A', 'B'],
      ['bc', 'B', 'C'],
      ['ad', 'A', 'D'],
    ],
  );

describe('T3-010 neighborhood and subgraph', () => {
  for (const query of [neighborhood, subgraph]) {
    it(`${query.name}: includes root and direct neighbors, excluding unrelated edges`, async () => {
      const result = await query(graph(), 'A', { at });
      assert.deepEqual(ids(result.entities), ['A', 'B', 'D']);
      assert.deepEqual(ids(result.relationships), ['ab', 'ad']);
    });
    it(`${query.name}: supports multiple hops, depth zero, isolated and missing roots`, async () => {
      assert.deepEqual(ids((await query(graph(), 'A', { depth: 2, at })).entities), [
        'A',
        'B',
        'C',
        'D',
      ]);
      assert.deepEqual(await query(graph(), 'A', { depth: 0, at }), {
        entities: [graph().entities.get('A')],
        relationships: [],
      });
      assert.deepEqual(ids((await query(graph(), 'Z', { at })).entities), ['Z']);
      assert.deepEqual(await query(graph(), 'missing', { at }), {
        entities: [],
        relationships: [],
      });
    });
    it(`${query.name}: includes induced boundary edges and suppresses cycles and duplicates`, async () => {
      const fixture = graph();
      const extra = new Fixture(
        [],
        [
          ['bd', 'B', 'D'],
          ['self', 'A', 'A'],
        ],
      );
      fixture.edges.push(...extra.edges, fixture.edges[0]);
      const result = await query(fixture, 'A', { depth: 1, at });
      assert.deepEqual(ids(result.entities), ['A', 'B', 'D']);
      assert.deepEqual(ids(result.relationships), ['ab', 'ad', 'bd', 'self']);
      assert.equal(fixture.transactions, 1);
      assert.equal(new Set(fixture.gets).size, fixture.gets.length);
      assert.equal(new Set(fixture.scans).size, fixture.scans.length);
      assert.ok(!fixture.gets.includes('C'));
    });
    it(`${query.name}: reaches five hops but never six`, async () => {
      const fixture = new Fixture(
        ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        [
          ['ab', 'A', 'B'],
          ['bc', 'B', 'C'],
          ['cd', 'C', 'D'],
          ['de', 'D', 'E'],
          ['ef', 'E', 'F'],
          ['fg', 'F', 'G'],
        ],
      );
      const result = await query(fixture, 'A', { depth: 5, at });
      assert.deepEqual(ids(result.entities), ['A', 'B', 'C', 'D', 'E', 'F']);
      assert.equal(result.relationships.length, 5);
      assert.ok(!fixture.gets.includes('G'));
      assert.ok(!fixture.scans.includes('G'));
    });
  }
});

describe('T3-010 shortest paths', () => {
  it('returns direct and multi-hop paths in path order, including reverse connectivity', async () => {
    assert.deepEqual(ids((await findPath(graph(), 'A', 'B', { at }))!.entities), ['A', 'B']);
    const result = await findPath(graph(), 'C', 'D', { at });
    assert.deepEqual(ids(result!.entities), ['C', 'B', 'A', 'D']);
    assert.deepEqual(ids(result!.relationships), ['bc', 'ab', 'ad']);
    assert.equal(result!.relationships[0].relationship.source.id, 'B');
  });
  it('returns null for missing/disconnected endpoints and a zero-hop path for equal endpoints', async () => {
    for (const [source, target] of [
      ['A', 'Z'],
      ['missing', 'B'],
      ['A', 'missing'],
      ['missing', 'missing'],
    ]) {
      assert.equal(await findPath(graph(), source, target, { at }), null);
    }
    assert.deepEqual(await findPath(graph(), 'A', 'A', { depth: 0, at }), {
      entities: [graph().entities.get('A')],
      relationships: [],
    });
    assert.equal(await findPath(graph(), 'A', 'B', { depth: 0, at }), null);
  });
  it('chooses the shortest route and stable tie breaks independent of adapter ordering', async () => {
    const fixture = new Fixture(
      ['A', 'B', 'C', 'D'],
      [
        ['ac', 'A', 'C'],
        ['cd', 'C', 'D'],
        ['ab', 'A', 'B'],
        ['bd', 'B', 'D'],
        ['bc', 'B', 'C'],
      ],
    );
    const result = await findPath(fixture, 'A', 'D', { at });
    assert.deepEqual(ids(result!.entities), ['A', 'B', 'D']);
    fixture.edges.reverse();
    assert.deepEqual(await findPath(fixture, 'A', 'D', { at }), result);
    fixture.edges.push(...new Fixture([], [['ad', 'A', 'D']]).edges);
    assert.deepEqual(ids((await findPath(fixture, 'A', 'D', { at }))!.entities), ['A', 'D']);
  });
  it('terminates on cycles and excludes paths beyond the requested depth', async () => {
    const fixture = new Fixture(
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Z'],
      [
        ['ab', 'A', 'B'],
        ['bc', 'B', 'C'],
        ['cd', 'C', 'D'],
        ['de', 'D', 'E'],
        ['ef', 'E', 'F'],
        ['fg', 'F', 'G'],
        ['self', 'C', 'C'],
      ],
    );
    assert.equal((await findPath(fixture, 'A', 'F', { at }))!.relationships.length, 5);
    assert.equal(await findPath(fixture, 'A', 'G', { at }), null);
    assert.equal(await findPath(fixture, 'A', 'C', { depth: 1, at }), null);
    assert.equal(await findPath(fixture, 'A', 'Z', { at }), null);
  });
});

describe('T3-010 temporal and safety behavior', () => {
  const queries = [
    (storage: GraphStorage, options: { depth?: number; at?: Date }) =>
      neighborhood(storage, 'A', options),
    (storage: GraphStorage, options: { depth?: number; at?: Date }) =>
      subgraph(storage, 'A', options),
    (storage: GraphStorage, options: { depth?: number; at?: Date }) =>
      findPath(storage, 'A', 'C', options),
  ];
  it('rejects invalid depth, dates, and identifiers before storage access', async () => {
    const fixture = graph();
    for (const query of queries) {
      for (const depth of [-1, 6, 10, 0.5, Infinity, NaN])
        await assert.rejects(query(fixture, { depth, at }), RangeError);
      await assert.rejects(query(fixture, { at: new Date(NaN) }), TypeError);
    }
    await assert.rejects(neighborhood(fixture, '', { at }));
    await assert.rejects(findPath(fixture, 'A', '', { at }));
    assert.equal(fixture.transactions, 0);
  });
  it('filters during traversal using inclusive start and exclusive end, including historical snapshots', async () => {
    const fixture = graph();
    fixture.edges[0].valid_to = new Date(at);
    fixture.edges[2].valid_from = new Date(future);
    const current = await neighborhood(fixture, 'A', { depth: 5, at });
    assert.deepEqual(ids(current.entities), ['A']);
    assert.ok(!fixture.gets.includes('C'));
    assert.equal(await findPath(fixture, 'A', 'C', { at }), null);
    assert.deepEqual(ids((await subgraph(fixture, 'A', { depth: 2, at: past })).entities), [
      'A',
      'B',
      'C',
    ]);
    assert.deepEqual(ids((await findPath(fixture, 'A', 'C', { at: past }))!.entities), [
      'A',
      'B',
      'C',
    ]);
    assert.deepEqual(ids((await neighborhood(fixture, 'A', { at: future })).entities), ['A', 'D']);
  });
  it('defaults to current active relationships and excludes future open intervals', async () => {
    const fixture = graph();
    fixture.edges[0].valid_from = new Date(0);
    fixture.edges[2].valid_from = new Date('9999-01-01T00:00:00Z');
    assert.deepEqual(ids((await neighborhood(fixture, 'A')).entities), ['A', 'B']);
  });
  it('does not traverse evidence-origin MENTIONS edges even on ID collision', async () => {
    const fixture = graph();
    fixture.edges[0].relationship = {
      ...fixture.edges[0].relationship,
      type: 'MENTIONS',
      source: { kind: 'evidence', id: 'A' },
    };
    assert.deepEqual(ids((await subgraph(fixture, 'B', { at })).entities), ['B', 'C']);
    assert.equal(await findPath(fixture, 'A', 'B', { at }), null);
  });
  it('does not mutate storage or alias returned data and snapshots the caller Date', async () => {
    const fixture = graph();
    const before = structuredClone({ entities: fixture.entities, edges: fixture.edges });
    for (const query of queries) {
      const instant = new Date(at);
      const pending = query(fixture, { depth: 2, at: instant });
      instant.setTime(0);
      const result = await pending;
      assert.ok(result);
      result.entities[0].id = 'changed';
      result.relationships[0].valid_from.setTime(0);
      result.relationships[0].relationship.evidence.length = 0;
    }
    assert.deepEqual({ entities: fixture.entities, edges: fixture.edges }, before);
  });
  it('propagates storage errors and rejects dangling entity references', async () => {
    const failure = new Error('database unavailable');
    const storage: GraphStorage = {
      transaction: async () => {
        throw failure;
      },
    };
    await assert.rejects(neighborhood(storage, 'A', { at }), (error) => error === failure);
    const fixture = graph();
    fixture.entities.delete('B');
    await assert.rejects(neighborhood(fixture, 'A', { at }), /Relationship entity not found/);
  });
});
