# Tasks — Team 1: Core Platform + Evidence

## T1-001 — Repository/Monorepo Foundation

**Team:** Team 1 — Core + Evidence
**Objective:** Initialize the pnpm monorepo with TypeScript, ESLint, Prettier, and workspace configuration.
**Why:** Every team needs a consistent project structure to work in parallel.

**Primary Owner:** `Preetam-06`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** Team lead

### Dependencies
None

### Inputs
- Empty repository with README.md

### Outputs
- `package.json` (root)
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `.eslintrc.json` / `eslint.config.mjs`
- `.prettierrc`
- `turbo.json`
- Workspace directories created

### Allowed Files
- Root configuration files
- `packages/`, `services/`, `apps/`, `connectors/`, `tests/` directories
- `.gitignore` updates

### Do Not Modify
- `docs/` (other teams own specific docs)
- Any team-specific directories

### Implementation Guidance
1. Run `pnpm init` at root
2. Create `pnpm-workspace.yaml` listing all workspace dirs
3. Set up `tsconfig.base.json` with strict mode, ES2022 target, ESNext module
4. Add ESLint with TypeScript plugin
5. Add Prettier
6. Add Turborepo for task orchestration
7. Create empty `package.json` in each workspace dir

### AI Instructions
Ask AI to explain pnpm workspace configuration before implementing. Ask for a setup plan before writing files.

### Tests
- `pnpm install` completes without errors
- `pnpm build` succeeds with empty packages
- `pnpm lint` runs

### Documentation
- Update README.md with setup instructions

### Acceptance Criteria
- [ ] `pnpm install` completes
- [ ] `pnpm build` completes
- [ ] `pnpm lint` runs
- [ ] All workspace packages recognized
- [ ] TypeScript compiles with strict mode

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-002 — Workspace/Package Configuration

**Team:** Team 1 — Core + Evidence
**Objective:** Configure each workspace package with proper package.json, tsconfig, and build settings.
**Why:** Each team needs their package ready to accept code.

**Primary Owner:** `Preetam-06`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** Team lead

### Dependencies
T1-001

### Inputs
- Monorepo structure from T1-001

### Outputs
- `packages/schemas/package.json`
- `services/core/package.json`
- `services/evidence/package.json`
- All workspace package.json files with correct dependencies
- Build scripts per package

### Allowed Files
- All workspace `package.json` files
- All workspace `tsconfig.json` files

### Do Not Modify
- Root configuration (T1-001 scope)

### Implementation Guidance
1. Configure `packages/schemas/package.json` as internal package
2. Configure each service package with correct workspace dependencies
3. Add build, test, lint scripts
4. Ensure TypeScript project references work

### AI Instructions
Ask AI to explain TypeScript project references in monorepos before implementing.

### Tests
- Each package builds independently
- Workspace linking works
- Build order respects dependencies

### Documentation
- Package dependency map in DEVELOPMENT.md

### Acceptance Criteria
- [ ] All packages have valid package.json
- [ ] Build scripts work
- [ ] Workspace linking works

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-003 — Shared Zod Schema Package

**Team:** Team 1 — Core + Evidence
**Objective:** Set up the shared schema package with Zod validation and barrel exports.
**Why:** All teams consume shared schemas. This package is the contract between teams.

**Primary Owner:** `Dinesh-Kumar-Ved`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `Preetam-06`

### Dependencies
T1-002

### Inputs
- Workspace configuration

### Outputs
- `packages/schemas/package.json` with Zod dependency
- `packages/schemas/src/index.ts` (barrel export)
- `packages/schemas/tsconfig.json`
- Build configuration

### Allowed Files
- `packages/schemas/`

### Do Not Modify
- Other workspace packages

### Implementation Guidance
1. Add Zod as dependency
2. Create `src/` directory structure
3. Set up barrel export in `src/index.ts`
4. Configure build to produce both CJS and ESM output
5. Add type declarations

### AI Instructions
Ask AI to explain Zod schema composition before implementing.

### Tests
- Package builds successfully
- Other packages can import types
- Zod validation works

### Documentation
- Schema package usage guide

### Acceptance Criteria
- [ ] Package builds
- [ ] Types are exported
- [ ] Zod validation works

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-004 — Case Schema

**Team:** Team 1 — Core + Evidence
**Objective:** Define the Case TypeScript types and Zod validation schemas.
**Why:** Case is the top-level container for investigations.

**Primary Owner:** `Dinesh-Kumar-Ved`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `Preetam-06`

