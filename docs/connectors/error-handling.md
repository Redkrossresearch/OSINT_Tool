# Connector Error Handling

This guide documents how connectors report errors, how failures are surfaced,
and how connector health is tracked.

## ConnectorError

The framework raises `ConnectorError`
(`services/connectors/src/framework/connector-base.ts`) with a typed code:

| Code | Meaning |
|---|---|
| `CONFIG_INVALID` | The provided configuration failed validation. |
| `NOT_CONFIGURED` | `collect()`/`request()` was called before `configure()`. |
| `TIMEOUT` | An external request exceeded `timeoutMs`. |
| `RATE_LIMITED` | A request was rejected because of rate limiting. |
| `RETRIES_EXHAUSTED` | The operation failed after all retries. |
| `COLLECTION_FAILED` | A connector-specific collection failure (e.g., invalid input, blocked source). |

A `ConnectorError` carries `code`, a message, and an optional `cause`.

## Result contract

`ConnectorResult` (`services/connectors/src/framework/connector-result.ts`)
models a collection outcome as a discriminated union:

```ts
type ConnectorResult =
  | { ok: true;  metadata; observations }
  | { ok: false; metadata; error: { code, message, cause? } };
```

The error detail (`ConnectorErrorDetail`) carries a `code`, `message`, and an
optional `cause` string. Both the success and error shapes are schema-validated
(`ConnectorResultSchema`).

## Health states

Connectors expose health through `health()` operating on the base class:

| Status | Meaning |
|---|---|
| `healthy` | Last collection/request succeeded. |
| `degraded` | A request failed and is being retried, retries were exhausted, or a connector marked itself degraded. |
| `unavailable` | The connector has not been configured yet. |

The `ConnectorHealthChecker` (`services/connectors/src/registry/health-checker.ts`)
polls every registered connector's health periodically (default 60 seconds) and
records the last check timestamp and any error.

## Per-connector error behavior

### web-fetch

- Maps an `SsrfError` (blocked scheme, credentials in URL, non-public address,
  DNS failure, too many redirects, body too large) to `ConnectorError` with code
  `COLLECTION_FAILED`.
- If `robots.txt` cannot be retrieved, the connector **fails open** (treats the
  page as unrestricted).
- If the target path is disallowed by `robots.txt`, collection returns no
  observations and health stays `healthy`.

### web-search

- Missing/empty query raises `COLLECTION_FAILED`.
- Not configured raises `NOT_CONFIGURED`.
- When DuckDuckGo returns a CAPTCHA / challenge page (detected via status code
  or visible markers), the connector marks health `degraded` with a descriptive
  error and returns no observations.

### dns-rdap

- DNS record types that are not configured on the domain (e.g., `ENODATA`,
  `ENOTFOUND`, `NXDOMAIN`) are ignored per-record type rather than failing the
  whole collection.
- RDAP 404/400 responses are treated as "no data" (returns `null`), and other
  RDAP failures are swallowed, returning `null`.

### cert-intel

- crt.sh 404/400 responses, empty bodies, and non-JSON responses are treated as
  "no certificates" (returns an empty list).
- Parse errors are handled gracefully without failing the collection.

### github-public

- GitHub 404 responses are treated as "not found", returning `null` for that
  resource.
- Other non-OK statuses raise an error with the HTTP status code for the path.

## Security errors

SSRF and input-validation failures are defined in
`services/connectors/src/security/` (input validator, output validator, SSRF
protection) and are surfaced as typed errors. See the [framework guide](./framework.md)
for the security scope.
