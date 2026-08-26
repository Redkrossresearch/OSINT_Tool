# Tasks — Team 4: AI + Verification

## T4-001 — Model Abstraction

**Team:** Team 4 — AI + Verification
**Objective:** Build a provider-agnostic model abstraction layer for AI interactions.
**Why:** Abstraction allows switching models without changing agent code.

### Dependencies
T1-003 (Schema package)

### Inputs
- Monorepo structure

### Outputs
- `services/ai/src/providers/model-interface.ts`
- `services/ai/src/providers/provider-factory.ts`
- Unit tests

### Allowed Files
- `services/ai/src/providers/`

### Do Not Modify
- Other team directories

### Implementation Guidance
1. Define `AIModel` interface: `complete()`, `isAvailable()`, `health()`
2. Define `CompleteOptions`: max_tokens, temperature, system_prompt, format
3. Define `CompleteResult`: content, tokens_used, model, duration_ms
4. Create provider factory

### AI Instructions
Ask AI to explain the Strategy design pattern for provider abstraction.

### Tests
- Interface defined
- Factory creates providers
- Types correct

### Documentation
- Model abstraction documentation

### Acceptance Criteria
- [ ] Interface defined
- [ ] Factory works
- [ ] Types correct

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-002 — Ollama Provider

**Team:** Team 4 — AI + Verification
**Objective:** Implement Ollama provider for local AI model interaction.
**Why:** Ollama is the primary (and only) AI runtime for this project.

### Dependencies
T4-001

### Inputs
- Model abstraction layer

### Outputs
- `services/ai/src/providers/ollama-provider.ts`
- Ollama API client
- Unit tests

### Allowed Files
- `services/ai/src/providers/`

### Do Not Modify
- Model interface

### Implementation Guidance
1. Implement `AIModel` interface for Ollama
2. Use Ollama REST API (localhost:11434)
3. Support JSON mode for structured output
4. Health check via /api/tags

### AI Instructions
Ask AI to explain Ollama REST API endpoints.

### Tests
- Provider implements interface
- Health check works
- Completion works (mock or real)

### Documentation
- Ollama provider documentation

### Acceptance Criteria
- [ ] Provider implements interface
- [ ] Health check works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-003 — Model Configuration

**Team:** Team 4 — AI + Verification
**Objective:** Implement model configuration management (which models to use, parameters).
**Why:** Different agents may need different models and parameters.

### Dependencies
T4-001

### Inputs
- Model abstraction

### Outputs
- `services/ai/src/config/ai-config.ts`
- Configuration schema
- Unit tests

### Allowed Files
- `services/ai/src/config/`

### Do Not Modify
- Provider files

### Implementation Guidance
1. Define model configuration per agent
2. Environment-based configuration
3. Default model chain
4. Parameter overrides per agent type

### AI Instructions
Ask AI to explain hierarchical configuration patterns.

### Tests
- Configuration loads correctly
- Defaults work
- Overrides work

### Documentation
- Configuration reference

### Acceptance Criteria
- [ ] Configuration works
- [ ] Defaults correct
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-004 — Model Fallback

**Team:** Team 4 — AI + Verification
**Objective:** Implement model fallback chain with paid API protection.
**Why:** If one model is unavailable, the system should try the next without using paid APIs.

### Dependencies
T4-001, T4-003

### Inputs
- Model abstraction, Configuration

### Outputs
- `services/ai/src/providers/fallback-chain.ts`
- Unit tests

### Allowed Files
- `services/ai/src/providers/`

### Do Not Modify
- Provider files

### Implementation Guidance
1. Fallback chain: qwen3:8b → qwen3:4b → tinyllama → STOP
2. **Never** fall back to paid provider
3. Clear error when all models unavailable
4. `AI_ALLOW_PAID=false` enforced

### CRITICAL RULE
**No paid AI APIs under any circumstances.** `AI_ALLOW_PAID=false` is the default.

### AI Instructions
Ask AI to explain chain of responsibility pattern.

### Tests
- Fallback works in order
- Paid providers never called
- Clear error when unavailable