### Dependencies
T1-003

### Inputs
- Schema package

### Outputs
- `packages/schemas/src/case.ts`
- Case status enum
- Case CRUD schemas
- Unit tests

### Allowed Files
- `packages/schemas/src/case.ts`
- `packages/schemas/__tests__/case.test.ts`

### Do Not Modify
- Other schema files

### Implementation Guidance
1. Define `CaseStatus` enum: `OPEN`, `ACTIVE`, `CLOSED`
2. Define `Case` interface: id (UUID), title, description, status, created_by, created_at, updated_at
3. Create Zod schemas for create, update, response
4. Add validation rules (title required, description optional)

### AI Instructions
Ask AI to explain Zod enum and object schema patterns.

### Tests
- Valid case passes validation
- Missing title fails validation
- Invalid status fails validation

### Documentation
- Schema field reference

### Acceptance Criteria
- [ ] Case types defined
- [ ] Zod validation works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-005 — Investigation Schema

**Team:** Team 1 — Core + Evidence
**Objective:** Define the Investigation TypeScript types and state machine types.
**Why:** Investigation is the core work unit with lifecycle states.

**Primary Owner:** `ANDY15K`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `Preetam-06`

### Dependencies
T1-003, T1-004

### Inputs
- Schema package, Case schema

### Outputs
- `packages/schemas/src/investigation.ts`
- Investigation state enum
- State transition types
- Unit tests

### Allowed Files
- `packages/schemas/src/investigation.ts`
- `packages/schemas/__tests__/investigation.test.ts`

### Do Not Modify
- Case schema

### Implementation Guidance
1. Define `InvestigationState` enum: `DRAFT`, `PLANNING`, `COLLECTING`, `ANALYZING`, `VERIFYING`, `COMPLETE`
2. Define valid transitions map
3. Define `Investigation` interface: id, case_id, state, objective, plan, created_at, updated_at
4. Create Zod schemas

### AI Instructions
Ask AI to explain state machine patterns in TypeScript.

### Tests
- Valid state transitions pass
- Invalid transitions fail validation
- Investigation links to case

### Documentation
- State machine diagram

### Acceptance Criteria
- [ ] State enum defined
- [ ] Valid transitions documented
- [ ] Zod validation works

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-006 — Objective Schema

**Team:** Team 1 — Core + Evidence
**Objective:** Define the Objective TypeScript types and validation schemas.
**Why:** Objectives define what an investigation is trying to discover.

**Primary Owner:** `Dinesh-Kumar-Ved`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `Preetam-06`

### Dependencies
T1-003

### Inputs
- Schema package

### Outputs
- `packages/schemas/src/objective.ts`
- Objective type enum
- Unit tests

### Allowed Files
- `packages/schemas/src/objective.ts`
- `packages/schemas/__tests__/objective.test.ts`

### Do Not Modify
- Other schemas

### Implementation Guidance
1. Define `ObjectiveType` enum: `PERSON`, `DOMAIN`, `COMPANY`, `IP`
2. Define `Objective` interface with type-specific required fields
3. Create discriminated union Zod schema
4. Validate required fields per type

### AI Instructions
Ask AI to explain Zod discriminated unions.

### Tests
- Each objective type validates correctly
- Missing required fields fail
- Invalid type fails

### Documentation
- Objective type reference

### Acceptance Criteria
- [ ] All objective types defined
- [ ] Validation works per type
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-007 — Source Schema

**Team:** Team 1 — Core + Evidence
**Objective:** Define the Source reference schema for tracking data origins.
**Why:** Every observation must trace back to its source.

**Primary Owner:** `Zrahul2024`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `Preetam-06`

### Dependencies
T1-003

### Inputs
- Schema package

### Outputs
- `packages/schemas/src/source.ts`
- Source reference types
- Unit tests

### Allowed Files
- `packages/schemas/src/source.ts`
- `packages/schemas/__tests__/source.test.ts`

### Do Not Modify
- Other schemas

### Implementation Guidance
1. Define `SourceRef` interface: connector_name, query, timestamp, parameters
2. Create Zod schema with validation
3. Ensure connector_name is a known connector identifier

### AI Instructions
Ask AI to explain source provenance patterns.

### Tests
- Valid source passes validation
- Missing connector_name fails

### Documentation
- Source reference format

### Acceptance Criteria
- [ ] Source types defined
- [ ] Validation works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-008 — Observation Schema

