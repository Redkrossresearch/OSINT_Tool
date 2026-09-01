/**
 * DuckDuckGo HTML search result parsing for the Web Search connector.
 *
 * The DuckDuckGo HTML endpoint (`https://html.duckduckgo.com/html/`) returns
 * results as raw HTML. Result links are wrapped in a DuckDuckGo redirect URL
 * (`//duckduckgo.com/l/?uddg=<encoded>`); this module decodes the real target
 * and extracts title and snippet text. It also detects anodyne "please verify
 * you are human" / CAPTCHA challenge pages so the connector can back off
 * gracefully instead of pretending the challenge is a result set.
 */

export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_match, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)));
}

/** Strip tags from a fragment and collapse whitespace. */
function stripTags(fragment: string): string {
  return decodeHtmlEntities(
    fragment
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

/**
 * DuckDuckGo wraps result links in a redirect URL. Extract the real http(s)
 * destination, returning the raw href when it is not a DDG redirect wrapper.
 */
export function extractResultUrl(href: string): string | undefined {
  if (href === '') return undefined;
  const normalized = href.startsWith('//') ? `https:${href}` : href;

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    return undefined;
  }

  const isDdgRedirect = url.hostname.endsWith('duckduckgo.com') && url.pathname.startsWith('/l/');

  if (isDdgRedirect) {
    const uddg = url.searchParams.get('uddg');
    if (uddg !== null && uddg !== '') {
      try {
        const target = new URL(uddg);
        if (target.protocol === 'http:' || target.protocol === 'https:') {
          return target.href;
        }
      } catch {
        // Fall through to the raw href below.
      }
    }
  }

  if (url.protocol === 'http:' || url.protocol === 'https:') {
    return url.href;
  }
  return undefined;
}

/**
 * Parse search-result HTML into structured results. Results are matched by
 * pairing `result__a` anchors (title) with `result__snippet` anchors in order.
 */
export function parseSearchResults(html: string, limit = 20): SearchResult[] {
  const titleMatches = Array.from(
    html.matchAll(
      /<a\b[^>]*class=["'][^"']*result__a[^"']*["'][^>]*\bhref=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    ),
  );
  const snippetMatches = Array.from(
    html.matchAll(/<a\b[^>]*class=["'][^"']*result__snippet[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi),
  );

  const results: SearchResult[] = [];
  for (const [index, match] of titleMatches.entries()) {
    if (results.length >= limit) break;

    const href = match[1] ?? '';
    const url = extractResultUrl(href);
    if (url === undefined) continue;

    const title = stripTags(match[2] ?? '');
    if (title === '') continue;

    const snippet = index < snippetMatches.length ? stripTags(snippetMatches[index][1] ?? '') : '';

    results.push({ url, title, snippet });
  }
  return results;
}

const BLOCK_MARKERS = [
  'anomaly',
  'captcha',
  'challenge',
  'verify you are human',
  'unusual traffic',
  'h2487',
];

/**
 * Detect whether an HTTP response is a CAPTCHA / anti-bot challenge rather
 * than a genuine result page. Markers are matched on the visible text.
 */
export function isBlockedResponse(status: number, body: string): boolean {
  if (status === 202 || (status >= 400 && status < 500)) return true;
  if (status < 200 || status >= 300) return false;
  const lower = body.toLowerCase();
  return BLOCK_MARKERS.some((marker) => lower.includes(marker));
}

/** Returns the `result__snippet` count used to sanity-check parsing. */
export function countSnippets(html: string): number {
  return Array.from(html.matchAll(/class=["'][^"']*result__snippet/gi)).length;
}
