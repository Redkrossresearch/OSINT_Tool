# SEPTEMBER 19, 2026 — MVP EXECUTION SCHEDULE

## Overview

| Field | Value |
|---|---|
| **TARGET** | September 19, 2026 |
| **TODAY** | August 26, 2026 |
| **DAYS REMAINING** | 24 working days (approx.) |
| **TOTAL TASKS** | 97 |
| **TOTAL EFFORT** | 168 points |

---

## PHASES (Dependency-Based, Not Arbitrary Dates)

### Phase 1: Foundation (Aug 27–29) — 3 days

| Task | Description | Owner | Effort |
|---|---|---|---|
| T1-001 | Repository/Monorepo Foundation | Preetam-06 | 5 |
| T1-002 | Workspace/Package Configuration | Preetam-006 | 3 |

- Teams 2–5: Read docs, understand architecture, plan implementation
- **Exit criterion:** pnpm monorepo working, all packages recognized

### Phase 2: Schema Contracts (Aug 30–Sep 2) — 4 days

| Task | Description | Owner | Effort | Dependency |
|---|---|---|---|---|
| T1-003 | Shared Zod Schema Package | Dinesh-Kumar-Ved | 8 | T1-002 |
| T1-004 | Case Schema | Dinesh-Kumar-Ved | 5 | T1-003 |
| T1-006 | Objective Schema | Dinesh-Kumar-Ved | 5 | T1-003 |
| T1-007 | Source Schema | Zrahul2024 | 5 | T1-003 |
| T1-010 | Evidence Provenance Model | Zrahul2024 | 5 | T1-003 |
| T5-001 | Next.js Application | Ishauparkar13 | 5 | T1-003 |
| T4-001 | Model Abstraction | sumeetmore334-rgb | 5 | T1-003 |
| T3-001 | Entity Schema | hirveabhishek2006-design | 5 | T1-003 |

- **Exit criterion:** All schema packages published, all teams can import

### Phase 3: Core Expansion (Sep 3–9) — 7 days

| Task | Description | Owner | Effort |
|---|---|---|---|
| T1-005 | Investigation Schema | ANDY15K | 5 |
| T1-008 | Observation Schema | Zrahul2024 | 8 |
| T1-009 | Evidence Schema | jadhavsarthak374-ai | 5 |
| T1-011 | Evidence Hashing | jadhavsarthak374-ai | 5 |
| T1-012 | Evidence Metadata | Dinesh-Kumar-Ved | 3 |
| T1-013 | Audit Event Model | ANDY15K | 5 |
| T1-014 | Investigation Lifecycle | ANDY15K | 5 |
| T3-002–T3-006 | Entity/Relationship schemas (Team 3) | Team 3 | 25 |
| T4-002–T4-006 | Model providers, prompts (Team 4) | Team 4 | 25 |
| T5-002 | Application Layout | Ishauparkar13 | 3 |
| T5-015 | Error/Loading States | dakshjadyar | 3 |
| T5-016 | Accessibility | dakshjadyar | 3 |

- **CRITICAL:** T1-008 unblocks Teams 2, 3
- **Exit criterion:** All schemas complete, entity types defined, model abstraction working

### Phase 4: Database + Connectors (Sep 10–14) — 5 days

| Task | Description | Owner | Effort |
|---|---|---|---|
| T1-015 | Database/Prisma Foundation | jadhavsarthak374-ai | 8 |
| T1-016 | Core Service Structure | Preetam-06 | 5 |
| T1-017 | Core API | Preetam-06 | 5 |
| T1-018 | Evidence API | jadhavsarthak374-ai | 5 |
| T2-001–T2-015 | All connector work (Team 2) | Team 2 | 45 |
| T3-007–T3-014 | Graph and relationship work (Team 3) | Team 3 | 40 |
| T4-007–T4-010 | AI agents (Team 4) | Team 4 | 20 |
| T5-003–T5-010 | Frontend pages (Team 5) | Team 5 | 24 |

- **CRITICAL:** T1-015 unblocks Team 3 graph work
- **Exit criterion:** Database working, all connectors functional, core API complete

### Phase 5: AI + Verification (Sep 15–17) — 3 days

| Task | Description | Owner | Effort |
|---|---|---|---|
| T4-011–T4-016 | Verification engine, safety controls (Team 4) | Team 4 | 18 |
| T3-015–T3-016 | Resolution and graph tests (Team 3) | Team 3 | 8 |
| T5-011–T5-014 | Findings, verification, reports (Team 5) | Team 5 | 12 |

- **Exit criterion:** AI pipeline complete, verification working, reports generating

### Phase 6: Integration + QA (Sep 18–19) — 2 days

