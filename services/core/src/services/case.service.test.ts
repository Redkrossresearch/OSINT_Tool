import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { PrismaClient } from '@prisma/client';

import { CaseService } from './case.service.js';
import { NotFoundError } from './errors.js';

const caseRecord = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Test case',
  description: null,
  status: 'OPEN',
  createdBy: '123e4567-e89b-12d3-a456-426614174001',
  createdAt: new Date('2026-08-28T00:00:00.000Z'),
  updatedAt: new Date('2026-08-28T00:00:00.000Z'),
};

const database = (overrides: Record<string, unknown> = {}): PrismaClient =>
  ({
    case: {
      create: async () => caseRecord,
      findMany: async () => [caseRecord],
      findUnique: async () => caseRecord,
      update: async () => ({ ...caseRecord, title: 'Updated case' }),
      delete: async () => caseRecord,
      ...overrides,
    },
  }) as unknown as PrismaClient;

describe('CaseService', () => {
  it('creates and maps a case through the shared schema', async () => {
    const service = new CaseService(database());
    const result = await service.create({
      title: 'Test case',
      created_by: caseRecord.createdBy,
    });

    assert.equal(result.id, caseRecord.id);
    assert.equal(result.status, 'OPEN');
  });

  it('returns cases in repository order', async () => {
    const service = new CaseService(database());
    const result = await service.list();
    assert.equal(result.length, 1);
    assert.equal(result[0]?.title, 'Test case');
  });

  it('raises a not-found error for a missing case', async () => {
    const service = new CaseService(database({ findUnique: async () => null }));
    await assert.rejects(
      service.getById(caseRecord.id),
      (error: unknown) => error instanceof NotFoundError,
    );
  });
});
