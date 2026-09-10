import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ConfidenceSchema } from '@osint-tool/entities';
import {
  AUTO_ACCEPT_THRESHOLD,
  CONTEXT_WEIGHT,
  PATTERN_WEIGHT,
  SOURCE_WEIGHT,
  evaluateConfidence,
  getConfidenceDecision,
  scoreConfidence,
  type ConfidenceFactors,
} from '../services/confidence-scorer.js';

const factors = (value: number): ConfidenceFactors => ({
  sourceReliability: value,
  patternStrength: value,
  contextStrength: value,
});

describe('T3-004 weighted confidence', () => {
  it('exports the approved weights with an exact unit sum and threshold', () => {
    assert.equal(SOURCE_WEIGHT, 0.3);
    assert.equal(PATTERN_WEIGHT, 0.45);
    assert.equal(CONTEXT_WEIGHT, 0.25);
    assert.equal(SOURCE_WEIGHT + PATTERN_WEIGHT + CONTEXT_WEIGHT, 1);
    assert.equal(AUTO_ACCEPT_THRESHOLD, 0.85);
  });
  it('returns zero for minimum factors', () => {
    assert.deepEqual(evaluateConfidence(factors(0)), { score: 0, decision: 'human_review' });
  });
  it('returns one for maximum factors', () => {
    assert.deepEqual(evaluateConfidence(factors(1)), { score: 1, decision: 'auto_accept' });
  });
  it('returns the intermediate weighted average', () => {
    assert.equal(scoreConfidence(factors(0.5)), 0.5);
  });
  it('calculates mixed inputs without rounding', () => {
    const result = evaluateConfidence({
      sourceReliability: 0.9,
      patternStrength: 1,
      contextStrength: 0.8,
    });
    assert.ok(Math.abs(result.score - 0.92) < 1e-15);
    assert.equal(result.decision, 'auto_accept');
    const precise = {
      sourceReliability: 0.123456789,
      patternStrength: 0.654321987,
      contextStrength: 0.345678912,
    };
    assert.equal(
      scoreConfidence(precise),
      0.123456789 * 0.3 + 0.654321987 * 0.45 + 0.345678912 * 0.25,
    );
  });
  it('gives stronger overall evidence a higher score', () => {
    assert.ok(scoreConfidence(factors(0.9)) > scoreConfidence(factors(0.2)));
  });
  for (const [field, low, high, weight] of [
    ['sourceReliability', 0.3, 0.9, 0.3],
    ['patternStrength', 0.4, 0.95, 0.45],
    ['contextStrength', 0.2, 0.9, 0.25],
  ] as const) {
    it(`increases confidence with ${field} while holding other factors equal`, () => {
      const weak = scoreConfidence({ ...factors(0.5), [field]: low });
      const strong = scoreConfidence({ ...factors(0.5), [field]: high });
      assert.ok(strong > weak);
      assert.ok(Math.abs(strong - weak - (high - low) * weight) < 1e-15);
    });
  }
  it('keeps a deterministic grid of scores in the official T3-001 range', () => {
    const values = [0, 0.1, 0.5, 0.85, 0.99, 1];
    for (const sourceReliability of values) {
      for (const patternStrength of values) {
        for (const contextStrength of values) {
          const score = scoreConfidence({ sourceReliability, patternStrength, contextStrength });
          assert.equal(ConfidenceSchema.safeParse(score).success, true);
          assert.ok(Number.isFinite(score) && score >= 0 && score <= 1);
        }
      }
    }
  });
  it('is repeatable and does not mutate frozen caller-owned factors', () => {
    const input = Object.freeze({
      sourceReliability: 0.9,
      patternStrength: 0.95,
      contextStrength: 0.8,
    });
    const original = structuredClone(input);
    const first = evaluateConfidence(input);
    assert.deepEqual(evaluateConfidence(input), first);
    assert.notEqual(evaluateConfidence(input), first);
    assert.equal(scoreConfidence(input), scoreConfidence(input));
    assert.deepEqual(input, original);
  });
});

describe('confidence workflow boundaries', () => {
  for (const [score, decision] of [
    [0, 'human_review'],
    [0.85 - Number.EPSILON, 'human_review'],
    [0.85, 'auto_accept'],
    [0.85 + Number.EPSILON, 'auto_accept'],
    [1, 'auto_accept'],
  ] as const) {
    it(`classifies ${score} as ${decision}`, () => {
      assert.equal(getConfidenceDecision(score), decision);
    });
  }
  it('evaluates factors exactly at the threshold and just below it', () => {
    assert.deepEqual(evaluateConfidence(factors(0.85)), { score: 0.85, decision: 'auto_accept' });
    const below = evaluateConfidence(factors(0.85 - Number.EPSILON));
    assert.ok(below.score < 0.85);
    assert.equal(below.decision, 'human_review');
  });
});

describe('invalid confidence inputs', () => {
  const invalid: unknown[] = [
    -0.01,
    1.01,
    NaN,
    Infinity,
    -Infinity,
    undefined,
    null,
    '0.8',
    true,
    {},
    [],
  ];
  for (const field of ['sourceReliability', 'patternStrength', 'contextStrength'] as const) {
    for (const value of invalid) {
      it(`rejects ${field}=${String(value)} without coercion or clamping`, () => {
        // Reflect.apply exercises untyped JS callers without unsafe casts or any.
        const input = { ...factors(0.5), [field]: value };
        assert.throws(() => Reflect.apply(scoreConfidence, undefined, [input]));
        assert.throws(() => Reflect.apply(evaluateConfidence, undefined, [input]));
      });
    }
    it(`rejects an absent ${field}`, () => {
      const input: Partial<ConfidenceFactors> = {};
      const remaining = Object.fromEntries(
        Object.entries(factors(0.5)).filter(([key]) => key !== field),
      );
      Object.assign(input, remaining);
      assert.throws(() => Reflect.apply(scoreConfidence, undefined, [input]));
    });
  }
  for (const value of invalid) {
    it(`validates decision input ${String(value)}`, () => {
      assert.throws(() => Reflect.apply(getConfidenceDecision, undefined, [value]));
    });
  }
});
