import { z } from 'zod';

import type { Observation } from '@osint-tool/schemas';

export const ConnectorResultMetadataSchema = z.object({
  connector_name: z.string().min(1),
  query: z.string().min(1),
  timestamp: z.coerce.date(),
  duration_ms: z.number().nonnegative(),
});

export type ConnectorResultMetadata = z.infer<typeof ConnectorResultMetadataSchema>;

export const ConnectorErrorDetailSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  cause: z.string().optional(),
});

export type ConnectorErrorDetail = z.infer<typeof ConnectorErrorDetailSchema>;

export interface ConnectorResultSuccess {
  ok: true;
  metadata: ConnectorResultMetadata;
  observations: Observation[];
}

export interface ConnectorResultError {
  ok: false;
  metadata: ConnectorResultMetadata;
  error: ConnectorErrorDetail;
}

export type ConnectorResult = ConnectorResultSuccess | ConnectorResultError;

export const ConnectorResultSuccessSchema = z.object({
  ok: z.literal(true),
  metadata: ConnectorResultMetadataSchema,
  observations: z.array(z.unknown()),
});

export const ConnectorResultErrorSchema = z.object({
  ok: z.literal(false),
  metadata: ConnectorResultMetadataSchema,
  error: ConnectorErrorDetailSchema,
});

export const ConnectorResultSchema = z.discriminatedUnion('ok', [
  ConnectorResultSuccessSchema,
  ConnectorResultErrorSchema,
]);

export function parseConnectorResult(input: unknown): ConnectorResult {
  return ConnectorResultSchema.parse(input) as ConnectorResult;
}
