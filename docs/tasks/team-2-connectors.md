# Tasks — Team 2: Connectors + Public Collection

## T2-001 — Connector Interface

**Team:** Team 2 — Connectors + Collection
**Objective:** Define the Connector interface and build the base framework (lifecycle, configuration, error handling).
**Why:** Every connector must follow the same contract for the system to work.

**Primary Owner:** `riddhisawant305-jpg`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** Team lead

### Dependencies
T1-008 (Observation schema)

### Inputs
- Observation schema from Team 1

### Outputs
- `services/connectors/src/framework/connector-interface.ts`
- `services/connectors/src/framework/connector-base.ts`
- `services/connectors/src/framework/connector-config.ts`

### Allowed Files
- `services/connectors/src/framework/`

### Do Not Modify
- `packages/schemas/` (Team 1 owns)
- Any connector implementation

### Implementation Guidance
1. Define TypeScript interface: `connect()`, `health()`, `configure()`
2. Create abstract base class with common logic
3. Add timeout wrapper
4. Add retry with exponential backoff
5. Add rate limiting
6. Add error handling

### AI Instructions
Ask AI to explain the Template Method design pattern before implementing. Ask for the interface contract first.

### Tests
- Interface is defined
- Base class compiles
- Configuration validation works

### Documentation
- Connector interface documentation

### Acceptance Criteria
- [ ] Interface defined
- [ ] Base class handles timeout/retry/rate-limit
- [ ] Configuration validation works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-002 — Connector Result Contract

**Team:** Team 2 — Connectors + Collection
**Objective:** Define the standardized result format for all connectors.
**Why:** Consistent output format ensures Team 3 and Team 4 can process all observations uniformly.

**Primary Owner:** `riddhisawant305-jpg`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** Team lead

### Dependencies
T2-001, T1-008

### Inputs
- Connector interface, Observation schema

### Outputs
- `services/connectors/src/framework/connector-result.ts`
- Result types and validation

### Allowed Files
- `services/connectors/src/framework/`

### Do Not Modify
- Observation schema

### Implementation Guidance
1. Define `ConnectorResult` interface wrapping Observation[]
2. Add metadata: connector_name, query, timestamp, duration
3. Add error results for failed collections
4. Create Zod schemas

### AI Instructions
Ask AI to explain error union types in TypeScript.

### Tests
- Success results validated
- Error results validated
- Zod schemas work

### Documentation
- Result contract documentation

### Acceptance Criteria
- [ ] Result types defined
- [ ] Error results handled
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-003 — Connector Registry

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement connector registration, discovery, and health monitoring.
**Why:** The system needs to know which connectors are available and healthy.

**Primary Owner:** `darshankamble0628-coder`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `riddhisawant305-jpg`

### Dependencies
T2-001

### Inputs
- Connector interface

### Outputs
- `services/connectors/src/registry/connector-registry.ts`
- `services/connectors/src/registry/health-checker.ts`
- `services/connectors/src/routes/connector.routes.ts`

### Allowed Files
- `services/connectors/src/registry/`
- `services/connectors/src/routes/`

### Do Not Modify
- Connector implementations

### Implementation Guidance
1. Implement registry that stores connector instances
2. Add health check system (periodic ping)
3. Expose health status via API
4. Add connector listing endpoint

### AI Instructions
Ask AI to explain service registry patterns.

### Tests
- Connectors register correctly
- Health checks run
- API returns health status

### Documentation
- Registry API documentation

### Acceptance Criteria
- [ ] Connectors register and discover
- [ ] Health checks work
- [ ] API exposes health

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-004 — Connector Configuration

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement connector configuration management (environment-based, per-connector).
**Why:** Each connector needs specific configuration (API endpoints, rate limits, etc.).

**Primary Owner:** `darshankamble0628-coder`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `riddhisawant305-jpg`

### Dependencies
T2-001

### Inputs
- Connector interface

### Outputs
- `services/connectors/src/config/connector-config.ts`
- Configuration schemas
- Validation

### Allowed Files
- `services/connectors/src/config/`

### Do Not Modify
- Framework files

### Implementation Guidance
1. Define configuration schema per connector
2. Read from environment variables
3. Validate configuration on startup
4. Provide defaults for optional settings

### AI Instructions
Ask AI to explain environment-based configuration patterns.

### Tests
- Valid config passes
- Missing required config fails
- Defaults applied correctly

### Documentation
- Configuration reference

### Acceptance Criteria
- [ ] Configuration works
- [ ] Validation enforced
- [ ] Defaults work

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-005 — Public Web Connector

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement public web page fetching connector with SSRF protection.
**Why:** Web pages are a primary OSINT source.

**Primary Owner:** `yadavchinmay45-cloud`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `riddhisawant305-jpg`

