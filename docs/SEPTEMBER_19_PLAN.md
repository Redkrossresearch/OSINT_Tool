# September 19 Plan

**Target Date:** 19 September 2026
**Total Duration:** ~25 days from 25 August 2026

---

## Phase 0 — Repository Audit + Governance (Aug 25-27)

| Task | Status | Owner |
|---|---|---|
| Repository audit | DONE | Architect |
| Hardware assessment | DONE | Architect |
| Ollama model assessment | DONE | Architect |
| Create governance documentation | IN PROGRESS | Architect |
| Create MVP scope | IN PROGRESS | Architect |
| Create team structure | IN PROGRESS | Architect |
| Create task breakdown | IN PROGRESS | Architect |
| Create AI strategy | IN PROGRESS | Architect |
| Receive Excel roster | PENDING | CEO |
| Create GitHub teams | PENDING | CEO/Admin |
| Configure branch protection | PENDING | CEO/Admin |

---

## Phase 1 — Architecture + Contracts (Aug 27 - Sep 1)

| Task | Owner | Dependencies |
|---|---|---|
| Finalize architecture documentation | Tech Architect | Phase 0 |
| Create ADRs | Tech Architect | Phase 0 |
| Define shared schema contracts | Team 1 Lead | Tech Architect |
| Define connector interface contract | Team 2 Lead | Team 1 |
| Define entity/relationship contracts | Team 3 Lead | Team 1 |
| Define AI pipeline contracts | Team 4 Lead | Team 1 |
| Define API contracts for frontend | Team 5 Lead | All Teams |
| Set up monorepo (T1-001) | Team 1 | Phase 0 |
| Set up database (T1-002) | Team 1 | T1-001 |

---

## Phase 2 — Core + Evidence (Sep 1-8)

| Task | Owner | Dependencies |
|---|---|---|
| T1-003 Case Model + API | Team 1 | T1-002 |
| T1-004 Investigation Model | Team 1 | T1-003 |
| T1-005 Objective Schema | Team 1 | T1-001 |
| T1-006 Evidence Schema + Hashing | Team 1 | T1-001 |
| T1-007 Evidence Storage | Team 1 | T1-002, T1-006 |
| T1-008 Source + Provenance | Team 1 | T1-001 |
| T1-009 Observation Schema | Team 1 | T1-006, T1-008 |
| T1-010 Audit Events | Team 1 | T1-002, T1-004 |
| T1-011 Shared Schema Package | Team 1 | All T1-XXX |

---

## Phase 3 — Connectors (Sep 3-10, parallel with Phase 2)

| Task | Owner | Dependencies |
|---|---|---|
| T2-001 Connector Interface | Team 2 | T1-009 (schema) |
| T2-002 Connector Registry | Team 2 | T2-001 |
| T2-003 Web Search Connector | Team 2 | T2-001 |
| T2-004 DNS/RDAP Connector | Team 2 | T2-001 |
| T2-005 GitHub Public Connector | Team 2 | T2-001 |
| T2-006 Certificate Intel Connector | Team 2 | T2-001 |
| T2-007 Web Fetch Connector | Team 2 | T2-001 |
| T2-008 Integration Tests | Team 2 | T2-003-T2-007 |

---

## Phase 4 — Entity + Graph (Sep 5-12, parallel)

| Task | Owner | Dependencies |
|---|---|---|
| T3-001 Entity Schema | Team 3 | T1-001 |
| T3-002 Relationship Schema | Team 3 | T3-001 |
| T3-003 Entity Extraction | Team 3 | T3-001, T1-009 |
| T3-004 Entity Normalization | Team 3 | T3-001 |
| T3-005 Entity Resolution | Team 3 | T3-003, T3-004 |
| T3-006 Graph DB Schema | Team 3 | T1-002, T3-001 |
| T3-007 Graph Service | Team 3 | T3-006 |
| T3-008 Graph API | Team 3 | T3-007 |
| T3-009 Timeline Service | Team 3 | T3-007, T1-010 |
| T3-010 Integration Tests | Team 3 | All T3-XXX |

---

## Phase 5 — AI + Verification (Sep 7-14, parallel)

