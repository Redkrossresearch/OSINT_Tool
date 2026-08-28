import { z } from 'zod';

import { SourceRefSchema } from './source.js';

export const ObservationSchema = z.object({
  id: z.string().min(1),
  evidence_id: z.string().min(1),
  type: z.string().min(1),
  data: z.record(z.unknown()),
  confidence: z.number().min(0).max(1),
  source_ref: SourceRefSchema,
  timestamp: z.coerce.date(),
});

export type Observation = z.infer<typeof ObservationSchema>;
