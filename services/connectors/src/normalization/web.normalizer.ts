import { EvidenceMetadataType, WebPageMetadataSchema } from '@osint-tool/schemas';

import {
  NormalizationError,
  buildObservation,
  type NormalizationInput,
  type NormalizationOutput,
  type Normalizer,
} from './normalizer.js';

const WebPageInputSchema = WebPageMetadataSchema.omit({ type: true });

export class WebNormalizer implements Normalizer {
  public readonly sourceType = 'web';

  public normalize(input: NormalizationInput): NormalizationOutput {
    const parsed = WebPageInputSchema.safeParse(input.rawData);

    if (!parsed.success) {
      throw new NormalizationError(`web normalization failed: ${parsed.error.message}`);
    }

    const data: Record<string, unknown> = {
      type: EvidenceMetadataType.WEB_PAGE,
      ...parsed.data,
    };

    return [buildObservation(input, EvidenceMetadataType.WEB_PAGE, data)];
  }
}