### Documentation
- Fallback chain documentation

### Acceptance Criteria
- [ ] Fallback works
- [ ] No paid APIs
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-005 — Prompt System

**Team:** Team 4 — AI + Verification
**Objective:** Implement prompt template management system.
**Why:** Prompts need versioning, testing, and easy modification.

### Dependencies
T4-001

### Inputs
- Model abstraction

### Outputs
- `services/ai/src/prompts/prompt-manager.ts`
- Prompt templates for each agent
- Unit tests

### Allowed Files
- `services/ai/src/prompts/`

### Do Not Modify
- Provider files

### Implementation Guidance
1. Define prompt template interface
2. Create templates for: planner, analysis, correlation, verification
3. Template variables with validation
4. Version tracking

### AI Instructions
Ask AI to explain prompt template engineering patterns.

### Tests
- Templates render correctly
- Variables substituted
- Validation works

### Documentation
- Prompt template documentation

### Acceptance Criteria
- [ ] Templates work
- [ ] Variables work
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-006 — Structured AI Output

**Team:** Team 4 — AI + Verification
**Objective:** Implement structured JSON output parsing from AI responses.
**Why:** AI must return structured data for programmatic consumption.

### Dependencies
T4-001

### Inputs
- Model abstraction

### Outputs
- `services/ai/src/output/json-parser.ts`
- Output schema validation
- Unit tests

### Allowed Files
- `services/ai/src/output/`

### Do Not Modify
- Provider files

### Implementation Guidance
1. Request JSON mode from Ollama
2. Parse and validate JSON output
3. Handle malformed responses gracefully
4. Fallback to text parsing if JSON fails

### AI Instructions
Ask AI to explain structured output extraction from LLMs.

### Tests
- Valid JSON parsed
- Malformed JSON handled
- Schema validation works

### Documentation
- Output parsing documentation

### Acceptance Criteria
- [ ] JSON parsing works
- [ ] Error handling works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-007 — Investigation Planner

**Team:** Team 4 — AI + Verification
**Objective:** Implement the Planner agent that decomposes objectives into research tasks.
**Why:** The planner translates high-level objectives into actionable collection tasks.

### Dependencies
T4-001, T1-005 (Investigation schema)

### Inputs
- Model abstraction, Investigation model

### Outputs
- `services/ai/src/agents/planner-agent.ts`
- Planner prompt template
- Unit tests

### Allowed Files
- `services/ai/src/agents/`
- `services/ai/src/prompts/`

### Do Not Modify
- Provider files

### Implementation Guidance
1. Input: Investigation objective
2. Output: ResearchTask[] (queries for connectors)
3. Bounded: max 10 tasks per plan
4. Structured JSON output

### AI Instructions
Ask AI to explain task decomposition strategies.

### Tests
- Produces research tasks from objective
- Tasks are valid connector queries
- Bounded to 10 tasks max

### Documentation
- Planner agent documentation

### Acceptance Criteria
- [ ] Produces tasks
- [ ] Tasks valid
- [ ] Bounded

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-008 — Evidence Analysis

**Team:** Team 4 — AI + Verification
**Objective:** Implement the Analysis agent that processes evidence and extracts insights.
**Why:** Analysis converts raw evidence into structured intelligence.

### Dependencies
T4-001, T1-009 (Evidence schema)

### Inputs
- Model abstraction, Evidence schema

### Outputs
- `services/ai/src/agents/analysis-agent.ts`
- Analysis prompt template
- Unit tests

### Allowed Files
- `services/ai/src/agents/`
- `services/ai/src/prompts/`

### Do Not Modify
- Provider files

### Implementation Guidance
1. Input: Evidence[]
2. Output: Insights (entities, relationships, key facts)
3. Bounded: max 50 evidence items per batch
4. Structured JSON output

### AI Instructions
Ask AI to explain evidence analysis patterns.

### Tests
- Extracts insights from evidence
- Output is structured
- Bounded processing

### Documentation
- Analysis agent documentation

