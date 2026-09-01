import { z } from 'zod';

export const RateLimitConfigSchema = z.object({
  requestsPerInterval: z.number().int().positive(),
  intervalMs: z.number().int().positive(),
});

export const ConnectorConfigSchema = z.object({
  timeoutMs: z.number().int().positive().default(30_000),
  maxRetries: z.number().int().min(0).max(5).default(3),
  rateLimit: RateLimitConfigSchema.optional(),
  options: z.record(z.string(), z.unknown()).default({}),
});

export type ConnectorConfig = z.infer<typeof ConnectorConfigSchema>;
export type ConnectorConfigInput = z.input<typeof ConnectorConfigSchema>;
export type RateLimitConfig = z.infer<typeof RateLimitConfigSchema>;

export function validateConnectorConfig(input: unknown): ConnectorConfig {
  return ConnectorConfigSchema.parse(input);
}
