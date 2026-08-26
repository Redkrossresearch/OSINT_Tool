# 📋 DAILY EXECUTION BOARD

**Last Updated:** 2026-08-26
**Purpose:** Answer the question — *"What should I work on today?"*

## How to Use This Board

1. Find your name in your team's board
2. Look at your assigned task's **Status**
3. If status is `NOT STARTED` and all dependencies are `COMPLETE` → **start working**
4. If status is `BLOCKED` or dependencies are not `COMPLETE` → check the **Backup Task** column
5. If all your tasks are blocked → go to the **"What Can I Work On If Blocked?"** section
6. Update your task status as you progress

---

## STATUS LEGEND

| Status | Meaning |
|---|---|
| `NOT STARTED` | Task has not been begun |
| `IN PROGRESS` | Someone is actively working on this task |
| `BLOCKED` | Cannot start — a dependency is incomplete or an issue exists |
| `COMPLETE` | Task is fully done and verified |
| `READY` | All dependencies met, task can be started immediately |

---

## 🏗️ TEAM 1 — Core/Platform Foundation

| Task ID | Title | Owner | Status | Dependency | Expected Output | Blocker | Backup Task | Next Task(s) |
|---|---|---|---|---|---|---|---|---|
| T1-001 | Repository/Monorepo Foundation | Preetam-06 | `NOT STARTED` | None | Monorepo structure, CI/CD, shared config | — | None | T1-002 |
| T1-002 | Workspace/Package Configuration | Preetam-06 | `NOT STARTED` | T1-001 | Workspace configs, package.json files | — | None | T1-003 |
| T1-003 | Shared Zod Schema Package | Dinesh-Kumar-Ved | `NOT STARTED` | T1-002 | Shared Zod schemas package | — | Preetam-06 | T1-004, T1-006, T1-007, T1-010, T3-001, T4-001, T5-001 |
| T1-004 | Case Schema | Dinesh-Kumar-Ved | `NOT STARTED` | T1-003 | Case Zod schema | — | Preetam-06 | T1-005 |
| T1-005 | Investigation Schema | ANDY15K | `NOT STARTED` | T1-003, T1-004 | Investigation Zod schema | — | Preetam-06 | T1-013, T1-014, T4-007, T5-005 |
| T1-006 | Objective Schema | Dinesh-Kumar-Ved | `NOT STARTED` | T1-003 | Objective Zod schema | — | Preetam-06 | None |
| T1-007 | Source Schema | Zrahul2024 | `NOT STARTED` | T1-003 | Source Zod schema | — | Preetam-06 | T1-008, T1-009 |
| T1-008 | Observation Schema | Zrahul2024 | `NOT STARTED` | T1-003, T1-007 | Observation Zod schema | — | Preetam-06 | T2-001, T2-005–T2-010, T3-003, T3-007 |
| T1-009 | Evidence Schema | jadhavsarthak374-ai | `NOT STARTED` | T1-003, T1-007 | Evidence Zod schema | — | Preetam-06 | T1-011, T1-012, T1-015, T4-008, T4-010 |
| T1-010 | Evidence Provenance Model | Zrahul2024 | `NOT STARTED` | T1-003 | Provenance tracking model | — | Preetam-06 | None |
| T1-011 | Evidence Hashing | jadhavsarthak374-ai | `NOT STARTED` | T1-009 | Hashing utilities for evidence | — | Dinesh-Kumar-Ved | T1-018 |
| T1-012 | Evidence Metadata | Dinesh-Kumar-Ved | `NOT STARTED` | T1-009 | Evidence metadata handling | — | jadhavsarthak374-ai | None |
| T1-013 | Audit Event Model | ANDY15K | `NOT STARTED` | T1-003, T1-005 | Audit event Zod schema | — | Preetam-06 | T1-015, T3-013 |
| T1-014 | Investigation Lifecycle | ANDY15K | `NOT STARTED` | T1-005 | Lifecycle state machine | — | Preetam-06 | None |
| T1-015 | Database/Prisma Foundation | jadhavsarthak374-ai | `NOT STARTED` | T1-001, T1-004, T1-005, T1-008, T1-009, T1-013 | Prisma schema, migrations, DB setup | — | ANDY15K | T1-016, T3-008, T4-014 |
| T1-016 | Core Service Structure | Preetam-06 | `NOT STARTED` | T1-015 | Service layer architecture | — | Team lead | T1-017, T1-018 |
| T1-017 | Core API | Preetam-06 | `NOT STARTED` | T1-016 | REST/GraphQL API endpoints | — | Team lead | T1-019, T5-003, T5-004, T5-005, T5-006 |
| T1-018 | Evidence API | jadhavsarthak374-ai | `NOT STARTED` | T1-016, T1-011 | Evidence-specific API endpoints | — | Preetam-06 | T1-019, T5-007, T5-013 |
| T1-019 | Validation/Error Handling | Preetam-06 | `NOT STARTED` | T1-017, T1-018 | Validation middleware, error formats | — | Team lead | T1-020 |
| T1-020 | Unit Tests | jadhavsarthak374-ai | `NOT STARTED` | T1-016, T1-017, T1-018, T1-019 | Unit test suite for core services | — | ANDY15K | T1-021 |
| T1-021 | Integration Tests | ANDY15K | `NOT STARTED` | T1-020 | Integration test suite | — | jadhavsarthak374-ai | T1-022 |
| T1-022 | Documentation | Preetam-06 | `NOT STARTED` | T1-021 | Platform documentation | — | Team lead | None |

