import { z } from 'zod';

import { UuidSchema } from './case.js';
import { ObjectiveSchema } from './objective.js';

export const InvestigationState = {
  DRAFT: 'DRAFT',
  PLANNING: 'PLANNING',
  COLLECTING: 'COLLECTING',
  ANALYZING: 'ANALYZING',
  VERIFYING: 'VERIFYING',
  COMPLETE: 'COMPLETE',
} as const;

export type InvestigationState = (typeof InvestigationState)[keyof typeof InvestigationState];

export const InvestigationStateSchema = z.enum([
  InvestigationState.DRAFT,
  InvestigationState.PLANNING,
  InvestigationState.COLLECTING,
  InvestigationState.ANALYZING,
  InvestigationState.VERIFYING,
  InvestigationState.COMPLETE,
]);

export const InvestigationBaseSchema = z.object({
  case_id: UuidSchema,
  state: InvestigationStateSchema.default(InvestigationState.DRAFT),
  objective: ObjectiveSchema,
  plan: z.array(z.string()).default([]),
});

export const InvestigationCreateSchema = InvestigationBaseSchema;

export const InvestigationUpdateSchema = InvestigationBaseSchema.partial();

export const InvestigationSchema = InvestigationBaseSchema.extend({
  id: UuidSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Investigation = z.infer<typeof InvestigationSchema>;
export type InvestigationCreate = z.infer<typeof InvestigationCreateSchema>;
export type InvestigationUpdate = z.infer<typeof InvestigationUpdateSchema>;
