# Team 1 — Core Platform + Evidence

## Mission

Build the foundation on which every other team depends. Team 1 owns the core domain models, shared schemas, database foundation, and evidence integrity system.

---

## Team Responsibilities

1. Case management (CRUD, lifecycle)
2. Investigation model and state machine
3. Objective model and validation
4. Evidence model, storage, and hashing
5. Observation model (what connectors produce)
6. Source tracking and provenance
7. Audit event system
8. Database foundation (PostgreSQL + Prisma)
9. Shared schema package (`packages/schemas/`)
10. Core APIs
11. Validation and error handling
12. Core tests
13. Technical documentation

---

## Team Ownership

```
services/core/           — Case, investigation, objective services + Prisma
services/evidence/       — Evidence storage, hashing, provenance
packages/schemas/        — Shared TypeScript schemas and types (ALL teams consume)
```

---

## Team Boundaries

### Team 1 OWNS

- All schema definitions in `packages/schemas/`
- Case, Investigation, Objective domain models
- Evidence storage and integrity
- Database migrations
- Audit events
- Core API contracts

### Team 1 DOES NOT OWN

- `connectors/` — Team 2
- `services/connectors/` — Team 2
- `services/intelligence/` — Team 3
- `services/graph/` — Team 3
- `packages/entities/` — Team 3
- `services/ai/` — Team 4
- `services/verification/` — Team 4
- `apps/web/` — Team 5
- `services/reporting/` — Team 5

---

## What Team 1 Must NOT Modify

- Frontend code (`apps/web/`)
- Connector implementations (`connectors/`)
- AI agent code (`services/ai/`)
- Graph query logic (`services/graph/`)
- Any file in another team's owned directory without explicit coordination

---

## Dependencies

**Team 1 has no upstream dependencies.** Team 1 is the foundation.

All other teams depend on Team 1's schemas and APIs.

---

## Dependents

| Team | Depends On (Team 1) |
|---|---|
| Team 2 | Observation schema, Evidence schema, Objective schema, Source schema |
| Team 3 | Entity schema, Observation schema, Evidence schema |
| Team 4 | Investigation model, Evidence schema, Observation schema |
| Team 5 | Case API, Investigation API, Evidence API |

---

## Interfaces With Other Teams

### Outgoing (Team 1 provides to others)

| Interface | Consumer | Location |
|---|---|---|
| `packages/schemas/` | ALL teams | Shared schemas |
| Case API | Team 5 | REST endpoints |
| Investigation API | Teams 3, 4, 5 | REST endpoints |
| Evidence API | Teams 2, 3, 4 | REST endpoints |
| Observation schema | Teams 2, 3, 4 | Package import |
| Objective schema | Teams 2, 4 | Package import |

### Incoming (Team 1 receives from others)

None. Team 1 is the foundation.

---

## Task List

See `docs/tasks/team-1-core.md` for the complete task list.

| Task | Title | Difficulty |
|---|---|---|
| T1-001 | Repository/monorepo foundation | Medium |
| T1-002 | Workspace/package configuration | Medium |
| T1-003 | Shared Zod schema package | Medium |
| T1-004 | Case schema | Easy |
| T1-005 | Investigation schema | Medium |
| T1-006 | Objective schema | Easy |
| T1-007 | Source schema | Easy |
| T1-008 | Observation schema | Medium |
| T1-009 | Evidence schema | Medium |
| T1-010 | Evidence provenance model | Medium |
| T1-011 | Evidence hashing | Medium |
| T1-012 | Evidence metadata | Easy |
| T1-013 | Audit event model | Medium |
| T1-014 | Investigation lifecycle | Hard |
| T1-015 | Database/Prisma foundation | Medium |
| T1-016 | Core service structure | Medium |
| T1-017 | Core API | Hard |
| T1-018 | Evidence API | Hard |
| T1-019 | Validation/error handling | Medium |
| T1-020 | Unit tests | Medium |
| T1-021 | Integration tests | Hard |
| T1-022 | Documentation | Easy |

---

## Git Workflow

1. Feature branch from `team/1-core`
2. Implement task
3. Write tests
4. Self-review
5. PR to `team/1-core`
6. Team lead reviews
7. Merge to `team/1-core`
8. Technical architect reviews `team/1-core` → `main`

**Never push directly to `main`.**

---

## Testing Expectations

- Unit tests for every service function
- Integration tests for API endpoints
- Schema validation tests
- Database migration tests
- Contract tests for shared schemas
- Minimum 80% code coverage

---

## Documentation Expectations

- Every API endpoint documented
- Every schema field documented
- Every service function documented
- Setup instructions in DEVELOPMENT.md
- Database migration guide
- Schema change log

---

## Security Rules

- No secrets in code
- No `.env` files committed
- Evidence is immutable after creation
- Audit events are immutable
- All inputs validated via Zod
- SQL injection prevented by Prisma
- All database access through service layer

---

## AI Coding Rules

- Use OpenCode + Ollama (free/local only)
- No paid AI APIs
- AI explains before modifying
- AI suggests implementation plan first
- Human reviews all AI output
- AI never decides architecture or schema changes alone
- AI never modifies `packages/schemas/` without human review

---

## Definition of Done

- [ ] Code compiles with TypeScript strict mode
- [ ] All tests pass
- [ ] Code coverage ≥ 80%
- [ ] Documentation updated
- [ ] PR reviewed and approved
- [ ] No secrets or credentials in code
- [ ] Schemas backward-compatible
- [ ] API endpoints documented
- [ ] Migrations are reversible
