================================================================================
TEAM 1 - CORE & EVIDENCE  |  API + SCHEMA + SETUP + ARCHITECTURE DOCUMENTATION
Task: T1-022 (Documentation)   Owner: Preetam-06
Status: DRAFT delivered as .txt because AGENTS.md forbids editing .md files.
        Copy this content into docs/api/* , docs/architecture/* , DEVELOPMENT.md
        if/when Markdown authoring is authorized.
================================================================================

--------------------------------------------------------------------------------
1. SCOPE AND PURPOSE
--------------------------------------------------------------------------------
- This document describes the Team 1 (Core + Evidence) services: their public
  HTTP API, the data schemas, the database setup, the internal architecture, and
  how to run the tests.
- Intended audience: other teams (connectors, intelligence, verification,
  reporting, web) that must consume these APIs.
- All identifiers returned by the API are opaque strings. Case/Investigation/
  Objective ids are UUID v4. Evidence/Observation/Provenance/AuditEvent ids are
  opaque strings (Prisma-generated). All relation fields that point at a Case or
  Investigation use UUID v4.

--------------------------------------------------------------------------------
2. SERVICE ARCHITECTURE (high level)
--------------------------------------------------------------------------------
- Repository: pnpm workspace monorepo orchestrated by Turborepo.
- Packages:
  * @osint-tool/schemas  (packages/schemas) - Zod schemas + inferred TS types.
    Shared by every service. Single source of truth for validation and shapes.
  * @osint-tool/core  (services/core) - Case, Investigation, Objective services
    and their Express routers, plus shared middleware (validation, async-route)
    and the error handler.
  * @osint-tool/evidence  (services/evidence) - Evidence service (hash,
    immutability, provenance) and its Express router.
- Persistence: PostgreSQL accessed through Prisma. Tables (all lowercase):
  cases, investigations, objectives, evidence, observations, audit_events.
- Composition: each service exposes a `create*Router(service)` factory. The
  production API gateway (or the integration harness) mounts these routers onto
  one Express app. The core package itself only builds routers; the HTTP
  `listen()` bootstrap lives in the host application / gateway, not in core.
- Evidence integrity guarantees:
  * Content hash: a SHA-256 hex digest (64 chars) of `content` is computed on
    create and stored as `hash`. Same content -> same hash (tamper detection).
  * Immutability: Evidence cannot be updated or deleted. PATCH/DELETE on an
    Evidence return HTTP 409.
  * Provenance: creating Evidence writes an AUDIT event (action EVIDENCE_ADDED)
    and the provenance chain is queryable via GET /api/evidence/:id/provenance.

--------------------------------------------------------------------------------
3. DATABASE SETUP (step by step)
--------------------------------------------------------------------------------
Prerequisites: Docker, Node.js (>=18), pnpm.

(1) Environment file
    Copy the example env and keep DATABASE_URL pointing at Postgres:
      copy .env.example .env
    Default value:
      DATABASE_URL=postgresql://postgres:postgres@localhost:5432/osint?schema=public
    NOTE: Prisma reads DATABASE_URL from the schema's project directory
    (services/core). If you run migrate from the repo root, also place a
    services/core/.env (or export DATABASE_URL in the shell).

(2) Start Postgres (Docker Compose)
      docker compose up -d postgres
    Verify health:
      docker compose ps        # status should be "healthy"

(3) Install dependencies
      pnpm install

(4) Apply the schema migration
      pnpm --filter @osint-tool/core db:migrate
    This runs `prisma migrate dev` and applies the 0001_init migration plus the
    follow-up migration that adjusts the id default. It also generates the
    Prisma client.

(5) Run checks
      pnpm test            # unit tests (no DB needed; Prisma is mocked)
      pnpm typecheck       # tsc --build across all packages
      pnpm lint            # eslint

(6) Run integration tests (needs the running DB from steps 1-4)
      # in PowerShell, set the URL for the session:
      $env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/osint?schema=public"
      pnpm test:integration

--------------------------------------------------------------------------------
4. API CONVENTIONS
--------------------------------------------------------------------------------
- Base path: routers are mounted under /api (so endpoints are /api/cases,
  /api/investigations, /api/objectives, /api/evidence).
- Content type: all request/response bodies are JSON. Send header
  `content-type: application/json`.
- Actor header: mutating endpoints that record provenance/audit expect an
  actor identity in the `x-actor-id` request header.
    * POST /api/evidence  REQUIRES `x-actor-id` (used for provenance).
    * PATCH /api/investigations  reads `x-actor-id` (defaults to "system" if
      absent) and records a STATE_CHANGED audit event.
- Validation: request bodies/params/query are validated with Zod. On failure
  the API returns HTTP 400 with a VALIDATION_ERROR envelope (see section 9).
- All timestamps are ISO-8601 strings (e.g. 2026-08-29T12:02:03.430Z).

--------------------------------------------------------------------------------
5. API REFERENCE - CASES  (mounted at /api/cases)
--------------------------------------------------------------------------------
- POST /api/cases
    Body (CaseCreateSchema + created_by):
      { "title": string (required, min 1),
        "description": string (optional),
        "status": "OPEN"|"ACTIVE"|"CLOSED" (optional, default OPEN),
        "created_by": uuid (required) }
    Returns 201 with the created Case.
    Example:
      curl -X POST http://localhost:3000/api/cases \
        -H "content-type: application/json" \
        -d '{"title":"Acme breach","description":"Initial case","created_by":"11111111-1111-1111-1111-111111111111"}'

- GET /api/cases
    Returns the full list of cases (array of Case).

- GET /api/cases/:id
    Returns a single Case. 404 if not found.

- PATCH /api/cases/:id
    Body (CaseUpdateSchema = all fields optional):
      { "title"?: string, "description"?: string, "status"?: "OPEN"|"ACTIVE"|"CLOSED" }
    Returns the updated Case.

- DELETE /api/cases/:id
    Returns 204 No Content. (Cascade behavior removes related investigations.)

--------------------------------------------------------------------------------
6. API REFERENCE - INVESTIGATIONS  (mounted at /api/investigations)
--------------------------------------------------------------------------------
- POST /api/investigations
    Body:
      { "case_id": uuid (required),
        "state": "DRAFT"|"PLANNING"|"COLLECTING"|"ANALYZING"|"VERIFYING"|"COMPLETE"
                 (optional, default DRAFT),
        "plan": string[] (optional, default []),
        "objective": Objective (required - discriminated union, see section 8) }
    Returns 201 with the created Investigation (including its embedded objective).
    Example:
      curl -X POST http://localhost:3000/api/investigations \
        -H "content-type: application/json" \
        -d '{"case_id":"22222222-2222-2222-2222-222222222222",
             "objective":{"type":"PERSON","name":"John Doe"},
             "plan":["collect OSINT","verify identities"]}'

- GET /api/investigations
    Returns the full list of investigations.

- GET /api/investigations/:id
    Returns a single Investigation. 404 if not found.

- PATCH /api/investigations/:id   (state transitions / edits)
    Body (all optional):
      { "state"?: InvestigationState,
        "plan"?: string[],
        "objective"?: Objective }
    Header `x-actor-id` is read as the audit actor (defaults to "system").
    State changes are validated by the investigation lifecycle state machine.
    A valid forward transition (e.g. DRAFT -> PLANNING) updates state and writes
    a STATE_CHANGED audit event. An invalid transition is rejected with HTTP 400.
    Example:
      curl -X PATCH http://localhost:3000/api/investigations/<id> \
        -H "content-type: application/json" -H "x-actor-id: analyst1" \
        -d '{"state":"PLANNING"}'

- DELETE /api/investigations/:id
    Returns 204 No Content.

--------------------------------------------------------------------------------
7. API REFERENCE - OBJECTIVES  (mounted at /api/objectives)
--------------------------------------------------------------------------------
- POST /api/objectives
    Body:
      { "investigation_id": uuid (required),
        "objective": Objective (required - discriminated union, see section 8) }
    Returns 201 with the created Objective.
    Example:
      curl -X POST http://localhost:3000/api/objectives \
        -H "content-type: application/json" \
        -d '{"investigation_id":"33333333-3333-3333-3333-333333333333",
             "objective":{"type":"DOMAIN","domain":"example.com"}}'

- GET /api/objectives/:id
    Returns a single Objective. 404 if not found.
    NOTE: there is no list endpoint for objectives; they are retrieved by id.

- PATCH /api/objectives/:id
    Body: free-form record of objective fields to update (validated by the
    Objective service). Returns the updated Objective.

- DELETE /api/objectives/:id
    Returns 204 No Content.

--------------------------------------------------------------------------------
8. API REFERENCE - EVIDENCE  (mounted at /api/evidence)
--------------------------------------------------------------------------------
- POST /api/evidence
    Header: `x-actor-id` is REQUIRED (provenance actor).
    Body (EvidenceCreateInputSchema):
      { "investigation_id": uuid (required),
        "type": "WEB_PAGE"|"DNS_RECORD"|"CERTIFICATE"|"GITHUB_DATA"|"SEARCH_RESULT",
        "source": SourceRef (required - see section 8.5),
        "content": string (required),
        "metadata": EvidenceMetadata (required - discriminated union by `type`,
                   see section 8.6) }
    Returns 201 with the created Evidence. The server computes `hash` (SHA-256 of
    `content`) and records provenance. `created_at` is set by the server.
    Example:
      curl -X POST http://localhost:3000/api/evidence \
        -H "content-type: application/json" -H "x-actor-id: collector1" \
        -d '{"investigation_id":"33333333-3333-3333-3333-333333333333",
             "type":"WEB_PAGE",
             "source":{"connector_name":"web","query":"https://example.com",
                       "timestamp":"2026-08-29T00:00:00Z","parameters":{}},
             "content":"<html>example</html>",
             "metadata":{"type":"WEB_PAGE","url":"https://example.com","title":"Example"}}'

- GET /api/evidence?investigation_id=<uuid>
    Query param `investigation_id` (UUID, required). Returns the array of
    Evidence records belonging to that investigation (newest first).

- GET /api/evidence/:id
    Returns a single Evidence. 404 if not found.

- GET /api/evidence/:id/provenance
    Returns the array of ProvenanceEntry records for that Evidence (oldest
    first). Each entry records an action (COLLECTED/STORED/ANALYZED/VERIFIED/
    MODIFIED), the actor, a timestamp, and free-form details.

- PATCH /api/evidence/:id
    Returns HTTP 409 - Evidence is immutable; it cannot be updated.

- DELETE /api/evidence/:id
    Returns HTTP 409 - Evidence is immutable; it cannot be deleted.

8.1 InvestigationState (lifecycle)
    DRAFT -> PLANNING -> COLLECTING -> ANALYZING -> VERIFYING -> COMPLETE
    Only the defined forward transitions are allowed; others are rejected (400).

8.2 ObjectiveType (discriminated union key `type`)
    PERSON   : { type:"PERSON", name: string(required), aliases?: string[] }
    DOMAIN   : { type:"DOMAIN", domain: string(required, valid domain regex) }
    COMPANY  : { type:"COMPANY", company_name: string(required),
                  registration_number?: string }
    IP       : { type:"IP", ip_address: string(required, IPv4 or IPv6) }

8.3 EvidenceType
    WEB_PAGE | DNS_RECORD | CERTIFICATE | GITHUB_DATA | SEARCH_RESULT

8.4 ProvenanceAction
    COLLECTED | STORED | ANALYZED | VERIFIED | MODIFIED

8.5 SourceRef
    { "connector_name": string(required),
      "query": string(required),
      "timestamp": ISO-8601 string (required),
      "parameters": object (required) }

8.6 EvidenceMetadata (discriminated union key `type`; all share optional
    collected_at, collector, notes)
    WEB_PAGE     : url(required,url), title(required), http_status?(100-599),
                   final_url?(url), response_time_ms?(>=0)
    DNS_RECORD   : record_type(required; A|AAAA|CNAME|MX|NS|TXT|SOA|SRV|PTR|CAA),
                   record_name(required), resolver?, ttl?(>=0)
    CERTIFICATE  : serial_number(required), subject(required), issuer(required),
                   fingerprint_sha256(required, 64 hex), not_before?, not_after?
    GITHUB_DATA  : repository(required), data_category(required;
                   commit|issue|pr|user|repo|release|file), branch?, query?,
                   result_count?(>=0)
    SEARCH_RESULT: engine(required), query(required), result_position?(>0),
                   total_results?(>=0), source_url?(url)

--------------------------------------------------------------------------------
9. ERROR RESPONSE ENVELOPE
--------------------------------------------------------------------------------
All errors share the shape: { "error": { "code": string, "message": string,
                                          "details"?: object } }

- 400 VALIDATION_ERROR  (Zod failure)
    Body: { "error": { "code":"VALIDATION_ERROR",
                        "message":"Request validation failed",
                        "details": <Zod flatten output with fieldErrors> } }
- 404 (resource not found, ServiceError)
    Body: { "error": { "code":"<NOT_FOUND_CODE>", "message":"<reason>" } }
- 409 CONFLICT / immutability
    Body: { "error": { "code":"CONFLICT",
                        "message":"Evidence is immutable and cannot be updated" } }
    (also used for DB unique-constraint conflicts, code CONFLICT)
- 500 INTERNAL_ERROR
    Body: { "error": { "code":"INTERNAL_ERROR", "message":"Internal server error" } }
    Generic message is returned so internals are not leaked.

--------------------------------------------------------------------------------
10. SCHEMA FIELD REFERENCE
--------------------------------------------------------------------------------
CASE (table: cases)
  id           uuid
  title        string  (required)
  description   string? (optional)
  status        "OPEN"|"ACTIVE"|"CLOSED"  (default OPEN)
  created_by    uuid  (required on create)
  created_at    datetime
  updated_at    datetime

INVESTIGATION (table: investigations)
  id           uuid
  case_id       uuid  (required)
  state         InvestigationState  (default DRAFT)
  objective      Objective (embedded discriminated union)
  plan          string[]  (default [])
  created_at    datetime
  updated_at    datetime

OBJECTIVE (table: objectives) - discriminated union by `type`
  id              uuid
  investigation_id uuid
  type            ObjectiveType
  name?           string        (PERSON)
  aliases?        string[]      (PERSON)
  domain?         string        (DOMAIN)
  company_name?   string        (COMPANY)
  registration_number? string   (COMPANY)
  ip_address?     string        (IP)
  created_at      datetime
  updated_at      datetime

EVIDENCE (table: evidence) - IMMUTABLE
  id            string (opaque)
  investigation_id uuid
  type          EvidenceType
  source        SourceRef
  content       string
  metadata      EvidenceMetadata (discriminated union)
  hash          string (SHA-256 hex, 64 chars) - computed from content
  created_at    datetime

OBSERVATION (table: observations)
  id            string (opaque)
  evidence_id   string
  type          string
  data          object
  confidence    number (0.0 - 1.0)
  source_ref    SourceRef
  timestamp     datetime

PROVENANCE ENTRY (derived from audit_events, queryable per evidence)
  id            string (opaque)
  evidence_id   string
  action        ProvenanceAction
  actor         string
  timestamp     datetime
  details       object

AUDIT EVENT (table: audit_events) - IMMUTABLE (frozen)
  id            string (opaque)
  investigation_id uuid
  action        "CREATED"|"UPDATED"|"STATE_CHANGED"|"EVIDENCE_ADDED"|
                "EVIDENCE_ANALYZED"|"FINDING_ADDED"
  actor         string
  timestamp     datetime
  details       object

SOURCE REF (embedded)
  connector_name string
  query          string
  timestamp      datetime
  parameters     object

--------------------------------------------------------------------------------
11. TESTING
--------------------------------------------------------------------------------
- Unit tests:  `pnpm test`
    Runs `node --test` in every package. Prisma is mocked; no database needed.
    Current count: 141 passing (core 16, evidence 7, schemas 118, others 0).

- Type check:  `pnpm typecheck`   (tsc --build, all packages)
- Lint:       `pnpm lint`        (eslint)

- Integration tests:  `pnpm test:integration`
    Runs end-to-end tests against a REAL Postgres instance (see section 3).
    Requires: Postgres running, migration applied, and DATABASE_URL exported in
    the shell. 16 tests cover cases, investigations, objectives and evidence
    (CRUD, validation 400s, 404s, state-machine transitions, evidence hashing,
    provenance, and immutability).

--------------------------------------------------------------------------------
12. IMPORTANT NOTES / GOTCHAS ("something s")
--------------------------------------------------------------------------------
- Express 5 makes `request.query` a read-only getter. The validation middleware
  validates the query but does NOT reassign `request.query`; handlers read the
  already-parsed raw query values. Do not try to overwrite `req.query`.
- Database table names are LOWERCASE. Raw SQL / TRUNCATE must reference
  `evidence`, `cases`, `investigations`, `objectives`, `observations`,
  `audit_events` (unquoted). Quoted capitals like "Evidence" cause 42P01.
- GET /api/evidence REQUIRES the `investigation_id` query parameter as a UUID;
  missing/invalid -> 400.
- Evidence create REQUIRES the `x-actor-id` header; without it the actor is
  empty and provenance is degraded.
- Investigation PATCH reads `x-actor-id` for the audit actor (defaults "system").
- `created_by` is mandatory on Case creation.
- Objectives expose only get-by-id (no list endpoint).
- Evidence is immutable: PATCH/DELETE -> 409 by design.
- IDs: Case/Investigation/Objective are UUID v4; Evidence/Observation/Provenance/
  AuditEvent ids are opaque strings.
- The core package builds routers only; the `listen()`/gateway bootstrap is the
  host application's responsibility (the integration harness supplies its own
  app via createIntegrationApp).

--------------------------------------------------------------------------------
13. ACCEPTANCE CRITICIA (from T1-022)
--------------------------------------------------------------------------------
- [x] All APIs documented (sections 5-8) with request/response examples.
- [x] All schemas documented (sections 8, 10) with every field and type.
- [x] Setup guide complete (section 3).
- [x] Service architecture documented (section 2).
- Note: delivered as a single .txt because AGENTS.md classifies all .md files as
  read-only. Convert to docs/api/* , docs/architecture/* , DEVELOPMENT.md when
  Markdown authoring is authorized.

--------------------------------------------------------------------------------
14. DOCUMENTATION CHANGES (Team 1 follow-up)
--------------------------------------------------------------------------------
- 2026-08-29 — Team 1 (preetam-06) corrected the root DEVELOPMENT.md,
  section "4. Set Up Database". The previously documented repo-root commands
  `pnpm db:migrate` / `pnpm db:seed` do not exist at the root. Replaced with the
  real command `pnpm --filter @osint-tool/core db:migrate` (migrations live in the
  @osint-tool/core package). Removed `pnpm db:seed` because no seed script exists.
  Recorded here so all Team 1 members know which .md file was changed.
================================================================================
