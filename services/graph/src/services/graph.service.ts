import {
  EntitySchema,
  EvidenceRefSchema,
  RelationshipSchema,
  type Entity,
  type Relationship,
} from '@osint-tool/entities';

/** Storage envelopes, not database models. IDs are supplied by the caller. */
export interface StoredEntity {
  id: string;
  entity: Entity;
}

export interface StoredRelationship {
  id: string;
  relationship: Relationship;
  valid_from: Date;
  valid_to: Date | null;
}

export interface GraphTransaction {
  getEntity(id: string): Promise<StoredEntity | null>;
  insertEntity(entity: StoredEntity): Promise<void>;
  updateEntity(entity: StoredEntity): Promise<void>;
  deleteEntity(id: string): Promise<void>;
  getRelationship(id: string): Promise<StoredRelationship | null>;
  insertRelationship(relationship: StoredRelationship): Promise<void>;
  updateRelationship(relationship: StoredRelationship): Promise<void>;
  /** Include historical and future relationships, with either endpoint matching. */
  relationshipsForEntity(id: string): Promise<StoredRelationship[]>;
  evidenceExists(id: string): Promise<boolean>;
}

/**
 * TODO(T3-008): bind this boundary to the real schema and database client.
 * The adapter MUST provide serializable, atomic transactions with rollback,
 * unique IDs, and one authorized investigation/case scope for ALL lookups,
 * including evidence. It must enforce these guarantees across service instances.
 * No production in-memory fallback is provided. Map Date values and the shared
 * contract's evidence array/MENTIONS evidence endpoint only after schema review.
 * Entity timestamps and relationship attributes are absent from the current
 * shared contracts and are deliberately not invented here. The caller supplies
 * authorization and provenance context when constructing the scoped adapter.
 */
export interface GraphStorage {
  transaction<T>(operation: (transaction: GraphTransaction) => Promise<T>): Promise<T>;
}

function identifier(value: string): string {
  return EvidenceRefSchema.parse({ kind: 'evidence', id: value }).id;
}

function date(value: Date): Date {
  if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
    throw new TypeError('Expected a valid Date');
  }
  return new Date(value.getTime());
}

function interval(from: Date, to: Date | null): void {
  if (to !== null && to.getTime() < from.getTime()) {
    throw new RangeError('valid_to must not precede valid_from');
  }
}

/** Half-open validity interval: valid_from <= instant < valid_to. */
export function isRelationshipActive(value: StoredRelationship, instant: Date): boolean {
  const time = date(instant).getTime();
  const from = date(value.valid_from);
  const to = value.valid_to === null ? null : date(value.valid_to);
  interval(from, to);
  return from.getTime() <= time && (to === null || time < to.getTime());
}

export class GraphService {
  private readonly storage: GraphStorage;
  private readonly clock: () => Date;

  constructor(storage: GraphStorage, clock: () => Date = () => new Date()) {
    this.storage = storage;
    this.clock = clock;
  }

  async addEntity(id: string, input: Entity): Promise<StoredEntity> {
    const value = { id: identifier(id), entity: EntitySchema.parse(input) };
    return this.storage.transaction(async (tx) => {
      if (await tx.getEntity(value.id)) throw new Error('Entity already exists');
      await tx.insertEntity(structuredClone(value));
      return structuredClone(value);
    });
  }

  async getEntity(id: string): Promise<StoredEntity | null> {
    const key = identifier(id);
    return this.storage.transaction(async (tx) => structuredClone(await tx.getEntity(key)));
  }

  async updateEntityAttributes(
    id: string,
    attributes: Record<string, unknown>,
  ): Promise<StoredEntity> {
    const key = identifier(id);
    if (attributes === null || typeof attributes !== 'object' || Array.isArray(attributes)) {
      throw new TypeError('Attributes must be an object');
    }
    // Snapshot before the first await; reject deletion through undefined values.
    const patch = structuredClone(attributes);
    if (Object.values(patch).some((value) => value === undefined)) {
      throw new TypeError('Attribute updates must not contain undefined');
    }
    return this.storage.transaction(async (tx) => {
      const existing = await tx.getEntity(key);
      if (!existing) throw new Error('Entity not found');
      const entity = EntitySchema.parse({
        ...existing.entity,
        attributes: { ...existing.entity.attributes, ...patch },
      });
      const updated = { id: key, entity };
      await tx.updateEntity(structuredClone(updated));
      return structuredClone(updated);
    });
  }

  async removeEntity(id: string): Promise<void> {
    const key = identifier(id);
    return this.storage.transaction(async (tx) => {
      if (!(await tx.getEntity(key))) throw new Error('Entity not found');
      if ((await tx.relationshipsForEntity(key)).length > 0) {
        throw new Error('Entity has relationships');
      }
      await tx.deleteEntity(key);
    });
  }

  async addRelationship(
    id: string,
    input: Relationship,
    temporal: { valid_from?: Date; valid_to?: Date | null } = {},
  ): Promise<StoredRelationship> {
    const value: StoredRelationship = {
      id: identifier(id),
      relationship: RelationshipSchema.parse(input),
      valid_from: date(temporal.valid_from === undefined ? this.clock() : temporal.valid_from),
      valid_to:
        temporal.valid_to === undefined || temporal.valid_to === null
          ? null
          : date(temporal.valid_to),
    };
    interval(value.valid_from, value.valid_to);
    return this.storage.transaction(async (tx) => {
      if (await tx.getRelationship(value.id)) throw new Error('Relationship already exists');
      const { source, target, evidence } = value.relationship;
      for (const ref of [source, target]) {
        if (ref.kind === 'evidence') {
          if (!(await tx.evidenceExists(ref.id))) throw new Error('Evidence not found');
        } else {
          const stored = await tx.getEntity(ref.id);
          if (!stored) throw new Error('Relationship entity not found');
          if (stored.entity.type !== ref.type) throw new Error('Entity reference type mismatch');
        }
      }
      for (const ref of evidence) {
        if (!(await tx.evidenceExists(ref.id))) throw new Error('Evidence not found');
      }
      await tx.insertRelationship(structuredClone(value));
      return structuredClone(value);
    });
  }

  async getRelationship(id: string): Promise<StoredRelationship | null> {
    const key = identifier(id);
    return this.storage.transaction(async (tx) => structuredClone(await tx.getRelationship(key)));
  }

  /** Removal is deactivation; historical records and connected entities remain. */
  async removeRelationship(id: string, validTo?: Date): Promise<StoredRelationship> {
    const key = identifier(id);
    const end = date(validTo === undefined ? this.clock() : validTo);
    return this.storage.transaction(async (tx) => {
      const existing = await tx.getRelationship(key);
      if (!existing) throw new Error('Relationship not found');
      // Repeated removal never changes or extends an already closed interval.
      if (existing.valid_to !== null) return structuredClone(existing);
      interval(existing.valid_from, end);
      const updated = { ...existing, valid_to: end };
      await tx.updateRelationship(structuredClone(updated));
      return structuredClone(updated);
    });
  }
}
