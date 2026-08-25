# OSINT_Tool

**RedKross OSINT Investigation Platform**

An evidence-first intelligence operating system for authorized open-source investigation.

---

## Status

**Phase:** Repository Audit + Governance Setup
**Target MVP:** September 19, 2026

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
pnpm db:migrate

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

## Documentation

| Document | Description |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture |
| [MVP_SCOPE.md](MVP_SCOPE.md) | September 19 MVP scope |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Development setup |
| [TEAM_WORKFLOW.md](TEAM_WORKFLOW.md) | Team processes |
| [SECURITY.md](SECURITY.md) | Security policy |
| [ROADMAP.md](ROADMAP.md) | Product roadmap |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Current status |

## AI Development

See [docs/FREE_AI_DEVELOPMENT.md](docs/FREE_AI_DEVELOPMENT.md) for free AI development setup using OpenCode + Ollama.

**Rule:** No paid AI APIs. Local models only.

## Teams

| Team | Responsibility |
|---|---|
| Team 1 | Core Platform + Evidence |
| Team 2 | Connectors + Collection |
| Team 3 | Intelligence + Entity + Graph |
| Team 4 | AI + Verification |
| Team 5 | Product + Frontend + Reporting |

See [docs/teams/](docs/teams/) for team-specific documentation.

## License

TBD — awaiting confirmation from organization.
