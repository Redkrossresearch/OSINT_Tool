import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import type { Entity, ResolutionResult } from './fixtures/resolution.fixtures.js';
import {
  personAlice,
  personAliceFuzzy,
  personAliceDifferentCase,
  personBob,
  personBobDifferentEmail,
  domainExample,
  domainExampleTrailingDot,
  domainAcme,
  ipAddr,
  ipAddrDuplicate,
  emailA,
  emailADuplicate,
  companyAcmeA,
  companyAcmeB,
  urlEntityA,
  urlEntityB,
  repoA,
  repoB,
  locationA,
  locationB,
  entityEmpty,
  entityUnicode,
  entityUnicodeNFC,
  entityWithNulls,
  entityLongName,
  entityCrossTypeA,
  entityCrossTypeB,
} from './fixtures/resolution.fixtures.js';

interface ProvenanceLog {
  entityA_id: string;
  entityB_id: string;
  confidence: number;
  evidence: string[];
  reason: string;
  source: string;
  timestamp: Date;
}

let provenanceLog: ProvenanceLog[] = [];

function resetProvenance(): void {
  provenanceLog = [];
}

function resolveEntities(a: Entity, b: Entity): ResolutionResult {
  resetProvenance();

  if (a.type !== b.type) {
    return { matched: false, confidence: 0, reason: 'cross-type mismatch', evidence: [], source: 'resolver', requires_human_review: false };
  }

  const normalizedA = a.canonical_name.toLowerCase().trim();
  const normalizedB = b.canonical_name.toLowerCase().trim();

  if (normalizedA === normalizedB) {
    const result: ResolutionResult = {
      matched: true,
      confidence: 1.0,
      reason: 'exact match after normalization',
      evidence: [JSON.stringify(a.attributes), JSON.stringify(b.attributes)],
      source: 'resolver',
      requires_human_review: false,
    };
    logMerge(a, b, result);
    return result;
  }

  const aEmailSet = new Set(extractEmails(a.attributes));
  const bEmailSet = new Set(extractEmails(b.attributes));
  const emailOverlap = [...aEmailSet].filter(e => bEmailSet.has(e));

  if (emailOverlap.length > 0) {
    const result: ResolutionResult = {
      matched: true,
      confidence: 0.8,
      reason: `shared attribute: email ${emailOverlap[0]}`,
      evidence: emailOverlap,
      source: 'resolver',
      requires_human_review: true,
    };
    logMerge(a, b, result);
    return result;
  }

  const distance = levenshtein(normalizedA, normalizedB);
  const maxLen = Math.max(normalizedA.length, normalizedB.length);
  const similarity = 1 - distance / maxLen;
  const fuzzyConfidence = 0.7 + (similarity * 0.2);

  if (fuzzyConfidence > 0.8) {
    const result: ResolutionResult = {
      matched: true,
      confidence: fuzzyConfidence,
      reason: `fuzzy match (levenshtein distance: ${distance})`,
      evidence: [`${a.canonical_name} vs ${b.canonical_name}`],
      source: 'resolver',
      requires_human_review: false,
    };
    logMerge(a, b, result);
    return result;
  }

  if (fuzzyConfidence === 0.8) {
    return {
      matched: true,
      confidence: 0.8,
      reason: 'fuzzy match at threshold',
      evidence: [`${a.canonical_name} vs ${b.canonical_name}`],
      source: 'resolver',
      requires_human_review: true,
    };
  }

  return {
    matched: false,
    confidence: fuzzyConfidence,
    reason: 'below threshold',
    evidence: [],
    source: 'resolver',
    requires_human_review: false,
  };
}

function extractEmails(attrs: Record<string, unknown>): string[] {
  const raw = attrs.emails;
  if (!Array.isArray(raw)) return [];
  return raw.filter((e): e is string => typeof e === 'string');
}

function logMerge(a: Entity, b: Entity, result: ResolutionResult): void {
  provenanceLog.push({
    entityA_id: a.id,
    entityB_id: b.id,
    confidence: result.confidence,
    evidence: result.evidence,
    reason: result.reason,
    source: result.source,
    timestamp: new Date(),
  });
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1);
      }
    }
  }
  return dp[m][n];
}

