# Individual Intern Assignments

**Repository:** Redkrossresearch/OSINT_Tool
**Updated:** 26 August 2026
**Purpose:** One section per intern — primary tasks, secondary tasks, review responsibilities, dependencies, definition of done.

Each intern also has a dedicated file under `docs/assignments/<github-username>.md` with full dependency-aware detail.

---

## Preetam-06 — Team 1 (team-core)

- **Role:** Head Intern / Team Maintainer
- **Primary:** T1-001 (Repo/Monorepo Foundation), T1-002 (Workspace Config), T1-016 (Core Service Structure), T1-017 (Core API), T1-019 (Validation/Error Handling), T1-022 (Documentation)
- **Secondary:** T1-003 (review/backup)
- **Review responsibilities:** All Team 1 PRs
- **Dependencies:** T1-002←T1-001; T1-016←T1-015; T1-017←T1-016; T1-019←T1-017+T1-018; T1-022←T1-021
- **Definition of done:** pnpm monorepo builds/lints; core API endpoints work; validation middleware; docs complete

## Dinesh-Kumar-Ved — Team 1

- **Role:** Intern
- **Primary:** T1-003 (Shared Zod Schema Package), T1-004 (Case Schema), T1-006 (Objective Schema), T1-012 (Evidence Metadata)
- **Secondary:** T1-011 (backup)
- **Review responsibilities:** T1-003 is cross-team contract; review schema PRs
- **Dependencies:** T1-003←T1-002; T1-004/006←T1-003; T1-012←T1-009
- **Definition of done:** schema package builds; all schema types validated; tests pass

## Zrahul2024 — Team 1

- **Role:** Intern
- **Primary:** T1-007 (Source Schema), T1-008 (Observation Schema), T1-010 (Evidence Provenance Model)
- **Secondary:** —
- **Review responsibilities:** —
- **Dependencies:** T1-007←T1-003; T1-008←T1-003+T1-007; T1-010←T1-003
- **Definition of done:** observation schema is the cross-team contract for Teams 2 & 3; validated + tested

## jadhavsarthak374-ai — Team 1

- **Role:** Intern
- **Primary:** T1-009 (Evidence Schema), T1-011 (Evidence Hashing), T1-015 (Database/Prisma Foundation), T1-018 (Evidence API), T1-020 (Unit Tests)
- **Secondary:** T1-012 (backup)
- **Review responsibilities:** —
- **Dependencies:** T1-011←T1-009; T1-015←{T1-001,T1-004,T1-005,T1-008,T1-009,T1-013}; T1-018←T1-016+T1-011; T1-020←{T1-016..T1-019}
- **Definition of done:** Prisma DB foundation connects; SHA-256 hashing works; evidence API stores immutably; unit tests ≥80%

## ANDY15K — Team 1

- **Role:** Intern
- **Primary:** T1-005 (Investigation Schema), T1-013 (Audit Event Model), T1-014 (Investigation Lifecycle), T1-021 (Integration Tests)
- **Secondary:** T1-020 (backup)
- **Review responsibilities:** —
- **Dependencies:** T1-005←T1-003+T1-004; T1-013←T1-003+T1-005; T1-014←T1-005; T1-021←T1-020
- **Definition of done:** state machine enforces transitions; audit trail; integration tests pass

## riddhisawant305-jpg — Team 2 (team-connectors)

- **Role:** Head Intern / Team Maintainer
- **Primary:** T2-001 (Connector Interface), T2-002 (Connector Result Contract), T2-013 (Connector Health), T2-014 (Connector Logging), T2-015 (Security Validation), T2-018 (Documentation)
- **Secondary:** —
- **Review responsibilities:** All Team 2 PRs
- **Dependencies:** T2-001←T1-008; T2-002←T2-001+T1-008; T2-013←T2-003; T2-014/015←T2-001; T2-018←T2-017
- **Definition of done:** connector framework with timeout/retry/rate-limit; SSRF protection; health checks; docs

## yadavchinmay45-cloud — Team 2

- **Role:** Intern
- **Primary:** T2-005 (Public Web Connector), T2-006 (Public Search Connector), T2-017 (Integration Tests)
- **Secondary:** —
- **Review responsibilities:** —
- **Dependencies:** T2-005/006←T2-001+T1-008; T2-017←T2-016
- **Definition of done:** web + search connectors fetch safely with SSRF/rate-limit; integration tests pass

## AaryanDhotre2326 — Team 2

- **Role:** Intern
- **Primary:** T2-007 (DNS/RDAP Connector), T2-008 (Certificate Intelligence Connector)
- **Secondary:** T2-017 (backup)
- **Review responsibilities:** —
- **Dependencies:** T2-007/008←T2-001+T1-008
- **Definition of done:** DNS/RDAP + CT-log connectors return valid data with rate limiting; no API key required