| Task | Description | Owner | Effort |
|---|---|---|---|
| T1-019–T1-022 | Validation, tests, docs (Team 1) | Team 1 | 16 |
| T2-016–T2-018 | Connector tests, docs (Team 2) | Team 2 | 12 |
| T3-017–T3-018 | Intelligence tests, docs (Team 3) | Team 3 | 10 |
| T4-017–T4-020 | Evaluation, tests, docs (Team 4) | Team 4 | 12 |
| T5-017–T5-019 | E2E tests, docs (Team 5) | Team 5 | 14 |

- **Exit criterion:** All tests passing, documentation complete, MVP ready

---

## CRITICAL PATH

The longest dependency chains that determine the minimum project duration:

```
Chain 1 (Connectors):
T1-001 → T1-002 → T1-003 → T1-008 → T2-001 → [connectors] → T2-016 → T2-017 → T2-018

Chain 2 (Core Platform):
T1-001 → T1-002 → T1-003 → T1-005 → T1-013 → T1-015 → T1-016 → T1-017 → T1-019 → T1-020 → T1-021 → T1-022
```

Any delay on these chains directly delays the MVP.

---

## PARALLEL EXECUTION MATRIX

| Phase | Team 1 (Core) | Team 2 (Connectors) | Team 3 (Intelligence) | Team 4 (AI) | Team 5 (Frontend) |
|---|---|---|---|---|---|
| **Phase 1** (Aug 27–29) | ✅ Monorepo setup | 📖 Read & plan | 📖 Read & plan | 📖 Read & plan | 📖 Read & plan |
| **Phase 2** (Aug 30–Sep 2) | ✅ Schemas | 📖 Plan connectors | 📖 Plan entity model | ✅ Model abstraction | ✅ Next.js scaffold |
| **Phase 3** (Sep 3–9) | ✅ More schemas | 📖 Finalize connector plan | ✅ Entity/relationship schemas | ✅ Model providers/prompts | ✅ Layout, error states |
| **Phase 4** (Sep 10–14) | ✅ Database, API | ✅ ALL connectors | ✅ Graph/relationships | ✅ AI agents | ✅ ALL frontend pages |
| **Phase 5** (Sep 15–17) | 🔄 Support | 🔄 Support | ✅ Resolution, tests | ✅ Verification engine | ✅ Findings, reports |
| **Phase 6** (Sep 18–19) | ✅ Validation, docs | ✅ Connector tests | ✅ Intelligence tests | ✅ Eval, tests | ✅ E2E tests |

---

## RISK REGISTER

| # | Risk | Impact | Severity | Mitigation |
|---|---|---|---|---|
| 1 | **T1-001 delayed** | Everything blocked | 🔴 CRITICAL | Assign backup owner, start Aug 27 AM |
| 2 | **T1-003 delayed** | 42 tasks blocked | 🔴 CRITICAL | Dinesh-Kumar-Ved priority #1, no other tasks |
| 3 | **T1-008 delayed** | Teams 2, 3 blocked | 🔴 CRITICAL | Zrahul2024 dedicated, daily check-in |
| 4 | **T1-015 delayed** | Team 3 graph work blocked | 🟠 HIGH | jadhavsarthak374-ai focused, no context switching |
| 5 | **Team 4 overloaded** | 20 tasks, 4 people | 🟠 HIGH | Prioritize critical path tasks, defer non-essential |
| 6 | **Team 5 overloaded** | 19 tasks, 39 effort (highest load) | 🟠 HIGH | Consider scope reduction or resource addition |
| 7 | **2 interns missing** | Gaps in Teams 3 and 5 | 🟡 MEDIUM | Redistribute tasks, adjust scope |

---

## REQUIRED ACTIONS (Milestones)

| # | Action | Deadline | Owner | Blocker? |
|---|---|---|---|---|
| 1 | Complete T1-001 | Aug 28 | Preetam-06 | Everything |
| 2 | Complete T1-003 | Sep 1 | Dinesh-Kumar-Ved | 42 tasks |
| 3 | Complete T1-008 | Sep 8 | Zrahul2024 | Teams 2, 3 |
| 4 | Complete T1-015 | Sep 12 | jadhavsarthak374-ai | Team 3 graph |
| 5 | All connectors done | Sep 14 | Team 2 | Phase 5 |
| 6 | All AI agents done | Sep 16 | Team 4 | Verification |
| 7 | All frontend pages done | Sep 16 | Team 5 | Integration |
| 8 | Full integration | Sep 18 | All teams | MVP |
| 9 | **MVP demo** | **Sep 19** | **Everyone** | **🎯 TARGET** |

---

## CONFLICTS AND GAPS

### Resource Conflicts

