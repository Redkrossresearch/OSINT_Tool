# GitHub Organization Governance

**Organization:** Redkrossresearch
**Repository:** Redkrossresearch/OSINT_Tool
**Last Updated:** 25 August 2026
**Status:** Teams created, repository access pending manual configuration

---

## Organization

| Property | Value |
|---|---|
| Name | Redkross Research Foundation |
| Login | Redkrossresearch |
| Location | India |
| Website | redkross.org.in |
| Email | redkrossresearch@gmail.com |
| Plan | Free |
| Public Repos | 9 |
| Created | June 10, 2026 |

---

## Repository

| Property | Value |
|---|---|
| Name | OSINT_Tool |
| Visibility | Private |
| Default Branch | main |
| Created | August 2026 |

---

## Organization Members (5)

| GitHub Username | Notes |
|---|---|
| harsh01harsh | Organization member |
| ojas1216 | Organization member, authenticated CLI user |
| PiyushBabele1 | Organization member |
| shivammittal2403 | Organization member, repository creator |
| Upasana1611 | Organization member |

**Note:** Organization owner/role could not be determined via API (requires `user` scope). Owner status must be verified via GitHub web UI.

---

## Repository Collaborators (9)

| GitHub Username | Org Member | Repo Permission | Role Name | Notes |
|---|---|---|---|---|
| harsh01harsh | Yes | admin | admin | Full access |
| ojas1216 | Yes | admin | admin | Full access (current CLI user) |
| shivammittal2403 | Yes | admin | admin | Full access, repo creator |
| Upasana1611 | Yes | read | read | Read-only |
| PiyushBabele1 | Yes | read | read | Read-only |
| Preetam-06 | No | write | write | Write access (external) |
| riddhisawant305-jpg | No | write | write | Write access (external) |
| ishauparkar13 | No | write | write | Write access (external) |
| hirveabhishek2006-design | No | write | write | Write access (external) |
| sumeetmore334-rgb | No | write | write | Write access (external) |

---

## GitHub Teams (6) — Created 25 August 2026

| Team | Slug | ID | Privacy | Permission | Purpose |
|---|---|---|---|---|---|
| team-core | `team-core` | 19165667 | closed | push | Core Platform + Evidence |
| team-connectors | `team-connectors` | 19165668 | closed | push | Connectors + Public Collection |
| team-intelligence | `team-intelligence` | 19165669 | closed | push | Intelligence + Entity + Graph |
| team-ai-verification | `team-ai-verification` | 19165670 | closed | push | AI + Verification |
| team-product | `team-product` | 19165671 | closed | push | Frontend + Reporting + QA |
| technical-admins | `technical-admins` | 19165676 | closed | push | Technical Architecture & Governance |

### Team Status

- All 6 teams created successfully
- All teams have `closed` privacy (visible to org members only)
- All teams have `push` permission on the repository
- **No members assigned yet** — awaiting Excel roster
- **Repository team access needs manual configuration** — `gh` CLI token lacks `admin:org` scope

---

## technical-admins Status

**Membership requires human confirmation.**

The technical-admins team is created but empty. It should contain only explicitly authorized technical administrators. Candidates for consideration:

| Username | Basis |
|---|---|
| ojas1216 | Authenticated CLI user, admin collaborator |
| shivammittal2403 | Repository creator, admin collaborator |

**Do NOT auto-add anyone.** The CEO/technical architect must confirm who belongs in this team.

---

## Repository Access Model

```
technical-admins
  → maintain permission on OSINT_Tool
  → CODEOWNERS: /.github/, /docs/architecture/, ARCHITECTURE.md, MVP_SCOPE.md

team-core
  → push permission on OSINT_Tool
  → CODEOWNERS: /services/core/, /services/evidence/, /packages/schemas/

team-connectors
  → push permission on OSINT_Tool
  → CODEOWNERS: /connectors/, /services/connectors/

team-intelligence
  → push permission on OSINT_Tool
  → CODEOWNERS: /services/intelligence/, /services/graph/, /packages/entities/

team-ai-verification
  → push permission on OSINT_Tool
  → CODEOWNERS: /services/ai/, /services/verification/

team-product
  → push permission on OSINT_Tool
  → CODEOWNERS: /apps/web/, /services/reporting/
```

---

## Branch Strategy

| Branch | Purpose | Protection |
|---|---|---|
| `main` | Production/integration | Pending (requires GitHub Pro or manual setup) |
| `team/1-core` | Team 1 integration | Not yet created |
| `team/2-connectors` | Team 2 integration | Not yet created |
| `team/3-intelligence` | Team 3 integration | Not yet created |
| `team/4-ai-verification` | Team 4 integration | Not yet created |
| `team/5-product` | Team 5 integration | Not yet created |
| `feature/t1-*` | Team 1 features | Standard |
| `feature/t2-*` | Team 2 features | Standard |
| `feature/t3-*` | Team 3 features | Standard |
| `feature/t4-*` | Team 4 features | Standard |
| `feature/t5-*` | Team 5 features | Standard |

---

## Main Branch Protection

**Status: NOT CONFIGURED**

Branch protection is **not available via API** on the GitHub Free plan for private repositories. The API returns:

```
"Upgrade to GitHub Pro or make this repository public to enable this feature."
```

### Options

1. **Upgrade to GitHub Pro** — enables branch protection rules via API/web
2. **Make repository public** — enables branch protection (but exposes code)
3. **Manual enforcement via convention** — rely on CODEOWNERS, PR review, and team discipline

### Recommended Approach

Until GitHub Pro is obtained:
- Enforce PR-only workflow via team discipline
- CODEOWNERS review requirement (when teams have members)
- No direct pushes to `main` (enforced by convention)
- Technical admins monitor and enforce

---

## CODEOWNERS Status

**Status: NOT ACTIVE**

`docs/CODEOWNERS_PLAN.md` exists with the intended mapping.

**Do NOT create `.github/CODEOWNERS` until:**
1. GitHub teams have members assigned
2. Repository team access is configured
3. Team leads are confirmed

---

## Pending Items

### Waiting for Excel Roster

| Item | Status |
|---|---|
| Team member assignments | Pending |
| Intern → team mapping | Pending |
| Intern → task assignment | Pending |
| CODEOWNERS activation | Pending |

### Waiting for GitHub Pro (or decision)

| Item | Status |
|---|---|
| Branch protection rules | Blocked by free plan |
| Required status checks | Blocked by free plan |
| Code owner reviews | Blocked by free plan |

### Waiting for Manual Configuration

| Item | Status |
|---|---|
| Team repository access | Token lacks admin:org scope — configure via web UI |
| technical-admins membership | Requires human confirmation |

---

## CLI Authentication Note

The `gh` CLI is authenticated as `ojas1216` with token scopes:
- `gist`
- `read:org`
- `repo`
- `workflow`

**Missing scope: `admin:org`** — required for:
- Managing team repository access
- Managing team memberships
- Organization-level settings

To enable full governance operations, the user should run:
```
gh auth refresh -h github.com -s admin:org
```

---

## Existing Collaborators — Do NOT Remove

The following users have repository access and must NOT be removed without explicit authorization:

| Username | Current Permission |
|---|---|
| harsh01harsh | admin |
| ojas1216 | admin |
| shivammittal2403 | admin |
| Upasana1611 | read |
| PiyushBabele1 | read |
| Preetam-06 | write |
| riddhisawant305-jpg | write |
| ishauparkar13 | write |
| hirveabhishek2006-design | write |
| sumeetmore334-rgb | write |
