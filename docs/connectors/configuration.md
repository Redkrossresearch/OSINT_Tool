# Connector Configuration

This guide documents how connectors are configured: the shared framework-level
configuration, per-connector options, and environment variable support.

## Framework configuration

Every connector accepts a `ConnectorConfigInput`
(`services/connectors/src/framework/connector-config.ts`), validated with Zod:

| Option | Type | Default | Description |
|---|---|---|---|
| `timeoutMs` | number | `30000` | Per-request timeout in milliseconds (must be a positive integer). |
| `maxRetries` | number | `3` | Maximum retries before a request fails (0–5). |
| `rateLimit` | `{ requestsPerInterval, intervalMs }` | optional | When present, enables token-bucket rate limiting for the connector. |
| `options` | `Record<string, unknown>` | `{}` | Free-form connector-specific options. |

`validateConnectorConfig(input)` validates the config and returns an inferred
`ConnectorConfig`. Values outside the allowed ranges reject with a
`ConnectorError` (`CONFIG_INVALID`).

## Per-connector options

Each connector accepts its own options in its constructor.

### web-fetch

Constructor options (`WebFetchOptions`):

| Option | Type | Default | Description |
|---|---|---|---|
| `httpFetch` | `HttpFetch` | `NodeHttpFetch` | Injectable HTTP transport (used by tests). |
| `maxBodyBytes` | number | `5 * 1024 * 1024` (5 MiB) | Maximum response body size in bytes. |
| `maxRedirects` | number | `5` | Maximum number of redirects to follow. |

The `configure()` override enforces security defaults: a 30-second timeout and a
rate limit of 1 request every 2 seconds, unless explicitly overridden.

### web-search

Constructor options (`WebSearchConnectorOptions`):

| Option | Type | Default | Description |
|---|---|---|---|
| `http` | `SearchHttp` | `NodeSearchHttp` | Injectable HTTP transport (used by tests). |
| `maxResults` | number | `20` | Maximum number of search results to return. |

The `configure()` override enforces a 30-second timeout and a rate limit of 1
request every 1 second, unless explicitly overridden.

### dns-rdap

Constructor options (`DnsRdapConnectorOptions`):

| Option | Type | Default | Description |
|---|---|---|---|
| `dnsServers` | `string[]` | `['1.1.1.1', '8.8.8.8']` | Public DNS servers to use. |
| `rdapBaseUrl` | string | `https://rdap.org` | RDAP base URL (trailing slashes stripped). |
| `resolver` | `DnsResolver` | Node resolver | Injectable DNS resolver (used by tests). |
| `fetchFn` | `typeof fetch` | global `fetch` | Injectable fetch (used by tests). |

### cert-intel

Constructor options (`CertIntelConnectorOptions`):

| Option | Type | Default | Description |
|---|---|---|---|
| `crtShBaseUrl` | string | `https://crt.sh` | crt.sh base URL (trailing slashes stripped). |
| `fetchFn` | `typeof fetch` | global `fetch` | Injectable fetch (used by tests). |

### github-public

Constructor options: none. The connector uses the fixed public GitHub REST API
base URL (`https://api.github.com`).

## Environment variables

Configuration can be loaded from environment variables via
`loadConnectorConfig(name, env)` in
`services/connectors/src/config/connector-config.ts`.

### Global variables (apply to every connector)

Defined in `.env.example`:

| Variable | Default | Description |
|---|---|---|
| `CONNECTOR_TIMEOUT_MS` | `30000` | Default per-request timeout. |
| `CONNECTOR_MAX_RETRIES` | `3` | Default retry count. |
| `CONNECTOR_RATE_LIMIT_MS` | `1000` | Default rate-limit interval. |

### Per-connector variables

Per-connector variables take precedence over the globals. Use the suffix form,
concatenating the connector name:

- `CONNECTOR_<NAME>_TIMEOUT_MS`
- `CONNECTOR_<NAME>_MAX_RETRIES`
- `CONNECTOR_<NAME>_RATE_LIMIT_MS`
- `CONNECTOR_<NAME>_API_ENDPOINT`
- `CONNECTOR_<NAME>_OPTION_<KEY>` (each becomes an entry in `options`)

Connector names are normalized for the key (lowercased, non-alphanumeric
characters replaced with `_`), so `web-search` maps to `CONNECTOR_WEB_SEARCH_*`.

When `RATE_LIMIT_MS` is set, the rate limit is created with 1 request per
interval. Any invalid value throws a `ConnectorConfigError` naming the offending
variable.
