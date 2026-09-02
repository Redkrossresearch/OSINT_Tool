import dns from 'node:dns/promises';
import net from 'node:net';

import {
  SecurityValidationError,
  type SecurityErrorCode,
} from './security-validation-error.js';

/**
 * Shared SSRF protection utilities for all connectors.
 *
 * Defense in depth:
 *  - only `http:` / `https:` schemes are accepted,
 *  - URLs carrying credentials are rejected,
 *  - hostnames are resolved and **every** resolved address is validated,
 *  - private / internal / reserved / multicast / link-local / loopback and
 *    other non-public address ranges are blocked,
 *  - hostname resolution and validation happen again for every redirect hop,
 *    so a DNS-rebinding or redirect attempt to an internal host cannot slip
 *    through.
 *
 * **Caller responsibilities:**
 *  - After calling {@link validatePublicUrl} or {@link resolvePublicTarget},
 *    the caller MUST use the returned `ip` (pinned address) for the actual
 *    TCP connection rather than performing its own DNS lookup.
 *  - On every redirect hop the caller MUST re-validate the redirect target
 *    by calling {@link validatePublicUrl} again.
 */

function ssrfError(
  code: SecurityErrorCode,
  message: string,
): SecurityValidationError {
  return new SecurityValidationError(code, message);
}

const BLOCKED_SCHEMES = new Set([
  'file',
  'ftp',
  'gopher',
  'dict',
  'ldap',
  'smb',
  'data',
  'javascript',
]);

export interface ResolvedTarget {
  /** The validated, normalized URL. */
  url: URL;
  /** Hostname used for the request. */
  hostname: string;
  /** The first public address the hostname resolved to (pin this for the connection). */
  ip: string;
  /** The network port. */
  port: number;
}

export type HostResolver = (host: string) => Promise<string[]>;

export const defaultResolver: HostResolver = async (host: string) => {
  const records = await dns.lookup(host, { all: true, family: 0 });
  return records.map((record) => record.address);
};

export interface ResolveOptions {
  /** Force a specific IP family (4 or 6). By default both are accepted. */
  family?: 4 | 6;
  /** Override the DNS resolver (useful for testing). */
  resolver?: HostResolver;
}

// ---------------------------------------------------------------------------
// URL parsing & structural validation
// ---------------------------------------------------------------------------

/**
 * Parse and structurally validate a URL without performing any DNS or network
 * activity. Throws {@link SecurityValidationError} for schemes that are not
 * http(s), for URLs that embed credentials, or for malformed URLs.
 */
export function parseTargetUrl(input: string): URL {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw ssrfError('INVALID_URL', `'${input}' is not a valid URL`);
  }

  const protocol = url.protocol.toLowerCase().replace(/:$/, '');
  if (protocol !== 'http' && protocol !== 'https') {
    throw ssrfError(
      'BLOCKED_SCHEME',
      `only http/https are allowed, got '${url.protocol}'`,
    );
  }
  if (BLOCKED_SCHEMES.has(protocol)) {
    throw ssrfError('BLOCKED_SCHEME', `scheme '${protocol}' is not allowed`);
  }

  if (url.username !== '' || url.password !== '') {
    throw ssrfError(
      'CREDENTIALS_IN_URL',
      'URLs containing credentials are not allowed',
    );
  }

  if (url.hostname === '') {
    throw ssrfError('INVALID_URL', `'${input}' has no hostname`);
  }

  return url;
}

// ---------------------------------------------------------------------------
// IPv4 private / reserved range checks
// ---------------------------------------------------------------------------

function ipv4Octets(ip: string): number[] | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  const octets: number[] = [];
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    octets.push(octet);
  }
  return octets;
}

function ipv4FirstOctet(octets: number[], value: number): boolean {
  return octets[0] === value;
}

function isReservedIpv4(ip: string): boolean {
  const octets = ipv4Octets(ip);
  if (octets === null) return false;

  // 0.0.0.0/8 - "this network"
  if (ipv4FirstOctet(octets, 0)) return true;
  // 10.0.0.0/8 - private
  if (ipv4FirstOctet(octets, 10)) return true;
  // 100.64.0.0/10 - CGNAT
  if (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127) return true;
  // 127.0.0.0/8 - loopback
  if (ipv4FirstOctet(octets, 127)) return true;
  // 169.254.0.0/16 - link-local
  if (octets[0] === 169 && octets[1] === 254) return true;
  // 172.16.0.0/12 - private
  if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
  // 192.168.0.0/16 - private
  if (octets[0] === 192 && octets[1] === 168) return true;
  // 192.0.0.0/24 - IETF protocol assignments
  if (octets[0] === 192 && octets[1] === 0 && octets[2] === 0) return true;
  // 192.0.2.0/24 - TEST-NET-1
  if (octets[0] === 192 && octets[1] === 0 && octets[2] === 2) return true;
  // 198.18.0.0/15 - benchmarking
  if (octets[0] === 198 && (octets[1] === 18 || octets[1] === 19)) return true;
  // 198.51.100.0/24 - TEST-NET-2
  if (octets[0] === 198 && octets[1] === 51 && octets[2] === 100) return true;
  // 203.0.113.0/24 - TEST-NET-3
  if (octets[0] === 203 && octets[1] === 0 && octets[2] === 113) return true;
  // 224.0.0.0/4 - multicast
  if (octets[0] >= 224 && octets[0] <= 239) return true;
  // 240.0.0.0/4 - reserved (incl. 255.255.255.255 broadcast)
  if (octets[0] >= 240 && octets[0] <= 255) return true;

  return false;
}

