import { randomUUID } from 'node:crypto';

import { BaseConnector, ConnectorError } from '@osint-tool/connectors-service';
import { ObjectiveType } from '@osint-tool/schemas';
import type { Observation } from '@osint-tool/schemas';
import type { CollectorInput, ConnectorConfigInput } from '@osint-tool/connectors-service';

import { NodeHttpFetch, type HttpFetch } from './http.js';
import { parseHtml } from './html.js';
import { isAllowedByRules, parseRobotsTxt, type RobotRule } from './robots.js';
import { SsrfError, validatePublicUrl } from './ssrf.js';

export const WEB_FETCH_USER_AGENT = 'RedKrossOSINT/0.1 (public web connector; OSINT research)';

/** Task-mandated default: one request every two seconds. */
export const DEFAULT_RATE_LIMIT_MS = 2_000;
/** Task-mandated default: request timeout of 30 seconds. */
export const DEFAULT_TIMEOUT_MS = 30_000;

export interface WebFetchOptions {
  /** Inject a custom HTTP transport (used by tests). */
  httpFetch?: HttpFetch;
  /** Maximum response body size in bytes. */
  maxBodyBytes?: number;
  /** Maximum number of redirects to follow. */
  maxRedirects?: number;
}

export interface WebFetchObservationData extends Record<string, unknown> {
  url: string;
  final_url: string;
  status: number;
  title: string;
  meta: Record<string, string>;
  text: string;
  links: string[];
  fetched_at: string;
}

/**
 * Public Web Fetch connector (T2-005).
 *
 * Fetches public HTTP(S) pages and normalizes title / metadata / text / links
 * into an {@link Observation}. SSRF protection is applied on the initial URL
 * and again on every redirect hop; `robots.txt` is consulted (and cached per
 * origin) before a page is fetched; requests are rate-limited to one per two
 * seconds and bounded by a 30s timeout enforced by the base connector.
 */
export class WebFetchConnector extends BaseConnector {
  public static readonly NAME = 'web-fetch';
  public static readonly VERSION = '0.1.0';

  private readonly httpFetch: HttpFetch;
  private readonly maxBodyBytes: number;
  private readonly maxRedirects: number;
  private readonly robotsCache = new Map<string, RobotRule[]>();

  public constructor(options: WebFetchOptions = {}) {
    super({
      name: WebFetchConnector.NAME,
      version: WebFetchConnector.VERSION,
      supportedObjectiveTypes: [
        ObjectiveType.DOMAIN,
        ObjectiveType.COMPANY,
        ObjectiveType.PERSON,
        ObjectiveType.IP,
      ],
    });
    this.httpFetch = options.httpFetch ?? new NodeHttpFetch();
    this.maxBodyBytes = options.maxBodyBytes ?? 5 * 1024 * 1024;
    this.maxRedirects = options.maxRedirects ?? 5;
  }

  /**
   * Enforce the task-mandated security defaults (30s timeout, 1 request every
   * 2 seconds) while allowing an operator to override them explicitly.
   */
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
    const { timeoutMs } = this.config;
    const url = await this.resolveTargetUrl(input.query);

    const robotRules = await this.getRobotRules(url);
    const path = `${url.pathname}${url.search}`;
    if (!isAllowedByRules(robotRules, path)) {
      this.lastHealth = { status: 'healthy', lastCheck: new Date() };
      return;
    }

    const response = await this.request(() =>
      this.httpFetch.get(url.href, {
        timeoutMs,
        maxBodyBytes: this.maxBodyBytes,
        maxRedirects: this.maxRedirects,
      }),
    );

    const page = parseHtml(response.body, response.finalUrl);

    const data: WebFetchObservationData = {
      url: url.href,
      final_url: response.finalUrl,
      status: response.status,
      title: page.title,
      meta: page.meta,
      text: page.text,
      links: page.links,
      fetched_at: new Date().toISOString(),
    };

    yield this.toObservation(input, data);
  }

  /** Validate the query as a public http(s) URL. */
  private async resolveTargetUrl(query: string): Promise<URL> {
    if (query === '') {
      throw new ConnectorError('COLLECTION_FAILED', 'web-fetch requires a URL in the query');
    }
    try {
      const target = await validatePublicUrl(query);
      return target.url;
    } catch (error) {
      if (error instanceof SsrfError) {
        throw new ConnectorError('COLLECTION_FAILED', error.message, error);
      }
      throw error;
    }
  }

  private originKey(url: URL): string {
    return `${url.protocol}//${url.host}`;
  }

  private async getRobotRules(url: URL): Promise<RobotRule[]> {
    const origin = this.originKey(url);
    const cached = this.robotsCache.get(origin);
    if (cached !== undefined) return cached;

    const robotsUrl = new URL('/robots.txt', url);
    let rules: RobotRule[] = [];
    try {
      const target = await validatePublicUrl(robotsUrl.href);
      const timeoutMs = this.config?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      const response = await this.request(() =>
        this.httpFetch.get(target.url.href, {
          timeoutMs,
          maxBodyBytes: this.maxBodyBytes,
          maxRedirects: this.maxRedirects,
        }),
      );
      if (response.status === 200) {
        rules = parseRobotsTxt(response.body).rules;
      }
    } catch {
      // Fail open: if robots.txt cannot be retrieved, treat as no restrictions.
      rules = [];
    }
    this.robotsCache.set(origin, rules);
    return rules;
  }

  private toObservation(input: CollectorInput, data: WebFetchObservationData): Observation {
    const timestamp = new Date();
    return {
      id: randomUUID(),
      evidence_id: randomUUID(),
      type: 'WEB_PAGE',
      data,
      confidence: 1,
      source_ref: {
        connector_name: this.name,
        query: input.query,
        timestamp,
        parameters: { target: data.final_url },
      },
      timestamp,
    };
  }
}
