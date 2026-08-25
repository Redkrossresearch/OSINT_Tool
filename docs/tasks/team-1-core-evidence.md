# Tasks — Team 1: Core Platform + Evidence

## T1-001: Project Monorepo Setup

**TEAM:** 1 — Core Platform + Evidence
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Initialize the pnpm monorepo structure with TypeScript, ESLint, Prettier, and shared configuration.

### Dependencies
None

### Input
- Repository with README.md only

### Output
- `package.json` (root, pnpm workspace)
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `.eslintrc.json` / `eslint.config.mjs`
- `.prettierrc`
- `turbo.json` (or nx.json)
- Workspace packages: `packages/schemas`, `packages/entities`, `services/core`, `services/evidence`, `services/connectors`, `services/intelligence`, `services/graph`, `services/ai`, `services/verification`, `services/reporting`, `apps/web`

### Allowed Files
- Root configuration files
- Workspace package.json files
- `.gitignore` updates

### Implementation Notes
- Use pnpm workspaces
- TypeScript 5.x with strict mode
- ES modules
- Node.js 20+ target
- Add `.env.example` with AI configuration

### Test Requirements
- Verify `pnpm install` succeeds
- Verify `pnpm build` succeeds with empty packages
- Verify `pnpm lint` runs

### Documentation Requirements
- Update README.md with setup instructions
- Create CONTRIBUTING.md
- Create DEVELOPMENT.md

### Acceptance Criteria
- [ ] `pnpm install` completes without errors
- [ ] `pnpm build` completes
- [ ] `pnpm lint` runs successfully
- [ ] All workspace packages are recognized
- [ ] TypeScript compiles with strict mode

---

## T1-002: Database Setup (PostgreSQL + Prisma)

**TEAM:** 1 — Core Platform + Evidence
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Set up PostgreSQL with Prisma ORM, create initial migration infrastructure, and configure Docker Compose for local development.

### Dependencies
T1-001 (monorepo setup)

### Input
- Monorepo structure from T1-001

### Output
- `docker-compose.yml` with PostgreSQL
- `services/core/prisma/schema.prisma` (base schema)
- Database connection configuration
- Migration scripts

### Allowed Files
- `docker-compose.yml`
- `services/core/prisma/*`
- `services/core/src/config/database.ts`
- `.env.example` (database variables)

### Implementation Notes
- PostgreSQL 16 in Docker
- Prisma ORM for schema management
- Connection pooling via Prisma
- Environment-based configuration

### Test Requirements
- Verify Docker Compose starts PostgreSQL
- Verify Prisma migration runs
- Verify connection works

### Documentation Requirements
- Document database setup in DEVELOPMENT.md

### Acceptance Criteria
- [ ] `docker-compose up` starts PostgreSQL
- [ ] `prisma migrate dev` creates migration
- [ ] Application can connect to database

---

## T1-003: Case Model + API

**TEAM:** 1 — Core Platform + Evidence
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement the Case data model, Prisma schema, and CRUD API endpoints.

### Dependencies
T1-001, T1-002

### Input
- Database setup from T1-002

### Output
- Prisma Case model
- Case service (CRUD operations)
- Case API routes (REST)
- Unit tests

### Allowed Files
- `services/core/prisma/schema.prisma`
- `services/core/src/services/case.service.ts`
- `services/core/src/routes/case.routes.ts`
- `services/core/src/__tests__/case.service.test.ts`

### Implementation Notes
- Case fields: id (UUID), title, description, status, created_by, created_at, updated_at
- Status enum: OPEN, ACTIVE, CLOSED
- REST endpoints: GET /api/cases, GET /api/cases/:id, POST /api/cases, PATCH /api/cases/:id, DELETE /api/cases/:id

### Test Requirements
- Unit tests for service layer
- API integration tests

### Acceptance Criteria
- [ ] Case CRUD operations work
- [ ] Status transitions are valid
- [ ] All tests pass
- [ ] API follows REST conventions

---

## T1-004: Investigation Model + State Machine

**TEAM:** 1 — Core Platform + Evidence
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement the Investigation data model with a state machine for investigation lifecycle.

### Dependencies
T1-003 (Case model)

### Input
- Case model from T1-003

### Output
- Prisma Investigation model
- State machine implementation
- Investigation service
- Investigation API routes
- Unit tests

### Allowed Files
- `services/core/prisma/schema.prisma`
- `services/core/src/services/investigation.service.ts`
- `services/core/src/routes/investigation.routes.ts`
- `services/core/src/lib/state-machine.ts`
- `services/core/src/__tests__/investigation.service.test.ts`

### Implementation Notes
- States: DRAFT → PLANNING → COLLECTING → ANALYZING → VERIFYING → COMPLETE
- Valid transitions must be enforced
- Investigation links to a Case (foreign key)
- Investigation contains an Objective

### Test Requirements
- State transition tests (valid and invalid)
- CRUD tests
- API tests

### Acceptance Criteria
- [ ] Valid state transitions are enforced
- [ ] Invalid transitions are rejected
- [ ] Investigation links to Case
- [ ] All tests pass

---

## T1-005: Objective Schema

**TEAM:** 1 — Core Platform + Evidence
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Define and validate the Objective schema (type, target, parameters).

### Dependencies
T1-001

### Input
- Shared schema package

