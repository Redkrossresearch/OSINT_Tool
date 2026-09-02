import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';

import { ObjectiveType } from '@osint-tool/schemas';
import type { Objective } from '@osint-tool/schemas';
import type { CollectorInput } from '@osint-tool/connectors-service';

import { WebSearchConnector } from '@osint-tool/web-search-connector';
import { WebFetchConnector } from '@osint-tool/web-fetch-connector';

import type { Observation } from '@osint-tool/schemas';

interface SearchGetOptions {
  timeoutMs: number;
  maxBodyBytes: number;
}

interface SearchResponse {
  status: number;
  body: string;
}

interface SearchHttp {
  get(url: string, options: SearchGetOptions): Promise<SearchResponse>;
}

interface FetchOptions {
  timeoutMs: number;
  maxBodyBytes: number;
  maxRedirects?: number;
}

interface FetchResponse {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
  finalUrl: string;
}

interface HttpFetch {
  get(url: string, options: FetchOptions): Promise<FetchResponse>;
}

const PUBLIC_IP = '93.184.216.34';
const TARGET_URL = `http://${PUBLIC_IP}/target-page`;

const SEARCH_HTML = `<!DOCTYPE html><html><body>
  <div class="result result__body">
    <h2 class="result__title">
      <a class="result__a" href="${TARGET_URL}">Example Target</a>
    </h2>
    <a class="result__snippet" href="#">A page about the target.</a>
  </div>
</body></html>`;

const PAGE_HTML = `<!DOCTYPE html>
<html><head><title>Fetched Page</title></head>
<body><h1>Hello</h1><p>Important content.</p><a href="/link">Link</a></body></html>`;

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

class FakeSearchHttp implements SearchHttp {
  public readonly requests: Array<{ url: string; options: SearchGetOptions }> = [];
  public handler: (url: string, options: SearchGetOptions) => Promise<SearchResponse>;

  public constructor(handler: (url: string, options: SearchGetOptions) => Promise<SearchResponse>) {
    this.handler = handler;
  }

  public async get(url: string, options: SearchGetOptions): Promise<SearchResponse> {
    this.requests.push({ url, options });
    return this.handler(url, options);
  }
}

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
}

async function collectAll(
  collector: { collect(input: CollectorInput): AsyncGenerator<Observation> },
  query: string,
) {
  const input: CollectorInput = { objective: domainObjective(), query };
  const results: Observation[] = [];
  for await (const item of collector.collect(input)) {
    results.push(item);
  }
  return results;
}

test('WebSearch -> WebFetch cross-connector flow', async () => {
  const searchHttp = new FakeSearchHttp(async () => ({ status: 200, body: SEARCH_HTML }));
  const searchConnector = new WebSearchConnector({ http: searchHttp, maxResults: 5 });
  await searchConnector.configure({
    maxRetries: 0,
    rateLimit: { requestsPerInterval: 1, intervalMs: 10 },
  });

  const searchObs = await collectAll(searchConnector, 'target query');
  assert.ok(searchObs.length >= 1, 'search should return at least one observation');
  assert.equal(searchObs[0].type, 'WEB_SEARCH');

  const url = searchObs[0].data.url as string;
  assert.equal(url, TARGET_URL, 'first search result URL should be the target');

  const fetchHttp = new FakeHttpFetch(async (fetchUrl) => {
    if (fetchUrl.includes('/robots.txt')) {
      return { status: 200, headers: {}, body: '', finalUrl: fetchUrl };
    }
    return {
      status: 200,
      headers: { 'content-type': 'text/html' },
      body: PAGE_HTML,
      finalUrl: fetchUrl,
    };
  });
  const fetchConnector = new WebFetchConnector({ httpFetch: fetchHttp });
  await fetchConnector.configure({
    maxRetries: 0,
    rateLimit: { requestsPerInterval: 1, intervalMs: 10 },
  });

  const fetchObs = await collectAll(fetchConnector, url);
  assert.ok(fetchObs.length >= 1, 'fetch should return at least one observation');
  assert.equal(fetchObs[0].type, 'WEB_PAGE');

  const data = fetchObs[0].data as Record<string, unknown>;
  assert.equal(data.url, TARGET_URL, 'fetch target URL should match search result');
  assert.equal(data.status, 200);
  assert.equal(data.title, 'Fetched Page');
  assert.ok(
    typeof data.text === 'string' && data.text.includes('Important content.'),
    'page text should contain body content',
  );
  assert.ok(Array.isArray(data.links), 'links should be an array');

  assert.equal(
    searchObs[0].data.url,
    fetchObs[0].data.url,
    'search result URL must be the fetch input URL',
  );
});

test('WebSearch -> WebFetch fails when search returns no URLs', async () => {
  const searchHttp = new FakeSearchHttp(async () => ({
    status: 200,
    body: '<html><body></body></html>',
  }));
  const searchConnector = new WebSearchConnector({ http: searchHttp });
  await searchConnector.configure({
    maxRetries: 0,
    rateLimit: { requestsPerInterval: 1, intervalMs: 10 },
  });

  const searchObs = await collectAll(searchConnector, 'empty results');
  assert.equal(searchObs.length, 0, 'empty search page should yield zero observations');
});

test('WebSearch -> WebFetch propagates search transport failure', async () => {
  const searchHttp = new FakeSearchHttp(async () => {
    throw new Error('NETWORK_DOWN');
  });
  const searchConnector = new WebSearchConnector({ http: searchHttp });
  await searchConnector.configure({
    maxRetries: 0,
    rateLimit: { requestsPerInterval: 1, intervalMs: 10 },
  });

  await assert.rejects(collectAll(searchConnector, 'test'), (error: unknown) => {
    assert.ok(error instanceof Error);
    return true;
  });
});

test('WebSearch -> WebFetch verifies URL data flows through the fetch token', async () => {
  const searchHttp = new FakeSearchHttp(async () => ({ status: 200, body: SEARCH_HTML }));
  const searchConnector = new WebSearchConnector({ http: searchHttp, maxResults: 1 });
  await searchConnector.configure({
    maxRetries: 0,
    rateLimit: { requestsPerInterval: 1, intervalMs: 10 },
  });

  const searchObs = await collectAll(searchConnector, 'specific query');
  assert.equal(searchObs.length, 1);

  const searchResultUrl = searchObs[0].data.url as string;

  let fetchedUrl: string | undefined;
  const fetchHttp = new FakeHttpFetch(async (fetchUrl) => {
    fetchedUrl = fetchUrl;
    if (fetchUrl.includes('/robots.txt')) {
      return { status: 200, headers: {}, body: '', finalUrl: fetchUrl };
    }
    return { status: 200, headers: {}, body: PAGE_HTML, finalUrl: fetchUrl };
  });
  const fetchConnector = new WebFetchConnector({ httpFetch: fetchHttp });
  await fetchConnector.configure({
    maxRetries: 0,
    rateLimit: { requestsPerInterval: 1, intervalMs: 10 },
  });

  await collectAll(fetchConnector, searchResultUrl);

  assert.equal(
    fetchedUrl,
    searchResultUrl,
    'WebFetch must have requested the exact URL from WebSearch',
  );
});
