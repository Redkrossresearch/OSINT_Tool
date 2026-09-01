/**
 * Lightweight HTML extraction for the Web Fetch connector.
 *
 * Uses a small regex-based parser (no external dependency) that extracts the
 * things OSINT collection needs: the page title, metadata tags, human-readable
 * text, and links. Links are resolved against the page URL.
 */

export interface ParsedPage {
  title: string;
  /** name/property -> content for <meta> tags. */
  meta: Record<string, string>;
  /** Markup-free, whitespace-collapsed text content. */
  text: string;
  /** Absolute URLs found in href attributes. */
  links: string[];
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

function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}

function attributeValue(attrs: string, name: string): string | undefined {
  const match = attrs.match(new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  if (match === null) return undefined;
  return (match[1] ?? match[2] ?? match[3] ?? '').trim();
}

/** Strip <script> and <style> blocks, then strip remaining tags. */
function extractText(html: string): string {
  const withoutScripts = html
    .replace(/<script[\s>][\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s>][\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const text = withoutScripts
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return decodeHtmlEntities(text);
}

export function parseHtml(html: string, baseUrl: string): ParsedPage {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch === null ? '' : normalizeWhitespace(decodeHtmlEntities(titleMatch[1]));

  const meta: Record<string, string> = {};
  for (const tag of html.matchAll(/<meta\b([^>]*)>/gi)) {
    const attrs = tag[1];
    const name =
      attributeValue(attrs, 'name') ??
      attributeValue(attrs, 'property') ??
      attributeValue(attrs, 'http-equiv');
    const content = attributeValue(attrs, 'content');
    if (name !== undefined && name !== '' && content !== undefined) {
      meta[name.toLowerCase()] = decodeHtmlEntities(content);
    }
  }

  const base = new URL(baseUrl);
  const links: string[] = [];
  const seen = new Set<string>();
  for (const anchor of html.matchAll(
    /<a\b[^>]*?href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi,
  )) {
    const raw = anchor[1] ?? anchor[2] ?? anchor[3];
    if (raw === undefined || raw === '') continue;
    try {
      const absolute = new URL(raw, base).href;
      if (seen.has(absolute)) continue;
      seen.add(absolute);
      links.push(absolute);
    } catch {
      // Ignore malformed link targets.
    }
  }

  return {
    title,
    meta,
    text: extractText(html),
    links,
  };
}
