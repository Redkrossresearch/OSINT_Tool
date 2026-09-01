import http from 'node:http';
import https from 'node:https';
import { RequestOptions } from 'node:http';
import zlib from 'node:zlib';

import { SsrfError, parseTargetUrl, resolvePublicTarget } from './ssrf.js';

export interface FetchResponse {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
  /** The URL after following redirects. */
  finalUrl: string;
}

export interface HttpFetch {
  get(url: string, options: FetchOptions): Promise<FetchResponse>;
}

export interface FetchOptions {
  timeoutMs: number;
  maxBodyBytes: number;
  maxRedirects?: number;
}

export const DEFAULT_MAX_REDIRECTS = 5;

/**
 * Pure redirect resolution used for every redirect hop. Returns the next URL
 * to follow, or `undefined` when the response is not a redirect.
 *
 * Security: redirects to non-http(s) schemes are rejected, relative redirects
 * are resolved against the current URL, and the hop budget is enforced. The
 * caller is responsible for re-resolving and re-validating the returned URL.
 */
export function redirectHop(
  currentUrl: string,
  status: number,
  location: string | string[] | undefined,
  maxRedirects: number,
  hops: number,
): string | undefined {
  const isRedirect = status >= 300 && status < 400;
  if (!isRedirect || location === undefined) return undefined;
  if (hops >= maxRedirects) {
    throw new SsrfError(
      'TOO_MANY_REDIRECTS',
      `refusing to follow more than ${maxRedirects} redirects`,
    );
  }
  const nextUrl = new URL(Array.isArray(location) ? location[0] : location, currentUrl);
  if (nextUrl.protocol !== 'http:' && nextUrl.protocol !== 'https:') {
    throw new SsrfError(
      'BLOCKED_SCHEME',
      `redirect to non-http(s) scheme '${nextUrl.protocol}' is not allowed`,
    );
  }
  return nextUrl.href;
}

/**
 * A minimal yet SSRF-safe HTTP(S) client used by the web connector.
 *
 * Security properties:
 *  - every hop (initial URL and each redirect destination) is resolved and
 *    validated as public before a socket is opened,
 *  - the connection is pinned to the validated address via a custom `lookup`,
 *    so the socket layer cannot be redirected to a different (internal) host
 *    after validation (DNS-rebinding defence),
 *  - an explicit `Host` header preserves the original hostname behind the pin,
 *  - response bodies are capped to prevent unbounded memory use.
 */
export class NodeHttpFetch implements HttpFetch {
  public async get(url: string, options: FetchOptions): Promise<FetchResponse> {
    const { timeoutMs, maxBodyBytes, maxRedirects = DEFAULT_MAX_REDIRECTS } = options;
    return this.fetchWithRedirects(url, { timeoutMs, maxBodyBytes, maxRedirects, hops: 0 });
  }

  private async fetchWithRedirects(
    urlString: string,
    ctx: { timeoutMs: number; maxBodyBytes: number; maxRedirects: number; hops: number },
  ): Promise<FetchResponse> {
    const target = await resolvePublicTarget(parseTargetUrl(urlString));
    const response = await this.requestOnce(target.url, target.ip, ctx.timeoutMs, ctx.maxBodyBytes);

    const nextUrl = redirectHop(
      urlString,
      response.status,
      response.headers.location,
      ctx.maxRedirects,
      ctx.hops,
    );
    if (nextUrl !== undefined) {
      // The next hop is re-resolved and re-validated by resolvePublicTarget,
      // which blocks any redirect to an internal/private destination.
      return this.fetchWithRedirects(nextUrl, { ...ctx, hops: ctx.hops + 1 });
    }

    return {
      status: response.status,
      headers: response.headers,
      body: response.body,
      finalUrl: urlString,
    };
  }

  private requestOnce(
    url: URL,
    pinnedIp: string,
    timeoutMs: number,
    maxBodyBytes: number,
  ): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }> {
    return new Promise((resolve, reject) => {
      const isHttps = url.protocol === 'https:';
      const port = url.port === '' ? (isHttps ? 443 : 80) : Number(url.port);

      const request: RequestOptions = {
        protocol: url.protocol,
        hostname: pinnedIp,
        port,
        path: `${url.pathname}${url.search}`,
        method: 'GET',
        headers: {
          Host: url.host,
          'User-Agent': 'RedKrossOSINT/0.1 (public web connector)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate',
          Connection: 'close',
        },
        // Pin the connection to the validated address so the OS resolver cannot
        // return a different IP after our validation (DNS-rebinding defence).
        lookup: (_hostname, _options, callback) => {
          callback(null, pinnedIp, isHttps ? 6 : 4);
        },
      };

      const req = (isHttps ? https : http).request(request, (res) => {
        const chunks: Buffer[] = [];
        let size = 0;
        let aborted = false;

        const stream = decodeStream(res, res.headers['content-encoding']);

        stream.on('data', (chunk: Buffer) => {
          size += chunk.length;
          if (size > maxBodyBytes) {
            aborted = true;
            req.destroy(
              new SsrfError('BODY_TOO_LARGE', `response body exceeds ${maxBodyBytes} bytes`),
            );
            return;
          }
          chunks.push(chunk);
        });
        stream.on('error', (error: Error) => {
          if (aborted) return;
          aborted = true;
          reject(error);
        });
        stream.on('end', () => {
          if (aborted) return;
          resolve({
            status: res.statusCode ?? 0,
            headers: res.headers,
            body: Buffer.concat(chunks).toString('utf8'),
          });
        });
      });

      req.setTimeout(timeoutMs, () => {
        req.destroy(new Error(`request timed out after ${timeoutMs}ms`));
      });
      req.on('error', (error: Error) => {
        reject(error);
      });
      req.end();
    });
  }
}

function decodeStream(
  res: http.IncomingMessage,
  encoding: string | string[] | undefined,
): NodeJS.ReadableStream {
  const value = String(encoding).toLowerCase();
  if (value.includes('gzip')) return res.pipe(zlib.createGunzip());
  if (value.includes('deflate')) return res.pipe(zlib.createInflate());
  return res;
}
