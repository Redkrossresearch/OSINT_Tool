# Execution Plan — September 19 MVP

**Target:** September 19, 2026
**Total Tasks:** 97
**Total Interns:** 24 verified (+ 2 pending verification)
**Teams:** 5

---

## Phase 1: Contracts (Week 1–2)

**Owner:** Team 1 (Preetam-06, Dinesh-Kumar-Ved, Zrahul2024)

### Tasks
| Task | Owner | Difficulty |
|---|---|---|
| T1-001 Repository/Monorepo Foundation | Preetam-06 | Foundation |
| T1-002 Workspace/Package Configuration | Preetam-006 | Foundation |
| T1-003 Shared Zod Schema Package | Dinesh-Kumar-Ved | Foundation |
| T1-004 Case Schema | Dinesh-Kumar-Ved | Schema |
| T1-006 Objective Schema | Dinesh-Kumar-Ved | Schema |
| T1-007 Source Schema | Zrahul2024 | Schema |
| T1-008 Observation Schema | Zrahul2024 | Schema (CRITICAL) |
| T1-010 Evidence Provenance Model | Zrahul2024 | Schema |

### Parallel Work
- Teams 2–5 read schemas and plan implementation
- Teams 2–5 create mock fixtures based on draft schemas

### Exit Criteria
- All schemas published and importable
- All teams can code against schemas
- Schema tests pass

---

## Phase 2: Core Foundation (Week 2–4)

**Owner:** Team 1 (ANDY15K, jadhavsarthak374-ai)

### Tasks
| Task | Owner | Difficulty |
|---|---|---|
| T1-005 Investigation Schema | ANDY15K | Schema |
| T1-009 Evidence Schema | jadhavsarthak374-ai | Schema |
| T1-011 Evidence Hashing | jadhavsarthak374-ai | Implementation |
| T1-012 Evidence Metadata | Dinesh-Kumar-Ved | Schema |
| T1-013 Audit Event Model | ANDY15K | Schema |
| T1-014 Investigation Lifecycle | ANDY15K | Implementation |
| T1-015 Database/Prisma Foundation | jadhavsarthak374-ai | Infrastructure |

### Parallel Work
- Team 2 starts connector framework (mock Observations)
- Team 3 starts entity types + extraction (mock Observations)
- Team 4 starts model abstraction (mock Ollama)
- Team 5 starts Next.js setup + UI (mock APIs)

### Exit Criteria
- Database foundation working
- Core schemas complete
- Investigation state machine functional

---

## Phase 3: Connectors (Week 2–5)

**Owner:** Team 2 (riddhisawant305-jpg, yadavchinmay45-cloud, AaryanDhotre2326, antarahire22-creator, darshankamble0628-coder)

### Tasks
| Task | Owner | Difficulty |
|---|---|---|
| T2-001 Connector Interface | riddhisawant305-jpg | Framework |
| T2-002 Connector Result Contract | riddhisawant305-jpg | Framework |
| T2-003 Connector Registry | darshankamble0628-coder | Framework |
| T2-004 Connector Configuration | darshankamble0628-coder | Framework |
| T2-005 Public Web Connector | yadavchinmay45-cloud | Connector |
| T2-006 Public Search Connector | yadavchinmay45-cloud | Connector |
| T2-007 DNS/RDAP Connector | AaryanDhotre2326 | Connector |
| T2-008 Certificate Intelligence Connector | AaryanDhotre2326 | Connector |
| T2-009 GitHub Public Connector | antarahire22-creator | Connector |
| T2-010 Normalization Pipeline | antarahire22-creator | Pipeline |
| T2-011 Rate Limiting | darshankamble0628-coder | Framework |
| T2-012 Timeout/Retry Handling | darshankamble0628-coder | Framework |

### Parallel Work
- Team 1 continues core APIs
- Teams 3–5 continue their work

### Exit Criteria
- All 5 connectors produce valid Observations
- Rate limiting works
- Health checks work