---

## 🔌 TEAM 2 — Connectors

| Task ID | Title | Owner | Status | Dependency | Expected Output | Blocker | Backup Task | Next Task(s) |
|---|---|---|---|---|---|---|---|---|
| T2-001 | Connector Interface | riddhisawant305-jpg | `NOT STARTED` | T1-008 | Base connector interface/class | — | Team lead | T2-002–T2-015 |
| T2-002 | Connector Result Contract | riddhisawant305-jpg | `NOT STARTED` | T2-001, T1-008 | Standardized result types | — | Team lead | None |
| T2-003 | Connector Registry | darshankamble0628-coder | `NOT STARTED` | T2-001 | Registry for managing connectors | — | riddhisawant305-jpg | T2-013 |
| T2-004 | Connector Configuration | darshankamble0628-coder | `NOT STARTED` | T2-001 | Connector config management | — | riddhisawant305-jpg | None |
| T2-005 | Public Web Connector | yadavchinmay45-cloud | `NOT STARTED` | T2-001, T1-008 | Web scraping connector | — | riddhisawant305-jpg | T2-016 |
| T2-006 | Public Search Connector | yadavchinmay45-cloud | `NOT STARTED` | T2-001, T1-008 | Search engine connector | — | riddhisawant305-jpg | T2-016 |
| T2-007 | DNS/RDAP Connector | AaryanDhotre2326 | `NOT STARTED` | T2-001, T1-008 | DNS/RDAP lookup connector | — | riddhisawant305-jpg | T2-016 |
| T2-008 | Certificate Intelligence Connector | AaryanDhotre2326 | `NOT STARTED` | T2-001, T1-008 | Certificate transparency connector | — | riddhisawant305-jpg | T2-016 |
| T2-009 | GitHub Public Connector | antarahire22-creator | `NOT STARTED` | T2-001, T1-008 | GitHub public data connector | — | riddhisawant305-jpg | T2-016 |
| T2-010 | Normalization Pipeline | antarahire22-creator | `NOT STARTED` | T2-001, T1-008 | Data normalization pipeline | — | riddhisawant305-jpg | T2-016 |
| T2-011 | Rate Limiting | darshankamble0628-coder | `NOT STARTED` | T2-001 | Rate limiting middleware | — | riddhisawant305-jpg | T2-016 |
| T2-012 | Timeout/Retry Handling | darshankamble0628-coder | `NOT STARTED` | T2-001 | Timeout and retry logic | — | riddhisawant305-jpg | T2-016 |
| T2-013 | Connector Health | riddhisawant305-jpg | `NOT STARTED` | T2-003 | Health check system for connectors | — | Team lead | T2-016 |
| T2-014 | Connector Logging | riddhisawant305-jpg | `NOT STARTED` | T2-001 | Connector logging infrastructure | — | Team lead | T2-016 |
| T2-015 | Connector Security Validation | riddhisawant305-jpg | `NOT STARTED` | T2-001 | Security validation for connectors | — | darshankamble0628-coder | T2-016 |
| T2-016 | Unit Tests | darshankamble0628-coder | `NOT STARTED` | T2-005 through T2-015 | Connector unit test suite | — | riddhisawant305-jpg | T2-017 |
| T2-017 | Integration Tests | yadavchinmay45-cloud | `NOT STARTED` | T2-016 | Connector integration tests | — | AaryanDhotre2326 | T2-018 |
| T2-018 | Connector Documentation | riddhisawant305-jpg | `NOT STARTED` | T2-017 | Connector documentation | — | Team lead | None |