**Team:** Team 1 — Core + Evidence
**Objective:** Define the Observation schema that connectors produce and intelligence consumes.
**Why:** Observation is the central data contract between Team 2 and Teams 3/4.

**Primary Owner:** `Zrahul2024`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `Preetam-06`

### Dependencies
T1-003, T1-007

### Inputs
- Schema package, Source schema

### Outputs
- `packages/schemas/src/observation.ts`
- Observation types
- Unit tests

### Allowed Files
- `packages/schemas/src/observation.ts`
- `packages/schemas/__tests__/observation.test.ts`

### Do Not Modify
- Source schema

### Implementation Guidance
1. Define `Observation` interface: id, evidence_id, type, data (Record<string, unknown>), confidence (0.0–1.0), source_ref, timestamp
2. Create Zod schema with confidence bounds
3. Ensure compatibility with connector output format

### AI Instructions
Ask AI to explain contract-first API design.

### Tests
- Observation with valid data passes
- Confidence out of range fails
- Missing source_ref fails

### Documentation
- Observation contract reference

### Acceptance Criteria
- [ ] Observation types defined
- [ ] Confidence bounds enforced
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-009 — Evidence Schema

**Team:** Team 1 — Core + Evidence
**Objective:** Define the Evidence schema and hashing types.
**Why:** Evidence is the immutable record of collected information.

**Primary Owner:** `jadhavsarthak374-ai`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `Preetam-06`

### Dependencies
T1-003, T1-007

### Inputs
- Schema package, Source schema

### Outputs
- `packages/schemas/src/evidence.ts`
- Evidence types
- Unit tests

### Allowed Files
- `packages/schemas/src/evidence.ts`
- `packages/schemas/__tests__/evidence.test.ts`

### Do Not Modify
- Source schema

### Implementation Guidance
1. Define `EvidenceType` enum: `WEB_PAGE`, `DNS_RECORD`, `CERTIFICATE`, `GITHUB_DATA`, `SEARCH_RESULT`
2. Define `Evidence` interface: id, investigation_id, type, source, content, metadata, hash, created_at
3. Create Zod schemas
4. Hash is SHA-256 (computed, not validated input)

### AI Instructions
Ask AI to explain evidence integrity patterns.

### Tests
- Valid evidence passes validation
- Invalid type fails
- Hash format validated (hex string, 64 chars)

### Documentation
- Evidence type reference

### Acceptance Criteria
- [ ] Evidence types defined
- [ ] Zod validation works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-010 — Evidence Provenance Model

**Team:** Team 1 — Core + Evidence
**Objective:** Define the Provenance chain types for evidence lifecycle tracking.
**Why:** Every evidence action must be traceable for audit and legal purposes.

**Primary Owner:** `Zrahul2024`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `Preetam-06`

### Dependencies
T1-003

### Inputs
- Schema package

### Outputs
- `packages/schemas/src/provenance.ts`
- Provenance types
- Unit tests

### Allowed Files
- `packages/schemas/src/provenance.ts`
- `packages/schemas/__tests__/provenance.test.ts`

### Do Not Modify
- Evidence schema

### Implementation Guidance
1. Define `ProvenanceAction` enum: `COLLECTED`, `STORED`, `ANALYZED`, `VERIFIED`, `MODIFIED`
2. Define `ProvenanceEntry` interface: id, evidence_id, action, actor, timestamp, details
3. Create Zod schemas

### AI Instructions
Ask AI to explain audit trail patterns.

### Tests
- Valid provenance passes validation
- Missing required fields fail

### Documentation
- Provenance chain format

### Acceptance Criteria
- [ ] Provenance types defined
- [ ] Validation works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-011 — Evidence Hashing

**Team:** Team 1 — Core + Evidence
**Objective:** Implement SHA-256 hashing for evidence integrity verification.
**Why:** Evidence must be tamper-evident. Hashing detects any modification.

**Primary Owner:** `jadhavsarthak374-ai`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `Dinesh-Kumar-Ved`

### Dependencies
T1-009

### Inputs
- Evidence schema

### Outputs
- `services/evidence/src/lib/hash.ts`
- Hash computation function
- Hash verification function
- Unit tests

### Allowed Files
- `services/evidence/src/lib/hash.ts`
- `services/evidence/src/__tests__/hash.test.ts`

### Do Not Modify
- Schema files

### Implementation Guidance
1. Implement `computeHash(content: string): string` using Node.js `crypto`
2. Implement `verifyHash(content: string, expectedHash: string): boolean`
3. Use SHA-256 with hex encoding
4. Canonical content representation (JSON.stringify with sorted keys)

