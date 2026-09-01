import { CertificateMetadataSchema, EvidenceMetadataType } from '@osint-tool/schemas';

import {
  NormalizationError,
  buildObservation,
  type NormalizationInput,
  type NormalizationOutput,
  type Normalizer,
} from './normalizer.js';

const CertificateInputSchema = CertificateMetadataSchema.omit({ type: true });

function asRecordArray(rawData: unknown): unknown[] {
  if (Array.isArray(rawData)) {
    return rawData;
  }
  return [rawData];
}

export class CertificateNormalizer implements Normalizer {
  public readonly sourceType = 'certificate';

  public normalize(input: NormalizationInput): NormalizationOutput {
    return asRecordArray(input.rawData).map((certificate) => {
      const parsed = CertificateInputSchema.safeParse(certificate);

      if (!parsed.success) {
        throw new NormalizationError(`certificate normalization failed: ${parsed.error.message}`);
      }

      const data: Record<string, unknown> = {
        type: EvidenceMetadataType.CERTIFICATE,
        ...parsed.data,
      };

      return buildObservation(input, EvidenceMetadataType.CERTIFICATE, data);
    });
  }
}