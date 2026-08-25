# ADR-007: Local AI / Ollama

**Status:** Accepted
**Date:** 25 August 2026
**Deciders:** Technical Architect, CEO

## Context

The organization requires free AI development without paid API subscriptions. Interns must develop without purchasing AI services.

## Decision

Use Ollama as the primary AI runtime with locally downloaded models.

### Configuration
- Ollama runs on localhost:11434
- Models: qwen3:8b, qwen3:4b, tinyllama
- No paid APIs configured
- `AI_ALLOW_PAID=false` by default

### Fallback Chain
```
qwen3:8b → qwen3:4b → tinyllama → STOP
```

## Consequences

### Positive
- Zero cost for AI development
- Data stays on local machine
- No internet required for AI
- Privacy preserved

### Negative
- Limited by local hardware (4GB VRAM)
- Slower than cloud models
- Model quality limited by size
- Requires disk space for models

## Hardware Constraints
- RTX 3050 (4GB VRAM): Fits qwen3:4b fully, qwen3:8b partially
- 16GB RAM: Sufficient for one model at a time
- 76GB free disk: Sufficient for multiple models

## Alternatives Considered

1. **Free cloud tiers (Gemini, etc.)**: Available as future option, not default
2. **Paid APIs**: Explicitly rejected by organization
3. **Self-hosted larger models**: Not enough VRAM
