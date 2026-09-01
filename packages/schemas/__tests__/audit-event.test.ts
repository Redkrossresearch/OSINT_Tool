import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  AuditAction,
  AuditActionSchema,
  AuditEvent,
  AuditEventCreateSchema,
  AuditEventSchema,
  freezeAuditEvent,
} from '../src/audit-event.js';

describe('AuditAction', () => {
  it('contains the required lifecycle actions', () => {
    assert.deepEqual(Object.values(AuditAction), [
      'CREATED',
      'UPDATED',
      'STATE_CHANGED',
      'EVIDENCE_ADDED',
      'EVIDENCE_ANALYZED',
      'FINDING_ADDED',
    ]);
  });

  it('rejects invalid actions', () => {
    const result = AuditActionSchema.safeParse('DELETED');
    assert.equal(result.success, false);
  });
});

describe('AuditEventCreateSchema', () => {
  it('accepts a valid audit event payload', () => {
    const result = AuditEventCreateSchema.safeParse({
      investigation_id: '123e4567-e89b-12d3-a456-426614174000',
      action: AuditAction.STATE_CHANGED,
      actor: 'analyst-001',
      timestamp: '2026-08-28T00:00:00.000Z',
      details: {
        from: 'DRAFT',
        to: 'PLANNING',
      },
    });

    assert.equal(result.success, true);
  });

  it('rejects missing fields', () => {
    const result = AuditEventCreateSchema.safeParse({
      investigation_id: '123e4567-e89b-12d3-a456-426614174000',
      action: AuditAction.STATE_CHANGED,
    });

    assert.equal(result.success, false);
  });
});

describe('AuditEventSchema', () => {
  it('accepts a valid full audit event record', () => {
    const result = AuditEventSchema.safeParse({
      id: 'audit-001',
      investigation_id: '123e4567-e89b-12d3-a456-426614174000',
      action: AuditAction.STATE_CHANGED,
      actor: 'analyst-001',
      timestamp: '2026-08-28T00:00:00.000Z',
      details: {
        from: 'DRAFT',
        to: 'PLANNING',
      },
    });

    assert.equal(result.success, true);
  });

  it('rejects invalid timestamps', () => {
    const result = AuditEventSchema.safeParse({
      id: 'audit-001',
      investigation_id: '123e4567-e89b-12d3-a456-426614174000',
      action: AuditAction.STATE_CHANGED,
      actor: 'analyst-001',
      timestamp: 'not-a-date',
      details: {},
    });

    assert.equal(result.success, false);
  });

  it('supports immutable audit records', () => {
    const event: AuditEvent = {
      id: 'audit-001',
      investigation_id: '123e4567-e89b-12d3-a456-426614174000',
      action: AuditAction.STATE_CHANGED,
      actor: 'analyst-001',
      timestamp: new Date('2026-08-28T00:00:00.000Z'),
      details: {
        from: 'DRAFT',
        to: 'PLANNING',
      },
    };

    const frozen = freezeAuditEvent(event);
    assert.equal(Object.isFrozen(frozen), true);
    assert.throws(() => {
      (frozen as Record<string, unknown>).actor = 'tampered';
    });
  });
});