// ---------------------------------------------------------------------------
// IPv6 private / reserved range checks
// ---------------------------------------------------------------------------

function isReservedIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase();

  // :: / ::1 (unspecified + loopback)
  if (normalized === '::' || normalized === '::1') return true;

  // IPv4-mapped IPv6 — two forms:
  //   dotted: ::ffff:127.0.0.1
  //   hex:    ::ffff:7f00:1  (Node.js v24 normalizes to this)
  const mappedDotted = normalized.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (mappedDotted !== null) {
    return isReservedIpv4(mappedDotted[1]);
  }
  const mappedHex = normalized.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (mappedHex !== null) {
    const high = parseInt(mappedHex[1], 16);
    const low = parseInt(mappedHex[2], 16);
    const octets = [(high >> 8) & 0xff, high & 0xff, (low >> 8) & 0xff, low & 0xff];
    if (octets[0] > 255 || octets[1] > 255 || octets[2] > 255 || octets[3] > 255) return false;
    return isReservedIpv4(octets.join('.'));
  }

  // fc00::/7 - unique local addresses (private)
  if (/^f[cd][0-9a-f]{2}/i.test(normalized)) return true;
  // fe80::/10 - link-local
  if (/^fe[89ab][0-9a-f]/i.test(normalized)) return true;
  // 2001:db8::/32 - documentation
  if (normalized.startsWith('2001:db8')) return true;
  // ff00::/8 - multicast
  if (normalized.startsWith('ff')) return true;
  // 2001:10::/28 - orchid
  if (normalized.startsWith('2001:10')) return true;

  // 2002::/16 (6to4) embedding private v4
  const sixToFour = normalized.match(/^2002:([0-9a-f]{4}):/);
  if (sixToFour !== null) {
    const first = parseInt(sixToFour[1], 16);
    const octets = [Math.floor(first / 256), first % 256];
    if (isReservedIpv4(`${octets[0]}.${octets[1]}.0.0`)) return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// Public address check
// ---------------------------------------------------------------------------

/**
 * Returns true when an IP literal is **not** a publicly routable address, i.e.
 * loopback, private, link-local, multicast, unspecified, CGNAT, documentation,
 * reserved, or otherwise non-public.
 *
 * Accepts both bracketed IPv6 (e.g. `[::1]`) and unbracketed forms.
 * Throws {@link SecurityValidationError} for unparseable IP strings.
 */
export function isNonPublicAddress(ip: string): boolean {
  const stripped = stripBrackets(ip);
  const version = net.isIP(stripped);
  if (version === 0) {
    throw ssrfError('INVALID_IP', `'${ip}' is not a valid IP address`);
  }
  if (version === 4) {
    return isReservedIpv4(stripped);
  }
  return isReservedIpv6(stripped);
}

// ---------------------------------------------------------------------------
// Host resolution + validation
// ---------------------------------------------------------------------------

function stripBrackets(host: string): string {
  return host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host;
}

/**
 * Resolve a hostname and return a {@link ResolvedTarget} pinned to the first
 * public address. **Every** address the hostname resolves to is validated so
 * that a mixed private/public DNS answer cannot be used to reach an internal
 * host.
 *
 * Throws {@link SecurityValidationError} if any address is non-public or
 * resolution fails.
 *
 * **Caller MUST** use the returned `ip` field for the actual TCP connection
 * (DNS-rebinding defence).
 */
export async function resolvePublicTarget(
  url: URL,
  options: ResolveOptions = {},
): Promise<ResolvedTarget> {
  const host = url.hostname;
  const port =
    url.port === '' ? (url.protocol === 'https:' ? 443 : 80) : Number(url.port);

  let addresses: string[];
  if (net.isIP(stripBrackets(host)) !== 0) {
    // IP literal — no DNS lookup needed
    addresses = [stripBrackets(host)];
  } else {
    const resolver = options.resolver ?? defaultResolver;
    try {
      addresses = await resolver(host);
    } catch {
      throw ssrfError('DNS_FAILED', `could not resolve host '${host}'`);
    }

    if (addresses.length === 0) {
      throw ssrfError(
        'DNS_FAILED',
        `host '${host}' did not resolve to any address`,
      );
    }
  }

  // Validate ALL resolved addresses — a mixed public/private answer must be
  // blocked to prevent DNS-rebinding attacks.
  for (const address of addresses) {
    if (isNonPublicAddress(stripBrackets(address))) {
      throw ssrfError(
        'BLOCKED_ADDRESS',
        `host '${stripBrackets(host)}' resolved to non-public address '${address}'`,
      );
    }
  }

  return {
    url,
    hostname: stripBrackets(host),
    ip: stripBrackets(addresses[0]),
    port,
  };
}

/**
 * Full validation entry point: parse the URL, resolve the host, and ensure the
 * resolved address is public.
 *
 * Call this on the initial URL **and** on every redirect destination.
 */
export async function validatePublicUrl(
  input: string,
  options: ResolveOptions = {},
): Promise<ResolvedTarget> {
  const url = parseTargetUrl(input);
  return resolvePublicTarget(url, options);
}
