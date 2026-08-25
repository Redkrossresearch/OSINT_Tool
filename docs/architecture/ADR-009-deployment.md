# ADR-009: Deployment

**Status:** Accepted
**Date:** 25 August 2026
**Deciders:** Technical Architect

## Context

The platform needs deployment infrastructure for development and production.

## Decision

### Development
- Docker Compose for local services (PostgreSQL)
- Ollama runs natively on host machine
- Frontend runs on localhost via `pnpm dev`

### Production (Future)
- Containerized services (Docker)
- PostgreSQL managed service (e.g., Supabase, Neon, AWS RDS)
- Frontend on Vercel or Cloudflare Pages
- Ollama on dedicated GPU server

### CI/CD
- GitHub Actions for CI
- Lint, typecheck, test, build on every PR
- Deploy on merge to `main`

## Consequences

### Positive
- Simple local development
- No vendor lock-in for production
- Standard tooling

### Negative
- Ollama requires host machine (not containerized)
- GPU access needed for AI features

## Alternatives Considered

1. **Kubernetes**: Rejected — too complex for team size
2. **Vercel for everything**: Rejected — no GPU access for Ollama
3. **AWS/GCP full stack**: Rejected — cost, complexity

## MVP Deployment

For September 19 demo:
- Local machine with Docker + Ollama
- No cloud deployment required
- Demo runs entirely on developer's laptop
