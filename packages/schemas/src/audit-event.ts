import { z } from 'zod';

import { InvestigationStateSchema } from './investigation.js';

export const AuditAction = {
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  STATE_CHANGED: 'STATE_CHANGED',
  EVIDENCE_ADDED: 'EVIDENCE_ADDED',
  EVIDENCE_ANALYZED: 'EVIDENCE_ANALYZED',
  FINDING_ADDED: 'FINDING_ADDED',
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export const AuditActionSchema = z.enum([
  AuditAction.CREATED,
  AuditAction.UPDATED,
  AuditAction.STATE_CHANGED,
  AuditAction.EVIDENCE_ADDED,
  AuditAction.EVIDENCE_ANALYZED,
  AuditAction.FINDING_ADDED,
]);

export const AuditEventBaseSchema = z.object({
  investigation_id: z.string().uuid(),
  action: AuditActionSchema,
  actor: z.string().min(1),
  timestamp: z.coerce.date(),
  details: z.record(z.unknown()).default({}),
});

export const AuditEventCreateSchema = AuditEventBaseSchema;

export const AuditEventSchema = AuditEventBaseSchema.extend({
  id: z.string().min(1),
});

export type AuditEvent = z.infer<typeof AuditEventSchema>;
export type AuditEventCreate = z.infer<typeof AuditEventCreateSchema>;

export const freezeAuditEvent = <T extends AuditEvent>(event: T): T => {
  return Object.freeze({
    ...event,
    details: Object.freeze({ ...event.details }),
  }) as T;
};

export const createStateChangeAuditDetails = (from: z.infer<typeof InvestigationStateSchema>, to: z.infer<typeof InvestigationStateSchema>) => ({
  from,
  to,
});