---

## 🕸️ TEAM 3 — Entity Resolution & Knowledge Graph

| Task ID | Title | Owner | Status | Dependency | Expected Output | Blocker | Backup Task | Next Task(s) |
|---|---|---|---|---|---|---|---|---|
| T3-001 | Entity Schema | hirveabhishek2006-design | `NOT STARTED` | T1-003 | Entity Zod schema | — | Team lead | T3-002, T3-003, T3-004, T3-006, T3-007, T3-008 |
| T3-002 | Entity Normalization | hirveabhishek2006-design | `NOT STARTED` | T3-001 | Entity normalization logic | — | katkarsujal1-design | None |
| T3-003 | Entity Extraction | katkarsujal1-design | `NOT STARTED` | T3-001, T1-008 | Entity extraction from observations | — | hirveabhishek2006-design | T3-005, T3-017 |
| T3-004 | Entity Confidence | katkarsujal1-design | `NOT STARTED` | T3-001 | Confidence scoring for entities | — | hirveabhishek2006-design | T3-005 |
| T3-005 | Entity Resolution | raunaksin9890-gif | `NOT STARTED` | T3-003, T3-004 | Entity deduplication/resolution | — | hirveabhishek2006-design | T3-015, T3-017 |
| T3-006 | Relationship Schema | raunaksin9890-gif | `NOT STARTED` | T3-001 | Relationship Zod schema | — | hirveabhishek2006-design | T3-007, T3-008 |
| T3-007 | Relationship Extraction | Pannkajyadhav333 | `NOT STARTED` | T3-001, T3-006, T1-008 | Relationship extraction logic | — | hirveabhishek2006-design | T3-017 |
| T3-008 | Graph Schema | Pannkajyadhav333 | `NOT STARTED` | T1-015, T3-001, T3-006 | Graph data model/schema | — | parthvichare20 | T3-009, T3-012 |
| T3-009 | Graph Storage | parthvichare20 | `NOT STARTED` | T3-008 | Graph persistence layer | — | Pannkajyadhav333 | T3-010, T3-013, T3-014 |
| T3-010 | Graph Queries | parthvichare20 | `NOT STARTED` | T3-009 | Graph query functions | — | Pannkajyadhav333 | T3-011, T3-016 |
| T3-011 | Graph API | parthvichare20 | `NOT STARTED` | T3-010 | Graph API endpoints | — | hirveabhishek2006-design | T3-016, T5-009 |
| T3-012 | Temporal Relationships | Pannkajyadhav333 | `NOT STARTED` | T3-008 | Time-aware relationships | — | parthvichare20 | None |
| T3-013 | Investigation Timeline | parthvichare20 | `NOT STARTED` | T3-009, T1-013 | Timeline data/service | — | hirveabhishek2006-design | T5-010 |
| T3-014 | Entity API | parthvichare20 | `NOT STARTED` | T3-009 | Entity CRUD API endpoints | — | hirveabhishek2006-design | T5-008, T5-013 |
| T3-015 | Resolution Tests | katkarsujal1-design | `NOT STARTED` | T3-005 | Entity resolution test suite | — | raunaksin9890-gif | T3-017 |
| T3-016 | Graph Tests | Pannkajyadhav333 | `NOT STARTED` | T3-010, T3-011 | Graph module test suite | — | parthvichare20 | T3-017 |
| T3-017 | Integration Tests | Pannkajyadhav333 | `NOT STARTED` | T3-003 through T3-014 | Team 3 integration tests | — | hirveabhishek2006-design | T3-018 |
| T3-018 | Documentation | hirveabhishek2006-design | `NOT STARTED` | T3-017 | Entity/Graph documentation | — | Team lead | None |

