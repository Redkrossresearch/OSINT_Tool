import { EvidenceMetadataType, SearchResultMetadataSchema } from '@osint-tool/schemas';

import {
  NormalizationError,
  buildObservation,
  type NormalizationInput,
  type NormalizationOutput,
  type Normalizer,
} from './normalizer.js';

const SearchResultInputSchema = SearchResultMetadataSchema.omit({ type: true });

function asRecordArray(rawData: unknown): unknown[] {
  if (Array.isArray(rawData)) {
    return rawData;
  }
  return [rawData];
}

export class SearchNormalizer implements Normalizer {
  public readonly sourceType = 'search';

  public normalize(input: NormalizationInput): NormalizationOutput {
    return asRecordArray(input.rawData).map((result) => {
      const parsed = SearchResultInputSchema.safeParse(result);

      if (!parsed.success) {
        throw new NormalizationError(`search normalization failed: ${parsed.error.message}`);
      }

      const data: Record<string, unknown> = {
        type: EvidenceMetadataType.SEARCH_RESULT,
        ...parsed.data,
      };

      return buildObservation(input, EvidenceMetadataType.SEARCH_RESULT, data);
    });
  }
}