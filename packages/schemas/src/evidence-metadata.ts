import { z } from 'zod';

export const EvidenceMetadataType = {
  WEB_PAGE: 'WEB_PAGE',
  DNS_RECORD: 'DNS_RECORD',
  CERTIFICATE: 'CERTIFICATE',
  GITHUB_DATA: 'GITHUB_DATA',
  SEARCH_RESULT: 'SEARCH_RESULT',
} as const;

export type EvidenceMetadataType =
  (typeof EvidenceMetadataType)[keyof typeof EvidenceMetadataType];

export const EvidenceMetadataTypeSchema = z.enum([
  EvidenceMetadataType.WEB_PAGE,
  EvidenceMetadataType.DNS_RECORD,
  EvidenceMetadataType.CERTIFICATE,
  EvidenceMetadataType.GITHUB_DATA,
  EvidenceMetadataType.SEARCH_RESULT,
]);

const EvidenceMetadataCommonSchema = z.object({
  collected_at: z.coerce.date().optional(),
  collector: z.string().optional(),
  notes: z.string().optional(),
});

export const WebPageMetadataSchema = EvidenceMetadataCommonSchema.extend({
  type: z.literal(EvidenceMetadataType.WEB_PAGE),
  url: z.string().min(1, 'URL is required').url('Invalid URL format'),
  title: z.string().min(1, 'Page title is required'),
  http_status: z.number().int().min(100).max(599).optional(),
  final_url: z.string().url().optional(),
  response_time_ms: z.number().int().nonnegative().optional(),
});

export const DnsRecordMetadataSchema = EvidenceMetadataCommonSchema.extend({
  type: z.literal(EvidenceMetadataType.DNS_RECORD),
  record_type: z
    .string()
    .min(1, 'Record type is required')
    .regex(/^(A|AAAA|CNAME|MX|NS|TXT|SOA|SRV|PTR|CAA)$/, 'Invalid DNS record type'),
  record_name: z.string().min(1, 'Record name is required'),
  resolver: z.string().optional(),
  ttl: z.number().int().nonnegative().optional(),
});

export const CertificateMetadataSchema = EvidenceMetadataCommonSchema.extend({
  type: z.literal(EvidenceMetadataType.CERTIFICATE),
  serial_number: z.string().min(1, 'Serial number is required'),
  subject: z.string().min(1, 'Subject is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  fingerprint_sha256: z
    .string()
    .min(1, 'SHA-256 fingerprint is required')
    .regex(/^[A-Fa-f0-9]{64}$/, 'Fingerprint must be 64 hex characters'),
  not_before: z.coerce.date().optional(),
  not_after: z.coerce.date().optional(),
});

export const GithubDataMetadataSchema = EvidenceMetadataCommonSchema.extend({
  type: z.literal(EvidenceMetadataType.GITHUB_DATA),
  repository: z.string().min(1, 'Repository identifier is required'),
  data_category: z
    .string()
    .min(1, 'Data category is required')
    .regex(/^(commit|issue|pr|user|repo|release|file)$/, 'Invalid GitHub data category'),
  branch: z.string().optional(),
  query: z.string().optional(),
  result_count: z.number().int().nonnegative().optional(),
});

export const SearchResultMetadataSchema = EvidenceMetadataCommonSchema.extend({
  type: z.literal(EvidenceMetadataType.SEARCH_RESULT),
  engine: z.string().min(1, 'Search engine name is required'),
  query: z.string().min(1, 'Search query is required'),
  result_position: z.number().int().positive().optional(),
  total_results: z.number().int().nonnegative().optional(),
  source_url: z.string().url().optional(),
});

export const EvidenceMetadataSchema = z.discriminatedUnion('type', [
  WebPageMetadataSchema,
  DnsRecordMetadataSchema,
  CertificateMetadataSchema,
  GithubDataMetadataSchema,
  SearchResultMetadataSchema,
]);

export type EvidenceMetadata = z.infer<typeof EvidenceMetadataSchema>;

export type WebPageMetadata = z.infer<typeof WebPageMetadataSchema>;
export type DnsRecordMetadata = z.infer<typeof DnsRecordMetadataSchema>;
export type CertificateMetadata = z.infer<typeof CertificateMetadataSchema>;
export type GithubDataMetadata = z.infer<typeof GithubDataMetadataSchema>;
export type SearchResultMetadata = z.infer<typeof SearchResultMetadataSchema>;
