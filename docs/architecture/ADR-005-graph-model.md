# ADR-005: Graph Model

**Status:** Accepted
**Date:** 25 August 2026
**Deciders:** Technical Architect

## Context

The platform needs to store and query entity relationships for intelligence analysis and visualization.

## Decision

Use PostgreSQL with relational tables for graph storage (no dedicated graph database for MVP).

### Schema
```sql
entities (id, type, canonical_name, attributes, confidence, created_at)
relationships (id, source_entity_id, target_entity_id, type, confidence, evidence_id, valid_from, valid_to, attributes)
```

### Queries
- Neighborhood: SQL JOINs with depth limit
- Shortest path: CTE-based BFS
- Subgraph: filtered entity/relationship sets

## Consequences

### Positive
- No additional database to manage
- Leverages existing PostgreSQL investment
- ACID guarantees
- SQL is well-understood by team

### Negative
- Graph queries are slower than dedicated graph DB
- Complex traversals require CTEs
- Performance degrades with deep traversals

## Alternatives Considered

1. **Neo4j**: Rejected — additional infrastructure, learning curve
2. **ArangoDB**: Rejected — multi-model complexity
3. **In-memory graph**: Rejected — no persistence

## Future

If graph query performance becomes a bottleneck, migrate to Neo4j or similar. The entity/relationship schema is compatible with graph database import.
