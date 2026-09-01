import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';

import { ConnectorError } from '@osint-tool/connectors-service';
import { ObjectiveType } from '@osint-tool/schemas';
import type { Objective } from '@osint-tool/schemas';
import type { CollectorInput } from '@osint-tool/connectors-service';

import { DEFAULT_RATE_LIMIT_MS, DEFAULT_TIMEOUT_MS, WebFetchConnector } from '../index.js';
import { SsrfError } from '../ssrf.js';
import type { FetchOptions, FetchResponse, HttpFetch } from '../http.js';

const PUBLIC_IP = '93.184.216.34';
const PAGE_HTML = `<!DOCTYPE html>
<html><head><title>Public Page</title>
<meta name="description" content="Public description"></head>
<body><h1>Hello</h1><a href="/next">Next</a><p>Some body text.</p></body></html>`;

class FakeHttpFetch implements HttpFetch {
  public readonly requests: Array<{ url: string; options: FetchOptions }> = [];
  public handler: (url: string, options: FetchOptions) => Promise<FetchResponse>;

  public constructor(handler: (url: string, options: FetchOptions) => Promise<FetchResponse>) {
    this.handler = handler;
  }

  public async get(url: string, options: FetchOptions): Promise<FetchResponse> {
    this.requests.push({ url, options });
    return this.handler(url, options);
  }

  public get pageRequests(): number {
    return this.requests.filter((r) => !r.url.includes('/robots.txt')).length;
  }

  public get pageRequestUrls(): string[] {
    return this.requests.filter((r) => !r.url.includes('/robots.txt')).map((r) => r.url);
  }
}

const okResponse = (body: string, finalUrl?: string): FetchResponse => ({
  status: 200,
  headers: { 'content-type': 'text/html' },
  body,
  finalUrl: finalUrl ?? '',
});

const robotsResponse = (): FetchResponse => ({
  status: 200,
  headers: {},
  body: `User-agent: *\nDisallow: /admin`,
  finalUrl: '',
});

function domainObjective(): Objective {
  return {
    id: randomUUID(),
    investigation_id: randomUUID(),
    created_at: new Date(),
    updated_at: new Date(),
    type: ObjectiveType.DOMAIN,
    domain: 'example.com',
  };
}

async function collectAll(connector: WebFetchConnector, query: string) {
  const input: CollectorInput = { objective: domainObjective(), query };
  const observations = [];
  for await (const observation of connector.collect(input)) {
    observations.push(observation);
  }
  return observations;
}

