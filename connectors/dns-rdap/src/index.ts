import { randomUUID } from 'node:crypto';
import { Resolver } from 'node:dns/promises';

import {
  ObjectiveType,
  EvidenceMetadataType,
  type Observation,
  type SourceRef,
} from '@osint-tool/schemas';
import { BaseConnector } from '../../../services/connectors/src/framework/connector-base.js';
import type { CollectorInput } from '../../../services/connectors/src/framework/connector-interface.js';

const DEFAULT_CONFIDENCE = 0.95;
const DEFAULT_DNS_SERVERS = ['1.1.1.1', '8.8.8.8'];
const DEFAULT_RDAP_BASE_URL = 'https://rdap.org';

export interface DnsResolver {
  resolve4(hostname: string): Promise<string[]>;
  resolve6(hostname: string): Promise<string[]>;
  resolveCname(hostname: string): Promise<string[]>;
  resolveMx(hostname: string): Promise<Array<{ exchange: string; priority: number }>>;
  resolveNs(hostname: string): Promise<string[]>;
  resolveTxt(hostname: string): Promise<string[][]>;
  resolveSoa(hostname: string): Promise<{
    nsname: string;
    hostmaster: string;
    serial: number;
    refresh: number;
    retry: number;
    expire: number;
    minttl: number;
  }>;
  reverse(ip: string): Promise<string[]>;
  setServers?(servers: readonly string[]): void;
}

export interface DnsRdapConnectorOptions {
  dnsServers?: string[];
  rdapBaseUrl?: string;
  resolver?: DnsResolver;
  fetchFn?: typeof fetch;
}

export interface RdapEvent {
  eventAction: string;
  eventDate: string;
}

export interface RdapEntity {
  handle?: string;
  roles?: string[];
  vcardArray?: unknown[];
}

export interface RdapNameserver {
  ldhName?: string;
}

export interface RdapResponse {
  objectClassName?: string;
  handle?: string;
  ldhName?: string;
  name?: string;
  status?: string[];
  events?: RdapEvent[];
  entities?: RdapEntity[];
  nameservers?: RdapNameserver[];
  startAddress?: string;
  endAddress?: string;
  ipVersion?: string;
  country?: string;
  [key: string]: unknown;
}

export class DnsRdapConnector extends BaseConnector {
  private readonly dnsServers: string[];
  private readonly rdapBaseUrl: string;
  private readonly resolver: DnsRdapConnectorOptions['resolver'];
  private readonly fetchFn: typeof fetch;

  public constructor(options: DnsRdapConnectorOptions = {}) {
    super({
      name: 'dns-rdap',
      version: '1.0.0',
      supportedObjectiveTypes: [ObjectiveType.DOMAIN, ObjectiveType.IP],
    });

    this.dnsServers = options.dnsServers ?? DEFAULT_DNS_SERVERS;
    this.rdapBaseUrl = (options.rdapBaseUrl ?? DEFAULT_RDAP_BASE_URL).replace(/\/+$/, '');
    this.fetchFn = options.fetchFn ?? globalThis.fetch;

    if (options.resolver) {
      this.resolver = options.resolver;
    } else {
      const resolver = new Resolver();
      try {
        resolver.setServers(this.dnsServers);
      } catch {
        // Fallback to system resolver if setServers fails
      }
      this.resolver = resolver;
    }
  }

  protected async *fetchObservations(input: CollectorInput): AsyncGenerator<Observation> {
    const rawQuery = input.query.trim();
    if (rawQuery.length === 0) {
      throw new Error('dns-rdap: query must not be empty');
    }

    const cleanQuery = sanitizeQuery(rawQuery);
    const isIp = isIpAddress(cleanQuery);

    const sourceRef: SourceRef = {
      connector_name: this.name,
      query: cleanQuery,
      timestamp: new Date(),
      parameters: {
        objective_type: input.objective.type,
        target_type: isIp ? 'IP' : 'DOMAIN',
      },
    };

    if (isIp) {
      // 1. Reverse DNS for IP
      const reverseRecords = await this.queryReverseDns(cleanQuery);
      for (const record of reverseRecords) {
        yield this.createDnsObservation(
          'PTR',
          cleanQuery,
          record,
          sourceRef,
          { record_type: 'PTR', ip: cleanQuery },
        );
      }

      // 2. RDAP query for IP
      const rdapData = await this.queryRdap('ip', cleanQuery);
      if (rdapData) {
        yield this.createRdapObservation(cleanQuery, rdapData, sourceRef, { query_type: 'ip' });
      }
    } else {
      // 1. Forward DNS lookups
      const dnsObservations = await this.queryAllDnsRecords(cleanQuery, sourceRef);
      for (const obs of dnsObservations) {
        yield obs;
      }

      // 2. RDAP query for domain
      const rdapData = await this.queryRdap('domain', cleanQuery);
      if (rdapData) {
        yield this.createRdapObservation(cleanQuery, rdapData, sourceRef, { query_type: 'domain' });
      }
    }
  }