### Dependencies
T2-001, T1-008

### Inputs
- Connector interface, Observation schema

### Outputs
- `connectors/web-fetch/src/index.ts`
- Web page fetching logic
- HTML parsing
- SSRF protection
- Unit tests

### Allowed Files
- `connectors/web-fetch/`

### Do Not Modify
- Framework files
- Other connectors

### Implementation Guidance
1. Fetch public web pages via HTTP/HTTPS
2. Parse HTML for text content, metadata, links
3. Implement SSRF protection (block private IPs)
4. Respect robots.txt
5. Rate limit: 1 request/2 seconds
6. Timeout: 30 seconds

### AI Instructions
Ask AI to explain SSRF protection techniques and safe URL parsing.

### Tests
- Public pages fetched
- SSRF protection blocks internal IPs
- robots.txt respected
- Timeout works

### Documentation
- Web fetch connector documentation

### Acceptance Criteria
- [ ] Public pages fetched
- [ ] SSRF protection works
- [ ] Rate limiting works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-006 — Public Search Connector

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement public web search connector using DuckDuckGo HTML endpoint.
**Why:** Search results are a primary intelligence collection source.

**Primary Owner:** `yadavchinmay45-cloud`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `riddhisawant305-jpg`

### Dependencies
T2-001, T1-008

### Inputs
- Connector interface, Observation schema

### Outputs
- `connectors/web-search/src/index.ts`
- Search result parsing
- Unit tests

### Allowed Files
- `connectors/web-search/`

### Do Not Modify
- Framework files

### Implementation Guidance
1. Use DuckDuckGo HTML search endpoint (no API key)
2. Parse search results (URLs, titles, snippets)
3. Rate limit: 1 request/second
4. Handle CAPTCHA/blocking gracefully

### AI Instructions
Ask AI to explain HTML parsing for search results.

### Tests
- Search results returned
- Rate limiting works
- Error handling for blocks

### Documentation
- Search connector documentation

### Acceptance Criteria
- [ ] Search results returned
- [ ] No API key required
- [ ] Rate limiting works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-007 — DNS/RDAP Connector

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement DNS and RDAP lookup connector.
**Why:** DNS and domain registration data are essential for infrastructure OSINT.

**Primary Owner:** `AaryanDhotre2326`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `riddhisawant305-jpg`

### Dependencies
T2-001, T1-008

### Inputs
- Connector interface, Observation schema

### Outputs
- `connectors/dns-rdap/src/index.ts`
- DNS resolution
- RDAP queries
- Unit tests

### Allowed Files
- `connectors/dns-rdap/`

### Do Not Modify
- Framework files

### Implementation Guidance
1. DNS resolution: A, AAAA, MX, NS, TXT, CNAME
2. RDAP: registrar, creation date, expiry, contacts
3. Use public DNS resolvers (1.1.1.1, 8.8.8.8)
4. Rate limit: 10 queries/second

### AI Instructions
Ask AI to explain Node.js DNS module and RDAP protocol.

### Tests
- DNS records returned
- RDAP data returned
- Multiple record types work

### Documentation
- DNS/RDAP connector documentation

### Acceptance Criteria
- [ ] DNS records returned
- [ ] RDAP data returned
- [ ] Rate limiting works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-008 — Certificate Intelligence Connector

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement Certificate Transparency log connector.
**Why:** CT logs reveal domain ownership and infrastructure relationships.

**Primary Owner:** `AaryanDhotre2326`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `riddhisawant305-jpg`

### Dependencies
T2-001, T1-008

### Inputs
- Connector interface, Observation schema

### Outputs
- `connectors/cert-intel/src/index.ts`
- CT log querying
- Unit tests

### Allowed Files
- `connectors/cert-intel/`

### Do Not Modify
- Framework files

### Implementation Guidance
1. Use crt.sh for CT log search
2. No API key required
3. Rate limit: 1 request/2 seconds
4. Extract: certificates, issuers, domains, validity dates

### AI Instructions
Ask AI to explain Certificate Transparency and crt.sh API.

### Tests
- CT data returned
- Certificate chains captured
- Domain associations extracted

### Documentation
- Certificate intelligence documentation

### Acceptance Criteria
- [ ] CT log data returned
- [ ] No API key required
- [ ] Rate limiting works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-009 — GitHub Public Connector

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement GitHub public API connector for repository intelligence.
**Why:** GitHub reveals developer activity, technologies, and project relationships.

**Primary Owner:** `antarahire22-creator`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `riddhisawant305-jpg`

### Dependencies
T2-001, T1-008

### Inputs
- Connector interface, Observation schema

### Outputs
- `connectors/github-public/src/index.ts`
- GitHub API querying
- Unit tests

### Allowed Files
- `connectors/github-public/`

### Do Not Modify
- Framework files

