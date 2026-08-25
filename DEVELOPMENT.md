# Development Guide

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 20+ | Runtime |
| pnpm | 9+ | Package manager |
| Docker | 24+ | PostgreSQL, development services |
| Git | 2.40+ | Version control |
| Ollama | 0.3+ | Local AI models |
| VS Code | Latest | IDE |
| OpenCode | Latest | AI coding assistant |

## Setup

### 1. Clone Repository
```bash
git clone https://github.com/Redkrossresearch/OSINT_Tool.git
cd OSINT_Tool
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Start Development Services
```bash
docker-compose up -d
```
This starts PostgreSQL and any other required services.

### 4. Set Up Database
```bash
pnpm db:migrate
pnpm db:seed
```

### 5. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 6. Start Development Servers
```bash
pnpm dev
```

### 7. Start Ollama (for AI features)
```bash
ollama serve
```

### 8. Verify Setup
```bash
pnpm test
pnpm lint
pnpm typecheck
```

## Development Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all development servers |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm lint` | Run linter |
| `pnpm typecheck` | Run TypeScript type checker |
| `pnpm format` | Format code with Prettier |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database with test data |

## Working Directory

```
OSINT_Tool/
├── apps/
│   └── web/              # Next.js frontend
├── services/
│   ├── core/             # Case, investigation, objective
│   ├── evidence/         # Evidence storage, hashing
│   ├── connectors/       # Connector orchestration
│   ├── intelligence/     # Entity extraction, resolution
│   ├── graph/            # Graph storage, queries
│   ├── ai/               # AI pipeline, agents
│   ├── verification/     # Contradiction detection
│   └── reporting/        # Report generation
├── packages/
│   ├── schemas/          # Shared TypeScript schemas
│   └── entities/         # Entity type definitions
├── connectors/           # Individual connector implementations
├── tests/
│   ├── e2e/              # End-to-end tests
│   └── evaluation/       # AI evaluation tests
├── docs/                 # Documentation
│   ├── teams/            # Team-specific docs
│   ├── tasks/            # Task breakdowns
│   ├── ai/               # AI documentation
│   ├── api/              # API documentation
│   └── architecture/     # Architecture docs
└── .github/
    └── workflows/        # CI/CD pipelines
```

## AI Development Setup

See `docs/FREE_AI_DEVELOPMENT.md` for complete AI setup.

Quick start:
```bash
# Verify Ollama is running
ollama list

# Verify OpenCode is configured
# Edit ~/.config/opencode/opencode.jsonc if needed

# Start coding with AI assistance
opencode
```

## Debugging

### Database
```bash
# Connect to PostgreSQL
docker exec -it osint-postgres psql -U postgres -d osint
```

### Ollama
```bash
# Check Ollama status
ollama list

# Test a model
ollama run qwen3:4b "Hello"

# Check GPU usage
nvidia-smi
```

### Logs
```bash
# Docker services logs
docker-compose logs -f

# Application logs
pnpm dev --verbose
```
