import { EvidenceMetadataType, DnsRecordMetadataSchema } from '@osint-tool/schemas';

import {
  NormalizationError,
  buildObservation,
  type NormalizationInput,
  type NormalizationOutput,
  type Normalizer,
} from './normalizer.js';

const DnsRecordInputSchema = DnsRecordMetadataSchema.omit({ type: true });

function asRecordArray(rawData: unknown): unknown[] {
  if (Array.isArray(rawData)) {
    return rawData;
  }
  return [rawData];
}

export class DnsNormalizer implements Normalizer {
  public readonly sourceType = 'dns';

  public normalize(input: NormalizationInput): NormalizationOutput {
    return asRecordArray(input.rawData).map((record) => {
      const parsed = DnsRecordInputSchema.safeParse(record);

      if (!parsed.success) {
        throw new NormalizationError(`dns normalization failed: ${parsed.error.message}`);
      }

      const data: Record<string, unknown> = {
        type: EvidenceMetadataType.DNS_RECORD,
        ...parsed.data,
      };

      return buildObservation(input, EvidenceMetadataType.DNS_RECORD, data);
    });
  }
}