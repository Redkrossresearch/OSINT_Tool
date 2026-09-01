import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { PrismaClient } from '@prisma/client';

import { InvestigationService } from './investigation.service.js';

const investigationRecord = {
  id: '123e4567-e89b-12d3-a456-426614174010',
  caseId: '123e4567-e89b-12d3-a456-426614174000',
  state: 'DRAFT',
  plan: [],
  createdAt: new Date('2026-08-28T00:00:00.000Z'),
  updatedAt: new Date('2026-08-28T00:00:00.000Z'),
  objectives: [
    {
      id: '123e4567-e89b-12d3-a456-426614174011',
      investigationId: '123e4567-e89b-12d3-a456-426614174010',
      type: 'PERSON',
      data: { name: 'Jane Doe' },
      createdAt: new Date('2026-08-28T00:00:00.000Z'),
      updatedAt: new Date('2026-08-28T00:00:00.000Z'),
    },
  ],
};

const database = (): PrismaClient =>
  ({
    investigation: {
      create: async () => investigationRecord,
      findMany: async () => [investigationRecord],
      findUnique: async () => investigationRecord,
      findUniqueOrThrow: async () => investigationRecord,
      update: async () => ({ ...investigationRecord, state: 'PLANNING' }),
      delete: async () => investigationRecord,
    },
    $transaction: async (callback: (transaction: PrismaClient) => Promise<unknown>) =>
      callback({
        investigation: {
          ...{
            update: async () => ({ ...investigationRecord, state: 'PLANNING' }),
            findUnique: async () => investigationRecord,
            findUniqueOrThrow: async () => ({ ...investigationRecord, state: 'PLANNING' }),
          },
        },
        auditEvent: { create: async () => ({}) },
        objective: { update: async () => ({}) },
      } as unknown as PrismaClient),
  }) as unknown as PrismaClient;

describe('InvestigationService', () => {
  it('creates an investigation with its objective', async () => {
    const service = new InvestigationService(database());
    const result = await service.create({
      case_id: investigationRecord.caseId,
      objective: { type: 'PERSON', name: 'Jane Doe' },
    });

    assert.equal(result.state, 'DRAFT');
    assert.equal(result.objective.type, 'PERSON');
    if (result.objective.type === 'PERSON') {
      assert.equal(result.objective.name, 'Jane Doe');
    }
  });

  it('rejects invalid state transitions', async () => {
    const service = new InvestigationService(database());
    await assert.rejects(
      service.update(investigationRecord.id, { state: 'COMPLETE' }),
      /Invalid investigation transition/,
    );
  });
});
