# Connector Rate Limiting, Timeout, and Retry

This guide documents the shared behavior that governs every external request a
connector makes: rate limiting, timeouts, and retries. These policies prevent
source blocking, respect fair use, and keep collection reliable.

## Rate limiting

Rate limiting uses a token-bucket limiter
(`services/connectors/src/framework/rate-limiter.ts`,
`TokenBucketRateLimiter`). When a rate limit is configured:

- Up to `requestsPerInterval` requests are granted immediately per refill
  interval (`intervalMs`).
- Further requests are enqueued **in FIFO order** and released as the bucket
  refills. Callers await their turn rather than being rejected.
- Rate-limit events (`granted` / `queued`) can be observed through an optional
  callback, including the wait time and queue depth.

### Defaults per connector

Each connector enforces its rate-limit default in its `configure()` override
(overridable by passing an explicit `rateLimit`):

| Connector | Default rate limit |
|---|---|
| web-fetch | 1 request / 2 seconds |
| web-search | 1 request / 1 second |
| dns-rdap | framework default (no connector-specific override) |
| cert-intel | framework default (no connector-specific override) |
| github-public | framework default (no connector-specific override) |

Connectors without an override inherit the framework configuration, including
`CONNECTOR_RATE_LIMIT_MS` from the environment. Note: the GitHub REST API
rate-limits unauthenticated requests to **60 requests per hour** at the source;
the connector relies on the shared rate limiter and does not hard-code this
hourly bound itself.

## Timeout

Every request is bounded by a timeout
(`services/connectors/src/framework/timeout-handler.ts`). The default is
`30000` ms (30 seconds), configurable via `timeoutMs`. When an operation does
not settle within the window, it rejects with a `ConnectorError` with code
`TIMEOUT`.

## Retry with exponential backoff

Retries (`services/connectors/src/framework/retry-handler.ts`) attempt an
operation up to `maxRetries + 1` times (default `maxRetries = 3`). Between
failed attempts the connector waits with exponential backoff:

- base delay 1000 ms, doubling per attempt (1s → 2s → 4s → ...),
- capped at a maximum backoff of 8000 ms.

While a retry is pending, connector health is marked `degraded`. If all retries
are exhausted, the request rejects with a `ConnectorError` with code
`RETRIES_EXHAUSTED`.

A `RATE_LIMITED` error is deliberately **not** retried by default, so callers do
not spin on a limit that is already queued by the rate limiter.

## Order of operations

The base class `request()` applies the policies in sequence:

1. Acquire a rate-limit token (if configured).
2. Apply the timeout.
3. On failure, retry with exponential backoff.

## Configuration summary

| Setting | Env variable | Default |
|---|---|---|
| Timeout | `CONNECTOR_TIMEOUT_MS` / `<NAME>` variant | `30000` ms |
| Retries | `CONNECTOR_MAX_RETRIES` / `<NAME>` variant | `3` |
| Rate-limit interval | `CONNECTOR_RATE_LIMIT_MS` / `<NAME>` variant | `1000` ms |

See the [Configuration guide](./configuration.md) for details.
