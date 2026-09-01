import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';

import { ConnectorError } from '@osint-tool/connectors-service';
import { ObjectiveType } from '@osint-tool/schemas';
import type { Objective } from '@osint-tool/schemas';
import type { CollectorInput } from '@osint-tool/connectors-service';

import {
  DEFAULT_MAX_RESULTS,
  DEFAULT_RATE_LIMIT_MS,
  DEFAULT_TIMEOUT_MS,
  WebSearchConnector,
} from '../index.js';
import type { SearchGetOptions, SearchHttp, SearchResponse } from '../http.js';

function resultsPage(count: number): string {
  const rows = Array.from(
    { length: count },
    (_, i) => `
    <div class="result result__body">
      <h2 class="result__title">
        <a class="result__a" href="//duckduckgo.com/l/?uddg=${encodeURIComponent(
          `https://result${i}.example/p${i}`,
        )}">Result ${i}</a>
      </h2>
      <a class="result__snippet" href="#">Snippet ${i}</a>
    </div>`,
  );
  return `<!DOCTYPE html><html><body>${rows.join('')}</body></html>`;
}

const challengePage = `
  <!DOCTYPE html><html><body>
  <h1>DuckDuckGo</h1><p>Anomaly detected: please verify you are a human.</p>
  </body></html>`;

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

const okPage = (count: number): SearchResponse => ({
  status: 200,
  body: resultsPage(count),
});

function objective(): Objective {
  return {
    id: randomUUID(),
    investigation_id: randomUUID(),
    created_at: new Date(),
    updated_at: new Date(),
    type: ObjectiveType.DOMAIN,
    domain: 'example.com',
  };
}

async function collectAll(connector: WebSearchConnector, query: string) {
  const input: CollectorInput = { objective: objective(), query };
  const observations = [];
  for await (const observation of connector.collect(input)) {
    observations.push(observation);
  }
  return observations;
}

describe('WebSearchConnector', () => {
  it('has expected identity and supported objective types', () => {
    const connector = new WebSearchConnector();
    assert.equal(connector.name, 'web-search');
    assert.equal(connector.version, '0.1.0');
    assert.deepEqual(connector.supportedObjectiveTypes, [
      ObjectiveType.DOMAIN,
      ObjectiveType.COMPANY,
      ObjectiveType.PERSON,
      ObjectiveType.IP,
    ]);
  });

  it('enforces the 30s timeout and 1 request / second defaults', async () => {
    assert.equal(DEFAULT_TIMEOUT_MS, 30_000);
    assert.equal(DEFAULT_RATE_LIMIT_MS, 1_000);
    assert.equal(DEFAULT_MAX_RESULTS, 20);

    const connector = new WebSearchConnector();
    await connector.configure();
    const health = await connector.health();
    assert.equal(health.status, 'healthy');
  });

  it('collects one web search observation per parsed result', async () => {
    const http = new FakeSearchHttp(async () => okPage(2));
    const connector = new WebSearchConnector({ http });
    await connector.configure();

    const observations = await collectAll(connector, 'red cross');
    assert.equal(observations.length, 2);

    const first = observations[0];
    assert.equal(first.type, 'WEB_SEARCH');
    assert.equal(first.confidence, 1);
    assert.equal(first.source_ref.connector_name, 'web-search');
    assert.equal(first.source_ref.query, 'red cross');
    assert.equal(first.data.url, 'https://result0.example/p0');
    assert.equal(first.data.title, 'Result 0');
    assert.equal(first.data.snippet, 'Snippet 0');
    assert.equal(first.data.position, 1);
    assert.equal(observations[1].data.position, 2);
    assert.ok(first.timestamp);
  });

  it('URL-encodes the query on the DuckDuckGo HTML endpoint', async () => {
    const http = new FakeSearchHttp(async () => okPage(0));
    const connector = new WebSearchConnector({ http });
    await connector.configure();

    await collectAll(connector, 'acme corp & co');
    assert.equal(http.requests.length, 1);
    const url = new URL(http.requests[0].url);
    assert.equal(url.origin, 'https://html.duckduckgo.com');
    assert.equal(url.pathname, '/html/');
    assert.equal(url.searchParams.get('q'), 'acme corp & co');
  });

  it('requires a non-empty query', async () => {
    const connector = new WebSearchConnector();
    await connector.configure();
    await assert.rejects(collectAll(connector, '   '), (error) => {
      assert.ok(error instanceof ConnectorError);
      assert.equal(error.code, 'COLLECTION_FAILED');
      return true;
    });
  });

  it('throws NOT_CONFIGURED when collect is called before configure', async () => {
    const connector = new WebSearchConnector();
    await assert.rejects(collectAll(connector, 'test'), (error) => {
      assert.ok(error instanceof ConnectorError);
      assert.equal(error.code, 'NOT_CONFIGURED');
      return true;
    });
  });

  it('yields nothing and reports degraded health on a CAPTCHA challenge', async () => {
    const http = new FakeSearchHttp(async () => ({ status: 200, body: challengePage }));
    const connector = new WebSearchConnector({ http });
    await connector.configure();

    const observations = await collectAll(connector, 'test');
    assert.equal(observations.length, 0);
    const health = await connector.health();
    assert.equal(health.status, 'degraded');
  });

  it('yields nothing when the endpoint responds with 403', async () => {
    const http = new FakeSearchHttp(async () => ({ status: 403, body: '<html>forbidden</html>' }));
    const connector = new WebSearchConnector({ http });
    await connector.configure();

    const observations = await collectAll(connector, 'test');
    assert.equal(observations.length, 0);
  });

  it('respects the configured max results', async () => {
    const http = new FakeSearchHttp(async () => okPage(5));
    const connector = new WebSearchConnector({ http, maxResults: 2 });
    await connector.configure();

    const observations = await collectAll(connector, 'test');
    assert.equal(observations.length, 2);
    assert.equal(observations[1].data.title, 'Result 1');
  });

  it('wraps transport failures as connector errors and degrades health', async () => {
    const http = new FakeSearchHttp(async () => {
      throw new Error('ECONNREFUSED');
    });
    const connector = new WebSearchConnector({ http });
    await connector.configure({ maxRetries: 0 });

    await assert.rejects(collectAll(connector, 'test'), (error) => {
      assert.ok(error instanceof ConnectorError);
      return true;
    });
    const health = await connector.health();
    assert.equal(health.status, 'degraded');
  });

  it('spaces consecutive requests at least one second apart by default', async () => {
    const http = new FakeSearchHttp(async () => okPage(0));
    const connector = new WebSearchConnector({ http });
    await connector.configure();

    const start = Date.now();
    const results: number[] = [];
    for (let i = 0; i < 3; i += 1) {
      await collectAll(connector, `probe ${i}`);
      results.push(Date.now());
    }
    const elapsed = results[results.length - 1] - start;
    assert.ok(elapsed >= 2_000, `expected >= 2000ms for three requests, got ${elapsed}ms`);
  });

  it('honors a custom rate limit interval', async () => {
    const http = new FakeSearchHttp(async () => okPage(0));
    const custom = new WebSearchConnector({ http });
    await custom.configure({ rateLimit: { requestsPerInterval: 1, intervalMs: 30 } });

    const start = Date.now();
    const results: number[] = [];
    for (let i = 0; i < 3; i += 1) {
      await collectAll(custom, `probe ${i}`);
      results.push(Date.now());
    }
    const elapsed = results[results.length - 1] - start;
    assert.ok(elapsed >= 60, `expected >= 60ms for three requests, got ${elapsed}ms`);
  });
});