## antarahire22-creator — Team 2

- **Role:** Intern
- **Primary:** T2-009 (GitHub Public Connector), T2-010 (Normalization Pipeline)
- **Secondary:** T2-016 (backup)
- **Review responsibilities:** —
- **Dependencies:** T2-009/010←T2-001+T1-008
- **Definition of done:** GitHub public connector + normalization produce valid Observations with confidence

## darshankamble0628-coder — Team 2

- **Role:** Intern
- **Primary:** T2-003 (Connector Registry), T2-004 (Connector Configuration), T2-011 (Rate Limiting), T2-012 (Timeout/Retry), T2-016 (Unit Tests)
- **Secondary:** T2-015 (backup)
- **Review responsibilities:** —
- **Dependencies:** T2-003/004/011/012←T2-001; T2-016←T2-005..T2-015
- **Definition of done:** registry/discovery works; rate limits + retries enforced; unit tests ≥80%

## hirveabhishek2006-design — Team 3 (team-intelligence)

- **Role:** Head Intern / Team Maintainer
- **Primary:** T3-001 (Entity Schema), T3-002 (Entity Normalization), T3-018 (Documentation)
- **Secondary:** —
- **Review responsibilities:** All Team 3 PRs
- **Dependencies:** T3-001←T1-003; T3-002←T3-001; T3-018←T3-017
- **Definition of done:** entity types defined; normalization canonical; docs complete

## katkarsujal1-design — Team 3

- **Role:** Intern
- **Primary:** T3-003 (Entity Extraction), T3-004 (Entity Confidence), T3-015 (Resolution Tests)
- **Secondary:** T3-002 (backup)
- **Review responsibilities:** —
- **Dependencies:** T3-003←T3-001+T1-008; T3-004←T3-001; T3-015←T3-005
- **Definition of done:** extraction with confidence bounds; resolution tests cover edge cases

## raunaksin9890-gif — Team 3

- **Role:** Intern
- **Primary:** T3-005 (Entity Resolution), T3-006 (Relationship Schema)
- **Secondary:** T3-015 (backup)
- **Review responsibilities:** —
- **Dependencies:** T3-005←T3-003+T3-004; T3-006←T3-001
- **Definition of done:** resolution merges logged, confidence-driven; relationship types defined

## Pannkajyadhav333 — Team 3

- **Role:** Intern
- **Primary:** T3-007 (Relationship Extraction), T3-008 (Graph Schema), T3-012 (Temporal Relationships), T3-016 (Graph Tests), T3-017 (Integration Tests)
- **Secondary:** —
- **Review responsibilities:** —
- **Dependencies:** T3-007←T3-001+T3-006+T1-008; T3-008←T1-015+T3-001+T3-006; T3-012←T3-008; T3-016←T3-010+T3-011; T3-017←T3-003..T3-014
- **Definition of done:** graph schema + migrations; temporal fields; graph + integration tests pass

## parthvichare20 — Team 3

- **Role:** Intern
- **Primary:** T3-009 (Graph Storage), T3-010 (Graph Queries), T3-011 (Graph API), T3-013 (Investigation Timeline), T3-014 (Entity API)
- **Secondary:** T3-016 (backup)
- **Review responsibilities:** —
- **Dependencies:** T3-009←T3-008; T3-010←T3-009; T3-011←T3-010; T3-013←T3-009+T1-013; T3-014←T3-009
- **Definition of done:** graph CRUD, traversal queries, REST API, timeline, entity API all functional

## lahanesakshi-create — Team 3 (username corrected from `lahanesakahi-create`)

- **Role:** Intern
- **Primary:** T3-015 (Resolution Tests), T3-016 (Graph Tests)
- **Secondary:** T3-018 (backup)
- **Review responsibilities:** —
- **Dependencies:** T3-015←T3-005; T3-016←T3-010+T3-011
- **Definition of done:** resolution + graph tests cover edge cases and pass

## sumeetmore334-rgb — Team 4 (team-ai-verification)

- **Role:** Head Intern / Team Maintainer (pending org invite)
- **Primary:** T4-001 (Model Abstraction), T4-002 (Ollama Provider), T4-016 (AI Safety Controls), T4-020 (Documentation)
- **Secondary:** —
- **Review responsibilities:** All Team 4 PRs
- **Dependencies:** T4-001←T1-003; T4-002←T4-001; T4-016←T4-001; T4-020←T4-019
- **Definition of done:** provider abstraction + Ollama; safety bounding enforced; docs complete

## anujmore2006-collab — Team 4

