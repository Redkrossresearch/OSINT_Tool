import { z } from 'zod';

export const CaseStatus = {
  OPEN: 'OPEN',
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
} as const;

export type CaseStatus = (typeof CaseStatus)[keyof typeof CaseStatus];

export const CaseStatusSchema = z.enum([CaseStatus.OPEN, CaseStatus.ACTIVE, CaseStatus.CLOSED]);

export const UuidSchema = z.string().uuid();

export const CaseBaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: CaseStatusSchema.default(CaseStatus.OPEN),
});

export const CaseCreateSchema = CaseBaseSchema;

export const CaseUpdateSchema = CaseBaseSchema.partial();

export const CaseResponseSchema = CaseBaseSchema.extend({
  id: UuidSchema,
  created_by: UuidSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Case = z.infer<typeof CaseResponseSchema>;
export type CaseCreate = z.infer<typeof CaseCreateSchema>;
export type CaseUpdate = z.infer<typeof CaseUpdateSchema>;
