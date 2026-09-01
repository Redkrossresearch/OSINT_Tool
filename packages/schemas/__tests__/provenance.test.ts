import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  ProvenanceAction,
  ProvenanceActionSchema,
  ProvenanceEntrySchema,
} from '../src/provenance.js';

describe('ProvenanceAction', () => {
  it('should contain all five provenance actions', () => {
    assert.equal(ProvenanceAction.COLLECTED, 'COLLECTED');
    assert.equal(ProvenanceAction.STORED, 'STORED');
    assert.equal(ProvenanceAction.ANALYZED, 'ANALYZED');
    assert.equal(ProvenanceAction.VERIFIED, 'VERIFIED');
    assert.equal(ProvenanceAction.MODIFIED, 'MODIFIED');
  });
});

describe('ProvenanceActionSchema', () => {
  it('should accept all valid actions', () => {
    for (const action of Object.values(ProvenanceAction)) {
      const result = ProvenanceActionSchema.safeParse(action);
      assert.equal(result.success, true);
    }
  });

  it('should reject an invalid action', () => {
    const result = ProvenanceActionSchema.safeParse('INVALID');

    assert.equal(result.success, false);
  });
});

describe('ProvenanceEntrySchema', () => {
  const validProvenance = {
    id: 'prov-001',
    evidence_id: 'evidence-001',
    action: ProvenanceAction.COLLECTED,
    actor: 'connector',
    timestamp: new Date(),
    details: {
      source: 'web-search',
    },
  };

  it('should accept valid provenance data', () => {
    const result = ProvenanceEntrySchema.safeParse(validProvenance);

    assert.equal(result.success, true);
  });

  it('should reject provenance with missing required fields', () => {
    const requiredFields = [
      'id',
      'evidence_id',
      'action',
      'actor',
      'timestamp',
      'details',
    ] as const;

    for (const field of requiredFields) {
      const invalidProvenance = { ...validProvenance };
      delete invalidProvenance[field];

      const result = ProvenanceEntrySchema.safeParse(invalidProvenance);

      assert.equal(result.success, false, `Expected ${field} to be required`);
    }
  });
});