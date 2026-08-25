# Dependencies

## Critical Path

The MVP has a strict sequential dependency chain. Teams 2-5 can prepare in parallel using mocks, but integration depends on upstream completion.

---

## Dependency Graph

```
T1-001 Monorepo Setup
├── T1-002 Database Setup
│   ├── T1-003 Case Model + API
│   │   ├── T1-004 Investigation Model + State Machine
│   │   │   ├── T4-003 Planner Agent
│   │   │   └── T5-004 Investigation Progress View
│   │   ├── T5-002 Dashboard + Case List
│   │   └── T5-003 Case/Investigation Creation
│   ├── T1-007 Evidence Storage Service
│   │   ├── T2-003 through T2-007 (all connectors)
│   │   ├── T4-004 Analysis Agent
│   │   └── T5-005 Evidence Viewer
│   └── T1-010 Audit Event System
│       └── T3-009 Timeline Service
├── T1-005 Objective Schema
│   └── T2-001 Connector Interface
│       ├── T2-002 Connector Registry
│       ├── T2-003 through T2-007 (connectors)
│       └── T2-008 Integration Tests
├── T1-006 Evidence Schema + Hashing
│   ├── T1-008 Source + Provenance
│   │   └── T1-009 Observation Schema
│   │       ├── T2-001 Connector Interface
│   │       ├── T3-003 Entity Extraction
│   │       └── T4-004 Analysis Agent
│   └── T4-007 Contradiction Detection
├── T1-011 Shared Schema Package
│   └── ALL OTHER TEAMS (depends on schemas)
├── T3-001 Entity Schema
│   ├── T3-002 Relationship Schema
│   ├── T3-003 Entity Extraction
│   │   ├── T3-004 Entity Normalization
│   │   │   └── T3-005 Entity Resolution
│   │   └── T3-006 Graph Database Schema
│   │       └── T3-007 Graph Service
│   │           ├── T3-008 Graph API
│   │           │   ├── T5-006 Entity Viewer
│   │           │   ├── T5-007 Graph Visualization
│   │           │   └── T5-008 Timeline View
│   │           └── T3-009 Timeline Service
├── T4-001 Model Abstraction
│   ├── T4-002 Ollama Integration
│   ├── T4-003 Planner Agent
│   ├── T4-004 Analysis Agent
│   │   └── T4-005 Correlation Agent
│   ├── T4-006 Supervisor Agent
│   ├── T4-007 Contradiction Detection
│   │   └── T4-008 Verification Workflow
│   │       ├── T5-009 Findings View
│   │       └── T5-010 Report Generation
│   └── T4-009 AI Logging
├── T5-001 Next.js Setup
│   └── ALL T5-XXX tasks
└── T5-011 E2E Tests (depends on all T5-XXX)
```

---

## Parallel Workstreams

While Team 1 builds the foundation, Teams 2-5 can work in parallel:

| Team | Can Start Immediately | Needs From Team 1 |
|---|---|---|
| Team 2 | T2-001 (connector interface — can define independently) | T1-009 (Observation schema) for integration |
| Team 3 | T3-001 (entity types — can define independently) | T1-009 for integration |
| Team 4 | T4-001 (model abstraction — can define independently) | T1-004, T1-006 for integration |
| Team 5 | T5-001 (Next.js setup — can start independently) | T1-003 for API integration |

---

## Integration Order

1. **Team 1** — schemas, core services, database
2. **Team 2** — connectors produce observations (consumed by Team 3)
3. **Team 3** — entities and graph (consumed by Team 4)
4. **Team 4** — AI pipeline (uses all upstream data)
5. **Team 5** — frontend consumes all APIs
6. **Full Integration** — end-to-end testing
7. **QA** — security, performance, usability
8. **Demo** — customer demonstration
9. **Release** — September 19

---

## Mock Strategy

Teams 2-5 should use mocks and fixtures to avoid blocking:

| Dependency | Mock Strategy |
|---|---|
| Database | SQLite in-memory or mock repositories |
| Team 1 APIs | MSW (Mock Service Worker) handlers |
| Team 2 Observations | JSON fixture files |
| Team 3 Entities/Graph | JSON fixture files |
| Team 4 AI responses | Mock model responses |
| External services | Recorded responses, mock servers |

---

## Critical Dependencies (Cannot Be Mocked Long-Term)

1. **Observation Schema** — Must be finalized by Team 1 before Team 2 integration
2. **Evidence Schema** — Must be finalized by Team 1 before storage integration
3. **Entity Schema** — Must be finalized by Team 3 before graph integration
4. **AI Model Abstraction** — Must be finalized by Team 4 before pipeline integration
5. **All APIs** — Must be finalized before Team 5 integration testing