---

## Phase 4: Intelligence + Graph (Week 3–6)

**Owner:** Team 3 (hirveabhishek2006-design, katkarsujal1-design, raunaksin9890-gif, Pannkajyadhav333, parthvichare20)

### Tasks
| Task | Owner | Difficulty |
|---|---|---|
| T3-001 Entity Schema | hirveabhishek2006-design | Schema |
| T3-002 Entity Normalization | hirveabhishek2006-design | Logic |
| T3-003 Entity Extraction | katkarsujal1-design | Logic |
| T3-004 Entity Confidence | katkarsujal1-design | Logic |
| T3-005 Entity Resolution | raunaksin9890-gif | Logic (CRITICAL) |
| T3-006 Relationship Schema | raunaksin9890-gif | Schema |
| T3-007 Relationship Extraction | Pannkajyadhav333 | Logic |
| T3-008 Graph Schema | Pannkajyadhav333 | Database |
| T3-009 Graph Storage | parthvichare20 | Database |
| T3-010 Graph Queries | parthvichare20 | Database |
| T3-011 Graph API | parthvichare20 | API |
| T3-012 Temporal Relationships | Pannkajyadhav333 | Logic |
| T3-013 Investigation Timeline | parthvichare20 | API |
| T3-014 Entity API | parthvichare20 | API |

### Parallel Work
- Team 1 completes core APIs
- Team 2 completes connectors
- Team 4 continues AI agents
- Team 5 continues frontend

### Exit Criteria
- Observations → Entities pipeline works
- Graph queries return correct results
- Entity resolution has confidence scores

---

## Phase 5: AI + Verification (Week 3–7)

**Owner:** Team 4 (sumeetmore334-rgb, anujmore2006-collab, Akash-Upade, shraddhamahindrakar217-cloud)

### Tasks
| Task | Owner | Difficulty |
|---|---|---|
| T4-001 Model Abstraction | sumeetmore334-rgb | Framework |
| T4-002 Ollama Provider | sumeetmore334-rgb | Provider |
| T4-003 Model Configuration | anujmore2006-collab | Config |
| T4-004 Model Fallback | anujmore2006-collab | Logic |
| T4-005 Prompt System | anujmore2006-collab | System |
| T4-006 Structured AI Output | Akash-Upade | Parsing |
| T4-007 Investigation Planner | Akash-Upade | Agent |
| T4-008 Evidence Analysis | Akash-Upade | Agent |
| T4-009 Correlation Engine | Akash-Upade | Agent |
| T4-010 Contradiction Detection | shraddhamahindrakar217-cloud | Logic |
| T4-011 Verification Engine | shraddhamahindrakar217-cloud | Workflow |
| T4-012 Confidence Calculation | shraddhamahindrakar217-cloud | Logic |
| T4-013 Human-Review State | shraddhamahindrakar217-cloud | Workflow |
| T4-014 AI Audit Logging | shraddhamahindrakar217-cloud | Logging |
| T4-015 Prompt Injection Defenses | shraddhamahindrakar217-cloud | Security |
| T4-016 AI Safety Controls | sumeetmore334-rgb | Safety |

### Exit Criteria
- AI pipeline runs end-to-end
- No paid API dependencies
- All AI actions logged
- Bounding rules enforced

---

## Phase 6: Product (Week 4–8)

**Owner:** Team 5 (Ishauparkar13, aryanbhosale20, dakshjadyar, Deepkasare, krishnasondigala-sys)

