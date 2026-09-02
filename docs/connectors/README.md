# OSINT Tool — Connectors

This directory documents the OSINT Tool connector framework and every connector
implementation. Connectors are the public-source collection layer: they ingest
authorized, public data from a single source type and normalize it into the
common `Observation` model consumed by the rest of the system.

## Table of Contents

- [Framework guide](./framework.md) — how the connector framework works and how
  to create a new connector.
- [Configuration guide](./configuration.md) — configuration options, defaults,
  and environment variables.
- [Rate limiting guide](./rate-limiting.md) — rate limiting, timeout, and retry
  behavior.
- [Error handling guide](./error-handling.md) — error codes, result contracts,
  and health states.

## Connector framework

The framework lives in `services/connectors/src/framework/` and is published as
`@osint-tool/connectors-service`. It defines:

- the `Connector` interface (`configure`, `collect`, `health`),
- an abstract `BaseConnector` that implements the common lifecycle,
- configuration validation, rate limiting, timeout, and retry handling,
- a typed connector result contract.

See the [framework guide](./framework.md) for details.

## Connectors

| Connector | Package | Source | Supported objective types | Observation types |
|---|---|---|---|---|
| [web-fetch](./../../connectors/web-fetch/README.md) | `@osint-tool/web-fetch-connector` | Public web pages (HTTP/HTTPS) | DOMAIN, COMPANY, PERSON, IP | `WEB_PAGE` |
| [web-search](./../../connectors/web-search/README.md) | `@osint-tool/web-search-connector` | DuckDuckGo HTML | DOMAIN, COMPANY, PERSON, IP | `WEB_SEARCH` |
| [dns-rdap](./../../connectors/dns-rdap/README.md) | `@osint-tool/dns-rdap-connector` | Public DNS + RDAP | DOMAIN, IP | `DNS_RECORD`, `RDAP_DATA` |
| [cert-intel](./../../connectors/cert-intel/README.md) | `@osint-tool/cert-intel-connector` | crt.sh (Certificate Transparency) | DOMAIN, COMPANY | `CERTIFICATE` |
| [github-public](./../../connectors/github-public/README.md) | `@osint-tool/github-public-connector` | GitHub REST API v3 (public) | PERSON, COMPANY, DOMAIN | `GITHUB_DATA` |

All connectors use public, authorized sources only and require **no API key**.

## Principles

- Every connector follows the same contract.
- External requests are rate-limited, bounded by a timeout, and retried with
  exponential backoff.
- All URL handling is protected against SSRF.
- Every connector emits normalized `Observation`s with a source reference and a
  confidence score.
