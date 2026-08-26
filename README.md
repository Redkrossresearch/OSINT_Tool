# OSINT_Tool

**RedKross OSINT Investigation Platform**

An evidence-first intelligence operating system for authorized open-source investigation.

---

## Status

**Phase:** Repository Foundation + Team Workflow
**Target MVP:** September 19, 2026

---

## START HERE

**New to this project? Read these documents in order:**

1. **[docs/INTERN_QUICK_START.md](docs/INTERN_QUICK_START.md)** — Complete setup guide for new developers
2. **[docs/DEVELOPER_WORKFLOW.md](docs/DEVELOPER_WORKFLOW.md)** — Standard development workflow
3. **[docs/AI_TEAM_WORKFLOW.md](docs/AI_TEAM_WORKFLOW.md)** — How to use AI (OpenCode + Ollama)
4. **[docs/GIT_BRANCHING_STRATEGY.md](docs/GIT_BRANCHING_STRATEGY.md)** — Branch naming and workflow

---

## Quick Start

```bash
# Clone
git clone https://github.com/Redkrossresearch/OSINT_Tool.git
cd OSINT_Tool

# Install dependencies
pnpm install

# Start services
docker-compose up -d

# Set up database
cd services/core
npx prisma migrate dev
cd ../..

# Configure environment
cp .env.example .env

# Start development
pnpm dev
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker 24+
- Ollama 0.3+ (for AI features)

---

## Teams

| # | Team | Responsibility | Branch |
|---|---|---|---|
| 1 | Core + Evidence | Database, schemas, APIs | `team/1-core` |
| 2 | Connectors | Data collection | `team/2-connectors` |
| 3 | Intelligence + Graph | Entity extraction, graphs | `team/3-intelligence` |
| 4 | AI + Verification | AI analysis, verification | `team/4-ai-verification` |
| 5 | Product + Frontend | Web UI, reports | `team/5-product` |

See [docs/teams/](docs/teams/) for team-specific documentation.

---

## Documentation Index

### For New Developers

| Document | Description |
|---|---|
| [docs/INTERN_QUICK_START.md](docs/INTERN_QUICK_START.md) | Complete setup guide |
| [docs/DEVELOPER_WORKFLOW.md](docs/DEVELOPER_WORKFLOW.md) | Development workflow |
| [docs/AI_TEAM_WORKFLOW.md](docs/AI_TEAM_WORKFLOW.md) | AI coding workflow |
| [docs/GIT_BRANCHING_STRATEGY.md](docs/GIT_BRANCHING_STRATEGY.md) | Git branching strategy |

### Team Documentation

| Document | Description |
|---|---|
| [docs/teams/team-1-core-evidence.md](docs/teams/team-1-core-evidence.md) | Team 1 guide |
| [docs/teams/team-2-connectors-collection.md](docs/teams/team-2-connectors-collection.md) | Team 2 guide |
| [docs/teams/team-3-intelligence-graph.md](docs/teams/team-3-intelligence-graph.md) | Team 3 guide |
| [docs/teams/team-4-ai-verification.md](docs/teams/team-4-ai-verification.md) | Team 4 guide |
| [docs/teams/team-5-product-reporting.md](docs/teams/team-5-product-reporting.md) | Team 5 guide |

### Task Lists

| Document | Tasks |
|---|---|
| [docs/tasks/team-1-core.md](docs/tasks/team-1-core.md) | 22 tasks |
| [docs/tasks/team-2-connectors.md](docs/tasks/team-2-connectors.md) | 18 tasks |
| [docs/tasks/team-3-intelligence.md](docs/tasks/team-3-intelligence.md) | 18 tasks |
| [docs/tasks/team-4-ai.md](docs/tasks/team-4-ai.md) | 20 tasks |
| [docs/tasks/team-5-product.md](docs/tasks/team-5-product.md) | 19 tasks |

### Cross-Team Documentation

| Document | Description |
|---|---|
| [docs/TEAM_INTERFACES.md](docs/TEAM_INTERFACES.md) | How teams communicate |
| [docs/TEAM_DEPENDENCY_MAP.md](docs/TEAM_DEPENDENCY_MAP.md) | Team dependencies |
| [docs/MILESTONES.md](docs/MILESTONES.md) | Project milestones |

### Architecture

| Document | Description |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture |
| [docs/architecture/ADR-001-repository-architecture.md](docs/architecture/ADR-001-repository-architecture.md) | ADR-001: Repository |
| [docs/architecture/ADR-002-evidence-model.md](docs/architecture/ADR-002-evidence-model.md) | ADR-002: Evidence |
| [docs/architecture/ADR-003-connector-interface.md](docs/architecture/ADR-003-connector-interface.md) | ADR-003: Connectors |
| [docs/architecture/ADR-004-entity-resolution.md](docs/architecture/ADR-004-entity-resolution.md) | ADR-004: Entities |
| [docs/architecture/ADR-005-graph-model.md](docs/architecture/ADR-005-graph-model.md) | ADR-005: Graph |
| [docs/architecture/ADR-006-ai-abstraction.md](docs/architecture/ADR-006-ai-abstraction.md) | ADR-006: AI |
| [docs/architecture/ADR-007-local-ai-ollama.md](docs/architecture/ADR-007-local-ai-ollama.md) | ADR-007: Ollama |
| [docs/architecture/ADR-008-authentication.md](docs/architecture/ADR-008-authentication.md) | ADR-008: Auth |
| [docs/architecture/ADR-009-deployment.md](docs/architecture/ADR-009-deployment.md) | ADR-009: Deployment |

### Project Management

| Document | Description |
|---|---|
| [MVP_SCOPE.md](MVP_SCOPE.md) | September 19 MVP scope |
| [docs/SEPTEMBER_19_PLAN.md](docs/SEPTEMBER_19_PLAN.md) | Timeline to MVP |
| [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md) | Task dependencies |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Current status |
| [ROADMAP.md](ROADMAP.md) | Product roadmap |

### Security and Policies

| Document | Description |
|---|---|
| [SECURITY.md](SECURITY.md) | Security policy |
| [docs/AI_CODE_REVIEW_POLICY.md](docs/AI_CODE_REVIEW_POLICY.md) | AI code review policy |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |

### AI Development

| Document | Description |
|---|---|
| [docs/AI_MODEL_STRATEGY.md](docs/AI_MODEL_STRATEGY.md) | AI model strategy |
| [docs/FREE_AI_DEVELOPMENT.md](docs/FREE_AI_DEVELOPMENT.md) | Free AI development |
| [docs/AI_CODING_RULES.md](docs/AI_CODING_RULES.md) | AI coding rules |
| [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md) | AI workflow |

---

## AI Development

See [docs/FREE_AI_DEVELOPMENT.md](docs/FREE_AI_DEVELOPMENT.md) for free AI development setup using OpenCode + Ollama.

**Rule:** No paid AI APIs. Local models only.

---

## License

TBD — awaiting confirmation from organization.
