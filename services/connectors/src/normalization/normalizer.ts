import { randomUUID } from 'node:crypto';

import type { Objective, Observation } from '@osint-tool/schemas';

export const SOURCE_TYPES = ['github', 'web', 'dns', 'certificate', 'search'] as const;

export type SourceType = (typeof SOURCE_TYPES)[number];

export function isSourceType(value: unknown): value is SourceType {
  return typeof value === 'string' && (SOURCE_TYPES as readonly string[]).includes(value);
}

export interface NormalizationInput {
  sourceType: SourceType;
  rawData: unknown;
  connectorName: string;
  query: string;
  objective?: Objective;
  timestamp?: Date;
  confidence?: number;
  parameters?: Record<string, unknown>;
}

export type NormalizationOutput = Observation[];

export interface Normalizer {
  readonly sourceType: SourceType;
  normalize(input: NormalizationInput): NormalizationOutput;
}

export const DEFAULT_CONFIDENCE: Record<SourceType, number> = {
  github: 0.9,
  web: 0.85,
  dns: 0.95,
  certificate: 0.9,
  search: 0.7,
};

export class NormalizationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'NormalizationError';
  }
}

export function resolveConfidence(input: NormalizationInput): number {
  const confidence = input.confidence ?? DEFAULT_CONFIDENCE[input.sourceType];
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    throw new NormalizationError(
      `confidence must be between 0 and 1, received ${JSON.stringify(confidence)}`,
    );
  }
  return confidence;
}

export function buildObservation(
  input: NormalizationInput,
  type: string,
  data: Record<string, unknown>,
): Observation {
  const timestamp = input.timestamp ?? new Date();

  return {
    id: randomUUID(),
    evidence_id: randomUUID(),
    type,
    data,
    confidence: resolveConfidence(input),
    source_ref: {
      connector_name: input.connectorName,
      query: input.query,
      timestamp,
      parameters: input.parameters ?? {},
    },
    timestamp,
  };
}