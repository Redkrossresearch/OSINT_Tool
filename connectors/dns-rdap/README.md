# dns-rdap Connector

DNS/RDAP connector (`@osint-tool/dns-rdap-connector`).

Performs DNS record lookups and RDAP registration queries for domains and IP
addresses, emitting normalized `Observation` objects.

## Source

Public DNS servers (default `1.1.1.1`, `8.8.8.8`) and the public RDAP network
(default `https://rdap.org`). No API key required.

## Supported objective types

DOMAIN, IP

## Query format

A domain name or an IP address (IPv4 or IPv6). A URL/protocol prefix and any
trailing path or port are stripped before lookup.

```
example.com
93.184.216.34
```

## Capabilities

For a **domain**:

- Forward DNS lookups: A, AAAA, CNAME, MX, NS, TXT, SOA.
- RDAP domain registration data: registrar, creation/expiration/update dates,
  nameservers, status.

For an **IP**:

- Reverse DNS (PTR) records.
- RDAP IP allocation data: handles, status, country, address range.

## Output

Emits one `Observation` per DNS record of type `DNS_RECORD`, plus an
`RDAP_DATA` observation when RDAP data is available.

`DNS_RECORD` data fields include `record_type`, `record_name`, `value`, and the
resolver used. `RDAP_DATA` includes registrar, relationship dates, nameservers,
and the raw RDAP document.

## Limitations

- DNS servers and the RDAP base URL are configurable but must be public and
  reachable.
- RDAP availability may vary by registry; when RDAP returns no/useful data the
  connector emits only the DNS observations.
- Record types not configured on the target (e.g., no MX) are skipped rather
  than failing the collection.

## Configuration

Framework config applies (see the [Configuration guide](../../docs/connectors/configuration.md)).
Connector-specific constructor options: `dnsServers`, `rdapBaseUrl`, `resolver`,
and `fetchFn`.

Rate limit: connector-specific override is not set, so it uses the framework
default. Timeout default: **30 seconds**.

## Error behavior

See the [Error handling guide](../../docs/connectors/error-handling.md). DNS
"record not configured" codes are ignored per record type; RDAP 404/400 and
other failures return "no data" rather than failing collection.
