import { EvidenceMetadataType, GithubDataMetadataSchema } from '@osint-tool/schemas';

import {
  NormalizationError,
  buildObservation,
  type NormalizationInput,
  type NormalizationOutput,
  type Normalizer,
} from './normalizer.js';

const GithubDataInputSchema = GithubDataMetadataSchema.omit({ type: true });

export class GithubNormalizer implements Normalizer {
  public readonly sourceType = 'github';

  public normalize(input: NormalizationInput): NormalizationOutput {
    const parsed = GithubDataInputSchema.safeParse(input.rawData);

    if (!parsed.success) {
      throw new NormalizationError(`github normalization failed: ${parsed.error.message}`);
    }

    const data: Record<string, unknown> = {
      type: EvidenceMetadataType.GITHUB_DATA,
      ...parsed.data,
    };

    return [buildObservation(input, EvidenceMetadataType.GITHUB_DATA, data)];
  }
}