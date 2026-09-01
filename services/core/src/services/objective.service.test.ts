import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { PrismaClient } from '@prisma/client';

import { ObjectiveService } from './objective.service.js';

const investigationId = '123e4567-e89b-12d3-a456-426614174010';
const objectiveRecord = {
  id: '123e4567-e89b-12d3-a456-426614174011',
  investigationId,
  type: 'PERSON',
  data: { name: 'Jane Doe' },
  createdAt: new Date('2026-08-28T00:00:00.000Z'),
  updatedAt: new Date('2026-08-28T00:00:00.000Z'),
};

const database = (): PrismaClient =>
  ({
    objective: {
      create: async () => objectiveRecord,
      findMany: async () => [objectiveRecord],
      findUnique: async () => objectiveRecord,
      update: async () => ({ ...objectiveRecord, data: { name: 'Jane Smith' } }),
      delete: async () => objectiveRecord,
    },
  }) as unknown as PrismaClient;

describe('ObjectiveService', () => {
  it('creates and maps a typed objective', async () => {
    const service = new ObjectiveService(database());
    const result = await service.create(investigationId, { type: 'PERSON', name: 'Jane Doe' });

    assert.equal(result.type, 'PERSON');
    assert.equal(result.name, 'Jane Doe');
    assert.equal(result.investigation_id, investigationId);
  });

  it('rejects invalid objective input before database access', async () => {
    const service = new ObjectiveService(database());
    await assert.rejects(service.create(investigationId, { type: 'PERSON' }));
  });
});