| Task | Owner | Dependencies |
|---|---|---|
| T4-001 Model Abstraction | Team 4 | T1-001 |
| T4-002 Ollama Integration | Team 4 | T4-001 |
| T4-003 Planner Agent | Team 4 | T4-001, T1-004 |
| T4-004 Analysis Agent | Team 4 | T4-001, T1-006 |
| T4-005 Correlation Agent | Team 4 | T4-001, T4-004 |
| T4-006 Supervisor Agent | Team 4 | T4-003, T4-004, T4-005 |
| T4-007 Contradiction Detection | Team 4 | T4-001, T1-006 |
| T4-008 Verification Workflow | Team 4 | T4-007 |
| T4-009 AI Logging | Team 4 | T4-001, T1-002 |
| T4-010 Evaluation Tests | Team 4 | All T4-XXX |

---

## Phase 6 — Frontend + Reporting (Sep 8-15, parallel)

| Task | Owner | Dependencies |
|---|---|---|
| T5-001 Next.js Setup | Team 5 | T1-001 |
| T5-002 Dashboard + Case List | Team 5 | T5-001, T1-003 |
| T5-003 Case/Investigation Creation | Team 5 | T5-001, T1-003, T1-004 |
| T5-004 Investigation Progress | Team 5 | T5-001, T1-004 |
| T5-005 Evidence Viewer | Team 5 | T5-001, T1-007 |
| T5-006 Entity Viewer | Team 5 | T5-001, T3-008 |
| T5-007 Graph Visualization | Team 5 | T5-001, T3-008 |
| T5-008 Timeline View | Team 5 | T5-001, T3-009 |
| T5-009 Findings View | Team 5 | T5-001, T4-008 |
| T5-010 Report Generation | Team 5 | T5-001, T1-007, T4-008 |
| T5-011 E2E Tests | Team 5 | All T5-XXX |

---

## Phase 7 — Integration (Sep 13-16)

| Task | Owner | Dependencies |
|---|---|---|
| Team 1 → Team 2 integration | Tech Architect | Phase 2, Phase 3 |
| Team 2 → Team 3 integration | Tech Architect | Phase 3, Phase 4 |
| Team 3 → Team 4 integration | Tech Architect | Phase 4, Phase 5 |
| All → Team 5 integration | Tech Architect | Phase 6 |
| Full pipeline test | All Teams | All integration |
| Fix integration issues | All Teams | Full pipeline |

---

## Phase 8 — Security + QA (Sep 15-17)

| Task | Owner | Dependencies |
|---|---|---|
| Security review | Tech Architect | Phase 7 |
| SSRF prevention testing | Tech Architect | Phase 7 |
| Prompt injection testing | Team 4 | Phase 7 |
| Input validation review | All Teams | Phase 7 |
| Performance testing | Tech Architect | Phase 7 |
| Bug fixes | All Teams | QA findings |

---

## Phase 9 — Customer Demo (Sep 17-18)

| Task | Owner | Dependencies |
|---|---|---|
| Demo scenario preparation | Tech Architect | Phase 8 |
| Demo rehearsal | All Teams | Phase 8 |
| Final polish | All Teams | Phase 8 |
| Demo environment setup | Tech Architect | Phase 8 |

---

## Phase 10 — Release (Sep 19)

| Task | Owner | Dependencies |
|---|---|---|
| Final review | Tech Architect | Phase 9 |
| Release to production | Tech Architect | Final review |
| Documentation finalized | All Teams | All |
| Post-demo feedback | CEO + Teams | Release |

---

## Critical Milestones

| Date | Milestone |
|---|---|
| Aug 27 | Phase 0 complete — governance established |
| Sep 1 | Phase 1 complete — contracts finalized |
| Sep 8 | Phase 2 complete — core/evidence services working |
| Sep 10 | Phase 3 complete — connectors producing observations |
| Sep 12 | Phase 4 complete — entities and graph working |
| Sep 14 | Phase 5 complete — AI pipeline operational |
| Sep 15 | Phase 6 complete — frontend functional |
| Sep 16 | Phase 7 complete — full integration |
| Sep 17 | Phase 8 complete — security/QA passed |
| Sep 18 | Phase 9 complete — demo rehearsed |
| Sep 19 | **RELEASE** |

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| Excel roster delayed | Begin with team leads only |
| GitHub admin access denied | Generate manual instructions for CEO |
| Hardware insufficient for 8B model | Fall back to 4B or tinyllama |
| Integration issues | Allocate extra time in Phase 7 |
| Scope creep | Enforce MVP_SCOPE.md strictly |
| AI quality issues | Use smaller tasks, better prompts |
| Team velocity unknown | Daily standups, early flagging |