### AI Instructions
Ask AI to explain Node.js crypto module and canonical JSON serialization.

### Tests
- Same content produces same hash
- Different content produces different hash
- Tampered content detected
- Empty content handled

### Documentation
- Hashing algorithm documentation

### Acceptance Criteria
- [ ] SHA-256 hashing works
- [ ] Verification detects tampering
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-012 — Evidence Metadata

**Team:** Team 1 — Core + Evidence
**Objective:** Define metadata structure for evidence items.
**Why:** Evidence needs context (source-specific data, collection parameters, etc.).

**Primary Owner:** `Dinesh-Kumar-Ved`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `jadhavsarthak374-ai`

### Dependencies
T1-009

### Inputs
- Evidence schema

### Outputs
- `packages/schemas/src/evidence-metadata.ts`
- Metadata types per evidence type
- Unit tests

### Allowed Files
- `packages/schemas/src/evidence-metadata.ts`
- `packages/schemas/__tests__/evidence-metadata.test.ts`

### Do Not Modify
- Evidence schema

### Implementation Guidance
1. Define base metadata interface
2. Define type-specific metadata (web page: URL, title; DNS: record_type; etc.)
3. Create Zod schemas for each

### AI Instructions
Ask AI to explain discriminated metadata patterns.

### Tests
- Valid metadata passes
- Type-specific fields validated

### Documentation
- Metadata field reference

### Acceptance Criteria
- [ ] Metadata types defined
- [ ] Per-type validation works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-013 — Audit Event Model

**Team:** Team 1 — Core + Evidence
**Objective:** Define audit event types for investigation action logging.
**Why:** All investigation actions must be logged for accountability and replay.

**Primary Owner:** `ANDY15K`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `Preetam-06`

### Dependencies
T1-003, T1-005

### Inputs
- Schema package, Investigation schema

### Outputs
- `packages/schemas/src/audit-event.ts`
- Audit event types
- Unit tests

### Allowed Files
- `packages/schemas/src/audit-event.ts`
- `packages/schemas/__tests__/audit-event.test.ts`

### Do Not Modify
- Investigation schema

### Implementation Guidance
1. Define `AuditAction` enum: `CREATED`, `UPDATED`, `STATE_CHANGED`, `EVIDENCE_ADDED`, `EVIDENCE_ANALYZED`, `FINDING_ADDED`
2. Define `AuditEvent` interface: id, investigation_id, action, actor, timestamp, details
3. Create Zod schemas

### AI Instructions
Ask AI to explain event sourcing patterns.

### Tests
- Valid audit event passes
- Missing required fields fail

### Documentation
- Audit event reference

### Acceptance Criteria
- [ ] Audit types defined
- [ ] Validation works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-014 — Investigation Lifecycle

**Team:** Team 1 — Core + Evidence
**Objective:** Implement the investigation state machine with valid transitions.
**Why:** Investigations must follow a controlled lifecycle.

**Primary Owner:** `ANDY15K`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `Preetam-06`

### Dependencies
T1-005

### Inputs
- Investigation schema

### Outputs
- `services/core/src/lib/state-machine.ts`
- State transition functions
- Unit tests

### Allowed Files
- `services/core/src/lib/state-machine.ts`
- `services/core/src/__tests__/state-machine.test.ts`

### Do Not Modify
- Schema files

### Implementation Guidance
1. Define transition map: DRAFT→PLANNING, PLANNING→COLLECTING, COLLECTING→ANALYZING, ANALYZING→VERIFYING, VERIFYING→COMPLETE
2. Implement `canTransition(from, to): boolean`
3. Implement `transition(investigation, to): Investigation`
4. Reject invalid transitions with clear error

### AI Instructions
Ask AI to explain finite state machine implementation in TypeScript.

### Tests
- All valid transitions work
- All invalid transitions rejected
- State persisted correctly

### Documentation
- State machine documentation

### Acceptance Criteria
- [ ] Valid transitions enforced
- [ ] Invalid transitions rejected
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-015 — Database/Prisma Foundation

**Team:** Team 1 — Core + Evidence
**Objective:** Set up PostgreSQL with Prisma ORM and create initial database schema.
**Why:** All services need a database foundation.

**Primary Owner:** `jadhavsarthak374-ai`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `ANDY15K`

### Dependencies
T1-001, T1-004, T1-005, T1-008, T1-009, T1-013

### Inputs
- All schema definitions

