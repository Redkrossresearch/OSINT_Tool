# Team 1 — Core Platform + Evidence

## Mission

Build the foundation all other teams depend on. Every team's work ultimately relies on the schemas, services, and APIs established by Team 1.

---

## Responsibilities

- Case management (CRUD, state machine)
- Investigation schema and lifecycle
- Objective schema and validation
- Evidence schema, storage, and hashing
- Observation model
- Source tracking
- Provenance chain
- Audit events
- Timeline data
- Database models and migrations
- Shared schemas (`packages/schemas/`)
- Core APIs
- Unit and integration tests
- API documentation

---

## Owned Directories

```
services/core/           — Case, investigation, objective services
services/evidence/       — Evidence storage, hashing, provenance
packages/schemas/        — Shared TypeScript schemas and types
docs/api/                — API documentation
docs/architecture/       — Architecture decision records
```

---

## Key Interfaces (To Be Created)

### Case
```typescript
interface Case {
  id: string;           // UUID
  title: string;
  description: string;
  status: CaseStatus;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}
```

### Investigation
```typescript
interface Investigation {
  id: string;           // UUID
  case_id: string;
  objective: Objective;
  state: InvestigationState;
  plan: InvestigationPlan | null;
  created_at: Date;
  updated_at: Date;
}
```

### Evidence
```typescript
interface Evidence {
  id: string;           // UUID
  investigation_id: string;
  type: EvidenceType;
  source: SourceRef;
  content: EvidenceContent;
  metadata: Record<string, unknown>;
  hash: string;         // SHA-256
  provenance: ProvenanceEntry[];
  created_at: Date;
}
```

### Observation
```typescript
interface Observation {
  id: string;
  evidence_id: string;
  type: string;
  data: Record<string, unknown>;
  confidence: number;   // 0.0 - 1.0
  source_ref: SourceRef;
  timestamp: Date;
}
```

---

## Dependencies

- None (Team 1 is the foundation)

## Dependents

- Team 2 (Connectors) depends on Observation and Evidence schemas
- Team 3 (Intelligence) depends on Entity, Observation, and Evidence schemas
- Team 4 (AI) depends on Investigation, Evidence, and Observation schemas
- Team 5 (Product) depends on all APIs

---

## Integration Points

| Interface | Consumed By |
|---|---|
| `packages/schemas/` | All teams |
| Case API | Team 5 |
| Investigation API | Teams 3, 4, 5 |
| Evidence API | Teams 2, 3, 4 |
| Observation schema | Teams 2, 3, 4 |

---

## Testing Strategy

- Unit tests for every service function
- Integration tests for API endpoints
- Schema validation tests
- Database migration tests
- Contract tests for shared schemas

---

## Team Lead Responsibilities

- Review all PRs touching `services/core/`, `services/evidence/`, `packages/schemas/`
- Maintain schema compatibility across teams
- Coordinate interface changes with other team leads
- Ensure database migrations are safe and reversible
