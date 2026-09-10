import type { z } from 'zod';
import type {
  EntityRef,
  EntityType,
  EvidenceRef,
  Relationship,
  RelationshipSchema,
  RelationshipType,
} from '../index.js';

type Assert<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

export type RelationshipTypeChecks = [
  Assert<Equal<Relationship, z.infer<typeof RelationshipSchema>>>,
  Assert<
    Equal<
      RelationshipType,
      | 'OWNS'
      | 'WORKS_FOR'
      | 'USES'
      | 'HOSTED_ON'
      | 'REGISTERED_TO'
      | 'MENTIONS'
      | 'ASSOCIATED_WITH'
      | 'RESOLVES_TO'
    >
  >,
  Assert<Equal<EntityRef, { kind: 'entity'; id: string; type: EntityType }>>,
  Assert<Equal<EvidenceRef, { kind: 'evidence'; id: string }>>,
  Assert<Equal<Relationship['source'], EntityRef | EvidenceRef>>,
  Assert<Equal<Relationship['target'], EntityRef>>,
  Assert<Equal<Relationship['evidence'], EvidenceRef[]>>,
  Assert<Equal<Extract<EntityType, 'evidence'>, never>>,
];
