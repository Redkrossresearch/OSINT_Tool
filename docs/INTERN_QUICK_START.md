# Intern Quick Start Guide

**Welcome to the RedKross OSINT Investigation Platform.**

This guide will help you get started as a developer on this project. Read it completely before writing any code.

---

## After Receiving GitHub Access

1. Accept the GitHub team invitation
2. Clone the repository
3. Open the project folder
4. Start OpenCode
5. Read `docs/OPENCODE_MASTER_INSTRUCTIONS.md`
6. Open your personal assignment: `docs/assignments/<your-github-username>.md`
7. Identify your assigned task
8. Read the task document in `docs/tasks/team-[N]-*.md`
9. Check dependencies
10. Create your feature branch
11. Ask OpenCode to explain the task
12. Implement
13. Test
14. Commit
15. Push
16. Create PR
17. Request your head intern's review

**Your personal assignment file is the single source of truth for your work.**

**Coordination references:**
- `docs/INDIVIDUAL_ASSIGNMENTS.md` — The consolidated list of every intern's primary/secondary tasks, review responsibilities, dependencies, and definition of done.
- `docs/MASTER_TASK_SEQUENCE.md` — The dependency-aware 12-wave execution order of all 97 tasks (which tasks run in parallel, which gate the MVP, and what to work on while blocked).
- `docs/ROSTER_VERIFICATION.md` — Verification that your GitHub username on the authorized Excel roster matches your live GitHub account.

---

## What Is This Project?

We are building an **OSINT (Open Source Intelligence) Investigation Platform**. This is a tool that helps investigators collect, analyze, and verify publicly available information for authorized investigations.

**Key concept:** Evidence is the source of truth. AI assists but never decides alone.

---

## What Does the MVP Do?

The MVP (Minimum Viable Product) by September 19, 2026:

1. Create and manage investigation cases
2. Collect public information from web, DNS, certificates, GitHub
3. Extract entities (people, companies, domains, IPs)
4. Build relationship graphs between entities
5. Use AI to analyze evidence and find patterns
6. Verify findings and detect contradictions
7. Generate investigation reports

---

## The Five Teams

| # | Team | What They Build | Owns |
|---|---|---|---|
| 1 | Core + Evidence | Database, schemas, APIs | `services/core/`, `services/evidence/`, `packages/schemas/` |
| 2 | Connectors | Data collection from public sources | `connectors/`, `services/connectors/` |
| 3 | Intelligence + Graph | Entity extraction, relationship graphs | `services/intelligence/`, `services/graph/`, `packages/entities/` |
| 4 | AI + Verification | AI analysis, contradiction detection | `services/ai/`, `services/verification/` |
| 5 | Product + Frontend | Web UI, reports | `apps/web/`, `services/reporting/` |

---

## How to Identify Your Team

Check the Excel roster provided by the CEO. Your team assignment determines:

1. Which team document to read: `docs/teams/team-N-*.md`
2. Which task list to follow: `docs/tasks/team-N-*.md`
3. Which team branch to use: `team/N-*`

---

## How to Find Your Task

1. Open `docs/tasks/team-N-*.md` for your team
2. Find your assigned task by ID (e.g., T3-005)
3. Read the full task description
4. Check dependencies — make sure prerequisite tasks are done
5. Check allowed files — only modify files listed in the task

---

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Redkrossresearch/OSINT_Tool.git
cd OSINT_Tool
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Install and Use Ollama

Ollama runs AI models locally on your computer. No paid APIs.

```bash
# Install Ollama (Windows)
# Download from: https://ollama.ai/download

# Pull the required models
ollama pull qwen3:4b
ollama pull qwen3:8b

# Verify Ollama is running
ollama list
```

### 4. Configure OpenCode

OpenCode uses Ollama for AI assistance. The configuration is already in `.opencode/opencode.json`.

### 5. Start the Database

```bash
docker-compose up -d
```

### 6. Set Up the Database

```bash
cd services/core
npx prisma migrate dev
cd ../..
```

### 7. Create Your Branch

**Always use the correct branch pattern:**

