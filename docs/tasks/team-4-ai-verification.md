# Tasks — Team 4: AI + Verification

## T4-001: Model Abstraction Layer

**TEAM:** 4 — AI + Verification
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Build a provider-agnostic model abstraction layer for AI interactions.

### Dependencies
T1-001

### Input
- Monorepo structure

### Output
- `services/ai/src/providers/model-interface.ts`
- `services/ai/src/providers/ollama-provider.ts`
- `services/ai/src/providers/provider-factory.ts`
- Unit tests

### Allowed Files
- `services/ai/src/providers/*.ts`
- `services/ai/src/__tests__/providers/*.test.ts`

### Implementation Notes
- Abstract AIModel interface
- OllamaProvider implementation
- Provider factory (selects provider based on config)
- Health check per provider
- Token counting
- Structured output support (JSON mode)

### Acceptance Criteria
- [ ] Interface is defined
- [ ] Ollama provider works
- [ ] Provider can be switched via configuration
- [ ] Health checks work

---

## T4-002: Ollama Integration + Fallback

**TEAM:** 4 — AI + Verification
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement Ollama integration with model fallback chain.

### Dependencies
T4-001

### Input
- Model abstraction layer

### Output
- `services/ai/src/providers/ollama-provider.ts` (enhanced)
- `services/ai/src/providers/fallback-chain.ts`
- Configuration integration
- Unit tests

### Allowed Files
- `services/ai/src/providers/ollama-provider.ts`
- `services/ai/src/providers/fallback-chain.ts`
- `services/ai/src/config/ai-config.ts`
- `services/ai/src/__tests__/fallback.test.ts`

### Implementation Notes
- Fallback: qwen3:8b → qwen3:4b → tinyllama → STOP
- Never falls back to paid provider
- Clear error message when no model available
- Configuration via environment variables

### Acceptance Criteria
- [ ] Fallback chain works in order
- [ ] Paid providers are never called
- [ ] Clear error when all models unavailable

---

## T4-003: Planner Agent

**TEAM:** 4 — AI + Verification
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement the Planner agent that decomposes objectives into research tasks.

### Dependencies
T4-001, T1-004

### Input
- Model abstraction, Investigation model

### Output
- `services/ai/src/agents/planner-agent.ts`
- Prompt template
- Unit tests

### Allowed Files
- `services/ai/src/agents/planner-agent.ts`
- `services/ai/src/prompts/planner.ts`
- `services/ai/src/__tests__/agents/planner.test.ts`

### Implementation Notes
- Input: Investigation objective
- Output: ResearchTask[] (queries for connectors)
- Bounded: max 10 tasks per plan
- Structured JSON output

### Acceptance Criteria
- [ ] Produces research tasks from objective
- [ ] Tasks are valid connector queries
- [ ] Bounded to 10 tasks max

---

## T4-004: Analysis Agent

**TEAM:** 4 — AI + Verification
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement the Analysis agent that processes evidence and extracts insights.

### Dependencies
T4-001, T1-006

### Input
- Model abstraction, Evidence schema

### Output
- `services/ai/src/agents/analysis-agent.ts`
- Prompt template
- Unit tests

### Allowed Files
- `services/ai/src/agents/analysis-agent.ts`
- `services/ai/src/prompts/analysis.ts`
- `services/ai/src/__tests__/agents/analysis.test.ts`

### Implementation Notes
- Input: Evidence[]
- Output: Insights (entities, relationships, key facts)
- Bounded: max 50 evidence items per batch
- Structured JSON output

### Acceptance Criteria
- [ ] Extracts insights from evidence
- [ ] Output is structured JSON
- [ ] Bounded processing

---

## T4-005: Correlation Agent

**TEAM:** 4 — AI + Verification
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement the Correlation agent that finds connections across evidence.

### Dependencies
T4-001, T4-004

### Input
- Model abstraction, Analysis results

### Output
- `services/ai/src/agents/correlation-agent.ts`
- Prompt template
- Unit tests

### Allowed Files
- `services/ai/src/agents/correlation-agent.ts`
- `services/ai/src/prompts/correlation.ts`
- `services/ai/src/__tests__/agents/correlation.test.ts`

### Implementation Notes
- Input: Insights from multiple evidence items
- Output: Correlations, patterns, connections
- Confidence scores for correlations
- Bounded: max 3 correlation passes

