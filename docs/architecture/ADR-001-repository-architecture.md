# ADR-001: Repository Architecture

**Status:** Accepted
**Date:** 25 August 2026
**Deciders:** Technical Architect

## Context

The RedKross OSINT Investigation Platform needs a repository structure that supports multiple teams working in parallel on a single codebase.

## Decision

Use a **pnpm monorepo** with workspace packages.

### Structure
```
OSINT_Tool/
├── apps/web/           # Frontend (Next.js)
├── services/           # Backend services (per domain)
├── packages/           # Shared code (schemas, entities)
├── connectors/         # Individual connector implementations
├── tests/              # Cross-cutting tests
└── docs/               # Documentation
```

### Rationale
- Single source of truth
- Shared types and schemas
- Co-located tests
- Clear ownership boundaries
- Enables CODEOWNERS-based review

## Consequences

### Positive
- Type safety across boundaries
-原子 deploys possible later
- Single CI pipeline
- Easy cross-service refactoring

### Negative
- All teams share one repository
- Merge conflicts possible
- Requires disciplined branch management

## Alternatives Considered

1. **Multiple repositories**: Rejected — too complex for team size and integration needs
2. **Nx monorepo**: Considered — pnpm workspaces chosen for simplicity
3. **Turborepo**: Considered — may add later for build caching

## Notes

- Branch model: feature → team lead review → team integration → main
- CODEOWNERS enforces review boundaries
- No direct pushes to `main`