### Outputs
- `services/core/prisma/schema.prisma`
- Database connection configuration
- Initial migration
- Docker Compose with PostgreSQL

### Allowed Files
- `services/core/prisma/`
- `services/core/src/config/database.ts`
- `docker-compose.yml`

### Do Not Modify
- Schema package files

### Implementation Guidance
1. Create Prisma schema with all models: Case, Investigation, Objective, Evidence, Observation, AuditEvent
2. Set up Docker Compose with PostgreSQL 16
3. Configure connection pooling
4. Create initial migration
5. Add seed script

### AI Instructions
Ask AI to explain Prisma schema design and migration strategy.

### Tests
- Docker Compose starts PostgreSQL
- Prisma migration runs
- Connection works

### Documentation
- Database setup in DEVELOPMENT.md

### Acceptance Criteria
- [ ] `docker-compose up` starts PostgreSQL
- [ ] `prisma migrate dev` creates migration
- [ ] Application connects to database

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-016 — Core Service Structure

**Team:** Team 1 — Core + Evidence
**Objective:** Implement the service layer structure for Case, Investigation, and Objective.
**Why:** Services provide the business logic layer between API and database.

**Primary Owner:** `Preetam-06`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** Team lead

### Dependencies
T1-015

### Inputs
- Database foundation

### Outputs
- `services/core/src/services/case.service.ts`
- `services/core/src/services/investigation.service.ts`
- `services/core/src/services/objective.service.ts`
- Service interfaces

### Allowed Files
- `services/core/src/services/`

### Do Not Modify
- Database schema
- API routes (T1-017)

### Implementation Guidance
1. Define service interfaces
2. Implement CRUD operations for each entity
3. Use Prisma client for database access
4. Implement validation using Zod schemas
5. Handle errors consistently

### AI Instructions
Ask AI to explain service layer patterns and dependency injection.

### Tests
- Each service method works
- Validation enforced
- Errors handled

### Documentation
- Service API documentation

### Acceptance Criteria
- [ ] All services implemented
- [ ] CRUD operations work
- [ ] Validation enforced

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-017 — Core API

**Team:** Team 1 — Core + Evidence
**Objective:** Implement REST API endpoints for Case, Investigation, and Objective.
**Why:** APIs are how other teams and the frontend consume core services.

**Primary Owner:** `Preetam-06`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** Team lead

### Dependencies
T1-016

### Inputs
- Core services

### Outputs
- `services/core/src/routes/case.routes.ts`
- `services/core/src/routes/investigation.routes.ts`
- `services/core/src/routes/objective.routes.ts`
- `services/core/src/index.ts` (Express/Fastify app)

### Allowed Files
- `services/core/src/routes/`
- `services/core/src/index.ts`

### Do Not Modify
- Service files

### Implementation Guidance
1. Set up Express or Fastify
2. Implement REST endpoints:
   - Cases: GET /api/cases, GET /api/cases/:id, POST /api/cases, PATCH /api/cases/:id, DELETE /api/cases/:id
   - Investigations: GET /api/investigations, GET /api/investigations/:id, POST /api/investigations, PATCH /api/investigations/:id
   - Objectives: GET /api/objectives/:id, POST /api/objectives
3. Add error handling middleware
4. Add request validation middleware

### AI Instructions
Ask AI to explain REST API design best practices.

### Tests
- All endpoints respond correctly
- Validation errors return 400
- Not found returns 404

### Documentation
- API endpoint documentation

### Acceptance Criteria
- [ ] All endpoints work
- [ ] Error handling works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-018 — Evidence API

**Team:** Team 1 — Core + Evidence
**Objective:** Implement REST API endpoints for Evidence CRUD and provenance tracking.
**Why:** Evidence API is how connectors store data and other teams query evidence.

**Primary Owner:** `jadhavsarthak374-ai`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `Dinesh-Kumar-Ved`

### Dependencies
T1-016, T1-011

### Inputs
- Core services, hashing utility

### Outputs
- `services/evidence/src/routes/evidence.routes.ts`
- `services/evidence/src/services/evidence.service.ts`
- Evidence API endpoints

### Allowed Files
- `services/evidence/src/routes/`
- `services/evidence/src/services/`

### Do Not Modify
- Core service files

### Implementation Guidance
1. Implement Evidence CRUD endpoints
2. Add hash computation on evidence creation
3. Add provenance entry on each action
4. Implement evidence immutability (content cannot change after creation)

### AI Instructions
Ask AI to explain immutable data patterns.

