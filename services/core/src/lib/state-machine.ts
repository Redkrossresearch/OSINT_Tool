/**
 * Investigation lifecycle state machine for Team 1.
 *
 * This is intentionally a pure, database-independent implementation because the
 * Prisma/database foundation is owned by T1-015 and not yet implemented.
 */
import {
  AuditAction,
  AuditEvent,
  AuditEventCreate,
  createStateChangeAuditDetails,
  freezeAuditEvent,
  Investigation,
  InvestigationState,
} from '@osint-tool/schemas';

const VALID_TRANSITIONS: Record<InvestigationState, InvestigationState[]> = {
  [InvestigationState.DRAFT]: [InvestigationState.PLANNING],
  [InvestigationState.PLANNING]: [InvestigationState.COLLECTING],
  [InvestigationState.COLLECTING]: [InvestigationState.ANALYZING],
  [InvestigationState.ANALYZING]: [InvestigationState.VERIFYING],
  [InvestigationState.VERIFYING]: [InvestigationState.COMPLETE],
  [InvestigationState.COMPLETE]: [],
};

export const canTransition = (from: InvestigationState, to: InvestigationState): boolean => {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
};

export const createTransitionAuditEvent = (
  investigation: Investigation,
  nextState: InvestigationState,
  actor: string,
): AuditEventCreate => {
  const previousState = investigation.state;

  if (!canTransition(previousState, nextState)) {
    throw new Error(`Invalid transition from ${previousState} to ${nextState}`);
  }

  return {
    investigation_id: investigation.id,
    action: AuditAction.STATE_CHANGED,
    actor,
    timestamp: new Date(),
    details: createStateChangeAuditDetails(previousState, nextState),
  };
};

export const transitionInvestigation = (
  investigation: Investigation,
  nextState: InvestigationState,
  actor: string,
): { investigation: Investigation; auditEvent?: AuditEvent } => {
  if (!canTransition(investigation.state, nextState)) {
    throw new Error(`Invalid transition from ${investigation.state} to ${nextState}`);
  }

  const updatedInvestigation: Investigation = {
    ...investigation,
    state: nextState,
    updated_at: new Date(),
  };

  const auditEvent = freezeAuditEvent({
    id: `audit-${updatedInvestigation.id}-${Date.now()}`,
    ...createTransitionAuditEvent(investigation, nextState, actor),
  });

  return {
    investigation: updatedInvestigation,
    auditEvent,
  };
};
