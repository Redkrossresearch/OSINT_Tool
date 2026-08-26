# AI Team Workflow

This document describes how to use AI (OpenCode + Ollama) when working on the RedKross OSINT project.

---

## The Rule

**AI is a tool, not a decision-maker.**

- AI assists with implementation
- AI explains concepts
- AI suggests approaches
- But **you** are responsible for the code

---

## Free AI Only

**No paid AI APIs under any circumstances.**

| Allowed | Not Allowed |
|---|---|
| Ollama (local) | OpenAI API |
| qwen3:4b | GPT-4 |
| qwen3:8b | Claude API |
| tinyllama | Any paid cloud AI |

Configuration: `.opencode/opencode.json`
Setting: `AI_ALLOW_PAID=false`

---

## How to Use AI

### Step 1: Read the Task First

Before asking AI anything, read:
- Your task description in `docs/tasks/team-N-*.md`
- Your team guide in `docs/teams/team-N-*.md`
- The architecture in `ARCHITECTURE.md`

### Step 2: Ask AI to Explain

Before implementing, ask AI to explain:
- The concept you're working with
- The framework or library you'll use
- The pattern you should follow

Example prompts:
```
Explain how Prisma migrations work in a pnpm monorepo.
Explain the Template Method design pattern for connector frameworks.
Explain how to implement entity resolution with Levenshtein distance.
```

### Step 3: Ask AI for an Implementation Plan

Before writing code, ask AI for a plan:
```
I need to implement task T3-005: Entity Resolution.
Here are the requirements: [paste task description]
What files should I create and what should each contain?
```

### Step 4: Implement Only Your Scope

- Implement only what the task specifies
- Only modify files listed in "Allowed Files"
- Do not modify files listed in "Do Not Modify"
- Do not add unrelated improvements

### Step 5: Ask AI to Review Your Code

After implementing, ask AI to review:
```
Please review this code for correctness, test coverage, and potential issues:
[paste your code]
```

### Step 6: You Review the AI Output

**Never trust AI output blindly.**

Check:
- Does the code actually work?
- Are there logical errors?
- Is the code secure?
- Does it meet the task requirements?
- Are tests adequate?

---

## What AI Must Never Do

| Decision | Who Decides |
|---|---|
| Architecture | Technical Architect |
| Team boundaries | Technical Architect |
| Schema changes | Team 1 + Technical Architect |
| Security policy | Technical Architect |
| Database migrations | Team 1 |
| Public API changes | Technical Architect |
| Unrelated refactoring | Your judgment + Team Lead |
| Paid AI dependencies | Nobody (forbidden) |

---

## AI Prompts by Task Type

### For Understanding Concepts
```
Explain [concept] in the context of [specific task].
What are the best practices for [topic]?
What are the common pitfalls of [approach]?
```

### For Implementation Planning
```
I need to implement [task description].
What files should I create?
What is the order of implementation?
What tests should I write?
```

### For Code Review
```
Review this code for:
1. Correctness
2. Test coverage
3. Security issues
4. Performance
5. adherence to the task requirements
```

### For Testing
```
What test cases should I write for [function/feature]?
Help me identify edge cases for [logic].
```

---

## AI and Security

### Never Ask AI to:
- Generate API keys or credentials
- Bypass rate limits
- Access private accounts
- Implement unauthorized access
- Create exploit code
- Handle sensitive data in prompts

### Always Ask AI to:
- Explain security concepts
- Suggest security best practices
- Review code for vulnerabilities
- Explain attack vectors and defenses

---

## AI and Schemas

**Schema changes require special care:**

1. Schemas in `packages/schemas/` are consumed by ALL teams
2. Changing a schema affects every team
3. Schema changes must be reviewed by Team 1 lead and Technical Architect
4. Never let AI make schema changes without human review

---

## AI and Tests

**AI can help with tests, but verify:**

1. AI-generated tests may miss edge cases
2. AI-generated tests may not match project conventions
3. Run the tests yourself to verify they pass
4. Check that tests actually test the right thing

---

## AI Output Quality Checklist

When reviewing AI output, verify:

- [ ] Code compiles and runs
- [ ] Code meets task requirements
- [ ] Code follows project conventions
- [ ] No unrelated changes introduced
- [ ] No secrets or credentials exposed
- [ ] No paid API dependencies
- [ ] Tests are adequate
- [ ] Documentation is updated
- [ ] Security requirements met

---

## Common AI Mistakes

1. **Overengineering** — AI may suggest complex solutions when simple ones suffice
2. **Wrong conventions** — AI may not match the project's code style
3. **Missing context** — AI may not know about team boundaries
4. **Invented dependencies** — AI may suggest libraries not in the project
5. **Skipping tests** — AI may suggest skipping tests for "simplicity"
6. **Scope creep** — AI may suggest improvements outside the task scope

---

## Getting Help

If AI is not helpful:

1. Try a more specific prompt
2. Break the question into smaller parts
3. Read the documentation directly
4. Ask your team lead
5. Do not force AI to solve problems it cannot

---

## Quick Reference

| Task | AI Use |
|---|---|
| Understanding concepts | Ask AI to explain |
| Implementation plan | Ask AI for plan |
| Writing code | AI suggests, you implement |
| Code review | Ask AI to review, you verify |
| Testing | AI suggests test cases, you write them |
| Documentation | AI helps draft, you finalize |
| Architecture decisions | Do not use AI alone |
| Security decisions | Do not use AI alone |
| Schema changes | AI helps, human reviews |
