# Team Members — PENDING

**Status:** Awaiting Excel roster from CEO
**Last Updated:** 25 August 2026

---

## Teams — CREATED (25 August 2026)

All 6 GitHub teams have been created under `Redkrossresearch`:

| Team | Slug | ID | Status |
|---|---|---|---|
| team-core | `team-core` | 19165667 | Created, empty |
| team-connectors | `team-connectors` | 19165668 | Created, empty |
| team-intelligence | `team-intelligence` | 19165669 | Created, empty |
| team-ai-verification | `team-ai-verification` | 19165670 | Created, empty |
| team-product | `team-product` | 19165671 | Created, empty |
| technical-admins | `technical-admins` | 19165676 | Created, empty |

---

## Current Known Contributors

| GitHub Username | Org Member | Repo Permission | Notes |
|---|---|---|---|
| ojas1216 | Yes | admin | Authenticated CLI user |
| shivammittal2403 | Yes | admin | Repository creator |
| harsh01harsh | Yes | admin | Organization member |
| Upasana1611 | Yes | read | Organization member |
| PiyushBabele1 | Yes | read | Organization member |
| Preetam-06 | No | write | External collaborator |
| riddhisawant305-jpg | No | write | External collaborator |
| ishauparkar13 | No | write | External collaborator |
| hirveabhishek2006-design | No | write | External collaborator |
| sumeetmore334-rgb | No | write | External collaborator |

---

## Pending Information

The final GitHub membership mapping is pending the CEO's Excel roster.

### Required Information Per Team Member

| Field | Description |
|---|---|
| GitHub Username | Their GitHub handle |
| Real Name | Full name |
| Team Assignment | Which team (1-5) |
| Role | Team Lead / Intern / Other |
| Start Date | When they begin contributing |

---

## What We Need From the CEO

1. **Excel roster** with GitHub usernames and team assignments
2. **Confirmation of team lead assignments** per team
3. **Confirmation of technical-admins membership**
4. **Decision on branch protection** (GitHub Pro required for private repo)

---

## What We Are NOT Doing

- NOT inventing GitHub usernames
- NOT creating fake team members
- NOT assuming anyone's team assignment
- NOT making irreversible permission changes without confirmation
- NOT removing any existing legitimate access

---

## Next Steps

1. Receive Excel roster
2. Map usernames to teams via `gh api` or web UI
3. Add members to teams
4. Configure team repository access (requires `admin:org` scope)
5. Confirm technical-admins membership
6. Activate CODEOWNERS
7. Configure branch protection
8. Distribute task assignments

---

## CLI Token Scopes Required

To complete team governance operations, the `gh` CLI token needs:

```
gh auth refresh -h github.com -s admin:org
```

Current scopes: `gist`, `read:org`, `repo`, `workflow`
Missing: `admin:org` (required for team-repo access, team membership management)