### Tasks
| Task | Owner | Difficulty |
|---|---|---|
| T5-001 Next.js Application | Ishauparkar13 | Setup |
| T5-002 Application Layout | Ishauparkar13 | UI |
| T5-003 Dashboard | aryanbhosale20 | UI |
| T5-004 Case Creation | aryanbhosale20 | UI |
| T5-005 Investigation Creation | aryanbhosale20 | UI |
| T5-006 Investigation Status | dakshjadyar | UI |
| T5-007 Evidence Viewer | dakshjadyar | UI |
| T5-008 Entity Viewer | Deepkasare | UI |
| T5-009 Graph View | Deepkasare | UI |
| T5-010 Timeline | Deepkasare | UI |
| T5-011 Findings View | krishnasondigala-sys | UI |
| T5-012 Verification View | krishnasondigala-sys | UI |
| T5-013 Report Generation | krishnasondigala-sys | Service |
| T5-014 Report Export | krishnasondigala-sys | Service |
| T5-015 Error/Loading States | dakshjadyar | UI |

### Exit Criteria
- All pages functional
- API integration works
- Loading/error states work

---

## Phase 7: Integration (Week 7–9)

**Owner:** All Teams

### Tasks
| Task | Owner |
|---|---|
| T1-016 Core Service Structure | Team 1 |
| T1-017 Core API | Team 1 |
| T1-018 Evidence API | Team 1 |
| T1-019 Validation/Error Handling | Team 1 |
| T2-013 Connector Health | Team 2 |
| T2-014 Connector Logging | Team 2 |
| T2-015 Connector Security Validation | Team 2 |
| T3-015 Resolution Tests | Team 3 |
| T3-016 Graph Tests | Team 3 |
| T4-017 Evaluation Dataset | Team 4 |
| T4-018 Evaluation Tests | Team 4 |
| T5-016 Accessibility | Team 5 |

### Exit Criteria
- Full pipeline works end-to-end
- No critical bugs

---

## Phase 8: Security + QA (Week 9–10)

**Owner:** Technical Architect (Ojas) + All Teams

### Tasks
| Task | Owner |
|---|---|
| T1-020 Unit Tests | Team 1 |
| T1-021 Integration Tests | Team 1 |
| T2-016 Unit Tests | Team 2 |
| T2-017 Integration Tests | Team 2 |
| T3-017 Integration Tests | Team 3 |
| T4-019 Integration Tests | Team 4 |
| T5-017 E2E Tests | Team 5 |
| T5-018 Product Integration Tests | Team 5 |

### Exit Criteria
- No security vulnerabilities
- All QA tests pass

---

## Phase 9: Demo (Week 10–11)

**Owner:** Team 5 + All Teams

### Tasks
| Task | Owner |
|---|---|
| T1-022 Documentation | Team 1 |
| T2-018 Connector Documentation | Team 2 |
| T3-018 Documentation | Team 3 |
| T4-020 Documentation | Team 4 |
| T5-019 Documentation | Team 5 |

### Exit Criteria
- Demo runs successfully
- Documentation complete

---

## Phase 10: September 19 MVP

**Owner:** All

### Exit Criteria
- MVP deployed
- All tests passing
- No critical bugs
- Team leads confirm readiness
- Technical architect confirms readiness
- CEO confirms acceptance

---

## Critical Path

```
T1-001 → T1-002 → T1-003 → T1-008 → T2-001 → Connectors
                                    → T3-001 → Entities
                                    → T4-001 → AI
                                    → T5-001 → Frontend
         T1-003 → T1-005 → T1-015 → T3-008 → Graph
         T1-003 → T1-009 → T1-011 → Evidence
```

**T1-003 (Shared Schema Package) is the single most critical task.** Everything depends on it.

---

## Parallelization Strategy

| Week | Team 1 | Team 2 | Team 3 | Team 4 | Team 5 |
|---|---|---|---|---|---|
| 1–2 | Schemas | Plan | Plan | Plan | Plan |
| 2–4 | Core APIs | Connectors | Entity types | Model abstraction | Next.js setup |
| 4–6 | Evidence API | Integration | Graph + queries | Agents | UI pages |
| 6–8 | Integration | Health + docs | API + tests | Verification | Reports + tests |
| 8–10 | Tests + docs | Tests + docs | Tests + docs | Tests + docs | E2E + docs |
| 10–11 | Demo prep | Demo prep | Demo prep | Demo prep | Demo |
