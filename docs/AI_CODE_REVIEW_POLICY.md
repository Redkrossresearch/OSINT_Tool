# AI-Generated Code Review Policy

---

## Principle

**AI-generated code is allowed. AI output is NOT automatically trusted.**

---

## Rules

### 1. The Human Developer Is Responsible

- You wrote the task assignment
- You asked AI for help
- You reviewed the output
- **You are responsible for the code**

### 2. The Team Lead Is Responsible for Review

- Team leads review all PRs
- They check AI-generated code the same as human-written code
- They may request changes to AI output

### 3. The Technical Architect Is Responsible for Architecture

- AI never decides architecture alone
- Schema changes require human review
- Cross-team impacts require architect approval

### 4. AI Must Not Approve Its Own Code

- AI cannot review its own output
- AI cannot approve PRs
- AI cannot make final decisions

---

## What AI Can Help With

| Task | AI Role | Human Role |
|---|---|---|
| Understanding concepts | Explain | Verify understanding |
| Implementation plan | Suggest | Approve plan |
| Writing code | Draft | Review and finalize |
| Code review | Analyze | Verify findings |
| Testing | Suggest test cases | Write and run tests |
| Documentation | Draft | Finalize |

---

## What AI Must Not Do Alone

| Decision | Required Review |
|---|---|
| Architecture changes | Technical Architect |
| Schema changes | Team 1 Lead + Technical Architect |
| Security decisions | Technical Architect |
| Database migrations | Team 1 Lead |
| Public API changes | Technical Architect |
| Cross-team dependencies | Affected Team Leads + Technical Architect |

---

## PR Review Checklist for AI-Generated Code

When reviewing a PR with AI-generated code:

- [ ] Code compiles and runs
- [ ] Code meets task requirements
- [ ] Code follows project conventions
- [ ] No unrelated changes introduced
- [ ] No secrets or credentials exposed
- [ ] No paid API dependencies
- [ ] Tests are adequate
- [ ] Documentation is updated
- [ ] Security requirements met
- [ ] Architecture is appropriate
- [ ] Error handling is correct
- [ ] Edge cases are handled

---

## AI Assistance Disclosure

All PRs must disclose AI usage in the PR description:

```markdown
## AI Assistance Disclosure

- Was AI used? Yes/No
- Which AI model? (e.g., qwen3:4b via Ollama)
- What was AI used for? (e.g., code drafting, review, explanation)
- What was human-reviewed/modified? (list changes)
```

---

## Prohibited AI Uses

1. **AI cannot approve PRs** — Only humans approve PRs
2. **AI cannot make architecture decisions** — Only architects decide
3. **AI cannot modify schemas without review** — Schemas affect all teams
4. **AI cannot bypass tests** — Tests are mandatory
5. **AI cannot introduce paid APIs** — Free/local only
6. **AI cannot skip documentation** — Documentation is mandatory
7. **AI cannot make security decisions** — Security requires human review

---

## Liability

- The developer who submits the PR is responsible for the code
- The team lead who approves the PR is responsible for the review
- The technical architect is responsible for architectural integrity
- AI tools are assistive — they do not bear responsibility

---

## Documentation

All AI-assisted work must be documented:

1. In the PR description (AI assistance disclosure)
2. In code comments (where AI output was used)
3. In task completion notes (what AI helped with)
