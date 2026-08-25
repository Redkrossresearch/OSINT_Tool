# ADR-002: Evidence Model

**Status:** Accepted
**Date:** 25 August 2026
**Deciders:** Technical Architect

## Context

The platform must store evidence with full integrity, provenance, and immutability to support investigations that can be replayed and verified.

## Decision

Evidence is stored as immutable objects with SHA-256 content hashing and a linear provenance chain.

### Evidence Object
```typescript
{
  id: UUID,
  investigation_id: UUID,
  type: string,
  source: SourceRef,
  content: EvidenceContent,
  metadata: Record<string, unknown>,
  hash: string,           // SHA-256 of canonical content
  provenance: ProvenanceEntry[],
  created_at: Date
}
```

### Properties
- **Immutable**: Content cannot change after creation
- **Verifiable**: Hash can be recomputed and compared
- **Traceable**: Provenance chain records every action
- **Typed**: Evidence types distinguish data categories

## Consequences

### Positive
- Evidence integrity is mathematically verifiable
- Full chain of custody
- Tamper detection
- Replay capability

### Negative
- Storage overhead for provenance chain
- Cannot update evidence (must create new version)

## Alternatives Considered

1. **Mutable evidence with audit log**: Rejected — weaker integrity guarantees
2. **Blockchain provenance**: Rejected — overkill for MVP, no decentralization need
3. **Merkle tree**: Considered for future — SHA-256 sufficient for MVP