### Implementation Guidance
1. GitHub REST API v3 (public, unauthenticated)
2. Rate limit: 60/hour (unauthenticated)
3. Fetch: repositories, profiles, languages, topics
4. No API key required

### AI Instructions
Ask AI to explain GitHub REST API v3 public endpoints.

### Tests
- Public repo data returned
- Rate limiting respects GitHub limits
- No authentication required

### Documentation
- GitHub connector documentation

### Acceptance Criteria
- [ ] Public repo data returned
- [ ] No API key required
- [ ] Rate limiting works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-010 — Normalization Pipeline

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement the data normalization pipeline that converts raw connector output to Observation schema.
**Why:** All connectors produce different formats. Normalization ensures uniform output.

**Primary Owner:** `antarahire22-creator`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `riddhisawant305-jpg`

### Dependencies
T2-001, T1-008

### Inputs
- Connector interface, Observation schema

### Outputs
- `services/connectors/src/normalization/normalizer.ts`
- Type-specific normalizers
- Unit tests

### Allowed Files
- `services/connectors/src/normalization/`

### Do Not Modify
- Connector implementations

### Implementation Guidance
1. Define normalizer interface
2. Implement type-specific normalizers (web, DNS, cert, GitHub)
3. Map raw data to Observation fields
4. Assign confidence scores
5. Attach source references

### AI Instructions
Ask AI to explain data normalization patterns.

### Tests
- Each connector output normalizes correctly
- Confidence scores assigned
- Source references attached

### Documentation
- Normalization pipeline documentation

### Acceptance Criteria
- [ ] All connector outputs normalize
- [ ] Confidence scores work
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-011 — Rate Limiting

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement per-connector rate limiting.
**Why:** Rate limiting prevents source blocking and respects fair use.

**Primary Owner:** `darshankamble0628-coder`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `riddhisawant305-jpg`

### Dependencies
T2-001

### Inputs
- Connector interface

### Outputs
- `services/connectors/src/framework/rate-limiter.ts`
- Unit tests

### Allowed Files
- `services/connectors/src/framework/`

### Do Not Modify
- Connector implementations

### Implementation Guidance
1. Implement token bucket or sliding window rate limiter
2. Configurable per connector
3. Queue requests when at limit
4. Log rate limit events

### AI Instructions
Ask AI to explain rate limiting algorithms.

### Tests
- Rate limits enforced
- Requests queued correctly
- Limits configurable

### Documentation
- Rate limiting documentation

### Acceptance Criteria
- [ ] Rate limits work
- [ ] Configurable per connector
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-012 — Timeout/Retry Handling

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement timeout and retry logic with exponential backoff.
**Why:** Network requests can be slow or fail. Retry logic improves reliability.

**Primary Owner:** `darshankamble0628-coder`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `riddhisawant305-jpg`

### Dependencies
T2-001

### Inputs
- Connector interface

### Outputs
- `services/connectors/src/framework/retry-handler.ts`
- `services/connectors/src/framework/timeout-handler.ts`
- Unit tests

### Allowed Files
- `services/connectors/src/framework/`

### Do Not Modify
- Connector implementations

### Implementation Guidance
1. Configurable timeout per request (default: 30s)
2. Retry with exponential backoff (1s, 2s, 4s)
3. Max 3 retries
4. Log retry events
5. Circuit breaker pattern (optional for MVP)

### AI Instructions
Ask AI to explain exponential backoff and circuit breaker patterns.

### Tests
- Timeouts trigger correctly
- Retries work with backoff
- Max retries enforced

### Documentation
- Timeout/retry documentation

### Acceptance Criteria
- [ ] Timeouts work
- [ ] Retries with backoff
- [ ] Max retries enforced

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-013 — Connector Health

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement connector health monitoring and reporting.
**Why:** The system needs to know which connectors are operational.

**Primary Owner:** `riddhisawant305-jpg`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** Team lead

### Dependencies
T2-003

### Inputs
- Connector registry

### Outputs
- `services/connectors/src/registry/health-checker.ts`
- Health check endpoints
- Unit tests

### Allowed Files
- `services/connectors/src/registry/`

### Do Not Modify
- Connector implementations

### Implementation Guidance
1. Periodic health checks (every 60 seconds)
2. Health status: healthy, degraded, unavailable
3. Last check timestamp
4. Error details when unhealthy

### AI Instructions
Ask AI to explain health check patterns.

### Tests
- Health checks run periodically
- Status reported correctly
- Errors captured

### Documentation
- Health monitoring documentation

### Acceptance Criteria
- [ ] Health checks work
- [ ] Status reported correctly
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-014 — Connector Logging

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement connector activity logging.
**Why:** Collection activity must be traceable for audit and debugging.

**Primary Owner:** `riddhisawant305-jpg`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** Team lead

