# OpenCode Master Instructions

**IMPORTANT: ALL AI DEVELOPMENT MUST BE FREE.**

---

## The Rule

No paid API. No automatic paid fallback. Use local Ollama models only.

### Allowed Models

| Model | Status |
|---|---|
| qwen3:4b | Preferred |
| qwen3:8b | Preferred |
| tinyllama | Fallback |

### If a Model Is Unavailable

1. Try another installed local Ollama model
2. If no local free model is available: **STOP**

### Output When No Model Available

```
NO FREE MODEL AVAILABLE — HUMAN ACTION REQUIRED
```

### Never Request

- OpenAI API key
- Anthropic API key
- Gemini API key
- OpenRouter paid key
- Azure OpenAI key
- AWS paid AI credentials
- Any paid AI service credentials

---

## Before Writing Any Code

You MUST read these documents IN ORDER:

1. `README.md` — Project overview
2. `ARCHITECTURE.md` — System architecture
3. `MVP_SCOPE.md` — What the MVP includes
4. `SECURITY.md` — Security rules
5. `docs/TEAM_INTERFACES.md` — How teams communicate
6. `docs/TEAM_DEPENDENCY_MAP.md` — Team dependencies
7. Your team guide: `docs/teams/team-[N]-*.md`
8. Your task document: `docs/tasks/team-[N]-*.md`
9. Your personal assignment: `docs/assignments/<your-github-username>.md`

---

## Before Modifying Anything

You MUST identify:

1. **Current team** — Which team do you belong to?
2. **Current task** — What task are you working on?
3. **Allowed files** — Which files may you modify?
4. **Do not modify** — Which files must you NOT touch?
5. **Dependencies** — Are prerequisite tasks complete?
6. **Acceptance criteria** — What must be true when done?

---

## Workflow

```
READ TASK
    ↓
UNDERSTAND TASK
    ↓
ASK AI TO EXPLAIN (if needed)
    ↓
ASK AI FOR IMPLEMENTATION PLAN
    ↓
CREATE BRANCH
    ↓
IMPLEMENT (only allowed files)
    ↓
WRITE TESTS
    ↓
ASK AI TO REVIEW
    ↓
YOU REVIEW AI OUTPUT
    ↓
COMMIT
    ↓
PUSH
    ↓
CREATE PR
    ↓
REQUEST TEAM HEAD REVIEW
```

---

## AI Rules

### AI May Help With

- Explaining concepts
- Suggesting implementation approaches
- Drafting code
- Reviewing code
- Suggesting test cases
- Drafting documentation

### AI Must Never Do Alone

- Decide architecture
- Decide team boundaries
- Decide security policy
- Modify schemas without human review
- Modify database migrations outside assigned task
- Change public APIs
- Do unrelated refactoring
- Introduce paid API dependencies
- Skip tests
- Skip documentation

### You Are Responsible

- AI output is NOT automatically correct
- You must review all AI output
- You must verify code works
- You must ensure tests pass
- You must meet acceptance criteria

---

## Branch Naming

```
feature/t{TEAM}-{TASK}-{short-description}
```

Examples:
- `feature/t1-004-case-schema`
- `feature/t2-007-dns-rdap-connector`
- `feature/t3-005-entity-resolution`
- `feature/t4-002-ollama-provider`
- `feature/t5-003-dashboard`

---

## Commit Convention

```
type(scope): description

feat(core): add investigation schema
fix(connectors): handle DNS timeout
docs(team-3): update entity extraction guide
test(graph): add traversal tests
```

---

## PR Rules

- Base: your team branch
- Fill in the PR template completely
- Request review from your head intern
- Never push directly to `main`

---

## Security Rules

- No secrets in code
- No `.env` files committed
- No API keys in code
- No credentials in code
- All inputs validated
- SSRF protection on URL handling
- Rate limits on external requests

---

## If You Are Stuck

1. Read the task document again
2. Read the team guide again
3. Ask your head intern
4. Do not guess — ask before making changes you're unsure about