### Acceptance Criteria
- [ ] Finds cross-evidence connections
- [ ] Confidence scores are assigned
- [ ] Bounded passes

---

## T4-006: Supervisor Agent

**TEAM:** 4 — AI + Verification
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement the Supervisor agent that monitors the AI pipeline.

### Dependencies
T4-003, T4-004, T4-005

### Input
- All agent implementations

### Output
- `services/ai/src/agents/supervisor-agent.ts`
- Pipeline orchestrator
- Unit tests

### Allowed Files
- `services/ai/src/agents/supervisor-agent.ts`
- `services/ai/src/pipeline/pipeline-orchestrator.ts`
- `services/ai/src/__tests__/agents/supervisor.test.ts`

### Implementation Notes
- Orchestrates: Plan → Collect → Analyze → Correlate
- Monitors agent health
- Handles errors and retries
- Logs all AI actions
- Enforces bounding rules

### Acceptance Criteria
- [ ] Pipeline runs end-to-end
- [ ] Errors are handled gracefully
- [ ] All actions are logged
- [ ] Bounding rules are enforced

---

## T4-007: Contradiction Detection

**TEAM:** 4 — AI + Verification
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement contradiction detection across findings and evidence.

### Dependencies
T4-001, T1-006

### Input
- Model abstraction, Evidence, Findings

### Output
- `services/verification/src/services/contradiction-detector.ts`
- Unit tests

### Allowed Files
- `services/verification/src/services/contradiction-detector.ts`
- `services/verification/src/__tests__/contradiction-detector.test.ts`

### Implementation Notes
- Compares findings against each other
- Compares findings against raw evidence
- Flags contradictions with evidence references
- Confidence score for contradiction likelihood

### Acceptance Criteria
- [ ] Contradictions are detected
- [ ] Evidence references are provided
- [ ] Confidence scores are assigned

---

## T4-008: Verification Workflow

**TEAM:** 4 — AI + Verification
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement verification status tracking and human review workflow.

### Dependencies
T4-007

### Input
- Contradiction detection

### Output
- `services/verification/src/services/verification-service.ts`
- Verification API
- Unit tests

### Allowed Files
- `services/verification/src/services/verification-service.ts`
- `services/verification/src/routes/verification.routes.ts`
- `services/verification/src/__tests__/verification-service.test.ts`

### Implementation Notes
- Finding statuses: UNVERIFIED, VERIFIED, CONTRADICTED
- Human can verify or override
- Verification audit trail
- API for frontend consumption

### Acceptance Criteria
- [ ] Findings can be verified
- [ ] Verification status is tracked
- [ ] Audit trail is maintained

---

## T4-009: AI Logging + Token Tracking

**TEAM:** 4 — AI + Verification
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement comprehensive AI activity logging and token usage tracking.

### Dependencies
T4-001, T1-002

### Input
- Model abstraction, Database

### Output
- `services/ai/src/logging/ai-logger.ts`
- `services/ai/src/logging/token-tracker.ts`
- Prisma schema additions
- Unit tests

### Allowed Files
- `services/ai/src/logging/*.ts`
- `services/core/prisma/schema.prisma` (additions)
- `services/ai/src/__tests__/logging/*.test.ts`

### Implementation Notes
- Log every AI call: model, tokens, duration, prompt hash, result summary
- Track cumulative token usage per investigation
- Alert when approaching limits
- Privacy: never log full prompts or responses in production

### Acceptance Criteria
- [ ] All AI calls are logged
- [ ] Token usage is tracked
- [ ] Limits are enforced

---

## T4-010: AI Evaluation Tests

**TEAM:** 4 — AI + Verification
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Create evaluation test suite for AI agent quality.

### Dependencies
T4-003, T4-004, T4-005, T4-006, T4-007

### Input
- All agent implementations

### Output
- `tests/evaluation/planner-eval.test.ts`
- `tests/evaluation/analysis-eval.test.ts`
- `tests/evaluation/correlation-eval.test.ts`
- Test fixtures (known-good inputs/outputs)

### Allowed Files
- `tests/evaluation/*.test.ts`
- `tests/evaluation/fixtures/*.json`

### Implementation Notes
- Known-good test cases
- Output quality scoring
- Regression detection
- Run with `pnpm test:eval`

### Acceptance Criteria
- [ ] Evaluation tests pass
- [ ] Quality metrics are tracked
- [ ] Regression detection works
