import { isIP } from 'node:net';
import { DomainEntitySchema, EntitySchema, type Entity } from '@osint-tool/entities';
import type { Observation } from '../../../../packages/schemas/src/observation.js';

const FIELDS = ['title', 'text', 'content', 'description', 'url'] as const;
const CONFIDENCE = { email: 0.98, url: 0.98, domain: 0.95, ip: 0.98, person: 0.7 } as const;

interface Match {
  start: number;
  end: number;
  entities: Entity[];
}

function entity(type: keyof typeof CONFIDENCE, attributes: Entity['attributes']): Entity[] {
  const result = EntitySchema.safeParse({ type, attributes, confidence: CONFIDENCE[type] });
  return result.success ? [result.data] : [];
}

// Remove sentence punctuation, but never repair repeated dots in malformed input.
function sentenceEnd(value: string): string {
  return value.endsWith('.') && !value.endsWith('..') ? value.slice(0, -1) : value;
}

function isolateUrl(value: string): string {
  let parentheses = 0;
  let brackets = 0;
  for (const character of value) {
    if (character === '(') parentheses++;
    if (character === ')') parentheses--;
    if (character === '[') brackets++;
    if (character === ']') brackets--;
  }
  let end = value.length;
  while (end > 0) {
    const last = value[end - 1];
    if (last === ')' && parentheses < 0) parentheses++;
    else if (last === ']' && brackets < 0) brackets++;
    else if (!/[,;!?]/.test(last) && !(last === '.' && value[end - 2] !== '.')) break;
    end--;
  }
  return value.slice(0, end);
}

function urlEntities(candidate: string): Entity[] {
  try {
    // Require the literal authority: URL parsing alone repairs slashes and numeric hosts.
    const authority = /^https?:\/\/([^/?#]+)/i.exec(candidate)?.[1];
    if (!authority || authority.includes('@') || authority.includes('\\')) return [];
    const parsed = new URL(candidate);
    const hostMatch = /^(\[[^\]]+\]|[^:]+)(?::[0-9]+)?$/.exec(authority);
    if (!hostMatch) return [];
    const rawHost = hostMatch[1];
    const address = rawHost.startsWith('[') ? rawHost.slice(1, -1) : rawHost;
    const ipVersion = isIP(address);
    const domain = DomainEntitySchema.safeParse({
      type: 'domain',
      confidence: CONFIDENCE.domain,
      attributes: { domain: rawHost },
    });
    if (!ipVersion && !domain.success) return [];
    // Numeric IPv4 alternatives must not be silently repaired into another address.
    if (ipVersion === 4 && parsed.hostname !== address) return [];
    const result = entity('url', { url: candidate });
    if (!result.length) return [];
    if (ipVersion) result.push(...entity('ip', { address }));
    else result.push(...entity('domain', { domain: parsed.hostname }));
    return result;
  } catch {
    return [];
  }
}

function extractText(text: string): Entity[] {
  const matches: Match[] = [];
  // Broad URL candidates reserve their entire span, even when invalid. This prevents
  // rescuing an email/IP substring from a malformed URL. Parsing validates authority.
  for (const match of text.matchAll(/https?:\/\/[^\s<>"“”‘’{}]*/gi)) {
    const start = match.index;
    const preceding = text[start - 1];
    const validBoundary = preceding === undefined || /[\s(<[{'"“‘]/u.test(preceding);
    matches.push({
      start,
      end: start + match[0].length,
      entities: validBoundary ? urlEntities(isolateUrl(match[0])) : [],
    });
  }

  // URL spans are ordered and disjoint. Advance a cursor instead of repeatedly
  // searching all prior entities when scanning long observations.
  const urlSpans = matches.slice();
  let urlIndex = 0;
  const overlapsUrl = (start: number, end: number): boolean => {
    while (urlIndex < urlSpans.length && urlSpans[urlIndex].end <= start) urlIndex++;
    return urlIndex < urlSpans.length && urlSpans[urlIndex].start < end;
  };

  // Whole tokens, rather than permissive substring regexes, keep malformed addresses
  // intact for rejection. Runtime IP validation handles IPv6 without a giant regex.
  for (const match of text.matchAll(/[^\s<>"“”‘’()[\]{},;!?]+/gu)) {
    const start = match.index;
    const end = start + match[0].length;
    if (overlapsUrl(start, end)) continue;
    const candidate = sentenceEnd(match[0]);
    let entities: Entity[] = [];
    if (candidate.includes('@')) entities = entity('email', { address: candidate });
    else if (isIP(candidate)) entities = entity('ip', { address: candidate });
    if (entities.length) matches.push({ start, end, entities });
  }

  // Explicit line/semicolon labels only; validate the entire value, never truncate
  // five tokens into four. Unicode case categories allow accented name tokens.
  const nameToken = String.raw`\p{Lu}(?:[\p{Ll}\p{M}]+|(?=['’\-]))(?:['’\-]\p{Lu}?[\p{Ll}\p{M}]+)*`;
  const namePattern = new RegExp(`^${nameToken}(?:[ \\t]+${nameToken}){1,3}$`, 'u');
  urlIndex = 0;
  for (const match of text.matchAll(/(?:^|[\n;])[ \t]*Name:[ \t]*([^\n;]+)/g)) {
    const name = sentenceEnd(match[1].trim());
    if (!namePattern.test(name)) continue;
    const start = match.index;
    const end = start + match[0].length;
    if (overlapsUrl(start, end)) continue;
    matches.push({ start, end, entities: entity('person', { name }) });
  }
  return matches.sort((a, b) => a.start - b.start).flatMap((match) => match.entities);
}

/**
 * Deterministic MVP extraction: scan only string values in title, text, content,
 * description, url order. Within each field use textual order, URL before its host.
 * Domains come only from validated URLs; IP URL hosts emit IPs instead of domains.
 * No standalone/email domains, nested scanning, normalization, or network requests.
 * Emails/URLs/IPs score .98, URL domains .95, explicit Name: people .70; these are
 * rule strengths, not calibrated probabilities or inherited observation confidence.
 * Every result passes T3-001. Suppress exact type/attribute duplicates only, keeping
 * the first occurrence. Read input without mutation and return newly parsed objects.
 */
export function extractEntities(observation: Observation): Entity[] {
  const seen = new Set<string>();
  const result: Entity[] = [];
  for (const field of FIELDS) {
    const value = observation.data[field];
    if (typeof value !== 'string') continue;
    for (const candidate of extractText(value)) {
      const key = JSON.stringify([candidate.type, candidate.attributes]);
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(candidate);
    }
  }
  return result;
}
