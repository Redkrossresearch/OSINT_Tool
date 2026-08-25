# Team 2 — Connectors + Collection

## Mission

Convert authorized public sources into standardized observations and evidence objects. Each connector is a bounded, testable module that ingests data from one source type and outputs normalized observations.

---

## Responsibilities

- Connector framework (interface, lifecycle, configuration)
- Connector registry (discovery, listing, health)
- Initial connectors:
  1. Public web/search
  2. Public web (page fetch)
  3. DNS/RDAP/domain intelligence
  4. Certificate intelligence (CT logs)
  5. GitHub/public repositories
- Normalization to Observation schema
- Timeout handling
- Retry logic with backoff
- Rate limiting
- Health monitoring
- Error handling and reporting
- Tests for each connector
- Connector documentation

---

## Owned Directories

```
connectors/              — Connector implementations
services/connectors/     — Connector orchestration, registry, health
docs/connectors/         — Connector documentation
```

---

## Connector Interface (Contract)

```typescript
interface Connector {
  name: string;
  version: string;
  supportedObjectiveTypes: ObjectiveType[];

  configure(config: ConnectorConfig): Promise<void>;
  collect(input: CollectorInput): AsyncGenerator<Observation>;
  health(): Promise<ConnectorHealth>;
}

interface CollectorInput {
  objective: Objective;
  investigation_id: string;
  parameters: Record<string, unknown>;
  timeout_ms: number;
}

interface Observation {
  id: string;
  evidence_id: string;
  type: string;
  data: Record<string, unknown>;
  confidence: number;
  source_ref: SourceRef;
  timestamp: Date;
}

interface ConnectorHealth {
  status: 'healthy' | 'degraded' | 'unavailable';
  last_check: Date;
  error?: string;
}
```

---

## Data Flow

```
OBJECTIVE + PARAMETERS
        ↓
    CONNECTOR
        ↓
    RAW DATA
        ↓
    NORMALIZATION
        ↓
    OBSERVATION[]
        ↓
    EVIDENCE REFERENCE
        ↓
    STORAGE (via Team 1 Evidence API)
```

---

## Dependencies

- Team 1: Observation schema, Evidence schema, Objective schema, Source schema
- External: Public DNS resolvers, GitHub API (public), HTTP clients

## Dependents

- Team 3 (Intelligence): Consumes observations for entity extraction
- Team 4 (AI): Consumes observations for analysis
- Team 5 (Product): Displays connector health, collection status

---

## Connector-Specific Notes

### Web/Search Connector
- Uses public search engines (DuckDuckGo HTML, etc.)
- No API keys required
- Rate limit: 1 request/second
- Output: URLs, snippets, titles

### DNS/RDAP Connector
- Uses public DNS resolvers and RDAP servers
- No API keys required
- Rate limit: 10 queries/second
- Output: A/AAAA/MX/NS/TXT records, RDAP entity data

### Certificate Intelligence Connector
- Uses Certificate Transparency logs (crt.sh, etc.)
- No API keys required
- Rate limit: 1 request/2 seconds
- Output: Certificate issuers, domains, validity dates

### GitHub Public Connector
- Uses GitHub public API (unauthenticated)
- Rate limit: 60 requests/hour (unauthenticated)
- Output: Repositories, profiles, languages, topics

---

## Testing Strategy

- Unit tests per connector (mock HTTP responses)
- Integration tests against live public sources (with rate limiting)
- Contract tests against Observation schema
- Health check tests
- Timeout/retry tests