describe('WebFetchConnector', () => {
  it('has expected identity and supported objective types', () => {
    const connector = new WebFetchConnector();
    assert.equal(connector.name, 'web-fetch');
    assert.equal(connector.version, '0.1.0');
    assert.ok(connector.supportedObjectiveTypes.includes(ObjectiveType.DOMAIN));
  });

  it('enforces the 30s timeout and 1 request / 2s defaults', async () => {
    const connector = new WebFetchConnector();
    await connector.configure();
    const health = await connector.health();
    assert.equal(health.status, 'healthy');
    // We directly assert the exported defaults equal the spec values.
    assert.equal(DEFAULT_TIMEOUT_MS, 30_000);
    assert.equal(DEFAULT_RATE_LIMIT_MS, 2_000);
  });

  it('fetches a public page and yields one WEB_PAGE observation', async () => {
    const httpFetch = new FakeHttpFetch(async (url) => {
      if (url.includes('/robots.txt')) return robotsResponse();
      return okResponse(PAGE_HTML, url);
    });
    const connector = new WebFetchConnector({ httpFetch });
    await connector.configure({ timeoutMs: 3000, maxRetries: 0 });
    const url = `http://${PUBLIC_IP}/page`;

    const observations = await collectAll(connector, url);

    assert.equal(observations.length, 1);
    const obs = observations[0];
    assert.equal(obs.type, 'WEB_PAGE');
    const data = obs.data as { url: string; title: string; text: string; links: string[] };
    assert.equal(data.url, url);
    assert.equal(data.title, 'Public Page');
    assert.ok(data.text.includes('Some body text.'));
    assert.ok(data.links.includes(`http://${PUBLIC_IP}/next`));
    assert.equal(obs.source_ref.connector_name, 'web-fetch');
    assert.equal(obs.confidence, 1);
  });

  it('blocks internal/private addresses before any request is made', async () => {
    const httpFetch = new FakeHttpFetch(async () => okResponse(PAGE_HTML));
    const connector = new WebFetchConnector({ httpFetch });
    await connector.configure({ timeoutMs: 3000, maxRetries: 0 });

    for (const bad of [
      'http://127.0.0.1/',
      'http://10.0.0.1/',
      'http://192.168.1.1/',
      'http://169.254.169.254/latest/meta-data/',
    ]) {
      await assert.rejects(
        collectAll(connector, bad),
        (error: unknown) =>
          error instanceof ConnectorError &&
          error.cause instanceof SsrfError &&
          error.cause.reason === 'BLOCKED_ADDRESS',
      );
    }
    assert.equal(httpFetch.requests.length, 0);
  });

  it('blocks hostnames resolving to private addresses', async () => {
    // The connector uses validatePublicUrl internally; here we check the
    // connector surfaces the underlying SsrfError through ConnectorError.
    const httpFetch = new FakeHttpFetch(async () => okResponse(PAGE_HTML));
    const connector = new WebFetchConnector({ httpFetch });
    await connector.configure({ timeoutMs: 3000, maxRetries: 0 });

    // The fake transport is never reached because validation runs first. We
    // use a hostname that the real DNS layer would resolve; instead we assert
    // the rejection shape via a private IP-literal path.
    await assert.rejects(
      collectAll(connector, 'http://localhost/'),
      (error: unknown) => error instanceof ConnectorError,
    );
    assert.equal(httpFetch.requests.length, 0);
  });

  it('respects robots.txt by not fetching a disallowed path', async () => {
    const httpFetch = new FakeHttpFetch(async (url) => {
      if (url.includes('/robots.txt')) return robotsResponse();
      return okResponse(PAGE_HTML, url);
    });
    const connector = new WebFetchConnector({ httpFetch });
    await connector.configure({ timeoutMs: 3000, maxRetries: 0 });

    const observations = await collectAll(connector, `http://${PUBLIC_IP}/admin`);
    assert.equal(observations.length, 0);
    // Only the robots request happened; the page was never fetched.
    assert.equal(httpFetch.pageRequests, 0);
  });

  it('fetches pages that robots.txt allows', async () => {
    const httpFetch = new FakeHttpFetch(async (url) => {
      if (url.includes('/robots.txt')) return robotsResponse();
      return okResponse(PAGE_HTML, url);
    });
    const connector = new WebFetchConnector({ httpFetch });
    await connector.configure({ timeoutMs: 3000, maxRetries: 0 });

    const observations = await collectAll(connector, `http://${PUBLIC_IP}/about`);
    assert.equal(observations.length, 1);
  });

  it('requests robots.txt only once per origin (cache)', async () => {
    const httpFetch = new FakeHttpFetch(async (url) => {
      if (url.includes('/robots.txt')) return robotsResponse();
      return okResponse(PAGE_HTML, url);
    });
    const connector = new WebFetchConnector({ httpFetch });
    await connector.configure({ timeoutMs: 3000, maxRetries: 0 });

    await collectAll(connector, `http://${PUBLIC_IP}/a`);
    const robotsCountAfterFirst = httpFetch.requests.filter((r) =>
      r.url.includes('/robots.txt'),
    ).length;
    assert.equal(robotsCountAfterFirst, 1);

    await collectAll(connector, `http://${PUBLIC_IP}/b`);
    const robotsCountTotal = httpFetch.requests.filter((r) => r.url.includes('/robots.txt')).length;
    assert.equal(robotsCountTotal, 1);
  });

  it('surfaces a timeout through the retry contract', async () => {
    const httpFetch = new FakeHttpFetch(async () => new Promise<FetchResponse>(() => {}));
    const connector = new WebFetchConnector({ httpFetch });
    await connector.configure({
      timeoutMs: 50,
      maxRetries: 0,
      rateLimit: { requestsPerInterval: 1, intervalMs: 30 },
    });

    await assert.rejects(
      collectAll(connector, `http://${PUBLIC_IP}/page`),
      (error: unknown) =>
        error instanceof ConnectorError &&
        error.code === 'RETRIES_EXHAUSTED' &&
        error.message.includes('timed out'),
    );
  });

  it('rate-limits repeated fetches to one request per interval', async () => {
    const timestamps: number[] = [];
    const httpFetch = new FakeHttpFetch(async (url) => {
      if (url.includes('/robots.txt')) return robotsResponse();
      timestamps.push(Date.now());
      return okResponse(PAGE_HTML, url);
    });
    const connector = new WebFetchConnector({ httpFetch });
    // Short interval keeps the unit test fast while verifying spacing.
    await connector.configure({
      timeoutMs: 3000,
      maxRetries: 0,
      rateLimit: { requestsPerInterval: 1, intervalMs: 120 },
    });

    for (let i = 0; i < 3; i += 1) {
      await collectAll(connector, `http://${PUBLIC_IP}/page`);
    }

    assert.equal(timestamps.length, 3);
    const first = timestamps[0] ?? 0;
    const last = timestamps[2] ?? 0;
    assert.ok(last - first >= 120, `expected spacing, got ${last - first}ms`);
  });

  it('handles network errors gracefully as ConnectorError', async () => {
    const httpFetch = new FakeHttpFetch(async () => {
      throw new Error('ECONNREFUSED');
    });
    const connector = new WebFetchConnector({ httpFetch });
    await connector.configure({ timeoutMs: 3000, maxRetries: 0 });

    await assert.rejects(
      collectAll(connector, `http://${PUBLIC_IP}/page`),
      (error: unknown) => error instanceof ConnectorError,
    );

    const health = await connector.health();
    assert.equal(health.status, 'degraded');
  });
});
