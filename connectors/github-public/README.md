# github-public Connector

GitHub Public connector (`@osint-tool/github-public-connector`).

Queries the public GitHub REST API v3 (unauthenticated) to gather repository and
user intelligence, normalizing the results into `Observation` objects.

## Source

GitHub REST API v3 public endpoints (`https://api.github.com`). No API key
required.

## Supported objective types

PERSON, COMPANY, DOMAIN

## Query format

A GitHub username (login) or a repository in `owner/repo` form. For example:

```
octocat
octocat/Hello-World
```

## Capabilities

For a **repository** (`owner/repo`):

- Repository profile (metadata, stars, forks, etc.).
- Repository languages.
- Repository topics.

For a **username**:

- User profile.
- User's updated public repositories (up to 100, sorted by update time).

## Output

Emits one or more `Observation`s of type `GITHUB_DATA` with a `category` field
distinguishing the data:

| Category | Description |
|---|---|
| `github-repository` | Repository metadata. |
| `github-repository-languages` | Language usage. |
| `github-repository-topics` | Repository topics. |
| `github-profile` | User profile. |
| `github-user-repositories` | User's public repositories. |

## Limitations

- Unauthenticated GitHub API access is rate-limited at the source to 60 requests
  per hour. The connector relies on the shared rate limiter and does not
  hard-code this hourly bound.
- Only public data is queried; no authentication is used or supported.
- Repository queries require the exact `owner/repo` form.

## Configuration

Framework config applies (see the [Configuration guide](../../docs/connectors/configuration.md)).
The connector has no constructor options; it uses the fixed GitHub API base URL.

Rate limit: connector-specific override is not set, so it uses the framework
default. Timeout default: **30 seconds**.

## Error behavior

See the [Error handling guide](../../docs/connectors/error-handling.md). GitHub
404 responses are treated as "not found" (that resource is skipped); other
non-OK statuses raise an error including the HTTP status code.
