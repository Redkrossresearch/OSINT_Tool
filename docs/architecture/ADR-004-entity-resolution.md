# ADR-004: Entity Resolution

**Status:** Accepted
**Date:** 25 August 2026
**Deciders:** Technical Architect

## Context

Entities extracted from multiple sources and observations must be resolved to canonical forms to build a coherent intelligence graph.

## Decision

Use a multi-pass resolution strategy with confidence scoring.

### Resolution Strategy
1. **Exact match** after normalization (confidence: 1.0)
2. **Fuzzy match** with Levenshtein distance (confidence: 0.7-0.9)
3. **Shared attribute match** (same email → same person) (confidence: 0.8)
4. **Human confirmation** for ambiguous cases

### Rules
- No silent merges — every merge is logged
- Confidence scores are transparent
- Merges require confidence > 0.8 OR human confirmation
- All merges create provenance entries

## Consequences

### Positive
- Transparent resolution process
- Human oversight for ambiguous cases
- Full audit trail of merges

### Negative
- May require human intervention for complex cases
- False positives possible with fuzzy matching

## Alternatives Considered

1. **AI-only resolution**: Rejected — too unreliable for evidence
2. **No resolution**: Rejected — creates duplicate entities
3. **Graph neural networks**: Future consideration
