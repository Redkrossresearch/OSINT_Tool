# AI Workflow Guide

## Working with Local/Free Models

Because interns use local models with smaller context windows, tasks must be decomposed into small, focused units.

---

## Task Decomposition

### Level 1: Feature Epic
```
"Implement connector framework for authorized public-source collection"
```
→ Too large for a single AI interaction

### Level 2: Task
```
"Implement T2-001: Connector interface schema"
```
→ Appropriate for one AI session

### Level 3: Sub-task
```
"Define TypeScript interface for ConnectorConfig in packages/schemas/connector.ts"
```
→ Ideal for a single AI interaction

---

## AI Session Structure

Each AI coding session should follow:

### 1. Context Setup (30 seconds)
```
Read these files:
- packages/schemas/connector.ts (the interface I'm implementing)
- connectors/web-search.ts (existing example)
- docs/tasks/team-2-connectors.md (task definition)
```

### 2. Task Definition (10 seconds)
```
Implement T2-003: DNS connector that satisfies ConnectorInterface.
Output must include: connector function, config schema, unit tests.
```

### 3. Implementation (varies)
AI reads context, generates code, suggests changes.

### 4. Verification (30 seconds)
```
Run: npm test -- --filter dns-connector
Run: npm run typecheck
```

### 5. Summary (10 seconds)
AI summarizes what was implemented and any assumptions.

---

## Context Window Management

### Include in Context:
- The specific interface/schema being implemented
- 1-2 example implementations
- The task definition
- Related test files
- Relevant type definitions

### Exclude from Context:
- Entire codebase
- Unrelated services
- Full database schema
- Complete API documentation
- Other teams' implementations (unless directly related)

---

## Model Selection per Task Type

| Task Type | Recommended Model | Reason |
|---|---|---|
| TypeScript implementation | qwen3:8b | Best coding quality |
| Simple file edits | qwen3:4b | Fast, sufficient quality |
| Documentation writing | qwen3:4b or tinyllama | Text generation is easy |
| Complex debugging | qwen3:8b | Needs reasoning |
| Test writing | qwen3:4b | Pattern-based |
| Architecture discussion | qwen3:8b | Needs understanding |
| Formatting / cleanup | tinyllama | Trivial tasks |

---

## Error Recovery

If the AI generates incorrect code:

1. Don't commit the bad code
2. Provide the specific error message
3. Point to the correct interface or type
4. Ask for a targeted fix
5. Verify the fix compiles and tests pass

---

## Tips for Small Models

1. **Be specific** — "Add a `validate()` method to the ConnectorConfig type" not "Improve validation"
2. **Show examples** — "Like the existing web-search connector but for DNS"
3. **One change at a time** — Don't ask for 5 files at once
4. **Verify incrementally** — Test after each change
5. **Provide error output** — If something fails, paste the error
6. **Limit file size** — Keep files under 300 lines when possible