```bash
# Make sure you're on the team branch first
git checkout team/3-intelligence  # Replace with your team

# Create your feature branch
git checkout -b feature/t3-005-entity-resolution
```

**Branch naming pattern:**
```
feature/t{TEAM_NUMBER}-{TASK_NUMBER}-{short-description}
```

Examples:
- `feature/t1-004-case-schema`
- `feature/t2-007-dns-rdap-connector`
- `feature/t3-005-entity-resolution`
- `feature/t4-002-ollama-provider`
- `feature/t5-003-dashboard`

---

## How to Work on a Task

1. **Read the task** in `docs/tasks/team-N-*.md`
2. **Read your team guide** in `docs/teams/team-N-*.md`
3. **Read the architecture** in `ARCHITECTURE.md`
4. **Check dependencies** — are prerequisite tasks done?
5. **Check allowed files** — only modify files listed in the task
6. **Implement the code** — write the code as described
7. **Write tests** — as specified in the task
8. **Self-review** — check your own code before committing

---

## How to Use AI (OpenCode + Ollama)

We use free, local AI models. **No paid APIs allowed.**

1. Read the task first
2. Ask AI to **explain** the concept before implementing
3. Ask AI for an **implementation plan** before writing code
4. Implement only your assigned scope
5. Ask AI to **review** your changes
6. **You are responsible** for the code — AI output is not automatically correct

**AI must never:**
- Decide architecture or schema changes alone
- Modify files outside your task scope
- Introduce paid API dependencies
- Skip tests or documentation

---

## How to Test

```bash
# Run all tests
pnpm test

# Run tests for your package
pnpm --filter @redkross/core test

# Run specific test file
pnpm vitest run path/to/test.test.ts
```

---

## How to Commit

```bash
# Stage your changes
git add path/to/changed/file.ts

# Commit with a descriptive message
git commit -m "feat(core): add investigation schema"

# Commit message format:
# feat(scope): description     — new feature
# fix(scope): description      — bug fix
# docs(scope): description     — documentation
# test(scope): description     — tests
# refactor(scope): description — code improvement
```

---

## How to Push

```bash
# Push your feature branch
git push origin feature/t3-005-entity-resolution
```

---

## How to Create a PR

1. Go to GitHub repository
2. Click "New Pull Request"
3. Base: `team/3-intelligence` (your team branch)
4. Compare: `feature/t3-005-entity-resolution` (your branch)
5. Fill in the PR template
6. Request review from your team lead

---

## How Review Works

### Team Lead Review
1. Team lead reviews your PR
2. They may request changes
3. You make changes and push again
4. Once approved, they merge to the team branch

### Technical Architect Review
1. Technical architect reviews team branch
2. Ensures cross-team compatibility
3. Merges to `main`

**You never push directly to `main`.**

---

## What NOT to Do

- **Never** push directly to `main`
- **Never** modify files outside your team's ownership
- **Never** modify `packages/schemas/` without Team 1 review
- **Never** use paid AI APIs
- **Never** commit secrets, API keys, or credentials
- **Never** guess GitHub usernames or team assignments
- **Never** skip tests
- **Never** merge your own PR

---

## How to Report Blockers

If you are stuck:

1. Check if the blocker is in your task dependencies
2. Ask your team lead
3. If it's a cross-team dependency, the team lead will coordinate
4. Document the blocker in your PR description

---

## Quick Reference

| What | Where |
|---|---|
| Team guide | `docs/teams/team-N-*.md` |
| Task list | `docs/tasks/team-N-*.md` |
| Architecture | `ARCHITECTURE.md` |
| MVP scope | `MVP_SCOPE.md` |
| Security rules | `SECURITY.md` |
| Developer workflow | `docs/DEVELOPER_WORKFLOW.md` |
| AI coding rules | `docs/AI_TEAM_WORKFLOW.md` |
| Git branching | `docs/GIT_BRANCHING_STRATEGY.md` |
| Team interfaces | `docs/TEAM_INTERFACES.md` |

---

## Need Help?

- Read the documentation first
- Ask your team lead
- Ask in the team channel
- Do not guess — ask before making changes you're unsure about
