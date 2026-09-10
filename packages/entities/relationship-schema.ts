import { z } from 'zod';

import { ConfidenceSchema, EntitySchema } from './entity-schema.js';
import type { EntityType } from './entity-types.js';
import { RELATIONSHIP_CONSTRAINTS, RELATIONSHIP_TYPES } from './relationship-types.js';

const entityTypes: ReadonlySet<string> = new Set(
  EntitySchema.options.map((schema) => schema.shape.type.value),
);
const EntityTypeSchema = z
  .string()
  .refine((value): value is EntityType => entityTypes.has(value), 'Unknown entity type');

// Relationship-local references; these do not extend the extracted Entity model.
// Nonempty string IDs match the existing evidence ID convention without imposing UUIDs.
const ReferenceIdSchema = z.string().min(1);

export const EntityRefSchema = z
  .object({ kind: z.literal('entity'), id: ReferenceIdSchema, type: EntityTypeSchema })
  .strict();

export const EvidenceRefSchema = z
  .object({ kind: z.literal('evidence'), id: ReferenceIdSchema })
  .strict();

export const RelationshipTypeSchema = z.enum(RELATIONSHIP_TYPES);

/** Validates reference shapes and endpoint types, not database existence or ownership. */
export const RelationshipSchema = z
  .object({
    type: RelationshipTypeSchema,
    source: z.discriminatedUnion('kind', [EntityRefSchema, EvidenceRefSchema]),
    target: EntityRefSchema,
    confidence: ConfidenceSchema,
    evidence: z.array(EvidenceRefSchema),
  })
  .strict()
  .superRefine((relationship, context) => {
    const constraint = RELATIONSHIP_CONSTRAINTS[relationship.type];
    const sourceType =
      relationship.source.kind === 'evidence' ? 'evidence' : relationship.source.type;
    const sources: readonly string[] = constraint.source;
    const targets: readonly string[] = constraint.target;
    const message = `${relationship.type} requires source type ${sources.join('/')} and target type ${targets.join('/')}.`;

    if (!sources.includes(sourceType)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['source'], message });
    }
    if (!targets.includes(relationship.target.type)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['target'], message });
    }
  });