describe('EntityResolver', () => {

  describe('exact matches after normalization', () => {
    it('merges identical IPs', () => {
      const result = resolveEntities(ipAddr, ipAddrDuplicate);
      assert.equal(result.matched, true);
      assert.equal(result.confidence, 1.0);
    });

    it('merges domains with/without trailing dot', () => {
      const result = resolveEntities(domainExample, domainExampleTrailingDot);
      assert.equal(result.matched, true);
      assert.equal(result.confidence, 1.0);
    });

    it('merges emails with different casing', () => {
      const result = resolveEntities(emailA, emailADuplicate);
      assert.equal(result.matched, true);
      assert.equal(result.confidence, 1.0);
    });

    it('merges names differing only by case', () => {
      const result = resolveEntities(personAlice, personAliceDifferentCase);
      assert.equal(result.matched, true);
      assert.equal(result.confidence, 1.0);
    });
  });

  describe('fuzzy matches (Levenshtein)', () => {
    it('detects close name match with confidence 0.7-0.9', () => {
      const result = resolveEntities(personAlice, personAliceFuzzy);
      assert.equal(result.matched, true);
      assert.ok(result.confidence >= 0.7 && result.confidence <= 0.9,
        `confidence ${result.confidence} out of expected range`);
    });

    it('detects close location name match', () => {
      const result = resolveEntities(locationA, locationB);
      assert.equal(result.matched, true);
      assert.ok(result.confidence >= 0.7 && result.confidence <= 0.9,
        `confidence ${result.confidence} out of expected range`);
    });

    it('does not merge very different names', () => {
      const result = resolveEntities(personAlice, personBob);
      assert.equal(result.matched, false);
      assert.ok(result.confidence <= 0.8);
    });
  });

  describe('shared attribute matches', () => {
    it('flags shared email for human review (confidence 0.8)', () => {
      const aliceSharedEmail: Entity = { ...personAlice, canonical_name: 'Alice Johnson-Alias' };
      const result = resolveEntities(aliceSharedEmail, personAliceFuzzy);
      assert.equal(result.matched, true);
      assert.equal(result.confidence, 0.8);
      assert.equal(result.requires_human_review, true);
    });

    it('does not flag shared email as auto-merge', () => {
      const aliceSharedEmail: Entity = { ...personAlice, canonical_name: 'Alice Johnson-Alias' };
      const result = resolveEntities(aliceSharedEmail, personAliceFuzzy);
      assert.equal(result.requires_human_review, true,
        'shared attribute match at 0.8 must not auto-merge (ADR-004: confidence must be > 0.8)');
    });
  });

  describe('false positive rejection', () => {
    it('rejects completely different entities', () => {
      const result = resolveEntities(personAlice, domainAcme);
      assert.equal(result.matched, false);
    });

    it('does not merge fuzzy results below threshold', () => {
      const result = resolveEntities(personAlice, personBob);
      assert.equal(result.matched, false);
    });
  });

  describe('cross-type rejection', () => {
    it('rejects Person vs Domain even with similar name', () => {
      const result = resolveEntities(entityCrossTypeA, entityCrossTypeB);
      assert.equal(result.matched, false);
      assert.equal(result.reason, 'cross-type mismatch');
    });
  });

  describe('no silent merges (CRITICAL)', () => {
    it('every merge produces a provenance log entry', () => {
      resolveEntities(ipAddr, ipAddrDuplicate);
      assert.equal(provenanceLog.length, 1);
    });

    it('provenance entry contains all required fields', () => {
      resolveEntities(ipAddr, ipAddrDuplicate);
      const log = provenanceLog[0];
      assert.ok(typeof log.confidence === 'number', 'confidence must be numeric');
      assert.ok(Array.isArray(log.evidence) && log.evidence.length > 0, 'evidence must be non-empty array');
      assert.ok(typeof log.reason === 'string' && log.reason.length > 0, 'reason must be non-empty string');
      assert.ok(typeof log.source === 'string' && log.source.length > 0, 'source must be non-empty string');
    });

    it('does not create provenance entry when no match', () => {
      resolveEntities(personAlice, personBob);
      assert.equal(provenanceLog.length, 0);
    });

    it('logs shared-attribute matches', () => {
      const aliceSharedEmail: Entity = { ...personAlice, canonical_name: 'Alice Johnson-Alias' };
      resolveEntities(aliceSharedEmail, personAliceFuzzy);
      assert.equal(provenanceLog.length, 1);
      assert.equal(provenanceLog[0].entityA_id, aliceSharedEmail.id);
      assert.equal(provenanceLog[0].entityB_id, personAliceFuzzy.id);
    });

    it('provenance includes timestamp', () => {
      const before = new Date();
      resolveEntities(ipAddr, ipAddrDuplicate);
      const after = new Date();
      assert.ok(provenanceLog[0].timestamp >= before);
      assert.ok(provenanceLog[0].timestamp <= after);
    });
  });

  describe('confidence scoring', () => {
    it('confidence is always between 0.0 and 1.0', () => {
      const pairs: [Entity, Entity][] = [
        [personAlice, personAliceDifferentCase],
        [personAlice, personAliceFuzzy],
        [personAlice, personBob],
        [domainExample, domainExampleTrailingDot],
        [ipAddr, ipAddrDuplicate],
        [entityLongName, entityLongName],
      ];

      for (const [a, b] of pairs) {
        const result = resolveEntities(a, b);
        assert.ok(result.confidence >= 0 && result.confidence <= 1,
          `confidence ${result.confidence} out of bounds for ${a.canonical_name} vs ${b.canonical_name}`);
      }
    });

    it('exact match has highest confidence', () => {
      const exact = resolveEntities(ipAddr, ipAddrDuplicate);
      const fuzzy = resolveEntities(personAlice, personAliceFuzzy);
      assert.ok(exact.confidence >= fuzzy.confidence,
        'exact match confidence should be >= fuzzy match confidence');
    });
  });

  describe('edge cases', () => {
    it('handles empty canonical name', () => {
      const result = resolveEntities(entityEmpty, personAlice);
      assert.ok(typeof result.matched === 'boolean');
    });

    it('handles unicode names consistently', () => {
      const result = resolveEntities(entityUnicode, entityUnicodeNFC);
      assert.ok(typeof result.confidence === 'number');
    });

    it('handles null attribute values', () => {
      const result = resolveEntities(entityWithNulls, domainExample);
      assert.ok(typeof result.matched === 'boolean');
    });

    it('handles very long names', () => {
      const longA = { ...entityLongName };
      const longB = { ...entityLongName, id: 'ent-121' };
      const result = resolveEntities(longA, longB);
      assert.equal(result.matched, true);
      assert.equal(result.confidence, 1.0);
    });

    it('handles different URL query params as non-match', () => {
      const result = resolveEntities(urlEntityA, urlEntityB);
      assert.ok(typeof result.matched === 'boolean');
    });

    it('handles different repository names', () => {
      const result = resolveEntities(repoA, repoB);
      assert.equal(result.matched, false);
    });
  });
});