### Acceptance Criteria
- [ ] Insights extracted
- [ ] Structured output
- [ ] Bounded

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-009 — Correlation Engine

**Team:** Team 4 — AI + Verification
**Objective:** Implement the Correlation agent that finds connections across evidence.
**Why:** Correlation reveals patterns across multiple evidence items.

### Dependencies
T4-001, T4-008

### Inputs
- Model abstraction, Analysis results

### Outputs
- `services/ai/src/agents/correlation-agent.ts`
- Correlation prompt template
- Unit tests

### Allowed Files
- `services/ai/src/agents/`
- `services/ai/src/prompts/`

### Do Not Modify
- Analysis agent

### Implementation Guidance
1. Input: Insights from multiple evidence items
2. Output: Correlations, patterns, connections
3. Confidence scores for correlations
4. Bounded: max 3 correlation passes

### AI Instructions
Ask AI to explain correlation analysis patterns.

### Tests
- Cross-evidence connections found
- Confidence scores assigned
- Bounded passes

### Documentation
- Correlation agent documentation

### Acceptance Criteria
- [ ] Correlations found
- [ ] Confidence scores work
- [ ] Bounded

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-010 — Contradiction Detection

**Team:** Team 4 — AI + Verification
**Objective:** Implement contradiction detection across findings and evidence.
**Why:** Contradictions must be flagged for human review.

### Dependencies
T4-001, T1-009

### Inputs
- Model abstraction, Evidence, Findings

### Outputs
- `services/verification/src/services/contradiction-detector.ts`
- Unit tests

### Allowed Files
- `services/verification/src/services/`
- `services/verification/src/__tests__/`

### Do Not Modify
- AI agent files

### Implementation Guidance
1. Compare findings against each other
2. Compare findings against raw evidence
3. Flag contradictions with evidence references
4. Confidence score for contradiction likelihood

### AI Instructions
Ask AI to explain contradiction detection logic.

### Tests
- Contradictions detected
- Evidence references provided
- Confidence scores assigned

### Documentation
- Contradiction detection documentation

### Acceptance Criteria
- [ ] Contradictions detected
- [ ] Evidence references provided
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-011 — Verification Engine

**Team:** Team 4 — AI + Verification
**Objective:** Implement verification status tracking and human review workflow.
**Why:** Findings must be verified before being trusted.

### Dependencies
T4-010

### Inputs
- Contradiction detection

### Outputs
- `services/verification/src/services/verification-service.ts`
- Verification API
- Unit tests

### Allowed Files
- `services/verification/src/services/`
- `services/verification/src/routes/`
- `services/verification/src/__tests__/`

### Do Not Modify
- Contradiction detector

### Implementation Guidance
1. Finding statuses: UNVERIFIED, VERIFIED, CONTRADICTED
2. Human can verify or override
3. Verification audit trail
4. API for frontend consumption

### AI Instructions
Ask AI to explain workflow state management.

### Tests
- Findings can be verified
- Status tracked
- Audit trail maintained

### Documentation
- Verification workflow documentation

### Acceptance Criteria
- [ ] Verification works
- [ ] Status tracked
- [ ] Audit trail

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-012 — Confidence Calculation

**Team:** Team 4 — AI + Verification
**Objective:** Implement confidence score calculation for findings.
**Why:** Confidence scores help prioritize human review.

### Dependencies
T4-001

### Inputs
- Model abstraction

### Outputs
- `services/ai/src/scoring/confidence-calculator.ts`
- Unit tests

### Allowed Files
- `services/ai/src/scoring/`
- `services/ai/src/__tests__/scoring/`

### Do Not Modify
- Agent files

### Implementation Guidance
1. Aggregate confidence from evidence, AI analysis, and verification
2. Factor: evidence quality, source count, AI certainty, human verification
3. Score range: 0.0–1.0

### AI Instructions
Ask AI to explain confidence aggregation methods.

### Tests
- Scores within range
- Aggregation correct
- Human verification boosts score

### Documentation
- Confidence calculation documentation

