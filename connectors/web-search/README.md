# web-search Connector

Public Web Search connector (`@osint-tool/web-search-connector`).

Performs a public web search using the DuckDuckGo HTML endpoint and normalizes
the results (title, URL, snippet, position) into `Observation` objects.

## Source

DuckDuckGo HTML endpoint (`https://html.duckduckgo.com/html/`). No API key
required.

## Supported objective types

DOMAIN, COMPANY, PERSON, IP

## Query format

A plain-text search query string. For example:

```
"OpenAI" site:github.com
```

## Capabilities

- Returns search results with decoded target URLs, titles, and snippets.
- Recognizes DuckDuckGo redirect wrappers and decodes the real destination URL.
- Handles CAPTCHA / challenge pages gracefully by marking health `degraded`
  instead of returning them as results.
- Caps the number of results (default 20, configurable via `maxResults`).

## Output

Emits one `Observation` of type `WEB_SEARCH` per result with data fields:

| Field | Description |
|---|---|
| `query` | The search query. |
| `position` | 1-based result position. |
| `url` | The decoded destination URL. |
| `title` | Result title. |
| `snippet` | Result snippet (may be empty). |

## Limitations

- Search behavior depends on the DuckDuckGo HTML endpoint, which is a
  third-party public source and may change or block repeated requests.
- Does not require an API key, but is subject to the source's anti-bot
  protections.

## Security

The HTTP transport only requests HTTPS endpoints. Browsing to result URLs is a
separate step (see the [web-fetch](./../web-fetch/README.md) connector).

## Configuration

Framework config applies (see the [Configuration guide](../../docs/connectors/configuration.md)).
Connector-specific constructor option: `maxResults` (default 20), and an
injectable `http` transport for tests.

Rate limit default: **1 request / 1 second**. Timeout default: **30 seconds**.

## Error behavior

See the [Error handling guide](../../docs/connectors/error-handling.md). An
empty query raises `COLLECTION_FAILED`; a missing configuration raises
`NOT_CONFIGURED`; a detected CAPTCHA/challenge page marks health `degraded` and
returns no results.
