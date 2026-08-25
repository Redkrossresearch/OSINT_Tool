# ADR-008: Authentication

**Status:** Accepted
**Date:** 25 August 2026
**Deciders:** Technical Architect

## Context

The platform needs to authenticate users and control access to investigations.

## Decision

Use JWT-based authentication with bcrypt password hashing.

### Tokens
- Access token: 1-hour expiry
- Refresh token: 7-day expiry
- Stored in HTTP-only cookies (frontend)

### Passwords
- bcrypt with cost factor 12
- Minimum 8 characters
- No password reuse (last 5)

### Roles
- `admin`: Full access, user management
- `analyst`: Create/manage investigations, view evidence
- `viewer`: Read-only access

## Consequences

### Positive
- Stateless authentication (JWT)
- Standard, well-understood approach
- No session storage needed

### Negative
- Token revocation requires blacklisting
- JWT payload is visible (no secrets in payload)

## Alternatives Considered

1. **Session-based auth**: Rejected — requires session store
2. **OAuth/SSO**: Future consideration for enterprise
3. **API keys only**: Rejected — no user context