### Acceptance Criteria
- [ ] Scores work
- [ ] Aggregation correct
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-013 — Human-Review State

**Team:** Team 4 — AI + Verification
**Objective:** Implement human review state management for AI outputs.
**Why:** AI outputs must be reviewable by humans before being finalized.

### Dependencies
T4-011

### Inputs
- Verification service

### Outputs
- `services/verification/src/services/review-state.ts`
- State transitions
- Unit tests

### Allowed Files
- `services/verification/src/services/`
- `services/verification/src/__tests__/`

### Do Not Modify
- Verification service

### Implementation Guidance
1. States: PENDING_REVIEW → UNDER_REVIEW → APPROVED / REJECTED / NEEDS_INFO
2. Track reviewer, timestamp, comments
3. State machine for review workflow

### AI Instructions
Ask AI to explain review workflow state machines.

### Tests
- State transitions work
- Invalid transitions rejected
- Audit trail maintained

### Documentation
- Review state documentation

### Acceptance Criteria
- [ ] States work
- [ ] Transitions enforced
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-014 — AI Audit Logging

**Team:** Team 4 — AI + Verification
**Objective:** Implement comprehensive AI activity logging and token usage tracking.
**Why:** AI actions must be traceable for accountability and cost monitoring.

### Dependencies
T4-001, T1-015 (Database)

### Inputs
- Model abstraction, Database

### Outputs
- `services/ai/src/logging/ai-logger.ts`
- `services/ai/src/logging/token-tracker.ts`
- Prisma schema additions
- Unit tests

### Allowed Files
- `services/ai/src/logging/`
- `services/ai/src/__tests__/logging/`

### Do Not Modify
- Provider files

### Implementation Guidance
1. Log every AI call: model, tokens, duration, prompt hash, result summary
2. Track cumulative token usage per investigation
3. Privacy: never log full prompts or responses in production

### AI Instructions
Ask AI to explain audit logging patterns.

### Tests
- All AI calls logged
- Token usage tracked
- Privacy preserved

### Documentation
- AI logging documentation

### Acceptance Criteria
- [ ] Logging works
- [ ] Token tracking works
- [ ] Privacy preserved

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-015 — Prompt Injection Defenses

**Team:** Team 4 — AI + Verification
**Objective:** Implement defenses against prompt injection attacks.
**Why:** User-provided text could contain malicious prompts that manipulate AI behavior.

### Dependencies
T4-001

### Inputs
- Model abstraction

### Outputs
- `services/ai/src/security/prompt-guard.ts`
- Input sanitization
- Unit tests

### Allowed Files
- `services/ai/src/security/`
- `services/ai/src/__tests__/security/`

### Do Not Modify
- Agent files

### Implementation Guidance
1. Sanitize all user-provided text before including in prompts
2. Detect common injection patterns
3. Separate system prompts from user input
4. Log detected injection attempts

### AI Instructions
Ask AI to explain prompt injection attack vectors and defenses.

### Tests
- Injection patterns detected
- User input sanitized
- System prompts isolated

### Documentation
- Security documentation

### Acceptance Criteria
- [ ] Injection detected
- [ ] Input sanitized
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-016 — AI Safety Controls

**Team:** Team 4 — AI + Verification
**Objective:** Implement AI safety controls (bounding rules, resource limits).
**Why:** AI must operate within defined boundaries to prevent runaway behavior.

### Dependencies
T4-001

### Inputs
- Model abstraction

### Outputs
- `services/ai/src/safety/safety-controller.ts`
- Bounding rule enforcement
- Unit tests

### Allowed Files
- `services/ai/src/safety/`
- `services/ai/src/__tests__/safety/`

### Do Not Modify
- Agent files

### Implementation Guidance
1. Enforce max recursion depth: 3
2. Enforce max tool calls per invocation: 10
3. Enforce max runtime: 120 seconds
4. Enforce max concurrent agents: 3
5. Enforce max evidence items per analysis: 50
6. Enforce max tokens per invocation: 8,000

### AI Instructions
Ask AI to explain resource limiting patterns.

