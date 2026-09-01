import { ObservationSchema } from '@osint-tool/schemas';

import {
  NormalizationError,
  isSourceType,
  type NormalizationInput,
  type NormalizationOutput,
  type Normalizer,
  type SourceType,
} from './normalizer.js';

export class NormalizationPipeline {
  private readonly normalizers = new Map<SourceType, Normalizer>();

  public register(normalizer: Normalizer): void {
    if (this.normalizers.has(normalizer.sourceType)) {
      throw new NormalizationError(
        `a normalizer for source type '${normalizer.sourceType}' is already registered`,
      );
    }
    this.normalizers.set(normalizer.sourceType, normalizer);
  }

  public normalize(input: NormalizationInput): NormalizationOutput {
    if (!isSourceType(input.sourceType)) {
      throw new NormalizationError(
        `unsupported source type: ${JSON.stringify(input.sourceType)}`,
      );
    }

    const normalizer = this.normalizers.get(input.sourceType);
    if (normalizer === undefined) {
      throw new NormalizationError(
        `no normalizer registered for source type '${input.sourceType}'`,
      );
    }

    return normalizer.normalize(input).map((observation) => ObservationSchema.parse(observation));
  }
}