/**
 * robots.txt parsing and enforcement for the Web Fetch connector.
 *
 * Group semantics follow RFC 9309: a robots.txt file is a sequence of groups,
 * each started by one or more `User-agent` lines, whose `Allow` / `Disallow`
 * rules apply to those agents. This module only applies rules from the
 * `User-agent: *` group, which represents "any crawler" and is the only group
 * our generic connector identity is entitled to use. Rules are matched by the
 * longest matching path prefix per RFC 9309.
 */

export interface RobotRule {
  /** Raw path pattern (may contain `*` and a trailing `$`). */
  pattern: string;
  /** `true` for Allow, `false` for Disallow. */
  allowed: boolean;
}

export interface RobotsParseResult {
  /** Rules from the `User-agent: *` group, in document order. */
  rules: RobotRule[];
  /** crawl-delay if a positive number was provided, undefined otherwise. */
  crawlDelay: number | undefined;
}

export function parseRobotsTxt(document: string): RobotsParseResult {
  const rules: RobotRule[] = [];
  let crawlDelay: number | undefined;
  let inStarGroup = false;

  for (const rawLine of document.split(/\r?\n/)) {
    const commentIndex = rawLine.indexOf('#');
    const line = (commentIndex === -1 ? rawLine : rawLine.slice(0, commentIndex)).trim();
    if (line === '') continue;

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const field = line.slice(0, colonIndex).trim().toLowerCase();
    const value = line.slice(colonIndex + 1).trim();

    if (field === 'user-agent') {
      const agents = value.toLowerCase().split(/\s+/).filter(Boolean);
      inStarGroup = agents.includes('*');
      continue;
    }

    // Only rules within the `User-agent: *` group are applied.
    if (!inStarGroup) continue;

    if (field === 'allow' || field === 'disallow') {
      // An empty Allow/Disallow carries no restriction (RFC 9309: it is
      // equivalent to having no rule for that field).
      if (value !== '') {
        rules.push({ pattern: value, allowed: field === 'allow' });
      }
      continue;
    }

    if (field === 'crawl-delay') {
      const parsed = Number(value);
      if (!Number.isNaN(parsed) && parsed > 0) {
        crawlDelay = parsed;
      }
    }
  }

  return { rules, crawlDelay };
}

function patternToRegExp(pattern: string): RegExp {
  const anchored = pattern.endsWith('$');
  const body = anchored ? pattern.slice(0, -1) : pattern;
  let regexp = '';
  for (const char of body) {
    if (char === '*') {
      regexp += '.*';
    } else {
      regexp += char.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${regexp}${anchored ? '$' : ''}`);
}

/**
 * Evaluate a list of rules against a path using RFC 9309 longest-match
 * semantics. Returns `true` when the request is permitted.
 */
export function isAllowedByRules(rules: RobotRule[], path: string): boolean {
  if (rules.length === 0) return true;

  let longestMatch: RobotRule | undefined;

  for (const rule of rules) {
    // Empty pattern is a prefix of every path.
    const regExp = patternToRegExp(rule.pattern);
    if (!regExp.test(path)) continue;
    if (longestMatch === undefined || rule.pattern.length >= longestMatch.pattern.length) {
      longestMatch = rule;
    }
  }

  return longestMatch === undefined ? true : longestMatch.allowed;
}

/** Convenience: parse and evaluate in one step. */
export function isRobotsAllowed(document: string, path: string): boolean {
  return isAllowedByRules(parseRobotsTxt(document).rules, path);
}