| Issue | Details | Impact | Recommendation |
|---|---|---|---|
| **Team 4 understaffed** | Only 4 members for 20 tasks | High velocity required | Prioritize critical path, cut scope if needed |
| **Team 5 overloaded** | 39 effort points (highest of any team) | Burnout risk, quality risk | Add resource or reduce scope by ~8 points |
| **2 missing interns** | `lahanesakahi-create`, `khushishukla3008` | Gaps in Teams 3, 5 | Redistribute 15+ effort points across remaining members |

### Dependency Conflicts

| Dependency | Risk | Mitigation |
|---|---|---|
| T1-003 blocks 42 tasks | Single point of failure | Dinesh-Kumar-Ved dedicated, no other assignments until complete |
| T1-008 blocks Teams 2, 3 | Late unblocking | Start Team 2 connector planning in Phase 1 (read-only) |
| T1-015 blocks Team 3 graph | Database prerequisite | jadhavsarthak374-ai starts in Phase 3, dedicated through Phase 4 |

### Scope Gaps

| Gap | Impact | Resolution |
|---|---|---|
| No dedicated QA role | Testing compressed into Phase 6 | Each team owns their tests; Team 1 leads integration |
| No dedicated DevOps | Deployment not explicitly scheduled | Include in T1-019–T1-022 |
| Missing intern coverage | 15+ effort points unassigned | Redistribute or defer non-critical tasks |

---

## TEAM WORKLOAD SUMMARY

| Team | Members | Tasks | Effort Points | Avg Effort/Person |
|---|---|---|---|---|
| Team 1 (Core) | 3 | 22 | 41 | 13.7 |
| Team 2 (Connectors) | 3 | 18 | 57 | 19.0 |
| Team 3 (Intelligence) | 3 | 16 | 43 | 14.3 |
| Team 4 (AI) | 4 | 20 | 35 | 8.8 |
| Team 5 (Frontend) | 3 | 19 | 39 | 13.0 |
| **TOTAL** | **16** | **97** | **168** | **10.5** |

### Workload Distribution Concerns

```
Team 2: ████████████████████░░░░░ 57 pts (HIGHEST)
Team 3: ██████████████░░░░░░░░░░░ 43 pts
Team 1: █████████████░░░░░░░░░░░░ 41 pts
Team 5: █████████████░░░░░░░░░░░░ 39 pts
Team 4: ███████████░░░░░░░░░░░░░░ 35 pts (LOWEST per person: 8.8)
```

---

## PHASE TIMELINE (GANTT-STYLE)

```
Aug 27    Aug 30    Sep 3     Sep 10    Sep 15    Sep 18  Sep 19
  |         |         |         |         |         |       |
  |-- P1 ---|-- P2 ---|--- P3 --|-- P4 ---|-- P5 --|-- P6--|→ MVP
  3 days    4 days    7 days    5 days    3 days   2 days  |
  |         |         |         |         |         |       |
  T1-001    T1-003    T1-008    T1-015    T4-011    ALL    🎯
  T1-002    T1-004    T1-009    T1-016    T3-015    TESTS
            T1-006    T1-010    T1-017    T5-011
            T1-007    T1-011    T1-018    T4-016
            T5-001    T1-012    T2-xxx
            T4-001    T1-013    T3-xxx
            T3-001    T1-014    T4-xxx
                      T3-xxx    T5-xxx
                      T4-xxx
                      T5-xxx
```

---

## DAILY STANDUP FOCUS AREAS

| Date Range | Key Questions |
|---|---|
| Aug 27–29 | Is monorepo working? Can all packages be recognized? |
| Aug 30–Sep 2 | Is T1-003 on track? Can other teams import schemas? |
| Sep 3–9 | Is T1-008 on track? Are entity types defined? Model abstraction working? |
| Sep 10–14 | Is database foundation done? Are connectors progressing? Frontend pages started? |
| Sep 15–17 | Is verification engine working? Are reports generating? |
| Sep 18–19 | Are all tests passing? Is documentation complete? Is MVP demo-ready? |

---

## ESCALATION PROTOCOL

| Trigger | Action | Owner |
|---|---|---|
| Any Phase 1 task delayed > 1 day | All-hands standup, reassign resources | Project lead |
| T1-003 delayed > 2 days | Escalate to sponsor, scope review | Project lead |
| T1-008 delayed > 2 days | Team 2/3 replan, identify workarounds | Project lead |
| Team 4/5 velocity < 80% | Scope reduction meeting | Tech leads |
| Sep 15: any team < 70% complete | Emergency scope cut to core MVP | All tech leads |

---

*Generated: August 26, 2026 | Target: September 19, 2026 | 24 working days remaining*
