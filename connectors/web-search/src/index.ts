import { randomUUID } from 'node:crypto';

import { BaseConnector, ConnectorError } from '@osint-tool/connectors-service';
import { ObjectiveType } from '@osint-tool/schemas';
import type { Observation } from '@osint-tool/schemas';
import type { CollectorInput, ConnectorConfigInput } from '@osint-tool/connectors-service';

import { NodeSearchHttp, type SearchHttp } from './http.js';
import { isBlockedResponse, parseSearchResults, type SearchResult } from './search.js';

export { SEARCH_USER_AGENT } from './http.js';

export const DEFAULT_RATE_LIMIT_MS = 1_000; // 1 request / second per T2-006.
export const DEFAULT_TIMEOUT_MS = 30_000;
export const DEFAULT_MAX_RESULTS = 20;
export const SEARCH_ENDPOINT = 'https://html.duckduckgo.com/html/';
export const SEARCH_MAX_BODY_BYTES = 2 * 1024 * 1024;

export interface WebSearchObservationData extends Record<string, unknown> {
  query: string;
  position: number;
  url: string;
  title: string;
  snippet: string;
}

export interface WebSearchConnectorOptions {
  http: SearchHttp;
  maxResults?: number;
}

export class WebSearchConnector extends BaseConnector {
  public readonly name = 'web-search';
  public readonly version = '0.1.0';
  public readonly supportedObjectiveTypes = [
    ObjectiveType.DOMAIN,
    ObjectiveType.COMPANY,
    ObjectiveType.PERSON,
    ObjectiveType.IP,
  ];

  private readonly http: SearchHttp;
  private readonly maxResults: number;

  public constructor(options: Partial<WebSearchConnectorOptions> = {}) {
    super({
      name: 'web-search',
      version: '0.1.0',
      supportedObjectiveTypes: [
        ObjectiveType.DOMAIN,
        ObjectiveType.COMPANY,
        ObjectiveType.PERSON,
        ObjectiveType.IP,
      ],
    });
    this.http = options.http ?? new NodeSearchHttp();
    this.maxResults = options.maxResults ?? DEFAULT_MAX_RESULTS;
  }

  public override async configure(config: ConnectorConfigInput = {}): Promise<void> {
    await super.configure({
      timeoutMs: config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      maxRetries: config.maxRetries,
      rateLimit: config.rateLimit ?? { requestsPerInterval: 1, intervalMs: DEFAULT_RATE_LIMIT_MS },
      options: config.options,
    });
  }

  protected async *fetchObservations(input: CollectorInput): AsyncGenerator<Observation> {
    if (this.config === undefined) {
      throw new ConnectorError('NOT_CONFIGURED', `${this.name} has not been configured`);
    }

    const query = typeof input.query === 'string' ? input.query.trim() : '';
    if (query === '') {
      throw new ConnectorError('COLLECTION_FAILED', 'web-search requires a non-empty query string');
    }

    const { timeoutMs } = this.config;
    const endpoint = this.buildEndpoint(query);
    const response = await this.request(() =>
      this.http.get(endpoint.href, {
        timeoutMs,
        maxBodyBytes: SEARCH_MAX_BODY_BYTES,
      }),
    );

    if (isBlockedResponse(response.status, response.body)) {
      this.lastHealth = {
        status: 'degraded',
        lastCheck: new Date(),
        error: 'duckduckgo returned a CAPTCHA or challenge page; treating as blocked',
      };
      return;
    }

    const results = parseSearchResults(response.body, this.maxResults);
    for (const [index, result] of results.entries()) {
      yield this.toObservation(input, query, index + 1, result);
    }
  }

  private buildEndpoint(query: string): URL {
    const url = new URL(SEARCH_ENDPOINT);
    url.searchParams.set('q', query);
    return url;
  }

  private toObservation(
    input: CollectorInput,
    query: string,
    position: number,
    result: SearchResult,
  ): Observation {
    const now = new Date();
    const data: WebSearchObservationData = {
      query,
      position,
      url: result.url,
      title: result.title,
      snippet: result.snippet,
    };
    return {
      id: randomUUID(),
      evidence_id: randomUUID(),
      type: 'WEB_SEARCH',
      data,
      confidence: 1,
      source_ref: {
        connector_name: this.name,
        query: typeof input.query === 'string' ? input.query : '',
        timestamp: now,
        parameters: {},
      },
      timestamp: now,
    };
  }
}