**UNASSIGNED: lahanesakahi-create** — Account not found on GitHub

---

## 🤖 TEAM 4 — AI/Intelligence Layer

| Task ID | Title | Owner | Status | Dependency | Expected Output | Blocker | Backup Task | Next Task(s) |
|---|---|---|---|---|---|---|---|---|
| T4-001 | Model Abstraction | sumeetmore334-rgb | `NOT STARTED` | T1-003 | LLM provider abstraction layer | — | Team lead | T4-002–T4-016 |
| T4-002 | Ollama Provider | sumeetmore334-rgb | `NOT STARTED` | T4-001 | Ollama provider implementation | — | Team lead | None |
| T4-003 | Model Configuration | anujmore2006-collab | `NOT STARTED` | T4-001 | Model config management | — | sumeetmore334-rgb | T4-004, T4-017 |
| T4-004 | Model Fallback | anujmore2006-collab | `NOT STARTED` | T4-001, T4-003 | Fallback logic between models | — | sumeetmore334-rgb | None |
| T4-005 | Prompt System | anujmore2006-collab | `NOT STARTED` | T4-001 | Prompt template management | — | sumeetmore334-rgb | T4-017 |
| T4-006 | Structured AI Output | Akash-Upade | `NOT STARTED` | T4-001 | Structured output parsing | — | sumeetmore334-rgb | None |
| T4-007 | Investigation Planner | Akash-Upade | `NOT STARTED` | T4-001, T1-005 | AI investigation planning | — | sumeetmore334-rgb | T4-018 |
| T4-008 | Evidence Analysis | Akash-Upade | `NOT STARTED` | T4-001, T1-009 | AI evidence analysis engine | — | sumeetmore334-rgb | T4-009, T4-018 |
| T4-009 | Correlation Engine | Akash-Upade | `NOT STARTED` | T4-001, T4-008 | Cross-evidence correlation | — | sumeetmore334-rgb | T4-018 |
| T4-010 | Contradiction Detection | shraddhamahindrakar217-cloud | `NOT STARTED` | T4-001, T1-009 | AI contradiction detection | — | sumeetmore334-rgb | T4-011, T4-018 |
| T4-011 | Verification Engine | shraddhamahindrakar217-cloud | `NOT STARTED` | T4-010 | Fact verification system | — | sumeetmore334-rgb | T4-013, T5-011, T5-013 |
| T4-012 | Confidence Calculation | shraddhamahindrakar217-cloud | `NOT STARTED` | T4-001 | AI confidence scoring | — | sumeetmore334-rgb | None |
| T4-013 | Human-Review State | shraddhamahindrakar217-cloud | `NOT STARTED` | T4-011 | Human-in-the-loop workflow | — | sumeetmore334-rgb | T5-012 |
| T4-014 | AI Audit Logging | shraddhamahindrakar217-cloud | `NOT STARTED` | T4-001, T1-015 | AI decision audit trail | — | sumeetmore334-rgb | None |
| T4-015 | Prompt Injection Defenses | shraddhamahindrakar217-cloud | `NOT STARTED` | T4-001 | Prompt injection protection | — | sumeetmore334-rgb | None |
| T4-016 | AI Safety Controls | sumeetmore334-rgb | `NOT STARTED` | T4-001 | AI safety guardrails | — | Team lead | None |
| T4-017 | Evaluation Dataset | anujmore2006-collab | `NOT STARTED` | T4-003, T4-005 | AI evaluation dataset | — | sumeetmore334-rgb | T4-018 |
| T4-018 | Evaluation Tests | anujmore2006-collab | `NOT STARTED` | T4-007, T4-008, T4-009, T4-010, T4-017 | AI evaluation test suite | — | Akash-Upade | T4-019 |
| T4-019 | Integration Tests | shraddhamahindrakar217-cloud | `NOT STARTED` | T4-018 | Team 4 integration tests | — | anujmore2006-collab | T4-020 |
| T4-020 | Documentation | sumeetmore334-rgb | `NOT STARTED` | T4-019 | AI layer documentation | — | Team lead | None |

