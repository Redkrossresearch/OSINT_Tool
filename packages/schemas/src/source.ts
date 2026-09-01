import { z } from 'zod';

export const SourceRefSchema = z.object({
  connector_name: z.string().min(1),
  query: z.string().min(1),
  timestamp: z.coerce.date(),
  parameters: z.record(z.unknown()),
});

export type SourceRef = z.infer<typeof SourceRefSchema>;
