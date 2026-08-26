# Team 4 — AI + Verification

## Mission

Use AI to assist investigation analysis while keeping evidence as the source of truth. AI assists but never decides alone.

---

## Team Responsibilities

1. AI model abstraction layer
2. Ollama integration
3. Prompt management
4. Structured outputs
5. Investigation planning assistance
6. Evidence analysis
7. Correlation detection
8. Contradiction detection
9. Verification workflow
10. Confidence calculation
11. Human review states
12. AI audit logging
13. AI evaluation
14. Model fallback chain
15. Safety controls

---

## Team Ownership

```
services/ai/                — AI model abstraction, agents, prompts
services/verification/      — Contradiction detection, verification workflow
docs/ai/                    — AI documentation
tests/evaluation/           — AI evaluation tests
```

---

## Team Boundaries

### Team 4 OWNS

- All AI agent logic
- Model abstraction layer
- Prompt templates
- Verification workflow
- Contradiction detection
- AI logging and token tracking
- AI evaluation tests

### Team 4 DOES NOT OWN

- `services/core/` — Team 1
- `services/evidence/` — Team 1
- `connectors/` — Team 2
- `services/intelligence/` — Team 3
- `services/graph/` — Team 3
- `apps/web/` — Team 5

---

## What Team 4 Must NOT Modify

- Core schemas (`packages/schemas/`) without Team 1 review
- Database migrations (Team 1 only)
- Connector implementations (`connectors/`)
- Entity/graph logic (`services/intelligence/`, `services/graph/`)
- Frontend code (`apps/web/`)
- Evidence storage logic (Team 1 only)

---

## Dependencies

| Dependency | Provider | What |
|---|---|---|
| Investigation model | Team 1 | Investigation lifecycle |
| Evidence schema | Team 1 | Evidence structure |
| Observation schema | Team 1 | Observation structure |
| Entity data | Team 3 | Entities for correlation |
| Graph data | Team 3 | Relationships for analysis |
| Ollama | External (local) | AI model runtime |

---

## Dependents

| Team | What They Consume |
|---|---|
| Team 2 (Connectors) | AI-planned research tasks |
| Team 3 (Intelligence) | AI-extracted insights |
| Team 5 (Product) | Findings, verification status, AI activity |

---

## Interfaces With Other Teams

### Outgoing (Team 4 provides)

| Interface | Consumer | Description |
|---|---|---|
| Research tasks | Team 2 | AI-planned collection tasks |
| Insights | Team 3 | AI-extracted entities/relationships |
| Findings | Team 5 | Analysis results with confidence |
| Verification status | Team 5 | Human-verified findings |
| AI activity log | Team 5 | Token usage, model calls |

### Incoming (Team 4 receives)

| Interface | Provider | Description |
|---|---|---|
| Investigation | Team 1 | What to investigate |
| Evidence | Team 1 | Evidence to analyze |
| Entities | Team 3 | Entities for correlation |
| Graph | Team 3 | Relationships for analysis |

---

## AI Pipeline

```
OBJECTIVE
    ↓
PLANNER AGENT → Research Tasks[] → Team 2 connectors
    ↓
COLLECTED EVIDENCE[]
    ↓
ANALYSIS AGENT → Insights, Entities, Relationships → Team 3
    ↓
CORRELATION AGENT → Correlations, Patterns
    ↓
SUPERVISOR AGENT → Pipeline Health, Completeness
    ↓
CONTRADICTION DETECTION → Contradictions, Verified Findings
    ↓
FINDINGS[]
    ↓
REPORT → Team 5
```

---

## Agent Bounding Rules

| Constraint | Limit |
|---|---|
| Max recursion depth | 3 |
| Max tool calls per invocation | 10 |
| Max runtime | 120 seconds |
| Max concurrent agents | 3 |
| Max evidence items per analysis | 50 |
| Max tokens per invocation | 8,000 |
| Max retries | 2 |

---

## CRITICAL RULE — AI Is Not the Source of Truth

- Evidence is the source of truth
- AI output must reference evidence
- AI output carries confidence scores
- AI output requires human verification
- AI cannot modify evidence
- AI cannot change investigation state without human approval
- AI cannot autonomously execute external actions

---

## Task List

See `docs/tasks/team-4-ai.md` for the complete task list.

| Task | Title | Difficulty |
|---|---|---|
| T4-001 | Model abstraction | Hard |
| T4-002 | Ollama provider | Hard |
| T4-003 | Model configuration | Medium |
| T4-004 | Model fallback | Medium |
| T4-005 | Prompt system | Medium |
| T4-006 | Structured AI output | Hard |
| T4-007 | Investigation planner | Hard |
| T4-008 | Evidence analysis | Hard |
| T4-009 | Correlation engine | Hard |
| T4-010 | Contradiction detection | Hard |
| T4-011 | Verification engine | Hard |
| T4-012 | Confidence calculation | Medium |
| T4-013 | Human-review state | Medium |
| T4-014 | AI audit logging | Medium |
| T4-015 | Prompt injection defenses | Hard |
| T4-016 | AI safety controls | Hard |
| T4-017 | Evaluation dataset | Medium |
| T4-018 | Evaluation tests | Hard |
| T4-019 | Integration tests | Hard |
| T4-020 | Documentation | Easy |

---

## Git Workflow

1. Feature branch from `team/4-ai-verification`
2. Implement feature
3. Write tests
4. Self-review
5. PR to `team/4-ai-verification`
6. Team lead reviews
7. Merge to `team/4-ai-verification`
8. Technical architect reviews `team/4-ai-verification` → `main`

**Never push directly to `main`.**

---

## Testing Expectations

- Unit tests for model abstraction
- Integration tests with Ollama (mock or real)
- Evaluation tests for prompt quality
- Bounded-runtime tests
- Contradiction detection tests
- Prompt injection resistance tests
- Token tracking tests

---

## Documentation Expectations

- Model configuration guide
- Prompt template documentation
- Agent bounding rules documentation
- Evaluation methodology
- AI safety controls documentation

---

## Security Rules

- AI models run locally (Ollama) — no data leaves the machine
- AI cannot autonomously execute external actions
- AI cannot modify evidence
- AI cannot change investigation state without human approval
- All AI actions are logged
- Prompt injection protection on all user-provided text
- No AI model can access credentials or secrets
- No paid AI APIs under any circumstances
- `AI_ALLOW_PAID=false` enforced in configuration

---

## AI Coding Rules

- Use OpenCode + Ollama (free/local only)
- No paid AI APIs
- AI explains before modifying
- AI suggests implementation plan first
- Human reviews all AI output
- AI never decides architecture or schema changes alone
- AI never bypasses bounding rules
- AI never introduces paid API dependencies

---

## Definition of Done

- [ ] Code compiles with TypeScript strict mode
- [ ] All tests pass
- [ ] AI bounding rules enforced
- [ ] No paid API dependencies
- [ ] All AI actions logged
- [ ] Prompt injection defenses active
- [ ] Documentation updated
- [ ] PR reviewed and approved
- [ ] Evidence is source of truth verified

---

## Current Team Members

Head Intern: Sumeet Nandu More (`sumeetmore334-rgb`)

| Member | Role | Task Allocations |
|---|---|---|
| sumeetmore334-rgb | Head Intern | T4-001, T4-002, T4-016 |
| anujmore2006-collab | Intern | T4-003, T4-004, T4-005, T4-017 |
| Akash-Upade | Intern | T4-006, T4-007, T4-008, T4-009 |
| shraddhamahindrakar217-cloud | Intern | T4-010, T4-011, T4-012, T4-013, T4-014, T4-015 |
