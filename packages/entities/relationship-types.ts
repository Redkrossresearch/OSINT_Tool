import type { z } from 'zod';

import { EntitySchema } from './entity-schema.js';
import type { EntityType } from './entity-types.js';
import type {
  EntityRefSchema,
  EvidenceRefSchema,
  RelationshipSchema,
} from './relationship-schema.js';

export const RELATIONSHIP_TYPES = [
  'OWNS',
  'WORKS_FOR',
  'USES',
  'HOSTED_ON',
  'REGISTERED_TO',
  'MENTIONS',
  'ASSOCIATED_WITH',
  'RESOLVES_TO',
] as const;

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

const entityTypes = Object.freeze(EntitySchema.options.map((schema) => schema.shape.type.value));

type Constraint = {
  readonly source: readonly (EntityType | 'evidence')[];
  readonly target: readonly EntityType[];
};

/** `evidence` denotes an endpoint kind, never an EntityType. */
export const RELATIONSHIP_CONSTRAINTS = {
  OWNS: { source: ['person', 'company'], target: ['domain', 'ip', 'company'] },
  WORKS_FOR: { source: ['person'], target: ['company'] },
  USES: { source: ['person', 'company'], target: ['technology'] },
  HOSTED_ON: { source: ['domain'], target: ['ip'] },
  REGISTERED_TO: { source: ['domain'], target: ['person', 'company'] },
  MENTIONS: { source: ['evidence'], target: entityTypes },
  ASSOCIATED_WITH: { source: entityTypes, target: entityTypes },
  RESOLVES_TO: { source: ['domain'], target: ['ip'] },
} as const satisfies Readonly<Record<RelationshipType, Constraint>>;

export type EntityRef = z.infer<typeof EntityRefSchema>;
export type EvidenceRef = z.infer<typeof EvidenceRefSchema>;
export type Relationship = z.infer<typeof RelationshipSchema>;
