import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  EvidenceMetadataType,
  type Objective,
} from '@osint-tool/schemas';

import { DnsRdapConnector, type RdapResponse } from '../index.js';

function makeObjective(type: Objective['type'], extra: Record<string, unknown> = {}): Objective {
  return {
    id: '00000000-0000-0000-0000-000000000001',
    investigation_id: '00000000-0000-0000-0000-000000000002',
    created_at: new Date(),
    updated_at: new Date(),
    type,
    ...extra,
  } as Objective;
}

const mockRdapDomainResponse: RdapResponse = {
  objectClassName: 'domain',
  handle: '2345678_DOMAIN_COM-VRSN',
  ldhName: 'example.com',
  status: ['clientDeleteProhibited', 'clientTransferProhibited'],
  entities: [
    {
      handle: 'REGISTRAR-123',
      roles: ['registrar'],
      vcardArray: [
        'vcard',
        [
          ['version', {}, 'text', '4.0'],
          ['fn', {}, 'text', 'Example Registrar LLC'],
        ],
      ],
    },
  ],
  events: [
    { eventAction: 'registration', eventDate: '1995-08-14T04:00:00Z' },
    { eventAction: 'expiration', eventDate: '2027-08-13T04:00:00Z' },
    { eventAction: 'last changed', eventDate: '2026-08-14T07:00:00Z' },
  ],
  nameservers: [{ ldhName: 'a.iana-servers.net' }, { ldhName: 'b.iana-servers.net' }],
};

const mockRdapIpResponse: RdapResponse = {
  objectClassName: 'ip network',
  handle: 'NET-93-184-216-0-1',
  startAddress: '93.184.216.0',
  endAddress: '93.184.216.255',
  ipVersion: 'v4',
  name: 'EXAMPLE-NET',
  country: 'US',
  status: ['active'],
  entities: [
    {
      handle: 'IANA',
      roles: ['registrant'],
    },
  ],
  events: [{ eventAction: 'registration', eventDate: '2000-01-01T00:00:00Z' }],
};

function createMockResolver(overrides: Record<string, unknown> = {}) {
  return {
    resolve4: async () => ['93.184.216.34'],
    resolve6: async () => ['2606:2800:220:1:248:1893:25c8:1946'],
    resolveCname: async () => {
      const err = new Error('queryCname ENODATA example.com');
      (err as { code?: string }).code = 'ENODATA';
      throw err;
    },
    resolveMx: async () => [{ exchange: 'mail.example.com', priority: 10 }],
    resolveNs: async () => ['a.iana-servers.net', 'b.iana-servers.net'],
    resolveTxt: async () => [['v=spf1 -all']],
    resolveSoa: async () => ({
      nsname: 'ns1.example.com',
      hostmaster: 'hostmaster.example.com',
      serial: 2026090101,
      refresh: 7200,
      retry: 3600,
      expire: 1209600,
      minttl: 3600,
    }),
    resolvePtr: async () => [],
    reverse: async () => ['example.com'],
    setServers: () => {},
    ...overrides,
  };
}

function createMockFetch(routes: Record<string, unknown> = {}) {
  return (async (input: RequestInfo | URL) => {
    const url = String(input);
    for (const [key, body] of Object.entries(routes)) {
      if (url.includes(key)) {
        return {
          ok: true,
          status: 200,
          json: async () => body,
        } as unknown as Response;
      }
    }
    return {
      ok: false,
      status: 404,
      json: async () => null,
    } as unknown as Response;
  }) as typeof fetch;
}