  private async queryAllDnsRecords(
    domain: string,
    sourceRef: SourceRef,
  ): Promise<Observation[]> {
    const observations: Observation[] = [];

    // Query A records
    const aRecords = await this.safeResolve(() => this.resolver!.resolve4(domain));
    if (aRecords) {
      for (const ip of aRecords) {
        observations.push(
          this.createDnsObservation('A', domain, ip, sourceRef, { record_type: 'A', value: ip }),
        );
      }
    }

    // Query AAAA records
    const aaaaRecords = await this.safeResolve(() => this.resolver!.resolve6(domain));
    if (aaaaRecords) {
      for (const ip of aaaaRecords) {
        observations.push(
          this.createDnsObservation('AAAA', domain, ip, sourceRef, {
            record_type: 'AAAA',
            value: ip,
          }),
        );
      }
    }

    // Query CNAME records
    const cnameRecords = await this.safeResolve(() => this.resolver!.resolveCname(domain));
    if (cnameRecords) {
      for (const cname of cnameRecords) {
        observations.push(
          this.createDnsObservation('CNAME', domain, cname, sourceRef, {
            record_type: 'CNAME',
            value: cname,
          }),
        );
      }
    }

    // Query MX records
    const mxRecords = await this.safeResolve(() => this.resolver!.resolveMx(domain));
    if (mxRecords) {
      for (const mx of mxRecords) {
        observations.push(
          this.createDnsObservation('MX', domain, `${mx.priority} ${mx.exchange}`, sourceRef, {
            record_type: 'MX',
            exchange: mx.exchange,
            priority: mx.priority,
          }),
        );
      }
    }

    // Query NS records
    const nsRecords = await this.safeResolve(() => this.resolver!.resolveNs(domain));
    if (nsRecords) {
      for (const ns of nsRecords) {
        observations.push(
          this.createDnsObservation('NS', domain, ns, sourceRef, { record_type: 'NS', value: ns }),
        );
      }
    }

    // Query TXT records
    const txtRecords = await this.safeResolve(() => this.resolver!.resolveTxt(domain));
    if (txtRecords) {
      for (const txtChunks of txtRecords) {
        const txtValue = txtChunks.join('');
        observations.push(
          this.createDnsObservation('TXT', domain, txtValue, sourceRef, {
            record_type: 'TXT',
            value: txtValue,
          }),
        );
      }
    }

    // Query SOA record
    const soaRecord = await this.safeResolve(() => this.resolver!.resolveSoa(domain));
    if (soaRecord) {
      observations.push(
        this.createDnsObservation(
          'SOA',
          domain,
          `${soaRecord.nsname} ${soaRecord.hostmaster} ${soaRecord.serial}`,
          sourceRef,
          {
            record_type: 'SOA',
            nsname: soaRecord.nsname,
            hostmaster: soaRecord.hostmaster,
            serial: soaRecord.serial,
            refresh: soaRecord.refresh,
            retry: soaRecord.retry,
            expire: soaRecord.expire,
            minttl: soaRecord.minttl,
          },
        ),
      );
    }

    return observations;
  }

  private async queryReverseDns(ip: string): Promise<string[]> {
    const ptrs = await this.safeResolve(() => this.resolver!.reverse(ip));
    return ptrs ?? [];
  }

  private async safeResolve<T>(fn: () => Promise<T>): Promise<T | null> {
    try {
      return await this.request(fn);
    } catch (error) {
      // Ignorable DNS error codes when a record type is not configured on domain
      const code = (error as { code?: string })?.code;
      if (
        code === 'ENODATA' ||
        code === 'ENOTFOUND' ||
        code === 'NODATA' ||
        code === 'NXDOMAIN' ||
        code === 'FORMERR' ||
        code === 'SERVFAIL' ||
        code === 'NOTFOUND'
      ) {
        return null;
      }
      return null;
    }
  }