### Tests
- Evidence created with hash
- Provenance chain maintained
- Content immutability enforced

### Documentation
- Evidence API documentation

### Acceptance Criteria
- [ ] Evidence stored with hash
- [ ] Provenance chain maintained
- [ ] Immutability enforced

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-019 — Validation/Error Handling

**Team:** Team 1 — Core + Evidence
**Objective:** Implement consistent validation and error handling across all services and APIs.
**Why:** Consistent error handling prevents bugs and improves developer experience.

**Primary Owner:** `Preetam-06`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** Team lead

### Dependencies
T1-017, T1-018

### Inputs
- All API endpoints

### Outputs
- `services/core/src/middleware/validation.ts`
- `services/core/src/middleware/error-handler.ts`
- Error response format
- Unit tests

### Allowed Files
- `services/core/src/middleware/`
- `services/core/src/__tests__/middleware/`

### Do Not Modify
- Route files

### Implementation Guidance
1. Define error response format: `{ error: { code, message, details? } }`
2. Implement Zod validation middleware
3. Implement global error handler
4. Handle Prisma errors consistently

### AI Instructions
Ask AI to explain Express error handling middleware patterns.

### Tests
- Validation errors return 400 with details
- Not found returns 404
- Server errors return 500

### Documentation
- Error format documentation

### Acceptance Criteria
- [ ] Consistent error format
- [ ] Validation middleware works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-020 — Unit Tests

**Team:** Team 1 — Core + Evidence
**Objective:** Write comprehensive unit tests for all core services and schemas.
**Why:** Tests ensure reliability and prevent regressions.

**Primary Owner:** `jadhavsarthak374-ai`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `ANDY15K`

### Dependencies
T1-016, T1-017, T1-018, T1-019

### Inputs
- All implemented services and APIs

### Outputs
- Unit test files for each service
- Test utilities and helpers
- Coverage report configuration

### Allowed Files
- `services/core/src/__tests__/`
- `services/evidence/src/__tests__/`
- `packages/schemas/__tests__/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Write tests for each service method
2. Write tests for each API endpoint
3. Write tests for schema validation
4. Configure coverage thresholds

### AI Instructions
Ask AI to explain testing patterns for the framework used.

### Tests
- All unit tests pass
- Coverage ≥ 80%

### Documentation
- Test setup documentation

### Acceptance Criteria
- [ ] All unit tests pass
- [ ] Coverage ≥ 80%

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-021 — Integration Tests

**Team:** Team 1 — Core + Evidence
**Objective:** Write integration tests for API endpoints with database.
**Why:** Integration tests verify end-to-end functionality.

**Primary Owner:** `ANDY15K`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** `jadhavsarthak374-ai`

### Dependencies
T1-020

### Inputs
- All implemented APIs

### Outputs
- Integration test files
- Test database configuration
- Test fixtures

### Allowed Files
- `tests/integration/core/`
- `tests/integration/evidence/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Set up test database (Docker)
2. Write API integration tests
3. Use test fixtures for consistent data
4. Clean up after each test

### AI Instructions
Ask AI to explain integration testing with Prisma and test databases.

### Tests
- All integration tests pass
- Database cleaned between tests

### Documentation
- Integration test setup guide

### Acceptance Criteria
- [ ] Integration tests pass
- [ ] Test database works

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`

---

## T1-022 — Documentation

**Team:** Team 1 — Core + Evidence
**Objective:** Write comprehensive documentation for all core services and schemas.
**Why:** Other teams need clear documentation to consume Team 1's APIs.

**Primary Owner:** `Preetam-06`
**Reviewer:** Head Intern (`Preetam-06`)
**Backup:** Team lead

### Dependencies
T1-021

### Inputs
- All implemented services and APIs

### Outputs
- API documentation
- Schema reference
- Database setup guide
- Service architecture docs

### Allowed Files
- `docs/api/`
- `docs/architecture/`
- `DEVELOPMENT.md`

### Do Not Modify
- Source files

### Implementation Guidance
1. Document all API endpoints with examples
2. Document all schema fields
3. Document database setup
4. Document service architecture

### AI Instructions
Ask AI to explain API documentation best practices.

### Tests
- Documentation is accurate
- Code examples work

### Documentation
- This IS the documentation task

### Acceptance Criteria
- [ ] All APIs documented
- [ ] All schemas documented
- [ ] Setup guide complete

### Definition of Done
- [ ] All checks pass
- [ ] Code committed
- [ ] PR to `team/1-core`