- **Role:** Intern
- **Primary:** T4-003 (Model Configuration), T4-004 (Model Fallback), T4-005 (Prompt System), T4-017 (Evaluation Dataset), T4-018 (Evaluation Tests)
- **Secondary:** —
- **Review responsibilities:** —
- **Dependencies:** T4-003←T4-001; T4-004←T4-001+T4-003; T4-005←T4-001; T4-017←T4-003+T4-005; T4-018←{T4-007,T4-008,T4-009,T4-010,T4-017}
- **Definition of done:** config, no-paid fallback, prompts, evaluation fixtures + tests

## Akash-Upade — Team 4

- **Role:** Intern
- **Primary:** T4-006 (Structured AI Output), T4-007 (Investigation Planner), T4-008 (Evidence Analysis), T4-009 (Correlation Engine)
- **Secondary:** T4-018 (backup)
- **Review responsibilities:** —
- **Dependencies:** T4-006←T4-001; T4-007←T4-001+T1-005; T4-008←T4-001+T1-009; T4-009←T4-001+T4-008
- **Definition of done:** JSON parsing, planner/analysis/correlation agents, all bounded

## shraddhamahindrakar217-cloud — Team 4

- **Role:** Intern
- **Primary:** T4-010 (Contradiction Detection), T4-011 (Verification Engine), T4-012 (Confidence Calculation), T4-013 (Human-Review State), T4-014 (AI Audit Logging), T4-015 (Prompt Injection Defenses), T4-019 (Integration Tests)
- **Secondary:** —
- **Review responsibilities:** —
- **Dependencies:** T4-010←T4-001+T1-009; T4-011←T4-010; T4-012←T4-001; T4-013←T4-011; T4-014←T4-001+T1-015; T4-015←T4-001; T4-019←T4-018
- **Definition of done:** verification workflow, contradiction detection, confidence, human-review states, audit log, injection defenses, integration tests

## Ishauparkar13 — Team 5 (team-product)

- **Role:** Head Intern / Team Maintainer
- **Primary:** T5-001 (Next.js Application), T5-002 (Application Layout), T5-019 (Documentation)
- **Secondary:** —
- **Review responsibilities:** All Team 5 PRs
- **Dependencies:** T5-001←T1-003; T5-002←T5-001; T5-019←T5-018
- **Definition of done:** Next.js app + layout; docs complete

## aryanbhosale20 — Team 5

- **Role:** Intern
- **Primary:** T5-003 (Dashboard), T5-004 (Case Creation), T5-005 (Investigation Creation)
- **Secondary:** T5-015 (backup)
- **Review responsibilities:** —
- **Dependencies:** T5-003/004←T5-002+T1-017; T5-005←T5-002+T1-017+T1-005
- **Definition of done:** dashboard, case form, investigation form functional with loading/error states

## dakshjadyar — Team 5

- **Role:** Intern
- **Primary:** T5-006 (Investigation Status), T5-007 (Evidence Viewer), T5-015 (Error/Loading States), T5-016 (Accessibility)
- **Secondary:** —
- **Review responsibilities:** —
- **Dependencies:** T5-006←T5-002+T1-017; T5-007←T5-002+T1-018; T5-015/016←T5-002
- **Definition of done:** status + evidence views; error/loading/empty states; accessibility audit passes

## Deepkasare — Team 5

- **Role:** Intern
- **Primary:** T5-008 (Entity Viewer), T5-009 (Graph View), T5-010 (Timeline), T5-017 (E2E Tests)
- **Secondary:** T5-016 (backup)
- **Review responsibilities:** —
- **Dependencies:** T5-008←T5-002+T3-014; T5-009←T5-002+T3-011; T5-010←T5-002+T3-013; T5-017←T5-002..T5-016
- **Definition of done:** entity/graph/timeline views; E2E tests deterministic in CI

## krishnasondigala-sys — Team 5

- **Role:** Intern
- **Primary:** T5-011 (Findings View), T5-012 (Verification View), T5-013 (Report Generation), T5-014 (Report Export), T5-018 (Product Integration Tests)
- **Secondary:** —
- **Review responsibilities:** —
- **Dependencies:** T5-011←T5-002+T4-011; T5-012←T5-011+T4-013; T5-013←{T5-002,T1-018,T3-014,T4-011}; T5-014←T5-013; T5-018←T5-017
- **Definition of done:** findings + verification UI; report generation/export; integration tests

## khushishukla3008-star — Team 5 (username corrected from `khushishukla3008`)

- **Role:** Intern
- **Primary:** T5-015 (Error/Loading States), T5-016 (Accessibility)
- **Secondary:** T5-019 (backup)
- **Review responsibilities:** —
- **Dependencies:** T5-015/016←T5-002
- **Definition of done:** error/loading/empty states; accessibility passes; (independent of backend — can start once layout is ready)
