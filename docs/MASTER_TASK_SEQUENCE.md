# Master Task Sequence

**Repository:** Redkrossresearch/OSINT_Tool
**Updated:** 26 August 2026
**Total tasks:** 97 (Team 1: 22, Team 2: 18, Team 3: 18, Team 4: 20, Team 5: 19)
**Target:** September 19, 2026 MVP

This is a **dependency-aware** execution sequence. It is NOT a rigid Team-1→Team-2→Team-3 serial order. Tasks that can proceed in parallel are grouped into **waves**. When a task is blocked, interns switch to independent/backup tasks (see `docs/INDIVIDUAL_ASSIGNMENTS.md` and each intern's file in `docs/assignments/`).

---

## Execution Model

- **WAVES** = dependency readiness, not dates.
- A task enters a wave only when ALL its dependencies are satisfied.
- Independent tasks (tests, schemas, mocks, fixtures, docs, UI components, adapters) proceed in parallel regardless of other teams.
- Critical path tasks are flagged **CRITICAL** — they gate the MVP.

---

## Wave 1 — Foundation (single root)

| Seq | Task ID | Team | Title | Owner | Dep | Effort | Blocks |
|---|---|---|---|---|---|---|---|
| 1 | T1-001 | 1 | Repo/Monorepo Foundation | Preetam-06 | — | 2 | T1-002, T1-015, everything |

## Wave 2 — Workspace + Schemas begin

| Seq | Task ID | Team | Title | Owner | Dep | Effort | Blocks |
|---|---|---|---|---|---|---|---|
| 2 | T1-002 | 1 | Workspace/Package Config | Preetam-06 | T1-001 | 1 | T1-003 |

## Wave 3 — Schema contracts (all teams can start after T1-003)

| Seq | Task ID | Team | Title | Owner | Dep | Effort | Blocks |
|---|---|---|---|---|---|---|---|
| 3 | **T1-003** | 1 | Shared Zod Schema Package | Dinesh-Kumar-Ved | T1-002 | 2 | 42 tasks (T1-004..T1-014, T3-001, T4-001, T5-001) |
| 4 | T1-006 | 1 | Objective Schema | Dinesh-Kumar-Ved | T1-003 | 1 | — |
| 5 | T1-007 | 1 | Source Schema | Zrahul2024 | T1-003 | 1 | T1-008, T1-009 |
| 6 | T1-010 | 1 | Evidence Provenance Model | Zrahul2024 | T1-003 | 1 | — |
| 7 | T3-001 | 3 | Entity Schema | hirveabhishek2006-design | T1-003 | 2 | T3-002..T3-008 |
| 8 | T4-001 | 4 | Model Abstraction | sumeetmore334-rgb | T1-003 | 2 | T4-002..T4-016 |
| 9 | T5-001 | 5 | Next.js Application | Ishauparkar13 | T1-003 | 2 | T5-002 |

## Wave 4 — Schema expansion (parallel across all teams)

| Seq | Task ID | Team | Title | Owner | Dep | Effort | Blocks |
|---|---|---|---|---|---|---|---|
| 10 | T1-004 | 1 | Case Schema | Dinesh-Kumar-Ved | T1-003 | 1 | T1-005 |
| 11 | T1-005 | 1 | Investigation Schema | ANDY15K | T1-003,T1-004 | 2 | T1-013,T1-014,T4-007,T5-005 |
| 12 | **T1-008** | 1 | Observation Schema | Zrahul2024 | T1-003,T1-007 | 2 | T2-001,connectors,T3-003,T3-007 |
| 13 | **T1-009** | 1 | Evidence Schema | jadhavsarthak374-ai | T1-003,T1-007 | 2 | T1-011,T1-012,T1-015,T4-008,T4-010 |
| 14 | T3-002 | 3 | Entity Normalization | hirveabhishek2006-design | T3-001 | 2 | — |
| 15 | T3-004 | 3 | Entity Confidence | katkarsujal1-design | T3-001 | 1 | T3-005 |
| 16 | T3-006 | 3 | Relationship Schema | raunaksin9890-gif | T3-001 | 1 | T3-007,T3-008 |
| 17 | T4-003 | 4 | Model Configuration | anujmore2006-collab | T4-001 | 1 | T4-004,T4-017 |
| 18 | T4-005 | 4 | Prompt System | anujmore2006-collab | T4-001 | 2 | T4-017 |
| 19 | T4-006 | 4 | Structured AI Output | Akash-Upade | T4-001 | 2 | — |
| 20 | T4-012 | 4 | Confidence Calculation | shraddhamahindrakar217-cloud | T4-001 | 2 | — |
| 21 | T4-015 | 4 | Prompt Injection Defenses | shraddhamahindrakar217-cloud | T4-001 | 2 | — |
| 22 | T4-016 | 4 | AI Safety Controls | sumeetmore334-rgb | T4-001 | 2 | — |
| 23 | T5-002 | 5 | Application Layout | Ishauparkar13 | T5-001 | 2 | T5-003..T5-016 |
| 24 | T5-015 | 5 | Error/Loading States | khushishukla3008-star | T5-002 | 1 | T5-017 |
| 25 | T5-016 | 5 | Accessibility | khushishukla3008-star | T5-002 | 1 | T5-017 |

## Wave 5 — Core + connectors frame + AI providers

| Seq | Task ID | Team | Title | Owner | Dep | Effort | Blocks |
|---|---|---|---|---|---|---|---|
| 26 | T1-013 | 1 | Audit Event Model | ANDY15K | T1-003,T1-005 | 1 | T1-015,T3-013 |
| 27 | T1-014 | 1 | Investigation Lifecycle | ANDY15K | T1-005 | 2 | — |
| 28 | T1-011 | 1 | Evidence Hashing | jadhavsarthak374-ai | T1-009 | 1 | T1-018 |
| 29 | T1-012 | 1 | Evidence Metadata | Dinesh-Kumar-Ved | T1-009 | 1 | — |
| 30 | **T2-001** | 2 | Connector Interface | riddhisawant305-jpg | T1-008 | 3 | T2-002..T2-015 |
| 31 | T3-003 | 3 | Entity Extraction | katkarsujal1-design | T3-001,T1-008 | 3 | T3-005,T3-017 |
| 32 | T3-007 | 3 | Relationship Extraction | Pannkajyadhav333 | T3-001,T3-006,T1-008 | 3 | T3-017 |
| 33 | T4-002 | 4 | Ollama Provider | sumeetmore334-rgb | T4-001 | 2 | — |
| 34 | T4-004 | 4 | Model Fallback | anujmore2006-collab | T4-001,T4-003 | 2 | — |
| 35 | T4-007 | 4 | Investigation Planner | Akash-Upade | T4-001,T1-005 | 3 | T4-018 |
| 36 | T4-008 | 4 | Evidence Analysis | Akash-Upade | T4-001,T1-009 | 3 | T4-009,T4-018 |
| 37 | T4-010 | 4 | Contradiction Detection | shraddhamahindrakar217-cloud | T4-001,T1-009 | 3 | T4-011,T4-018 |
| 38 | T4-014 | 4 | AI Audit Logging | shraddhamahindrakar217-cloud | T4-001,T1-015 | 2 | — |
| 39 | T3-005 | 3 | Entity Resolution | raunaksin9890-gif | T3-003,T3-004 | 3 | T3-015,T3-017 |

## Wave 6 — Database + connector implementations + graph schema

| Seq | Task ID | Team | Title | Owner | Dep | Effort | Blocks |
|---|---|---|---|---|---|---|---|
| 40 | **T1-015** | 1 | Database/Prisma Foundation | jadhavsarthak374-ai | T1-001,T1-004,T1-005,T1-008,T1-009,T1-013 | 3 | T1-016,T3-008,T4-014 |
| 41 | T2-002 | 2 | Connector Result Contract | riddhisawant305-jpg | T2-001,T1-008 | 2 | — |
| 42 | T2-003 | 2 | Connector Registry | darshankamble0628-coder | T2-001 | 2 | T2-013 |
| 43 | T2-004 | 2 | Connector Config | darshankamble0628-coder | T2-001 | 1 | — |
| 44 | T2-005 | 2 | Public Web Connector | yadavchinmay45-cloud | T2-001,T1-008 | 2 | T2-016 |
| 45 | T2-006 | 2 | Public Search Connector | yadavchinmay45-cloud | T2-001,T1-008 | 2 | T2-016 |
| 46 | T2-007 | 2 | DNS/RDAP Connector | AaryanDhotre2326 | T2-001,T1-008 | 2 | T2-016 |
| 47 | T2-008 | 2 | Cert Intelligence Connector | AaryanDhotre2326 | T2-001,T1-008 | 2 | T2-016 |
| 48 | T2-009 | 2 | GitHub Public Connector | antarahire22-creator | T2-001,T1-008 | 2 | T2-016 |
| 49 | T2-010 | 2 | Normalization Pipeline | antarahire22-creator | T2-001,T1-008 | 2 | T2-016 |
| 50 | T2-011 | 2 | Rate Limiting | darshankamble0628-coder | T2-001 | 1 | T2-016 |
| 51 | T2-012 | 2 | Timeout/Retry | darshankamble0628-coder | T2-001 | 1 | T2-016 |
| 52 | T2-014 | 2 | Connector Logging | riddhisawant305-jpg | T2-001 | 1 | — |
| 53 | T2-015 | 2 | Connector Security Validation | riddhisawant305-jpg | T2-001 | 2 | — |
| 54 | **T3-008** | 3 | Graph Schema | Pannkajyadhav333 | T1-015,T3-001,T3-006 | 3 | T3-009,T3-012 |
| 55 | T3-012 | 3 | Temporal Relationships | Pannkajyadhav333 | T3-008 | 2 | — |
| 56 | T4-009 | 4 | Correlation Engine | Akash-Upade | T4-001,T4-008 | 3 | T4-018 |
| 57 | T4-011 | 4 | Verification Engine | shraddhamahindrakar217-cloud | T4-010 | 3 | T4-013,T5-011,T5-013 |
| 58 | T4-017 | 4 | Evaluation Dataset | anujmore2006-collab | T4-003,T4-005 | 1 | T4-018 |

## Wave 7 — Core services + graph storage + AI verification + frontend pages

| Seq | Task ID | Team | Title | Owner | Dep | Effort | Blocks |
|---|---|---|---|---|---|---|---|
| 59 | T1-016 | 1 | Core Service Structure | Preetam-06 | T1-015 | 2 | T1-017,T1-018 |
| 60 | T2-013 | 2 | Connector Health | riddhisawant305-jpg | T2-003 | 1 | — |
| 61 | T3-009 | 3 | Graph Storage | parthvichare20 | T3-008 | 3 | T3-010,T3-013,T3-014 |
| 62 | T3-010 | 3 | Graph Queries | parthvichare20 | T3-009 | 3 | T3-011,T3-016 |
| 63 | T3-013 | 3 | Investigation Timeline | parthvichare20 | T3-009,T1-013 | 2 | T5-010 |
| 64 | T3-014 | 3 | Entity API | parthvichare20 | T3-009 | 2 | T5-008,T5-013 |
| 65 | T4-013 | 4 | Human-Review State | shraddhamahindrakar217-cloud | T4-011 | 2 | T5-012 |

## Wave 8 — Core/Evidence API + Graph API + frontend wiring

| Seq | Task ID | Team | Title | Owner | Dep | Effort | Blocks |
|---|---|---|---|---|---|---|---|
| 66 | T1-017 | 1 | Core API | Preetam-06 | T1-016 | 3 | T1-019,T5-003..T5-006 |
| 67 | T1-018 | 1 | Evidence API | jadhavsarthak374-ai | T1-016,T1-011 | 2 | T1-019,T5-007,T5-013 |
| 68 | T3-011 | 3 | Graph API | parthvichare20 | T3-010 | 2 | T3-016,T5-009 |
| 69 | T3-015 | 3 | Resolution Tests | lahanesakshi-create | T3-005 | 1 | — |
| 70 | T3-016 | 3 | Graph Tests | lahanesakshi-create | T3-010,T3-011 | 2 | — |
| 71 | T5-003 | 5 | Dashboard | aryanbhosale20 | T5-002,T1-017 | 2 | — |
| 72 | T5-004 | 5 | Case Creation | aryanbhosale20 | T5-002,T1-017 | 2 | — |
| 73 | T5-005 | 5 | Investigation Creation | aryanbhosale20 | T5-002,T1-017,T1-005 | 2 | — |
| 74 | T5-006 | 5 | Investigation Status | dakshjadyar | T5-002,T1-017 | 2 | — |
| 75 | T5-007 | 5 | Evidence Viewer | dakshjadyar | T5-002,T1-018 | 2 | — |

## Wave 9 — Validation + verification + reports + remaining UI

| Seq | Task ID | Team | Title | Owner | Dep | Effort | Blocks |
|---|---|---|---|---|---|---|---|
| 76 | T1-019 | 1 | Validation/Error Handling | Preetam-06 | T1-017,T1-018 | 2 | T1-020 |
| 77 | T4-018 | 4 | Evaluation Tests | anujmore2006-collab | T4-007,T4-008,T4-009,T4-010,T4-017 | 3 | T4-019 |
| 78 | T5-008 | 5 | Entity Viewer | Deepkasare | T5-002,T3-014 | 2 | T5-017 |
| 79 | T5-009 | 5 | Graph View | Deepkasare | T5-002,T3-011 | 3 | T5-017 |
| 80 | T5-010 | 5 | Timeline | Deepkasare | T5-002,T3-013 | 2 | T5-017 |
| 81 | T5-011 | 5 | Findings View | krishnasondigala-sys | T5-002,T4-011 | 2 | T5-012 |
| 82 | T5-012 | 5 | Verification View | krishnasondigala-sys | T5-011,T4-013 | 2 | — |
| 83 | T5-013 | 5 | Report Generation | krishnasondigala-sys | T5-002,T1-018,T3-014,T4-011 | 3 | T5-014 |

## Wave 10 — Testing (unit + integration across all teams)

| Seq | Task ID | Team | Title | Owner | Dep | Effort | Blocks |
|---|---|---|---|---|---|---|---|
| 84 | T1-020 | 1 | Unit Tests | jadhavsarthak374-ai | T1-016..T1-019 | 2 | T1-021 |
| 85 | T2-016 | 2 | Unit Tests | darshankamble0628-coder | T2-005..T2-015 | 2 | T2-017 |
| 86 | T3-017 | 3 | Integration Tests | Pannkajyadhav333 | T3-003..T3-014 | 3 | T3-018 |
| 87 | T4-019 | 4 | Integration Tests | shraddhamahindrakar217-cloud | T4-018 | 2 | T4-020 |
| 88 | T5-014 | 5 | Report Export | krishnasondigala-sys | T5-013 | 1 | — |
| 89 | T5-017 | 5 | E2E Tests | Deepkasare | T5-002..T5-016 | 3 | T5-018 |

## Wave 11 — Final integration + QA

| Seq | Task ID | Team | Title | Owner | Dep | Effort | Blocks |
|---|---|---|---|---|---|---|---|
| 90 | T1-021 | 1 | Integration Tests | ANDY15K | T1-020 | 2 | T1-022 |
| 91 | T2-017 | 2 | Integration Tests | yadavchinmay45-cloud | T2-016 | 2 | T2-018 |
| 92 | T5-018 | 5 | Product Integration Tests | krishnasondigala-sys | T5-017 | 2 | T5-019 |

## Wave 12 — Documentation + release

| Seq | Task ID | Team | Title | Owner | Dep | Effort | Blocks |
|---|---|---|---|---|---|---|---|
| 93 | T1-022 | 1 | Documentation | Preetam-06 | T1-021 | 1 | MVP |
| 94 | T2-018 | 2 | Connector Documentation | riddhisawant305-jpg | T2-017 | 1 | MVP |
| 95 | T3-018 | 3 | Documentation | hirveabhishek2006-design | T3-017 | 1 | MVP |
| 96 | T4-020 | 4 | Documentation | sumeetmore334-rgb | T4-019 | 1 | MVP |
| 97 | T5-019 | 5 | Documentation | Ishauparkar13 | T5-018 | 1 | MVP |

---

## Critical Path

The critical path is the longest dependency chain gating the MVP:

```
T1-001 → T1-002 → T1-003 → T1-008 → T2-001 → connectors → T2-016 → T2-017 → T2-018
T1-003 → T1-005 → T1-013 → T1-015 → T1-016 → T1-017 → T1-019 → T1-020 → T1-021 → T1-022
T1-003 → T1-008 → T3-003 → T3-005 → (T3-015)
T1-003 → T4-001 → T4-010 → T4-011 → T5-011 → T5-012
T1-003 → T1-009 → T4-008 → T4-009 → T4-018 → T4-019 → T4-020
```

## Highest Fan-Out Tasks (stage gates)

| Task | Direct dependents | Risk |
|---|---|---|
| T1-001 | 10 | Everything depends on it |
| T1-003 | 10 (42 transitive) | Schema contract hub |
| T1-008 | 9 (45 transitive) | Observation contract for Teams 2+3 |
| T1-009 | 7 (36 transitive) | Evidence schema for Team 4 |
| T4-001 | 10 (23 transitive) | AI foundation |
| T5-002 | 6 (15 transitive) | Frontend layout |

## Parallel Work While Blocked

When a team is blocked by an upstream deliverable, work these independent tasks:

- **Team 1:** T1-006, T1-010, T1-012, T1-014 (schema/model work not blocked by T1-008); T1-020 tests.
- **Team 2:** connector framework is blocked on T1-008; write parser/validation/tests, fixtures, mock responses (permitted within connector scope).
- **Team 3:** after T1-003, T3-001/T3-002/T3-004/T3-006 are independent of T1-008; write entity/graph fixtures + tests.
- **Team 4:** after T1-003, T4-001, T4-002, T4-003, T4-005, T4-006, T4-012, T4-015, T4-016 are independent of evidence; use mocks where allowed; build evaluation fixtures.
- **Team 5:** after T1-003, T5-001/T5-002 are independent; T5-015/T5-016 (error/accessibility) independent of backend; build UI with mock APIs, components, layouts, tests.