---

## 🖥️ TEAM 5 — Frontend/UI

| Task ID | Title | Owner | Status | Dependency | Expected Output | Blocker | Backup Task | Next Task(s) |
|---|---|---|---|---|---|---|---|---|
| T5-001 | Next.js Application | Ishauparkar13 | `NOT STARTED` | T1-003 | Next.js project scaffold | — | Team lead | T5-002 |
| T5-002 | Application Layout | Ishauparkar13 | `NOT STARTED` | T5-001 | Layout components, routing | — | Team lead | T5-003–T5-016 |
| T5-003 | Dashboard | aryanbhosale20 | `NOT STARTED` | T5-002, T1-017 | Main dashboard view | — | Ishauparkar13 | None |
| T5-004 | Case Creation | aryanbhosale20 | `NOT STARTED` | T5-002, T1-017 | Case creation form/view | — | Ishauparkar13 | None |
| T5-005 | Investigation Creation | aryanbhosale20 | `NOT STARTED` | T5-002, T1-017, T1-005 | Investigation creation form | — | Ishauparkar13 | None |
| T5-006 | Investigation Status | dakshjadyar | `NOT STARTED` | T5-002, T1-017 | Investigation status view | — | Ishauparkar13 | None |
| T5-007 | Evidence Viewer | dakshjadyar | `NOT STARTED` | T5-002, T1-018 | Evidence viewing component | — | Ishauparkar13 | None |
| T5-008 | Entity Viewer | Deepkasare | `NOT STARTED` | T5-002, T3-014 | Entity detail view | — | Ishauparkar13 | None |
| T5-009 | Graph View | Deepkasare | `NOT STARTED` | T5-002, T3-011 | Knowledge graph visualization | — | Ishauparkar13 | None |
| T5-010 | Timeline | Deepkasare | `NOT STARTED` | T5-002, T3-013 | Investigation timeline view | — | Ishauparkar13 | None |
| T5-011 | Findings View | krishnasondigala-sys | `NOT STARTED` | T5-002, T4-011 | Findings display view | — | Ishauparkar13 | T5-012 |
| T5-012 | Verification View | krishnasondigala-sys | `NOT STARTED` | T5-011, T4-013 | Verification workflow view | — | Ishauparkar13 | None |
| T5-013 | Report Generation | krishnasondigala-sys | `NOT STARTED` | T5-002, T1-018, T3-014, T4-011 | Report generation UI | — | Ishauparkar13 | T5-014 |
| T5-014 | Report Export | krishnasondigala-sys | `NOT STARTED` | T5-013 | Report export functionality | — | Ishauparkar13 | None |
| T5-015 | Error/Loading States | dakshjadyar | `NOT STARTED` | T5-002 | Error boundaries, loading spinners | — | Ishauparkar13 | T5-017 |
| T5-016 | Accessibility | dakshjadyar | `NOT STARTED` | T5-002 | WCAG compliance, a11y features | — | Deepkasare | T5-017 |
| T5-017 | E2E Tests | Deepkasare | `NOT STARTED` | T5-002 through T5-016 | End-to-end test suite | — | krishnasondigala-sys | T5-018 |
| T5-018 | Product Integration Tests | krishnasondigala-sys | `NOT STARTED` | T5-017 | Full product integration tests | — | Deepkasare | T5-019 |
| T5-019 | Documentation | Ishauparkar13 | `NOT STARTED` | T5-018 | Frontend documentation | — | Team lead | None |

**UNASSIGNED: khushishukla3008** — Account not found on GitHub

---

## 🚨 CROSS-TEAM BLOCKERS

Tasks in one team that block tasks in another team.

