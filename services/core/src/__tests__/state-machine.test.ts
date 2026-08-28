import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { InvestigationState } from '../../../../packages/schemas/src/investigation.ts';
import {
  canTransition,
  createTransitionAuditEvent,
  transitionInvestigation,
} from '../lib/state-machine.js';

describe('Investigation lifecycle state machine', () => {
  const baseInvestigation = {
    id: '123e4567-e89b-12d3-a456-426614174010',
    case_id: '123e4567-e89b-12d3-a456-426614174000',
    state: InvestigationState.DRAFT,
    objective: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      investigation_id: '123e4567-e89b-12d3-a456-426614174010',
      type: 'PERSON',
      name: 'Jane Doe',
      created_at: '2026-08-28T00:00:00.000Z',
      updated_at: '2026-08-28T00:00:00.000Z',
    },
    plan: [],
    created_at: '2026-08-28T00:00:00.000Z',
    updated_at: '2026-08-28T00:00:00.000Z',
  } as const;

  it('allows the defined valid transitions', () => {
    const transitions = [
      ['DRAFT', 'PLANNING'],
      ['PLANNING', 'COLLECTING'],
      ['COLLECTING', 'ANALYZING'],
      ['ANALYZING', 'VERIFYING'],
      ['VERIFYING', 'COMPLETE'],
    ] as const;

    for (const [from, to] of transitions) {
      assert.equal(canTransition(from, to), true);
    }
  });

  it('rejects invalid transitions', () => {
    assert.equal(canTransition('DRAFT', 'COLLECTING'), false);
    assert.equal(canTransition('COMPLETE', 'VERIFYING'), false);
    assert.equal(canTransition('VERIFYING', 'PLANNING'), false);
  });

  it('updates investigation state and creates an audit event for valid transitions', () => {
    const result = transitionInvestigation(baseInvestigation, InvestigationState.PLANNING, 'analyst-001');

    assert.equal(result.investigation.state, InvestigationState.PLANNING);
    assert.equal(result.auditEvent?.action, 'STATE_CHANGED');
    assert.equal(result.auditEvent?.details.from, InvestigationState.DRAFT);
    assert.equal(result.auditEvent?.details.to, InvestigationState.PLANNING);
    assert.equal(result.auditEvent?.actor, 'analyst-001');
  });

  it('throws for invalid transitions', () => {
    assert.throws(() => {
      transitionInvestigation({ ...baseInvestigation, state: InvestigationState.COMPLETE }, InvestigationState.VERIFYING, 'analyst-001');
    });
  });

  it('creates a transition audit event with the correct payload', () => {
    const auditEvent = createTransitionAuditEvent(baseInvestigation, InvestigationState.PLANNING, 'analyst-001');

    assert.equal(auditEvent.action, 'STATE_CHANGED');
    assert.equal(auditEvent.investigation_id, baseInvestigation.id);
    assert.equal(auditEvent.details.from, InvestigationState.DRAFT);
    assert.equal(auditEvent.details.to, InvestigationState.PLANNING);
  });
});