### Output
- Objective TypeScript types
- Objective validation (Zod schemas)
- Unit tests

### Allowed Files
- `packages/schemas/objective.ts`
- `packages/schemas/__tests__/objective.test.ts`

### Implementation Notes
- Types: PERSON, DOMAIN, COMPANY, IP
- Each type has specific required fields
- Validation via Zod

### Acceptance Criteria
- [ ] Objective types are defined
- [ ] Validation works for each type
- [ ] Invalid objectives are rejected

---

## T1-006: Evidence Schema + Hashing

**TEAM:** 1 — Core Platform + Evidence
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Define the Evidence schema and implement SHA-256 hashing for evidence integrity.

### Dependencies
T1-001, T1-005

### Input
- Schema package

### Output
- Evidence TypeScript types
- Evidence validation schemas
- SHA-256 hashing utility
- Unit tests

### Allowed Files
- `packages/schemas/evidence.ts`
- `packages/schemas/__tests__/evidence.test.ts`
- `services/evidence/src/lib/hash.ts`
- `services/evidence/src/__tests__/hash.test.ts`

### Implementation Notes
- Evidence fields: id, investigation_id, type, source, content, metadata, hash, created_at
- Hash: SHA-256 of canonical content representation
- Hash verification utility

### Acceptance Criteria
- [ ] Evidence schema is complete
- [ ] SHA-256 hashing produces consistent results
- [ ] Hash verification detects tampering

---

## T1-007: Evidence Storage Service

**TEAM:** 1 — Core Platform + Evidence
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement evidence storage with full provenance tracking.

### Dependencies
T1-002, T1-006

### Input
- Database setup, Evidence schema

### Output
- Prisma Evidence model
- Evidence service
- Provenance tracking
- Evidence API routes
- Unit tests

### Allowed Files
- `services/core/prisma/schema.prisma`
- `services/evidence/src/services/evidence.service.ts`
- `services/evidence/src/routes/evidence.routes.ts`
- `services/evidence/src/__tests__/evidence.service.test.ts`

### Implementation Notes
- Store evidence with computed hash
- Provenance entry per evidence action
- Evidence immutability (content cannot change after creation)

### Acceptance Criteria
- [ ] Evidence is stored with hash
- [ ] Provenance chain is maintained
- [ ] Evidence content is immutable after creation

---

## T1-008: Source Schema + Provenance

**TEAM:** 1 — Core Platform + Evidence
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Define the Source reference schema and Provenance chain.

### Dependencies
T1-001

### Input
- Schema package

### Output
- Source TypeScript types
- Provenance TypeScript types
- Unit tests

### Allowed Files
- `packages/schemas/source.ts`
- `packages/schemas/provenance.ts`
- `packages/schemas/__tests__/source.test.ts`

### Implementation Notes
- Source: connector_name, query, timestamp, parameters
- Provenance: action, actor, timestamp, details

### Acceptance Criteria
- [ ] Source schema is defined
- [ ] Provenance chain is defined
- [ ] Validation works

---

## T1-009: Observation Schema

**TEAM:** 1 — Core Platform + Evidence
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Define the Observation schema that connectors produce.

### Dependencies
T1-001, T1-006, T1-008

### Input
- Evidence and Source schemas

### Output
- Observation TypeScript types
- Observation validation schemas
- Unit tests

### Allowed Files
- `packages/schemas/observation.ts`
- `packages/schemas/__tests__/observation.test.ts`

### Implementation Notes
- Observation: id, evidence_id, type, data, confidence, source_ref, timestamp
- Must be compatible with connector output
- Must be compatible with entity extraction input

### Acceptance Criteria
- [ ] Observation schema matches connector contract
- [ ] Confidence score is 0.0-1.0
- [ ] Validation works

---

## T1-010: Audit Event System

**TEAM:** 1 — Core Platform + Evidence
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement audit event logging for all investigation actions.

### Dependencies
T1-002, T1-004

### Input
- Database, Investigation model

### Output
- Prisma AuditEvent model
- Audit service
- Middleware for automatic logging
- Unit tests

### Allowed Files
- `services/core/prisma/schema.prisma`
- `services/core/src/services/audit.service.ts`
- `services/core/src/middleware/audit.ts`
- `services/core/src/__tests__/audit.service.test.ts`

### Implementation Notes
- Events: created, updated, state_changed, evidence_added, etc.
- Each event: id, investigation_id, action, actor, timestamp, details
- Middleware auto-logs API actions

### Acceptance Criteria
- [ ] All investigation actions are logged
- [ ] Audit events are immutable
- [ ] Events can be queried by investigation

---

## T1-011: Shared Schema Package

**TEAM:** 1 — Core Platform + Evidence
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Publish the shared schema package that all teams consume.

### Dependencies
T1-005, T1-006, T1-008, T1-009

### Input
- All individual schemas

### Output
- `packages/schemas/index.ts` (barrel export)
- Package.json for schema package
- Build configuration
- Unit tests

### Allowed Files
- `packages/schemas/index.ts`
- `packages/schemas/package.json`
- `packages/schemas/tsconfig.json`
- `packages/schemas/__tests__/index.test.ts`

### Test Requirements
- All schema validations pass
- Package builds successfully
- Other packages can import

### Acceptance Criteria
- [ ] All schemas are exported
- [ ] Package builds without errors
- [ ] Types are available to consumers
