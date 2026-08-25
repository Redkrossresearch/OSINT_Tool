# Demo Scenario — September 19, 2026

## Overview

A safe, authorized, synthetic investigation scenario that demonstrates the complete MVP workflow. No real investigation data, no real entities, no real sensitive information.

---

## Scenario: Public Domain Investigation

### Objective
Investigate a fictional company's public web presence to demonstrate the platform's capabilities.

### Target
**Objective Type:** Domain
**Target:** `example-demo.com` (use a safe, public domain or fully synthetic)

**Note:** For the actual demo, use one of:
- `example.com` (IANA reserved)
- A domain owned by the organization
- A fully synthetic scenario with mock data

---

## Demo Flow

### Step 1: Create Case
1. Analyst logs in
2. Clicks "New Case"
3. Enters:
   - Title: "Demo Investigation — Public Domain Intelligence"
   - Description: "Demonstration of OSINT investigation capabilities using authorized public sources"
4. Case is created with status "OPEN"

### Step 2: Enter Objective
1. Analyst creates new investigation from case
2. Selects objective type: **Domain**
3. Enters target: `example-demo.com`
4. Investigation state: **DRAFT → PLANNING**

### Step 3: AI Planning
1. Supervisor agent initiates planner
2. Planner generates research tasks:
   - DNS resolution (A, AAAA, MX, NS records)
   - RDAP lookup (registrar, dates)
   - Certificate Transparency search
   - Public web search for domain mentions
   - GitHub search for related repositories
3. Investigation state: **PLANNING → COLLECTING**

### Step 4: Collection
1. Connectors execute research tasks:
   - DNS connector returns IP addresses, mail servers
   - RDAP connector returns registrar info
   - Cert connector returns TLS certificates
   - Web search connector returns public mentions
   - GitHub connector returns related repositories
2. Each result stored as evidence with SHA-256 hash
3. Full provenance chain recorded

### Step 5: Evidence Review
1. Analyst views evidence list in frontend
2. Each evidence item shows:
   - Source connector
   - Raw data
   - Metadata
   - SHA-256 hash
   - Provenance chain
   - Timestamp
3. Investigation state: **COLLECTING → ANALYZING**

### Step 6: Entity Extraction
1. AI extracts entities from evidence:
   - Domain: example-demo.com
   - IP: 93.184.216.34
   - Company: Example Corp
   - Email: admin@example-demo.com
   - Technology: nginx, React
2. Entities displayed in entity viewer

### Step 7: Relationship Graph
1. Relationships extracted:
   - example-demo.com → RESOLVES_TO → 93.184.216.34
   - example-demo.com → REGISTERED_TO → Example Corp
   - Example Corp → USES → nginx
   - Example Corp → USES → React
2. Graph visualization shows connections
3. Timeline shows temporal events

### Step 8: AI Correlation
1. Correlation agent analyzes all evidence
2. Finds patterns:
   - Domain registered 5 years ago
   - Multiple subdomains discovered
   - GitHub activity from 3 contributors
3. Investigation state: **ANALYZING → VERIFYING**

### Step 9: Verification
1. Contradiction detection runs
2. No contradictions found (synthetic data is consistent)
3. All findings verified
4. Investigation state: **VERIFYING → COMPLETE**

### Step 10: Findings
1. Findings displayed:
   - "Domain registered with public registrar"
   - "3 IP addresses associated"
   - "2 public GitHub repositories found"
   - "nginx web server detected"
2. Each finding has confidence score and evidence references

### Step 11: Timeline
1. Timeline shows all events chronologically:
   - Case created
   - Investigation started
   - Evidence collected (5 items)
   - Entities extracted (5 entities)
   - Graph built
   - Analysis completed
   - Findings generated

### Step 12: Report
1. Report generated with sections:
   - Executive Summary
   - Methodology
   - Evidence Catalog
   - Entity Profiles
   - Relationship Map
   - Timeline
   - Findings
   - Verification Status
   - Audit Trail
2. Exported as Markdown

### Step 13: Replay/Audit
1. Audit manifest shows:
   - Every action with timestamp
   - Every AI call with model and tokens
   - Every evidence item with hash
   - Every state transition
2. Full chain of custody demonstrated

---

## Demo Duration
~15 minutes live demonstration

## Demo Environment
- Local development machine
- Ollama running locally
- No internet required (if using mock data)
- No paid APIs used

## Success Criteria
- [ ] All 13 steps complete without errors
- [ ] No paid AI APIs called
- [ ] Evidence integrity verified
- [ ] Graph visualization renders
- [ ] Report generates successfully
- [ ] Audit trail is complete
