import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  InvestigationCreateSchema,
  InvestigationSchema,
  InvestigationState,
  InvestigationStateSchema,
} from '../src/investigation.js';

describe('InvestigationState', () => {
  it('should expose the correct lifecycle states', () => {
    assert.deepEqual(Object.values(InvestigationState), [
      'DRAFT',
      'PLANNING',
      'COLLECTING',
      'ANALYZING',
      'VERIFYING',
      'COMPLETE',
    ]);
  });

  it('should validate allowed statuses', () => {
    for (const state of Object.values(InvestigationState)) {
      const result = InvestigationStateSchema.safeParse(state);
      assert.equal(result.success, true);
    }
  });

  it('should reject invalid status values', () => {
    const result = InvestigationStateSchema.safeParse('PAUSED');
    assert.equal(result.success, false);
  });
});

describe('InvestigationCreateSchema', () => {
  it('accepts a valid investigation creation payload', () => {
    const result = InvestigationCreateSchema.safeParse({
      case_id: '123e4567-e89b-12d3-a456-426614174000',
      state: InvestigationState.DRAFT,
      objective: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        investigation_id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'PERSON',
        name: 'Jane Doe',
        aliases: ['J. Doe'],
        created_at: '2026-08-28T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z',
      },
      plan: ['Research aliases', 'Review public records'],
    });

    assert.equal(result.success, true);
  });

  it('defaults state to DRAFT and plan to an empty array when omitted', () => {
    const result = InvestigationCreateSchema.safeParse({
      case_id: '123e4567-e89b-12d3-a456-426614174000',
      objective: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        investigation_id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'DOMAIN',
        domain: 'example.com',
        created_at: '2026-08-28T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z',
      },
    });

    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.state, InvestigationState.DRAFT);
      assert.deepEqual(result.data.plan, []);
    }
  });

  it('rejects missing required fields', () => {
    const result = InvestigationCreateSchema.safeParse({
      case_id: '123e4567-e89b-12d3-a456-426614174000',
    });

    assert.equal(result.success, false);
  });

  it('rejects invalid case_id format', () => {
    const result = InvestigationCreateSchema.safeParse({
      case_id: 'not-a-uuid',
      objective: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        investigation_id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'PERSON',
        name: 'Jane Doe',
        created_at: '2026-08-28T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z',
      },
    });

    assert.equal(result.success, false);
  });
});

describe('InvestigationSchema', () => {
  it('accepts a valid full investigation record', () => {
    const result = InvestigationSchema.safeParse({
      id: '123e4567-e89b-12d3-a456-426614174010',
      case_id: '123e4567-e89b-12d3-a456-426614174000',
      state: InvestigationState.COLLECTING,
      objective: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        investigation_id: '123e4567-e89b-12d3-a456-426614174010',
        type: 'PERSON',
        name: 'Jane Doe',
        aliases: ['J. Doe'],
        created_at: '2026-08-28T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z',
      },
      plan: ['Collect source data'],
      created_at: '2026-08-28T00:00:00.000Z',
      updated_at: '2026-08-28T01:00:00.000Z',
    });

    assert.equal(result.success, true);
  });

  it('rejects invalid timestamps', () => {
    const result = InvestigationSchema.safeParse({
      id: '123e4567-e89b-12d3-a456-426614174010',
      case_id: '123e4567-e89b-12d3-a456-426614174000',
      state: InvestigationState.DRAFT,
      objective: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        investigation_id: '123e4567-e89b-12d3-a456-426614174010',
        type: 'PERSON',
        name: 'Jane Doe',
        created_at: 'not-a-date',
        updated_at: '2026-08-28T00:00:00.000Z',
      },
      plan: [],
      created_at: 'not-a-date',
      updated_at: '2026-08-28T00:00:00.000Z',
    });

    assert.equal(result.success, false);
  });
});