| Blocking Task | Blocking Team | Blocked Task(s) | Blocked Team | Impact |
|---|---|---|---|---|
| T1-001 (Repository/Monorepo Foundation) | Team 1 | T1-002, T1-015 | Team 1 | All downstream tasks |
| T1-003 (Shared Zod Schema Package) | Team 1 | T3-001, T4-001, T5-001 | Teams 3, 4, 5 | Schema-dependent work across all teams |
| T1-008 (Observation Schema) | Team 1 | T2-001, T2-005–T2-010, T3-003, T3-007 | Teams 2, 3 | All connector + extraction work |
| T1-005 (Investigation Schema) | Team 1 | T4-007, T5-005 | Teams 4, 5 | Investigation planner + creation form |
| T1-009 (Evidence Schema) | Team 1 | T4-008, T4-010 | Team 4 | Evidence analysis + contradiction detection |
| T1-015 (Database/Prisma Foundation) | Team 1 | T3-008, T4-014 | Teams 3, 4 | Graph schema + AI audit logging |
| T1-017 (Core API) | Team 1 | T5-003–T5-006 | Team 5 | Dashboard + case/investigation forms |
| T1-018 (Evidence API) | Team 1 | T5-007, T5-013 | Team 5 | Evidence viewer + report generation |
| T3-014 (Entity API) | Team 3 | T5-008, T5-013 | Team 5 | Entity viewer + reports |
| T3-011 (Graph API) | Team 3 | T5-009 | Team 5 | Graph view |
| T3-013 (Investigation Timeline) | Team 3 | T5-010 | Team 5 | Timeline view |
| T4-011 (Verification Engine) | Team 4 | T5-011, T5-013 | Team 5 | Findings view + reports |
| T4-013 (Human-Review State) | Team 4 | T5-012 | Team 5 | Verification view |

---

## 🔀 WHAT CAN I WORK ON IF BLOCKED?

If your primary task is blocked, check below for available backup tasks.

### Preetam-06
- **Backup for:** T1-003, T1-015, T1-016 (when not on critical path)
- **Can assist with:** Any task where "Team lead" is listed as backup

### Dinesh-Kumar-Ved
- **Backup for:** T1-011 (Evidence Hashing), T1-018 (Evidence API)

### Zrahul2024
- **Backup for:** T1-008 (Observation Schema)

### jadhavsarthak374-ai
- **Backup for:** T1-012 (Evidence Metadata), T1-016 (Core Service Structure)

### ANDY15K
- **Backup for:** T1-020 (Unit Tests), T1-021 (Integration Tests)

### riddhisawant305-jpg
- **Backup for:** T2-005 (Public Web Connector), T2-016 (Unit Tests)

### yadavchinmay45-cloud
- **Backup for:** T2-017 (Integration Tests)

### AaryanDhotre2326
- **Backup for:** T2-017 (Integration Tests)

### antarahire22-creator
- **Backup for:** T2-016 (Unit Tests)

### darshankamble0628-coder
- **Backup for:** T2-015 (Connector Security Validation)

### hirveabhishek2006-design
- **Backup for:** T3-017 (Integration Tests), T3-018 (Documentation)

### katkarsujal1-design
- **Backup for:** T3-015 (Resolution Tests)

### raunaksin9890-gif
- **Backup for:** T3-015 (Resolution Tests)

### Pannkajyadhav333
- **Backup for:** T3-016 (Graph Tests)

### parthvichare20
- **Backup for:** T3-016 (Graph Tests)

### sumeetmore334-rgb
- **Backup for:** T4-016 (AI Safety Controls), T4-020 (Documentation)

### anujmore2006-collab
- **Backup for:** T4-017 (Evaluation Dataset), T4-018 (Evaluation Tests)

### Akash-Upade
- **Backup for:** T4-018 (Evaluation Tests)

### shraddhamahindrakar217-cloud
- **Backup for:** T4-019 (Integration Tests)

### Ishauparkar13
- **Backup for:** T5-015 (Error/Loading States), T5-016 (Accessibility), T5-019 (Documentation)

### aryanbhosale20
- **Backup for:** T5-015 (Error/Loading States)

### dakshjadyar
- **Backup for:** T5-015 (Error/Loading States), T5-016 (Accessibility)

### Deepkasare
- **Backup for:** T5-016 (Accessibility), T5-017 (E2E Tests)

### krishnasondigala-sys
- **Backup for:** T5-018 (Product Integration Tests)

---

*This board is a living document. Update task statuses daily. If a blocker arises, add it to the Blocker column and escalate to the team lead.*
