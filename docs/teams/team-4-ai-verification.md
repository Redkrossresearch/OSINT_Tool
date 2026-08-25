# Team 4 — AI + Verification

## Mission

AI assists the investigation but is **not the source of truth**. The AI pipeline decomposes objectives, correlates evidence, and flags contradictions. All AI outputs carry confidence scores and are subject to verification.

---

## Responsibilities

- Model abstraction layer (provider-agnostic)
- Ollama integration
- Planner agent (objective → research tasks)
- Analysis agent (evidence processing)
- Correlation agent (cross-evidence connections)
- Supervisor agent (pipeline monitoring, error handling)
- Contradiction detection
- Verification workflow
- Prompt engineering and templates
- Structured output parsing
- AI activity logging
- Token usage tracking
- Tests
- Documentation

---

## Owned Directories

```
services/ai/             — AI model abstraction, agents, prompts
services/verification/   — Contradiction detection, verification workflow
docs/ai/                 — AI documentation
tests/evaluation/        — AI evaluation tests
```

---

## AI Pipeline (MVP)

```
OBJECTIVE
    ↓
PLANNER AGENT
    ↓ (produces)
RESEARCH TASKS[]  ← fed to Team 2 connectors
    ↓
COLLECTED EVIDENCE[]
    ↓
ANALYSIS AGENT
    ↓ (produces)
INSIGHTS, ENTITIES, RELATIONSHIPS  ← fed to Team 3
    ↓
CORRELATION AGENT
    ↓ (produces)
CORRELATIONS, PATTERNS
    ↓
SUPERVISOR AGENT
    ↓ (monitors)
PIPELINE HEALTH, COMPLETENESS
    ↓
CONTRADICTION DETECTION
    ↓ (produces)
CONTRADICTIONS, VERIFIED FINDINGS
    ↓
FINDINGS[]
    ↓
REPORT (Team 5)
```

---

## Agent Bounding Rules

Every agent MUST have bounded:

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

## Model Abstraction

```typescript
interface AIModel {
  name: string;
  provider: 'ollama' | 'free-cloud';
  
  complete(prompt: string, options: CompleteOptions): Promise<CompleteResult>;
  isAvailable(): Promise<boolean>;
  health(): Promise<ModelHealth>;
}

interface CompleteOptions {
  max_tokens: number;
  temperature: number;
  system_prompt?: string;
  format?: 'text' | 'json';
}

interface CompleteResult {
  content: string;
  tokens_used: number;
  model: string;
  duration_ms: number;
}
```

---

## MVP Prompts (Bounded)

| Prompt | Agent | Input | Output |
|---|---|---|---|
| Plan investigation | Planner | Objective | ResearchTask[] |
| Analyze evidence | Analysis | Evidence[] | Insights |
| Find correlations | Correlation | Insights[] | Correlations |
| Detect contradictions | Verification | Findings[] | Contradictions[] |
| Summarize findings | Summary | Findings[] | Report section |

---

## Verification Workflow

1. AI produces findings with confidence scores
2. Contradiction detection compares findings against each other and against evidence
3. Contradictions are flagged for human review
4. Human verifies or overrides
5. Final findings carry human-verified status

---

## Dependencies

- Team 1: Investigation, Evidence, Observation schemas
- Team 3: Entity and Relationship data
- External: Ollama (local)

## Dependents

- Team 5 (Product): Displays AI activity, findings, verification status
- Teams 2, 3: Receive AI-planned tasks and AI-extracted insights

---

## Security Constraints

- AI models run locally (Ollama) — no data leaves the machine
- AI cannot autonomously execute external actions
- AI cannot modify evidence
- AI cannot change investigation state without human approval
- All AI actions are logged
- Prompt injection protection: input sanitization on all user-provided text
- No AI model can access credentials or secrets

---

## Testing Strategy

- Unit tests for model abstraction
- Integration tests with Ollama (mock or real)
- Evaluation tests for prompt quality
- Bounded-runtime tests (verify agents don't exceed limits)
- Contradiction detection tests
- Prompt injection resistance tests
