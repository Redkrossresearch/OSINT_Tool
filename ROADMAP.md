# Roadmap — RedKross OSINT Investigation Platform

---

## MVP (September 19, 2026)

**Narrow vertical slice demonstrating complete investigation workflow.**

### In Scope
- Case management
- Investigation lifecycle with state machine
- Objective intake (Person, Domain, Company, IP)
- 5 authorized public-source connectors
- Evidence storage with SHA-256 hashing
- Entity extraction and resolution
- Relationship graph (PostgreSQL)
- AI-assisted correlation (Ollama, local)
- Contradiction detection
- Verification workflow
- Report generation (Markdown)
- Audit trail / replay manifest
- Basic authentication and RBAC
- Automated testing

### Success Criteria
- Complete investigation workflow from objective to report
- No paid AI APIs used
- Full evidence integrity verification
- Customer demo on September 19

---

## Phase 2 — Enhanced Capabilities (Oct-Nov 2026)

- Additional connectors (social media public, WHOIS, Shodan public)
- PDF report export
- Advanced graph algorithms (centrality, clustering)
- Bulk evidence processing
- Investigation templates
- Multi-user collaboration
- Basic notification system

---

## Phase 3 — Intelligence Enhancement (Dec 2026 - Jan 2027)

- Enhanced entity resolution (ML-based)
- Temporal analysis improvements
- Pattern detection across investigations
- Investigation comparison
- Knowledge base accumulation
- Custom entity types
- Custom relationship types

---

## Phase 4 — Platform Maturation (Feb-Mar 2027)

- Advanced AI models (larger, more capable)
- Multi-investigation correlation
- Supply chain intelligence basics
- Threat intelligence integration
- Advanced reporting (executive summaries, visualizations)
- API for external integrations
- Webhook support

---

## Phase 5 — Enterprise Features (Apr-Jun 2027)

- Full multi-tenancy
- Advanced RBAC and audit
- SSO integration
- Compliance reporting
- Data retention policies
- Backup and disaster recovery
- Performance optimization at scale

---

## Future Vision (2027+)

- FININT capabilities
- DARKINT (with appropriate legal framework)
- Autonomous intelligence agents
- Full supply-chain digital twin
- Real-time monitoring and alerts
- Mobile application
- Public API marketplace
- Community-contributed connectors
- Advanced visualization (3D graph, AR)
- Country-specific compliance packs

---

## Principles

1. **Evidence first** — every claim must be backed by evidence
2. **Free/local AI** — no paid dependencies without explicit approval
3. **Authorized sources only** — no unauthorized access
4. **Human in the loop** — AI assists, humans decide
5. **Audit everything** — full traceability
6. **Incremental delivery** — working software over comprehensive documentation
7. **Security by design** — not an afterthought
