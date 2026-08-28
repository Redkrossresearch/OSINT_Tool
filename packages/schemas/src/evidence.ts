import { z } from 'zod';

import { EvidenceMetadataSchema } from './evidence-metadata.js';
import { SourceRefSchema } from './source.js';

export const EvidenceType = {
  WEB_PAGE: 'WEB_PAGE',
  DNS_RECORD: 'DNS_RECORD',
  CERTIFICATE: 'CERTIFICATE',
  GITHUB_DATA: 'GITHUB_DATA',
  SEARCH_RESULT: 'SEARCH_RESULT',
} as const;

export type EvidenceType = (typeof EvidenceType)[keyof typeof EvidenceType];

export const EvidenceTypeSchema = z.enum([
  EvidenceType.WEB_PAGE,
  EvidenceType.DNS_RECORD,
  EvidenceType.CERTIFICATE,
  EvidenceType.GITHUB_DATA,
  EvidenceType.SEARCH_RESULT,
]);

export const EvidenceSchema = z.object({
  id: z.string().min(1),
  investigation_id: z.string().uuid(),
  type: EvidenceTypeSchema,
  source: SourceRefSchema,
  content: z.string(),
  metadata: EvidenceMetadataSchema,
  hash: z.string().regex(/^[A-Fa-f0-9]{64}$/),
  created_at: z.coerce.date(),
});

export type Evidence = z.infer<typeof EvidenceSchema>;
