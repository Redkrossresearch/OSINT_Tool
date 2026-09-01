import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  EvidenceMetadataType,
  type Objective,
} from '@osint-tool/schemas';

import { CertIntelConnector, type CrtShCertificateEntry } from '../index.js';

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

const mockCrtShResponse: CrtShCertificateEntry[] = [
  {
    id: 1001,
    issuer_ca_id: 16418,
    issuer_name: 'C=US, O=DigiCert Inc, CN=DigiCert Global Root G2',
    common_name: 'example.com',
    name_value: 'example.com\nwww.example.com\napi.example.com',
    entry_timestamp: '2024-01-10T12:00:00.000',
    not_before: '2024-01-10T00:00:00',
    not_after: '2025-01-10T23:59:59',
    serial_number: '04a1b2c3d4e5f60718293a4b5c6d7e8f',
  },
  {
    id: 1002,
    issuer_ca_id: 7395,
    issuer_name: "C=US, O=Let's Encrypt, CN=R3",
    common_name: '*.example.com',
    name_value: '*.example.com\nexample.com',
    entry_timestamp: '2024-06-01T08:30:00.000',
    not_before: '2024-06-01T00:00:00',
    not_after: '2024-08-30T23:59:59',
    serial_number: '03f9e8d7c6b5a41234567890abcdef12',
  },
];

function createMockFetch(routes: Record<string, { status?: number; body?: unknown; text?: string }> = {}) {
  return (async (input: RequestInfo | URL) => {
    const url = String(input);
    for (const [key, response] of Object.entries(routes)) {
      if (url.includes(key)) {
        const status = response.status ?? 200;
        const ok = status >= 200 && status < 300;
        return {
          ok,
          status,
          text: async () => response.text ?? JSON.stringify(response.body ?? []),
          json: async () => response.body ?? [],
        } as unknown as Response;
      }
    }
    return {
      ok: false,
      status: 404,
      text: async () => '',
      json: async () => null,
    } as unknown as Response;
  }) as typeof fetch;
}

describe('CertIntelConnector', () => {
  it('rejects collection before configure() is called', async () => {
    const connector = new CertIntelConnector({
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

  it('rejects empty query', async () => {
    const connector = new CertIntelConnector({
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

  it('collects certificate transparency records from crt.sh and generates valid observations', async () => {
    const connector = new CertIntelConnector({
      fetchFn: createMockFetch({ 'q=example.com': { body: mockCrtShResponse } }),
    });

    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    const observations = [];
    for await (const obs of connector.collect({
      objective: makeObjective('DOMAIN', { domain: 'example.com' }),
      query: 'https://example.com/some/path',
    })) {
      observations.push(obs);
    }

    assert.equal(observations.length, 2);

    for (const obs of observations) {
      assert.equal(obs.type, EvidenceMetadataType.CERTIFICATE);
      assert.equal(obs.source_ref.connector_name, 'cert-intel');
      assert.equal(obs.source_ref.query, 'example.com');
      assert.ok(obs.confidence >= 0 && obs.confidence <= 1);
      assert.ok(obs.data.serial_number);
      assert.ok(obs.data.subject);
      assert.ok(obs.data.issuer);
      assert.ok(typeof obs.data.fingerprint_sha256 === 'string');
      assert.match(obs.data.fingerprint_sha256 as string, /^[A-Fa-f0-9]{64}$/);
    }

    const firstCert = observations[0]!;
    assert.equal(firstCert.data.subject, 'example.com');
    assert.equal(firstCert.data.issuer, 'C=US, O=DigiCert Inc, CN=DigiCert Global Root G2');
    assert.deepEqual(firstCert.data.domains, ['example.com', 'www.example.com', 'api.example.com']);
    assert.equal(firstCert.data.serial_number, '04a1b2c3d4e5f60718293a4b5c6d7e8f');

    const secondCert = observations[1]!;
    assert.equal(secondCert.data.subject, '*.example.com');
    assert.deepEqual(secondCert.data.domains, ['*.example.com', 'example.com']);
  });

  it('deduplicates certificates with identical fingerprints', async () => {
    const duplicateList = [mockCrtShResponse[0]!, mockCrtShResponse[0]!];

    const connector = new CertIntelConnector({
      fetchFn: createMockFetch({ 'q=example.com': { body: duplicateList } }),
    });

    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    const observations = [];
    for await (const obs of connector.collect({
      objective: makeObjective('DOMAIN', { domain: 'example.com' }),
      query: 'example.com',
    })) {
      observations.push(obs);
    }

    assert.equal(observations.length, 1);
  });

  it('handles empty results and 404 gracefully without errors', async () => {
    const connector = new CertIntelConnector({
      fetchFn: createMockFetch({ 'q=notfound.com': { status: 404 } }),
    });

    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    const observations = [];
    for await (const obs of connector.collect({
      objective: makeObjective('DOMAIN', { domain: 'notfound.com' }),
      query: 'notfound.com',
    })) {
      observations.push(obs);
    }

    assert.equal(observations.length, 0);
    const health = await connector.health();
    assert.equal(health.status, 'healthy');
  });

  it('handles malformed HTML responses from crt.sh without throwing', async () => {
    const connector = new CertIntelConnector({
      fetchFn: createMockFetch({ 'q=example.com': { text: '<html><head><title>502 Bad Gateway</title></head></html>' } }),
    });

    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    const observations = [];
    for await (const obs of connector.collect({
      objective: makeObjective('DOMAIN', { domain: 'example.com' }),
      query: 'example.com',
    })) {
      observations.push(obs);
    }

    assert.equal(observations.length, 0);
  });

  it('respects configured rate limiting', async () => {
    const connector = new CertIntelConnector({
      fetchFn: createMockFetch({ 'q=example.com': { body: mockCrtShResponse } }),
    });

    await connector.configure({
      timeoutMs: 5000,
      maxRetries: 0,
      rateLimit: { requestsPerInterval: 1, intervalMs: 50 },
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
    const elapsed = Date.now() - start;
    assert.ok(elapsed >= 40);
  });
});