  private async queryRdap(type: 'domain' | 'ip', target: string): Promise<RdapResponse | null> {
    const url = `${this.rdapBaseUrl}/${type}/${encodeURIComponent(target)}`;

    try {
      return await this.request(async () => {
        const response = await this.fetchFn(url, {
          method: 'GET',
          headers: {
            Accept: 'application/rdap+json, application/json',
            'User-Agent': 'osint-tool-dns-rdap-connector/1.0.0',
          },
        });

        if (response.status === 404 || response.status === 400) {
          return null;
        }

        if (!response.ok) {
          throw new Error(`RDAP request failed with HTTP ${response.status}`);
        }

        const data = (await response.json()) as RdapResponse;
        return data;
      });
    } catch {
      return null;
    }
  }

  private createDnsObservation(
    recordType: string,
    recordName: string,
    value: string,
    sourceRef: SourceRef,
    extraData: Record<string, unknown> = {},
  ): Observation {
    const now = new Date();

    return {
      id: randomUUID(),
      evidence_id: randomUUID(),
      type: EvidenceMetadataType.DNS_RECORD,
      data: {
        type: EvidenceMetadataType.DNS_RECORD,
        record_type: recordType,
        record_name: recordName,
        value,
        resolver: this.dnsServers[0],
        ...extraData,
      },
      confidence: DEFAULT_CONFIDENCE,
      source_ref: {
        ...sourceRef,
        timestamp: now,
        parameters: {
          ...sourceRef.parameters,
          record_type: recordType,
        },
      },
      timestamp: now,
    };
  }

  private createRdapObservation(
    target: string,
    rdap: RdapResponse,
    sourceRef: SourceRef,
    extraParams: Record<string, unknown> = {},
  ): Observation {
    const now = new Date();

    const registrar = extractRegistrar(rdap);
    const creationDate = extractEventDate(rdap, ['registration']);
    const expirationDate = extractEventDate(rdap, ['expiration']);
    const updatedDate = extractEventDate(rdap, ['last changed', 'last update of RDAP database']);
    const nameservers = (rdap.nameservers ?? [])
      .map((ns) => ns.ldhName)
      .filter((ns): ns is string => typeof ns === 'string');

    return {
      id: randomUUID(),
      evidence_id: randomUUID(),
      type: 'RDAP_DATA',
      data: {
        category: 'rdap-registration',
        target,
        handle: rdap.handle,
        ldhName: rdap.ldhName,
        name: rdap.name,
        status: rdap.status,
        registrar,
        creation_date: creationDate,
        expiration_date: expirationDate,
        updated_date: updatedDate,
        nameservers,
        start_address: rdap.startAddress,
        end_address: rdap.endAddress,
        country: rdap.country,
        raw: rdap,
      },
      confidence: DEFAULT_CONFIDENCE,
      source_ref: {
        ...sourceRef,
        timestamp: now,
        parameters: {
          ...sourceRef.parameters,
          ...extraParams,
        },
      },
      timestamp: now,
    };
  }
}

function sanitizeQuery(query: string): string {
  let cleaned = query.trim();
  // Strip protocol if user passed a URL
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  // Strip trailing path/slash
  cleaned = cleaned.replace(/\/.*$/, '');
  // Strip port
  cleaned = cleaned.replace(/:\d+$/, '');
  return cleaned.toLowerCase();
}

function isIpAddress(query: string): boolean {
  // IPv4 regex
  const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  // IPv6 regex
  const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^[0-9a-fA-F]{1,4}::/;
  return ipv4Pattern.test(query) || ipv6Pattern.test(query);
}

function extractEventDate(rdap: RdapResponse, actions: string[]): string | undefined {
  if (!Array.isArray(rdap.events)) return undefined;
  for (const action of actions) {
    const match = rdap.events.find(
      (e) => e.eventAction && e.eventAction.toLowerCase() === action.toLowerCase(),
    );
    if (match?.eventDate) {
      return match.eventDate;
    }
  }
  return undefined;
}

function extractRegistrar(rdap: RdapResponse): string | undefined {
  if (!Array.isArray(rdap.entities)) return undefined;

  const registrarEntity = rdap.entities.find(
    (e) => Array.isArray(e.roles) && e.roles.includes('registrar'),
  );

  if (!registrarEntity) return undefined;

  // Try extracting formatted name from vcardArray if available
  if (Array.isArray(registrarEntity.vcardArray)) {
    const vcards = registrarEntity.vcardArray;
    if (Array.isArray(vcards[1])) {
      const fnEntry = (vcards[1] as unknown[][]).find(
        (entry) => Array.isArray(entry) && entry[0] === 'fn',
      );
      if (fnEntry && typeof fnEntry[3] === 'string') {
        return fnEntry[3];
      }
    }
  }

  if (registrarEntity.handle) return registrarEntity.handle;

  return undefined;
}

export { DnsRdapConnector as default };
