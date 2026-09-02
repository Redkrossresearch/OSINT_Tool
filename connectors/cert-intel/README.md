# cert-intel Connector

Certificate Intelligence connector (`@osint-tool/cert-intel-connector`).

Queries Certificate Transparency (CT) logs through crt.sh and normalizes issued
certificates (subject, issuer, serial, fingerprint, validity, domains) into
`Observation` objects.

## Source

crt.sh CT-log search (`https://crt.sh`). No API key required.

## Supported objective types

DOMAIN, COMPANY

## Query format

A domain name (optionally with `%` wildcard for subdomain matching) or a company
name. A URL/protocol prefix and any trailing path or port are stripped before
lookup.

```
example.com
%.example.com
Acme Corp
```

## Capabilities

- Returns certificates matching the query from crt.sh.
- Extracts subject, issuer, serial number, SHA-256 fingerprint, SAN domains, and
  validity dates (`not_before`, `not_after`).
- Deduplicates certificates by SHA-256 fingerprint.

## Output

Emits one `Observation` of type `CERTIFICATE` per unique certificate with data
fields:

| Field | Description |
|---|---|
| `serial_number` | Certificate serial number (normalized). |
| `subject` | Certificate subject. |
| `issuer` | Certificate issuer. |
| `fingerprint_sha256` | 64-hex SHA-256 fingerprint. |
| `domains` | Domains/SANs covered by the certificate. |
| `crtsh_id` | crt.sh record id. |
| `not_before` | Validity start (if available). |
| `not_after` | Validity end (if available). |

## Limitations

- Depends on crt.sh availability and query support.
- Certificates missing enough data to derive a stable fingerprint may be
  synthesized deterministically from available fields.
- Wildcard/`%` queries depend on crt.sh's matching behavior.

## Configuration

Framework config applies (see the [Configuration guide](../../docs/connectors/configuration.md)).
Connector-specific constructor options: `crtShBaseUrl` and `fetchFn`.

Rate limit: connector-specific override is not set, so it uses the framework
default. Timeout default: **30 seconds**.

## Error behavior

See the [Error handling guide](../../docs/connectors/error-handling.md). crt.sh
404/400 responses, empty bodies, and non-JSON responses are treated as "no
certificates" rather than failures.
