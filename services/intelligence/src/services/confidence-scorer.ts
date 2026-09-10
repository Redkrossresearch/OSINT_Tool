import { ConfidenceSchema } from '@osint-tool/entities';

export const SOURCE_WEIGHT = 0.3;
export const PATTERN_WEIGHT = 0.45;
export const CONTEXT_WEIGHT = 0.25;
export const AUTO_ACCEPT_THRESHOLD = 0.85;

export interface ConfidenceFactors {
  /** Caller-assessed trust in the originating source; no reputation lookup. */
  readonly sourceReliability: number;
  /** Strength of the evidence identifying the claimed entity type. */
  readonly patternStrength: number;
  /** Support for the interpretation from surrounding evidence. */
  readonly contextStrength: number;
}

export type ConfidenceDecision = 'auto_accept' | 'human_review';

export interface ConfidenceResult {
  readonly score: number;
  readonly decision: ConfidenceDecision;
}

/**
 * Deterministic MVP evidence strength, not a calibrated statistical probability.
 * Combine complementary source, pattern, and context assessments so a single
 * factor does not determine the score; statistical independence is not assumed.
 * The nonnegative weights sum to 1, keeping their weighted average within [0, 1].
 * T3-001 validates each explicit factor and the result: invalid, missing, or
 * non-finite values throw rather than being coerced, defaulted, or clamped.
 * Fixed evaluation order and no rounding preserve repeatable results without
 * external state. Caller-owned factors are only read, never modified.
 */
export function scoreConfidence(factors: ConfidenceFactors): number {
  const source = ConfidenceSchema.parse(factors.sourceReliability);
  const pattern = ConfidenceSchema.parse(factors.patternStrength);
  const context = ConfidenceSchema.parse(factors.contextStrength);
  return ConfidenceSchema.parse(
    source * SOURCE_WEIGHT + pattern * PATTERN_WEIGHT + context * CONTEXT_WEIGHT,
  );
}

/**
 * Keep workflow policy separate from raw scoring. Valid scores at or above .85
 * are auto-accepted; every lower score requires human review. Compare the actual
 * number without rounding or tolerance. This returns a decision, taking no action.
 */
export function getConfidenceDecision(score: number): ConfidenceDecision {
  const validated = ConfidenceSchema.parse(score);
  return validated >= AUTO_ACCEPT_THRESHOLD ? 'auto_accept' : 'human_review';
}

/** Return a fresh score/decision result without changing factors or any Entity. */
export function evaluateConfidence(factors: ConfidenceFactors): ConfidenceResult {
  const score = scoreConfidence(factors);
  return { score, decision: getConfidenceDecision(score) };
}
