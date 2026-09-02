# web-fetch Connector

Public Web Fetch connector (`@osint-tool/web-fetch-connector`).

Fetches an authorized public HTTP(S) page and normalizes its title, metadata,
text, and links into an `Observation`.

## Source

Public web pages over HTTP/HTTPS. No API key required.

## Supported objective types

DOMAIN, COMPANY, PERSON, IP

## Query format

A valid absolute `http://` or `https://` URL. For example:

```
https://example.com/about
```

## Capabilities

- Fetches a page and normalizes `title`, `meta`, `text`, and `links`.
- Follows redirects (bounded by `maxRedirects`, default 5), re-validating every
  hop as public.
- Respects `robots.txt` for the target origin and caches rules per origin.

## Output

Emits a single `Observation` of type `WEB_PAGE` with data fields:

| Field | Description |
|---|---|
| `url` | The requested URL. |
| `final_url` | The URL after following redirects. |
| `status` | HTTP status code. |
| `title` | Page `<title>` (empty if absent). |
| `meta` | Name/property → content map of `<meta>` tags. |
| `text` | Markup-free, whitespace-collapsed page text. |
| `links` | Absolute URLs from `<a href>` attributes. |
| `fetched_at` | ISO timestamp of the fetch. |

## Limitations

- Only `http`/`https` schemes are accepted.
- Private/internal/reserved addresses are blocked (SSRF protection).
- Response bodies are capped (default 5 MiB); larger bodies abort with an error.
- URLs carrying credentials are rejected.

## Security

SSRF protection is applied to the initial URL and again on every redirect hop.
Hostnames are resolved and every address is validated as public before a socket
is opened; the connection is pinned to the validated address (defense against
DNS rebinding). `robots.txt` is consulted before fetching. If `robots.txt`
cannot be retrieved, the connector fails open (no restrictions).

## Configuration

Framework config applies (see the [Configuration guide](../../docs/connectors/configuration.md)).
Connector-specific constructor options: `httpFetch`, `maxBodyBytes` (default 5
MiB), `maxRedirects` (default 5).

Rate limit default: **1 request / 2 seconds**. Timeout default: **30 seconds**.

## Error behavior

See the [Error handling guide](../../docs/connectors/error-handling.md). SSRF
violations are reported as `COLLECTION_FAILED`. A path disallowed by
`robots.txt` returns no observations (health stays `healthy`); inability to load
`robots.txt` fails open.
