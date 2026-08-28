import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { EvidenceSchema, EvidenceType } from '../src/evidence.js';

const validEvidence = {
  id: 'evidence-001',
  investigation_id: '00000000-0000-0000-0000-000000000001',
  type: EvidenceType.WEB_PAGE,
  source: {
    connector_name: 'web-fetch',
    query: 'https://example.com',
    timestamp: new Date(),
    parameters: {},
  },
  content: 'Example content',
  metadata: {
    type: EvidenceType.WEB_PAGE,
    url: 'https://example.com',
    title: 'Example',
  },
  hash: 'a'.repeat(64),
  created_at: new Date(),
};

describe('EvidenceSchema', () => {
  it('accepts valid evidence', () => {
    assert.equal(EvidenceSchema.safeParse(validEvidence).success, true);
  });

  it('rejects an invalid evidence type', () => {
    assert.equal(EvidenceSchema.safeParse({ ...validEvidence, type: 'UNKNOWN' }).success, false);
  });

  it('rejects hashes that are not 64 hexadecimal characters', () => {
    assert.equal(
      EvidenceSchema.safeParse({ ...validEvidence, hash: 'not-a-hash' }).success,
      false,
    );
  });
});
