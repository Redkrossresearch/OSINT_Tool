# ADR-003: Connector Interface

**Status:** Accepted
**Date:** 25 August 2026
**Deciders:** Technical Architect

## Context

Multiple data sources must be accessed through a uniform interface that handles normalization, errors, rate limiting, and health monitoring.

## Decision

Define a TypeScript `Connector` interface that all connectors implement.

### Interface
```typescript
interface Connector {
  name: string;
  version: string;
  supportedObjectiveTypes: ObjectiveType[];
  configure(config: ConnectorConfig): Promise<void>;
  collect(input: CollectorInput): AsyncGenerator<Observation>;
  health(): Promise<ConnectorHealth>;
}
```

### Properties
- **AsyncGenerator**: Streams observations (memory efficient)
- **Bounded**: Timeout, retry, rate limit enforced by framework
- **Observable**: Health checks for monitoring
- **Typed**: Objective type filtering

## Consequences

### Positive
- Uniform behavior across all connectors
- Easy to add new connectors
- Framework handles cross-cutting concerns
- Testable with mock inputs

### Negative
- AsyncGenerator adds complexity vs. simple return
- Must handle partial failures gracefully

## Alternatives Considered

1. **Callback-based**: Rejected — harder to compose
2. **Class inheritance only**: Rejected — interface preferred for flexibility
3. **gRPC**: Rejected — overkill for MVP, same-process communication
