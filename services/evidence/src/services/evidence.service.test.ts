import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { PrismaClient } from '@prisma/client';

import { computeHash } from '../lib/hash.js';
import { EvidenceConflictError } from './errors.js';
import { EvidenceService } from './evidence.service.js';

const investigationId = '123e4567-e89b-12d3-a456-426614174000';
const evidenceId = '123e4567-e89b-12d3-a456-426614174001';
const timestamp = new Date('2026-08-28T00:00:00.000Z');
const evidenceRecord = {
  id: evidenceId,
  investigationId,
  type: 'WEB_PAGE',
  source: {
    connector_name: 'manual',
    query: 'https://example.com',
    timestamp,
    parameters: {},
  },
  content: '{"title":"Example"}',
  metadata: {
    type: 'WEB_PAGE',
    url: 'https://example.com',
    title: 'Example',
    collected_at: timestamp,
  },
  hash: computeHash('{"title":"Example"}'),
  createdAt: timestamp,
};

const database = (): PrismaClient =>
  ({
    evidence: {
      create: async () => evidenceRecord,
      findMany: async () => [evidenceRecord],
      findUnique: async () => evidenceRecord,
    },
    auditEvent: {
      create: async () => ({}),
      findMany: async () => [
        {
          id: 'audit-1',
          actor: 'tester',
          timestamp,
          details: { evidence_id: evidenceId, provenance_action: 'STORED' },
        },
      ],
    },
    $transaction: async (callback: (transaction: PrismaClient) => Promise<unknown>) =>
      callback({
        evidence: { create: async () => evidenceRecord },
        auditEvent: { create: async () => ({}) },
      } as unknown as PrismaClient),
  }) as unknown as PrismaClient;

describe('EvidenceService', () => {
  it('stores evidence with a deterministic hash and provenance event', async () => {
    const service = new EvidenceService(database());
    const result = await service.create(
      {
        investigation_id: investigationId,
        type: 'WEB_PAGE',
        source: evidenceRecord.source,
        content: evidenceRecord.content,
        metadata: evidenceRecord.metadata,
      },
      'tester',
    );

    assert.equal(result.hash, evidenceRecord.hash);
    const provenance = await service.listProvenance(evidenceId);
    assert.equal(provenance[0]?.action, 'STORED');
  });

  it('rejects update and delete operations to preserve immutability', async () => {
    const service = new EvidenceService(database());
    await assert.rejects(service.update(evidenceId, {}), EvidenceConflictError);
    await assert.rejects(service.delete(evidenceId), EvidenceConflictError);
  });
});
