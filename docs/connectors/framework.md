# Connector Framework

This guide explains the connector framework used by every connector in the
OSINT Tool. It is intended for developers who want to understand how connectors
work or create a new one.

## Overview

A connector is a bounded, testable module that gathers authorized public data
from one source type and emits a stream of `Observation` objects. All connectors
share a common contract and a common lifecycle implemented by the framework in
`services/connectors/src/framework/`.

The framework is exported from the package root
(`services/connectors/src/index.ts`) as `@osint-tool/connectors-service`.

## The Connector interface

Everything is built around the `Connector` interface
(`services/connectors/src/framework/connector-interface.ts`):

```ts
interface Connector {
  name: string;
  version: string;
  supportedObjectiveTypes: ObjectiveType[];
  configure(config: ConnectorConfigInput): Promise<void>;
  collect(input: CollectorInput): AsyncGenerator<Observation>;
  health(): Promise<ConnectorHealth>;
}
```

- `name` and `version` identify the connector.
- `supportedObjectiveTypes` declares which objective types the connector can
  serve (PERSON, DOMAIN, COMPANY, IP).
- `configure` applies configuration before collection.
- `collect` runs a collection for a `CollectorInput` (`{ objective, query }`)
  and yields observations.
- `health` reports the current connector health.

## BaseConnector

The abstract `BaseConnector`
(`services/connectors/src/framework/connector-base.ts`) implements the common
lifecycle so subclasses only provide the source-specific logic. It uses the
Template Method pattern: subclasses implement the protected
`fetchObservations(input)` generator, and the base class wires up
configuration, rate limiting, timeout, retry, and health tracking.

### Lifecycle

1. **Construct** — the subclass calls `super({ name, version,
   supportedObjectiveTypes })` and stores its own options.
2. **Configure** — `configure()` validates the config, builds a token-bucket
   rate limiter from `rateLimit` (when present), and marks health `healthy`.
   Subclasses typically override this to enforce connector-specific defaults
   (see [Configuration](./configuration.md)).
3. **Collect** — `collect()` checks that the connector was configured, then
   iterates the `fetchObservations` generator, marking health `healthy` after
   each observation.
4. **Request** — subclasses wrap each network operation with the protected
   `request(operation)` helper, which applies the shared rate limit, timeout,
   and retry policy.

### Making a network request

Inside `fetchObservations`, wrap a network call with `this.request(...)` so the
shared policies apply:

```ts
const response = await this.request(async () =>
  this.http.get(url, { timeoutMs, maxBodyBytes }),
);
```

`request` does, in order:

- acquires a rate-limit token (if a rate limit is configured),
- applies the timeout,
- retries with exponential backoff for retryable failures.

## Configuration

Configuration is defined by `ConnectorConfig`
(`services/connectors/src/framework/connector-config.ts`) and validated with
Zod:

```ts
interface ConnectorConfig {
  timeoutMs: number;   // default 30_000
  maxRetries: number;  // default 3, max 5
  rateLimit?: { requestsPerInterval: number; intervalMs: number };
  options: Record<string, unknown>;
}
```

See the [Configuration guide](./configuration.md) for the full reference.

## Result contract

`ConnectorResult` (`services/connectors/src/framework/connector-result.ts`) is a
discriminated union describing either a successful collection or an error:

```ts
type ConnectorResult =
  | { ok: true;  metadata: ConnectorResultMetadata; observations: Observation[] }
  | { ok: false; metadata: ConnectorResultMetadata; error: ConnectorErrorDetail };
```

Both variants carry metadata (`connector_name`, `query`, `timestamp`,
`duration_ms`) and both success/error shapes are validated with Zod schemas
(`ConnectorResultSchema`).

## Health

Health tracking is part of the base class. `ConnectorHealth` reports a status of
`healthy`, `degraded`, or `unavailable`, plus a `lastCheck` timestamp and an
optional `error` string. The `ConnectorHealthChecker` in
`services/connectors/src/registry/health-checker.ts` periodically polls every
registered connector's `health()` (default interval 60 seconds).

## Registry

The `ConnectorRegistry`
(`services/connectors/src/registry/connector-registry.ts`) stores connector
instances and supports `register`, `get`, `all`, and `list`. Registration is
keyed by connector `name`; registering a duplicate name throws a
`ConnectorRegistryError` with code `DUPLICATE_CONNECTOR`.

## Creating a new connector

1. Create a new package under `connectors/<name>/` (mirror the structure of an
   existing connector: `src/index.ts`, `tsconfig.json`, `package.json`, and a
   `src/__tests__/` folder).
2. Extend `BaseConnector` and set `name`, `version`, and
   `supportedObjectiveTypes`.
3. Implement `fetchObservations(input)` as an async generator that yields
   `Observation` objects.
4. Wrap every network operation with `this.request(...)`.
5. Override `configure()` to apply connector-specific security/rate-limit
   defaults.
6. Export the connector class and its public option types.
7. Write unit tests in `src/__tests__/` and a README at `connectors/<name>/README.md`.

## Related files

| Purpose | File |
|---|---|
| Interface + health types | `services/connectors/src/framework/connector-interface.ts` |
| Base class + `ConnectorError` | `services/connectors/src/framework/connector-base.ts` |
| Config schema + validation | `services/connectors/src/framework/connector-config.ts` |
| Result contract | `services/connectors/src/framework/connector-result.ts` |
| Rate limiter | `services/connectors/src/framework/rate-limiter.ts` |
| Retry with backoff | `services/connectors/src/framework/retry-handler.ts` |
| Timeout | `services/connectors/src/framework/timeout-handler.ts` |
| Registry | `services/connectors/src/registry/connector-registry.ts` |
| Health checker | `services/connectors/src/registry/health-checker.ts` |
| Package exports | `services/connectors/src/index.ts` |