### Tests
- All limits enforced
- Exceeding limits triggers error
- Limits configurable

### Documentation
- Safety controls documentation

### Acceptance Criteria
- [ ] All limits enforced
- [ ] Errors on exceed
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-017 — Evaluation Dataset

**Team:** Team 4 — AI + Verification
**Objective:** Create evaluation test fixtures for AI agent quality testing.
**Why:** Evaluation datasets ensure AI output quality is measurable and regressable.

### Dependencies
T4-003, T4-005

### Inputs
- Prompt templates, Configuration

### Outputs
- `tests/evaluation/fixtures/planner-input.json`
- `tests/evaluation/fixtures/analysis-input.json`
- `tests/evaluation/fixtures/correlation-input.json`
- Expected outputs for each

### Allowed Files
- `tests/evaluation/fixtures/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Create known-good input/output pairs
2. Cover each agent type
3. Include edge cases
4. Version-controlled fixtures

### AI Instructions
Ask AI to explain evaluation dataset design.

### Tests
- Fixtures are valid JSON
- Expected outputs match schema

### Documentation
- Evaluation dataset documentation

### Acceptance Criteria
- [ ] Fixtures created
- [ ] Valid schema
- [ ] Documented

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-018 — Evaluation Tests

**Team:** Team 4 — AI + Verification
**Objective:** Create evaluation test suite for AI agent quality.
**Why:** Evaluation tests measure AI output quality and detect regressions.

### Dependencies
T4-007, T4-008, T4-009, T4-010, T4-017

### Inputs
- All agent implementations, Fixtures

### Outputs
- `tests/evaluation/planner-eval.test.ts`
- `tests/evaluation/analysis-eval.test.ts`
- `tests/evaluation/correlation-eval.test.ts`

### Allowed Files
- `tests/evaluation/`

### Do Not Modify
- Agent files, fixtures

### Implementation Guidance
1. Run agents against fixtures
2. Score output quality
3. Compare against expected results
4. Flag regressions

### AI Instructions
Ask AI to explain AI evaluation methodologies.

### Tests
- Evaluation tests pass
- Quality metrics tracked
- Regression detection works

### Documentation
- Evaluation methodology documentation

### Acceptance Criteria
- [ ] Evaluation tests pass
- [ ] Metrics tracked
- [ ] Regression detection works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-019 — Integration Tests

**Team:** Team 4 — AI + Verification
**Objective:** Write integration tests for the full AI pipeline.
**Why:** Integration tests verify end-to-end AI workflow.

### Dependencies
T4-018

### Inputs
- All AI services

### Outputs
- Integration test suite

### Allowed Files
- `tests/integration/ai/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Test: Objective → Plan → Collection → Analysis → Findings
2. Test: Contradiction detection
3. Test: Verification workflow
4. Mock Ollama responses

### AI Instructions
Ask AI to explain integration testing for AI pipelines.

### Tests
- Full pipeline works
- Error handling works
- Bounding rules enforced

### Documentation
- Integration test setup

### Acceptance Criteria
- [ ] Full pipeline works
- [ ] Error handling works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`

---

## T4-020 — Documentation

**Team:** Team 4 — AI + Verification
**Objective:** Write documentation for AI agents, verification workflow, and safety controls.
**Why:** Clear documentation helps developers understand AI behavior and constraints.

### Dependencies
T4-019

### Inputs
- All AI services

### Outputs
- AI agent documentation
- Verification workflow documentation
- Safety controls documentation
- Prompt template documentation
- Evaluation methodology

### Allowed Files
- `docs/ai/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Document each agent's purpose and behavior
2. Document verification workflow
3. Document safety controls and bounding rules
4. Document prompt templates
5. Document evaluation methodology

### AI Instructions
Ask AI to explain AI system documentation best practices.

### Tests
- Documentation is accurate
- Examples work

### Documentation
- This IS the documentation task

### Acceptance Criteria
- [ ] All agents documented
- [ ] Verification documented
- [ ] Safety documented

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/4-ai-verification`