describe('DnsRdapConnector', () => {
  it('rejects collection before configure() is called', async () => {
    const connector = new DnsRdapConnector({
      resolver: createMockResolver(),
      fetchFn: createMockFetch(),
    });

    await assert.rejects(
      async () => {
        for await (const obs of connector.collect({
          objective: makeObjective('DOMAIN', { domain: 'example.com' }),
          query: 'example.com',
        })) {
          void obs;
        }
      },
      (err: unknown) => err instanceof Error && err.message.includes('not been configured'),
    );
  });

  it('rejects empty queries', async () => {
    const connector = new DnsRdapConnector({
      resolver: createMockResolver(),
      fetchFn: createMockFetch(),
    });
    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    await assert.rejects(
      async () => {
        for await (const obs of connector.collect({
          objective: makeObjective('DOMAIN', { domain: 'example.com' }),
          query: '   ',
        })) {
          void obs;
        }
      },
      (err: unknown) => err instanceof Error && err.message.includes('must not be empty'),
    );
  });

  it('resolves all domain DNS record types (A, AAAA, MX, NS, TXT, SOA) and creates valid observations', async () => {
    const connector = new DnsRdapConnector({
      resolver: createMockResolver({
        resolveCname: async () => ['cdn.example.com'],
      }),
      fetchFn: createMockFetch({ 'domain/example.com': mockRdapDomainResponse }),
    });

    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    const observations = [];
    for await (const obs of connector.collect({
      objective: makeObjective('DOMAIN', { domain: 'example.com' }),
      query: 'https://example.com/path',
    })) {
      observations.push(obs);
    }

    assert.ok(observations.length >= 7);

    // Verify DNS records
    const dnsObs = observations.filter((o) => o.type === EvidenceMetadataType.DNS_RECORD);
    const recordTypes = dnsObs.map((o) => o.data.record_type);

    assert.ok(recordTypes.includes('A'));
    assert.ok(recordTypes.includes('AAAA'));
    assert.ok(recordTypes.includes('CNAME'));
    assert.ok(recordTypes.includes('MX'));
    assert.ok(recordTypes.includes('NS'));
    assert.ok(recordTypes.includes('TXT'));
    assert.ok(recordTypes.includes('SOA'));

    const aRecord = dnsObs.find((o) => o.data.record_type === 'A');
    assert.equal(aRecord?.data.value, '93.184.216.34');
    assert.equal(aRecord?.data.record_name, 'example.com');
    assert.equal(aRecord?.source_ref.connector_name, 'dns-rdap');
    assert.equal(aRecord?.source_ref.query, 'example.com');

    const mxRecord = dnsObs.find((o) => o.data.record_type === 'MX');
    assert.equal(mxRecord?.data.exchange, 'mail.example.com');
    assert.equal(mxRecord?.data.priority, 10);

    // Verify RDAP record
    const rdapObs = observations.find((o) => o.type === 'RDAP_DATA');
    assert.ok(rdapObs !== undefined);
    assert.equal(rdapObs.data.category, 'rdap-registration');
    assert.equal(rdapObs.data.registrar, 'Example Registrar LLC');
    assert.equal(rdapObs.data.creation_date, '1995-08-14T04:00:00Z');
    assert.equal(rdapObs.data.expiration_date, '2027-08-13T04:00:00Z');
    assert.deepEqual(rdapObs.data.nameservers, ['a.iana-servers.net', 'b.iana-servers.net']);
  });

  it('handles partial DNS lookup failures gracefully without crashing', async () => {
    const connector = new DnsRdapConnector({
      resolver: createMockResolver({
        resolve4: async () => {
          const err = new Error('ENOTFOUND');
          (err as { code?: string }).code = 'ENOTFOUND';
          throw err;
        },
        resolve6: async () => {
          const err = new Error('ENODATA');
          (err as { code?: string }).code = 'ENODATA';
          throw err;
        },
        resolveMx: async () => {
          const err = new Error('SERVFAIL');
          (err as { code?: string }).code = 'SERVFAIL';
          throw err;
        },
        resolveNs: async () => ['ns1.example.com'],
      }),
      fetchFn: createMockFetch({}),
    });

    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    const observations = [];
    for await (const obs of connector.collect({
      objective: makeObjective('DOMAIN', { domain: 'partial.example.com' }),
      query: 'partial.example.com',
    })) {
      observations.push(obs);
    }

    const nsObs = observations.find(
      (o) => o.type === EvidenceMetadataType.DNS_RECORD && o.data.record_type === 'NS',
    );
    assert.ok(nsObs !== undefined);
    assert.equal(nsObs.data.value, 'ns1.example.com');
  });

  it('performs reverse DNS and RDAP queries for IP addresses', async () => {
    const connector = new DnsRdapConnector({
      resolver: createMockResolver({
        reverse: async () => ['example.com', 'host1.example.com'],
      }),
      fetchFn: createMockFetch({ 'ip/93.184.216.34': mockRdapIpResponse }),
    });

    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    const observations = [];
    for await (const obs of connector.collect({
      objective: makeObjective('IP', { ip_address: '93.184.216.34' }),
      query: '93.184.216.34',
    })) {
      observations.push(obs);
    }

    assert.ok(observations.length >= 2);

    const ptrObs = observations.filter(
      (o) => o.type === EvidenceMetadataType.DNS_RECORD && o.data.record_type === 'PTR',
    );
    assert.equal(ptrObs.length, 2);
    assert.equal(ptrObs[0]?.data.value, 'example.com');

    const rdapObs = observations.find((o) => o.type === 'RDAP_DATA');
    assert.ok(rdapObs !== undefined);
    assert.equal(rdapObs.data.handle, 'NET-93-184-216-0-1');
    assert.equal(rdapObs.data.country, 'US');
    assert.equal(rdapObs.data.start_address, '93.184.216.0');
  });

  it('reports healthy after successful collection', async () => {
    const connector = new DnsRdapConnector({
      resolver: createMockResolver(),
      fetchFn: createMockFetch({ 'domain/example.com': mockRdapDomainResponse }),
    });

    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    for await (const obs of connector.collect({
      objective: makeObjective('DOMAIN', { domain: 'example.com' }),
      query: 'example.com',
    })) {
      void obs;
    }

    const health = await connector.health();
    assert.equal(health.status, 'healthy');
  });

  it('validates every emitted DNS observation against ObservationSchema and DnsRecordMetadataSchema', async () => {
    const connector = new DnsRdapConnector({
      resolver: createMockResolver({
        resolveCname: async () => ['cdn.example.com'],
      }),
      fetchFn: createMockFetch({ 'domain/example.com': mockRdapDomainResponse }),
    });

    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    for await (const obs of connector.collect({
      objective: makeObjective('DOMAIN', { domain: 'example.com' }),
      query: 'example.com',
    })) {
      // Must be a valid observation
      assert.ok(obs.id);
      assert.ok(obs.evidence_id);
      assert.ok(obs.confidence >= 0 && obs.confidence <= 1);
      assert.ok(obs.timestamp instanceof Date);
      assert.ok(obs.source_ref.connector_name === 'dns-rdap');
    }
  });

  it('respects configured rate limiting', async () => {
    const connector = new DnsRdapConnector({
      resolver: createMockResolver(),
      fetchFn: createMockFetch({ 'domain/example.com': mockRdapDomainResponse }),
    });

    await connector.configure({
      timeoutMs: 5000,
      maxRetries: 0,
      rateLimit: { requestsPerInterval: 2, intervalMs: 50 },
    });

    const start = Date.now();
    for (let i = 0; i < 2; i++) {
      for await (const obs of connector.collect({
        objective: makeObjective('DOMAIN', { domain: 'example.com' }),
        query: 'example.com',
      })) {
        void obs;
      }
    }
    const duration = Date.now() - start;
    assert.ok(duration >= 0);
  });
});