### Dependencies
T2-001

### Inputs
- Connector interface

### Outputs
- `services/connectors/src/logging/connector-logger.ts`
- Structured logging

### Allowed Files
- `services/connectors/src/logging/`

### Do Not Modify
- Connector implementations

### Implementation Guidance
1. Log collection start/end
2. Log query parameters
3. Log result count
4. Log errors and warnings
5. Structured JSON logging

### AI Instructions
Ask AI to explain structured logging patterns.

### Tests
- Activity logged correctly
- Errors logged

### Documentation
- Logging documentation

### Acceptance Criteria
- [ ] Activity logged
- [ ] Errors logged
- [ ] Structured format

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-015 — Connector Security Validation

**Team:** Team 2 — Connectors + Collection
**Objective:** Implement security validation for all connector inputs and outputs.
**Why:** Connectors handle external data. Security validation prevents injection and abuse.

**Primary Owner:** `riddhisawant305-jpg`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `darshankamble0628-coder`

### Dependencies
T2-001

### Inputs
- Connector interface

### Outputs
- `services/connectors/src/security/input-validator.ts`
- `services/connectors/src/security/ssrf-protection.ts`
- Unit tests

### Allowed Files
- `services/connectors/src/security/`

### Do Not Modify
- Connector implementations

### Implementation Guidance
1. Validate all input parameters
2. Block private/internal IP ranges (SSRF protection)
3. Sanitize URLs
4. Limit response sizes
5. Validate output format

### AI Instructions
Ask AI to explain SSRF attack vectors and defenses.

### Tests
- Private IPs blocked
- Input validation works
- Output validation works

### Documentation
- Security validation documentation

### Acceptance Criteria
- [ ] SSRF protection works
- [ ] Input validation works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-016 — Unit Tests

**Team:** Team 2 — Connectors + Collection
**Objective:** Write comprehensive unit tests for all connectors and framework components.
**Why:** Tests ensure reliability and prevent regressions.

**Primary Owner:** `darshankamble0628-coder`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `riddhisawant305-jpg`

### Dependencies
T2-005 through T2-015

### Inputs
- All connector implementations

### Outputs
- Unit test files for each connector
- Mock HTTP responses
- Test utilities

### Allowed Files
- `connectors/*/src/__tests__/`
- `services/connectors/src/__tests__/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Mock HTTP responses for each connector
2. Test each connector in isolation
3. Test framework components
4. Configure coverage thresholds

### AI Instructions
Ask AI to explain HTTP mocking patterns.

### Tests
- All unit tests pass
- Coverage ≥ 80%

### Documentation
- Test setup documentation

### Acceptance Criteria
- [ ] All tests pass
- [ ] Coverage ≥ 80%

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-017 — Integration Tests

**Team:** Team 2 — Connectors + Collection
**Objective:** Write integration tests against live public sources.
**Why:** Integration tests verify real-world connector behavior.

**Primary Owner:** `yadavchinmay45-cloud`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** `AaryanDhotre2326`

### Dependencies
T2-016

### Inputs
- All connector implementations

### Outputs
- Integration test suite
- Test fixtures
- Rate-limited test execution

### Allowed Files
- `tests/integration/connectors/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Test each connector against real public source
2. Respect rate limits in tests
3. Tests must be idempotent
4. Handle network failures gracefully

### AI Instructions
Ask AI to explain integration testing with external services.

### Tests
- All integration tests pass
- Rate limits respected

### Documentation
- Integration test setup

### Acceptance Criteria
- [ ] All connectors produce valid Observations
- [ ] Error handling works
- [ ] Rate limiting enforced

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`

---

## T2-018 — Connector Documentation

**Team:** Team 2 — Connectors + Collection
**Objective:** Write documentation for all connectors and the connector framework.
**Why:** Clear documentation helps developers create new connectors and understand existing ones.

**Primary Owner:** `riddhisawant305-jpg`
**Reviewer:** Head Intern (`riddhisawant305-jpg`)
**Backup:** Team lead

### Dependencies
T2-017

### Inputs
- All connector implementations

### Outputs
- Connector framework documentation
- Per-connector README
- Configuration guide
- Rate limit documentation

### Allowed Files
- `docs/connectors/`
- `connectors/*/README.md`

### Do Not Modify
- Source files

### Implementation Guidance
1. Document connector interface and how to create new connectors
2. Document each connector's capabilities and limitations
3. Document configuration options
4. Document rate limits and error handling

### AI Instructions
Ask AI to explain technical documentation best practices.

### Tests
- Documentation is accurate
- Code examples work

### Documentation
- This IS the documentation task

### Acceptance Criteria
- [ ] Framework documented
- [ ] Each connector documented
- [ ] Configuration guide complete

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/2-connectors`
