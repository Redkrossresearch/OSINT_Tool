# ADR-006: AI Abstraction

**Status:** Accepted
**Date:** 25 August 2026
**Deciders:** Technical Architect

## Context

The AI pipeline must be provider-agnostic and support local models without vendor lock-in.

## Decision

Define an `AIModel` interface that all providers implement.

### Interface
```typescript
interface AIModel {
  name: string;
  provider: string;
  complete(prompt, options): Promise<CompleteResult>;
  isAvailable(): Promise<boolean>;
  health(): Promise<ModelHealth>;
}
```

### Provider Implementation
- Primary: Ollama (local)
- No paid providers configured by default
- Fallback chain: qwen3:8b → qwen3:4b → tinyllama → STOP

## Consequences

### Positive
- Easy to add new providers
- No vendor lock-in
- Local-first architecture
- Free to use

### Negative
- Local models may be less capable than cloud models
- Requires local GPU/RAM

## Alternatives Considered

1. **Vercel AI SDK**: Considered — good abstraction but adds dependency
2. **LangChain**: Rejected — too heavy for bounded pipeline
3. **Direct Ollama API**: Rejected — no abstraction
