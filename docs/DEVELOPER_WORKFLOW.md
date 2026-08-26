# Developer Workflow

This document describes the standard workflow for all developers on the RedKross OSINT project.

---

## The Workflow

```
READ TASK
    ↓
UNDERSTAND TASK
    ↓
CREATE BRANCH
    ↓
IMPLEMENT
    ↓
TEST
    ↓
SELF REVIEW
    ↓
COMMIT
    ↓
PUSH
    ↓
PULL REQUEST
    ↓
TEAM LEAD REVIEW
    ↓
TEAM BRANCH
    ↓
TECHNICAL ARCHITECT REVIEW
    ↓
MAIN
```

---

## Step 1: Read the Task

1. Open `docs/tasks/team-N-*.md` for your team
2. Find your assigned task by ID
3. Read every section of the task description
4. Understand the objective, dependencies, and acceptance criteria

---

## Step 2: Understand the Task

Before writing any code:

1. Read your team guide: `docs/teams/team-N-*.md`
2. Read the architecture: `ARCHITECTURE.md`
3. Check the task dependencies — are they complete?
4. Check the allowed files — only modify those
5. Check the do-not-modify list
6. If unclear, ask your team lead before proceeding

---

## Step 3: Create a Branch

```bash
# Ensure you're on the team branch
git checkout team/3-intelligence  # Replace with your team

# Pull latest changes
git pull origin team/3-intelligence

# Create your feature branch
git checkout -b feature/t3-005-entity-resolution
```

**Branch naming:** `feature/t{TEAM}-{TASK}-{description}`

---

## Step 4: Implement

1. Implement the code as described in the task
2. Follow existing code conventions
3. Use the frameworks and libraries already in the project
4. Do not introduce new dependencies without team lead approval
5. Keep changes focused on the task scope

---

## Step 5: Test

1. Write the tests specified in the task
2. Run all tests: `pnpm test`
3. Run package-specific tests: `pnpm --filter @redkross/core test`
4. Ensure all tests pass
5. Check code coverage

---

## Step 6: Self Review

Before committing, review your own code:

1. Does the code do what the task requires?
2. Are all acceptance criteria met?
3. Are all tests written and passing?
4. Is documentation updated?
5. Are there any secrets or credentials in the code?
6. Are there any unrelated changes?
7. Is the code clean and readable?

---

## Step 7: Commit

```bash
# Stage your changes
git add path/to/changed/file.ts

# Commit with a descriptive message
git commit -m "feat(core): add investigation schema"

# Push to your feature branch
git push origin feature/t3-005-entity-resolution
```

**Commit message format:**
```
type(scope): description

Examples:
feat(core): add investigation schema
fix(connectors): handle DNS timeout
docs(team-3): update entity extraction guide
test(graph): add traversal tests
refactor(ai): simplify prompt manager
```

---

## Step 8: Create a Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. **Base:** `team/3-intelligence` (your team branch)
4. **Compare:** `feature/t3-005-entity-resolution` (your branch)
5. Fill in the PR template completely
6. Request review from your team lead

---

## Step 9: Team Lead Review

Your team lead will:

1. Review the code for correctness
2. Check test coverage
3. Verify documentation
4. Ensure task scope is respected
5. Request changes if needed

**If changes are requested:**

1. Read the feedback
2. Make the requested changes
3. Push to the same branch
4. The PR will be re-reviewed

**When approved:**

The team lead merges your PR to the team branch.

---

## Step 10: Technical Architect Review

The technical architect will:

1. Review the team branch for cross-team compatibility
2. Check shared schemas
3. Ensure security requirements are met
4. Merge to `main`

**You do not need to do anything at this step.**

---

## Important Rules

### Do

- Read the task completely before starting
- Write tests as specified
- Update documentation
- Ask questions when unsure
- Keep changes focused on your task

### Do Not

- Push directly to `main`
- Modify files outside your task scope
- Modify `packages/schemas/` without Team 1 review
- Skip tests
- Introduce paid API dependencies
- Commit secrets or credentials
- Merge your own PR

---

## If You're Blocked

1. Check if the blocker is in your task dependencies
2. Check if the dependency task is complete
3. If yes, ask your team lead
4. If no, the dependency must be completed first
5. Document the blocker in your PR or standup

---

## Code Quality Checklist

Before submitting a PR, verify:

- [ ] Code compiles with TypeScript strict mode
- [ ] All tests pass
- [ ] Code coverage meets minimum (80%)
- [ ] Documentation is updated
- [ ] No secrets or credentials in code
- [ ] No unrelated changes
- [ ] Task scope respected
- [ ] Acceptance criteria met
- [ ] Definition of done satisfied
