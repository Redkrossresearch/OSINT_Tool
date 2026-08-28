import { z } from 'zod';

export const ProvenanceAction = {
  COLLECTED: 'COLLECTED',
  STORED: 'STORED',
  ANALYZED: 'ANALYZED',
  VERIFIED: 'VERIFIED',
  MODIFIED: 'MODIFIED',
} as const;

export const ProvenanceActionSchema = z.enum([
  ProvenanceAction.COLLECTED,
  ProvenanceAction.STORED,
  ProvenanceAction.ANALYZED,
  ProvenanceAction.VERIFIED,
  ProvenanceAction.MODIFIED,
]);

export const ProvenanceEntrySchema = z.object({
  id: z.string().min(1),
  evidence_id: z.string().min(1),
  action: ProvenanceActionSchema,
  actor: z.string().min(1),
  timestamp: z.coerce.date(),
  details: z.record(z.unknown()),
});

export type ProvenanceEntry = z.infer<typeof ProvenanceEntrySchema>;