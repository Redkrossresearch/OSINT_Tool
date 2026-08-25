# CODEOWNERS Plan

**Status:** PENDING — awaiting GitHub organization team creation

---

## Intended CODEOWNERS Mapping

Once GitHub teams are created under the `Redkrossresearch` organization, the following CODEOWNERS file will be activated:

```
# Default — Technical Admins (Architecture & Integration)
*                                       @Redkrossresearch/technical-admins

# Team 1 — Core Platform + Evidence
/services/core/                         @Redkrossresearch/team-core
/services/evidence/                     @Redkrossresearch/team-core
/packages/schemas/                      @Redkrossresearch/team-core

# Team 2 — Connectors + Collection
/connectors/                            @Redkrossresearch/team-connectors
/services/connectors/                   @Redkrossresearch/team-connectors

# Team 3 — Intelligence + Entity + Graph
/services/intelligence/                 @Redkrossresearch/team-intelligence
/services/graph/                        @Redkrossresearch/team-intelligence
/packages/entities/                     @Redkrossresearch/team-intelligence

# Team 4 — AI + Verification
/services/ai/                           @Redkrossresearch/team-ai-verification
/services/verification/                 @Redkrossresearch/team-ai-verification

# Team 5 — Product + Frontend + Reporting
/apps/web/                              @Redkrossresearch/team-product
/services/reporting/                    @Redkrossresearch/team-product

# Documentation & Architecture (Technical Admins)
/docs/architecture/                     @Redkrossresearch/technical-admins
/.github/                               @Redkrossresearch/technical-admins
ARCHITECTURE.md                         @Redkrossresearch/technical-admins
MVP_SCOPE.md                            @Redkrossresearch/technical-admins
```

---

## Current Status

| Item | Status |
|---|---|
| GitHub organization confirmed | Yes — `Redkrossresearch` |
| Organization admin access verified | YES — confirmed by CEO |
| Teams created | NO — pending Excel roster for member assignment |
| CODEOWNERS file created | NO — pending team creation |

---

## Prerequisites Before Activation

1. Confirm admin access to `Redkrossresearch` organization
2. Create GitHub teams:
   - `technical-admins`
   - `team-core`
   - `team-connectors`
   - `team-intelligence`
   - `team-ai-verification`
   - `team-product`
3. Add team members (from Excel roster)
4. Create `.github/CODEOWNERS` file
5. Verify branch protection references CODEOWNERS

---

## Rules

- CODEOWNERS review is **required** for PRs touching owned directories
- Technical Admins have final say on architecture decisions
- Team leads review PRs within their domain
- No intern can merge their own PR
- CODEOWNERS file itself is owned by Technical Admins only
