import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isAllowedByRules, isRobotsAllowed, parseRobotsTxt } from '../robots.js';

describe('parseRobotsTxt', () => {
  it('extracts star-group disallow rules', () => {
    const result = parseRobotsTxt(`User-agent: *
Disallow: /private/
Allow: /private/public`);
    assert.deepEqual(result.rules, [
      { pattern: '/private/', allowed: false },
      { pattern: '/private/public', allowed: true },
    ]);
  });

  it('ignores rules from specific-agent groups', () => {
    const result = parseRobotsTxt(`User-agent: Googlebot
Disallow: /for-google/
User-agent: *
Disallow: /private/`);
    assert.deepEqual(result.rules, [{ pattern: '/private/', allowed: false }]);
  });

  it('strips comments and blank lines', () => {
    const result = parseRobotsTxt(`# comment
User-agent: * # inline

Disallow: /x/ # trailing`);
    assert.deepEqual(result.rules, [{ pattern: '/x/', allowed: false }]);
  });

  it('returns an empty rule set for empty documents', () => {
    assert.deepEqual(parseRobotsTxt('').rules, []);
    assert.deepEqual(parseRobotsTxt('# nothing here').rules, []);
  });
});

describe('isAllowedByRules', () => {
  it('allows everything when there are no rules', () => {
    assert.equal(isAllowedByRules([], '/anything'), true);
  });

  it('applies longest-match semantics per RFC 9309', () => {
    const rules = [
      { pattern: '/', allowed: false },
      { pattern: '/admin', allowed: true },
    ];
    assert.equal(isAllowedByRules(rules, '/users'), false);
    assert.equal(isAllowedByRules(rules, '/admin'), true);
    assert.equal(isAllowedByRules(rules, '/admin/users'), true);
  });

  it('supports wildcard patterns', () => {
    const rules = [{ pattern: '/private/*', allowed: false }];
    assert.equal(isAllowedByRules(rules, '/private/secret'), false);
    assert.equal(isAllowedByRules(rules, '/public'), true);
  });

  it('supports $ end anchors', () => {
    const rules = [{ pattern: '/exact$', allowed: false }];
    assert.equal(isAllowedByRules(rules, '/exact'), false);
    assert.equal(isAllowedByRules(rules, '/exact/child'), true);
  });
});

describe('isRobotsAllowed', () => {
  it('allows a path not covered by disallow', () => {
    const robots = `User-agent: *
Disallow: /admin`;
    assert.equal(isRobotsAllowed(robots, '/about'), true);
    assert.equal(isRobotsAllowed(robots, '/admin'), false);
  });

  it('allows everything when Disallow is empty', () => {
    const robots = `User-agent: *\nDisallow:`;
    assert.equal(isRobotsAllowed(robots, '/anything'), true);
  });
});
