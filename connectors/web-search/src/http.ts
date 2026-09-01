import { request as httpsRequest } from 'node:https';
import { gunzipSync, inflateSync } from 'node:zlib';

export const SEARCH_USER_AGENT = 'RedKrossOSINT/0.1 (public search connector; OSINT research)';

export interface SearchResponse {
  status: number;
  body: string;
}

export interface SearchGetOptions {
  timeoutMs: number;
  maxBodyBytes: number;
}

/** Injectable HTTP transport so the connector can be tested with fakes. */
export interface SearchHttp {
  get(url: string, options: SearchGetOptions): Promise<SearchResponse>;
}

/** Node-based transport for the fixed DuckDuckGo HTML endpoint. */
export class NodeSearchHttp implements SearchHttp {
  async get(url: string, options: SearchGetOptions): Promise<SearchResponse> {
    return new Promise((resolve, reject) => {
      let parsed: URL;
      try {
        parsed = new URL(url);
      } catch (error) {
        reject(error);
        return;
      }
      if (parsed.protocol !== 'https:') {
        reject(new Error(`refusing non-https search endpoint: ${parsed.protocol}`));
        return;
      }

      const req = httpsRequest(parsed, {
        method: 'GET',
        headers: {
          'user-agent': SEARCH_USER_AGENT,
          accept: 'text/html,application/xhtml+xml',
          'accept-encoding': 'gzip, deflate',
        },
        timeout: options.timeoutMs,
      });

      let body = Buffer.alloc(0);
      let encoding: string | undefined;
      let exceeded = false;

      req.on('response', (res) => {
        encoding = String(res.headers['content-encoding'] ?? '').toLowerCase();
        res.on('data', (chunk: Buffer) => {
          if (body.length + chunk.length > options.maxBodyBytes) {
            exceeded = true;
            req.destroy(new Error(`response body exceeds ${options.maxBodyBytes} bytes`));
            return;
          }
          body = Buffer.concat([body, chunk]);
        });
        res.on('end', () => {
          if (exceeded || res.complete === false) return;
          resolve({
            status: res.statusCode ?? 0,
            body: decodeBody(body, encoding ?? ''),
          });
        });
      });

      req.on('timeout', () => {
        req.destroy(new Error(`search request timed out after ${options.timeoutMs}ms`));
      });
      req.on('error', reject);
      req.end();
    });
  }
}

function decodeBody(body: Buffer, encoding: string): string {
  if (encoding === 'gzip') return gunzipSync(body).toString('utf8');
  if (encoding === 'deflate') return inflateSync(body).toString('utf8');
  return body.toString('utf8');
}
