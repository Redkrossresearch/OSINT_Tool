# Security Policy

## Authorized Use Only

The RedKross OSINT Investigation Platform is designed exclusively for **authorized investigation and research** using **publicly available information**.

## Prohibited Activities

The following are **strictly prohibited**:

- Unauthorized access to any system or account
- Credential theft or harvesting
- Exploitation of vulnerabilities
- Private account access without authorization
- Malicious payloads or malware creation
- Unauthorized scraping beyond public sources
- Illicit transaction activity
- Access-control bypass
- Evidence tampering or destruction
- Cross-case data leakage
- Any activity violating applicable laws

## Security Controls (MVP)

### Input Validation
- All user inputs are validated and sanitized
- SQL injection prevention via parameterized queries
- XSS prevention via output encoding
- SSRF prevention (no internal IP access)

### Authentication
- JWT-based authentication
- bcrypt password hashing
- Token expiration and refresh

### Authorization
- Role-based access control (admin, analyst, viewer)
- Case-level access isolation
- Investigation-level access isolation

### Data Protection
- Evidence is immutable after creation
- SHA-256 hashing for evidence integrity
- Provenance chain for audit trail
- No secrets in source code
- `.env` excluded from version control

### AI Security
- AI runs locally (Ollama) — no data leaves the machine
- AI cannot execute external actions
- AI cannot modify evidence
- AI cannot change investigation state
- Prompt injection protection on user inputs
- All AI actions are logged

### Network Security
- Connectors only access authorized public sources
- No internal network scanning
- Rate limiting on all external requests
- No credential transmission

### Repository Security
- Branch protection on `main`
- CODEOWNERS required reviews
- CI checks required before merge
- Secret scanning in CI
- No direct pushes to `main`

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Report privately to the technical architect
3. Include: description, steps to reproduce, impact
4. Allow time for remediation before disclosure

## Security Testing Checklist

| Test | Priority | Status |
|---|---|---|
| SSRF prevention | HIGH | Pending |
| SQL injection | HIGH | Pending |
| XSS prevention | HIGH | Pending |
| Prompt injection | HIGH | Pending |
| Credential leakage | HIGH | Pending |
| Data exfiltration | HIGH | Pending |
| Authorization bypass | HIGH | Pending |
| Evidence tampering | HIGH | Pending |
| Cross-case leakage | HIGH | Pending |
| Unsafe file handling | MEDIUM | Pending |
| Unsafe subprocess execution | MEDIUM | Pending |
| Rate limiting | MEDIUM | Pending |
| Input validation | HIGH | Pending |
| Secret scanning | HIGH | Pending |

## Compliance

- All OSINT activities use only publicly available data
- No unauthorized access to private systems
- Full audit trail for all investigation actions
- Evidence integrity verification
- Reproducible investigation workflow
