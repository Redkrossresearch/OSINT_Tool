# Tasks — Team 2: Connectors + Collection

## T2-001: Connector Interface + Framework

**TEAM:** 2 — Connectors + Collection
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Define the Connector interface and build the connector framework (lifecycle, configuration, error handling).

### Dependencies
T1-009 (Observation schema)

### Input
- Observation schema from Team 1

### Output
- `packages/schemas/connector.ts` (interface definition)
- `services/connectors/src/framework/connector-base.ts` (base class)
- `services/connectors/src/framework/connector-loader.ts`
- `services/connectors/src/framework/connector-config.ts`
- Unit tests

### Allowed Files
- `packages/schemas/connector.ts`
- `services/connectors/src/framework/*`
- `services/connectors/src/__tests__/framework/*.test.ts`

### Implementation Notes
- Abstract base class with template method pattern
- Standardized error handling
- Timeout wrapper
- Retry with exponential backoff
- Rate limiting

### Acceptance Criteria
- [ ] Connector interface is defined
- [ ] Base class handles timeout, retry, rate limit
- [ ] Configuration validation works

---

## T2-002: Connector Registry + Health

**TEAM:** 2 — Connectors + Collection
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement connector registration, discovery, and health monitoring.

### Dependencies
T2-001

### Input
- Connector framework

### Output
- Connector registry service
- Health check system
- Registry API
- Unit tests

### Allowed Files
- `services/connectors/src/registry/connector-registry.ts`
- `services/connectors/src/registry/health-checker.ts`
- `services/connectors/src/routes/connector.routes.ts`
- `services/connectors/src/__tests__/registry/*.test.ts`

### Acceptance Criteria
- [ ] Connectors can be registered and discovered
- [ ] Health checks run periodically
- [ ] Health status is exposed via API

---

## T2-003: Web Search Connector

**TEAM:** 2 — Connectors + Collection
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement the public web search connector using DuckDuckGo HTML endpoint.

### Dependencies
T2-001, T1-009

### Input
- Connector interface, Observation schema

### Output
- `connectors/web-search/` directory
- Connector implementation
- Unit tests with mocked responses

### Allowed Files
- `connectors/web-search/src/*.ts`
- `connectors/web-search/__tests__/*.test.ts`
- `connectors/web-search/package.json`

### Implementation Notes
- Uses DuckDuckGo HTML search (no API key)
- Rate limit: 1 request/second
- Output: URLs, titles, snippets
- No paid API keys

### Acceptance Criteria
- [ ] Returns search results as Observations
- [ ] Rate limiting works
- [ ] Timeout handling works
- [ ] No API keys required

---

## T2-004: DNS/RDAP Connector

**TEAM:** 2 — Connectors + Collection
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement DNS and RDAP lookup connector.

### Dependencies
T2-001, T1-009

### Input
- Connector interface, Observation schema

### Output
- `connectors/dns-rdap/` directory
- Connector implementation
- Unit tests

### Allowed Files
- `connectors/dns-rdap/src/*.ts`
- `connectors/dns-rdap/__tests__/*.test.ts`
- `connectors/dns-rdap/package.json`

### Implementation Notes
- DNS resolution: A, AAAA, MX, NS, TXT, CNAME
- RDAP: registrar, creation date, expiry
- Uses public DNS resolvers (1.1.1.1, 8.8.8.8)
- Rate limit: 10 queries/second

### Acceptance Criteria
- [ ] DNS records are returned as Observations
- [ ] RDAP data is returned
- [ ] Multiple record types supported

---

## T2-005: GitHub Public Connector

**TEAM:** 2 — Connectors + Collection
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement GitHub public API connector.

### Dependencies
T2-001, T1-009

### Input
- Connector interface, Observation schema

### Output
- `connectors/github-public/` directory
- Connector implementation
- Unit tests

### Allowed Files
- `connectors/github-public/src/*.ts`
- `connectors/github-public/__tests__/*.test.ts`
- `connectors/github-public/package.json`

### Implementation Notes
- GitHub REST API v3 (public, unauthenticated)
- Rate limit: 60/hour (unauthenticated)
- Fetches: repositories, profiles, languages, topics
- No API key required

### Acceptance Criteria
- [ ] Public repo data is returned as Observations
- [ ] Rate limiting respects GitHub limits
- [ ] No authentication required

---

## T2-006: Certificate Intelligence Connector

**TEAM:** 2 — Connectors + Collection
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement Certificate Transparency log connector.

### Dependencies
T2-001, T1-009

### Input
- Connector interface, Observation schema

### Output
- `connectors/cert-intel/` directory
- Connector implementation
- Unit tests

### Allowed Files
- `connectors/cert-intel/src/*.ts`
- `connectors/cert-intel/__tests__/*.test.ts`
- `connectors/cert-intel/package.json`

### Implementation Notes
- Uses crt.sh (Certificate Transparency search)
- No API key required
- Rate limit: 1 request/2 seconds
- Output: certificates, issuers, domains, validity

### Acceptance Criteria
- [ ] CT log data is returned as Observations
- [ ] Certificate chains are captured
- [ ] Domain associations are extracted

---

## T2-007: Web Fetch Connector

**TEAM:** 2 — Connectors + Collection
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement public web page fetching connector.

### Dependencies
T2-001, T1-009

### Input
- Connector interface, Observation schema

### Output
- `connectors/web-fetch/` directory
- Connector implementation
- Unit tests

### Allowed Files
- `connectors/web-fetch/src/*.ts`
- `connectors/web-fetch/__tests__/*.test.ts`
- `connectors/web-fetch/package.json`

### Implementation Notes
- Fetches public web pages
- Extracts text content, metadata, links
- Respects robots.txt
- SSRF protection (no internal IPs)
- Rate limit: 1 request/2 seconds

### Acceptance Criteria
- [ ] Public pages are fetched and parsed
- [ ] SSRF protection blocks internal IPs
- [ ] robots.txt is respected

---

## T2-008: Connector Integration Tests

**TEAM:** 2 — Connectors + Collection
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Write integration tests for all connectors against live public sources.

### Dependencies
T2-003, T2-004, T2-005, T2-006, T2-007

### Input
- All connector implementations

### Output
- Integration test suite
- Test fixtures
- Mock data

### Allowed Files
- `services/connectors/src/__tests__/integration/*.test.ts`
- `services/connectors/src/__tests__/fixtures/*.json`

### Test Requirements
- Each connector tested against real public source
- Rate limiting respected in tests
- Tests are idempotent

### Acceptance Criteria
- [ ] All connectors produce valid Observations
- [ ] Error handling works for network failures
- [ ] Rate limiting is enforced
