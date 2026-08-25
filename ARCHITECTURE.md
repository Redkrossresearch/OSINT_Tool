# Architecture — RedKross OSINT Investigation Platform

## Overview

The RedKross OSINT Investigation Platform is an evidence-first intelligence operating system that transforms authorized public-source data into structured, verifiable intelligence through a systematic workflow.

---

## System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                   │
│  Dashboard │ Case Mgmt │ Evidence │ Graph │ Report       │
└──────────────┬───────────────────────────────────────────┘
               │ REST API
┌──────────────▼───────────────────────────────────────────┐
│                    API LAYER                              │
│  Case API │ Investigation API │ Evidence API │ Graph API  │
└──────────────┬───────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────┐
│                  SERVICE LAYER                            │
│                                                          │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  ┌────────┐ │
│  │  Core    │  │ Evidence  │  │Connectors  │  │  AI    │ │
│  │ Service  │  │ Service  │  │  Service   │  │Service │ │
│  └────┬────┘  └────┬─────┘  └─────┬──────┘  └───┬────┘ │
│       │            │              │              │       │
│  ┌────▼────┐  ┌────▼─────┐  ┌────▼──────┐  ┌───▼────┐ │
│  │  Case   │  │  Evidence │  │ Connector │  │  Agent │ │
│  │Invest.  │  │  Storage  │  │ Registry  │  │Pipeline│ │
│  │Objective│  │  Hashing  │  │           │  │        │ │
│  └─────────┘  │Provenance │  └─────┬─────┘  └───┬────┘ │
│               └──────────┘        │              │       │
│  ┌─────────────────┐  ┌───────────▼──┐  ┌───────▼────┐ │
│  │  Intelligence   │  │  Connectors  │  │Verification│ │
│  │    Service      │  │              │  │  Service   │ │
│  └────────┬────────┘  │ Web │ DNS    │  └──────┬─────┘ │
│           │           │ GH  │ Cert   │         │       │
│  ┌────────▼────────┐  │Fetch│        │  ┌──────▼─────┐ │
│  │   Graph         │  └─────────────┘  │  Findings   │ │
│  │   Service       │                   │  Reporting  │ │
│  └─────────────────┘                   └────────────┘ │
└──────────────────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────┐
│                    DATA LAYER                             │
│  PostgreSQL (via Prisma) │ File Storage │ Ollama (local) │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Investigation Workflow

```
1. CREATE CASE
   ↓
2. CREATE INVESTIGATION + OBJECTIVE
   ↓
3. AI PLANNER → Research Tasks
   ↓
4. CONNECTORS → Raw Data → Normalization
   ↓
5. OBSERVATIONS → Evidence Storage (with hash + provenance)
   ↓
6. AI ANALYSIS → Entity Extraction → Relationships
   ↓
7. GRAPH BUILDING → Entity Resolution → Relationship Graph
   ↓
8. AI CORRELATION → Cross-evidence patterns
   ↓
9. CONTRADICTION DETECTION → Verification
   ↓
10. FINDINGS → Human Verification
    ↓
11. REPORT GENERATION
    ↓
12. AUDIT MANIFEST / REPLAY
```

### Evidence Flow

```
Connector produces raw data
        ↓
Normalization (to Observation schema)
        ↓
Observation stored as Evidence (with hash)
        ↓
Provenance entry recorded
        ↓
Entity extraction (from Observation data)
        ↓
Relationship extraction
        ↓
Graph update
```

---

## Components

### Core Services (`services/core/`)
- Case management
- Investigation lifecycle
- Objective management
- State machine
- Audit events

### Evidence Services (`services/evidence/`)
- Evidence storage
- SHA-256 hashing
- Provenance tracking
- Evidence retrieval

### Connector Services (`services/connectors/`)
- Connector framework
- Registry
- Health monitoring
- Orchestration

### Intelligence Services (`services/intelligence/`)
- Entity extraction
- Entity normalization
- Entity resolution
- Confidence scoring

### Graph Services (`services/graph/`)
- Graph storage (PostgreSQL)
- Graph queries
- Timeline generation
- Traversal

### AI Services (`services/ai/`)
- Model abstraction
- Ollama integration
- Agent pipeline
- Prompt management
- Logging

### Verification Services (`services/verification/`)
- Contradiction detection
- Verification workflow
- Finding management

### Product (`apps/web/`)
- Dashboard
- Case management UI
- Investigation UI
- Evidence viewer
- Entity viewer
- Graph visualization
- Timeline
- Report viewer

### Reporting (`services/reporting/`)
- Report generation
- Markdown export

---

## Database Schema (High Level)

```
cases
├── investigations
│   ├── objectives
│   ├── evidence
│   │   ├── provenance
│   │   └── observations
│   ├── entities
│   ├── relationships
│   ├── findings
│   └── audit_events
└── users
```

---

## Authentication

- JWT tokens with expiry
- bcrypt password hashing
- Role-based access: admin, analyst, viewer
- Per-case and per-investigation access control

---

## Security Architecture

- All AI runs locally (Ollama) — no data leaves machine
- Connectors access only authorized public sources
- SSRF prevention blocks internal IP access
- Evidence is immutable (hash verification)
- Full audit trail for all actions
- Branch protection + CODEOWNERS on repository
- No paid API keys in codebase

---

## Deployment

### Development
- Docker Compose (PostgreSQL)
- Ollama local
- Local development servers

### Production (Future)
- Containerized services
- PostgreSQL managed service
- Static frontend hosting
- Ollama on dedicated GPU server

---

## ADRs

See `docs/architecture/` for Architecture Decision Records:
- ADR-001: Repository Architecture
- ADR-002: Evidence Model
- ADR-003: Connector Interface
- ADR-004: Entity Resolution
- ADR-005: Graph Model
- ADR-006: AI Abstraction
- ADR-007: Local AI/Ollama
- ADR-008: Authentication
- ADR-009: Deployment
