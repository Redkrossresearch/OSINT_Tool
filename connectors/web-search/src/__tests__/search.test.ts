import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  countSnippets,
  extractResultUrl,
  isBlockedResponse,
  parseSearchResults,
} from '../search.js';

describe('extractResultUrl', () => {
  it('decodes a DuckDuckGo redirect wrapper to the real http(s) target', () => {
    const href = '//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fabout&rut=abc123';
    assert.equal(extractResultUrl(href), 'https://example.com/about');
  });

  it('keeps a plain http(s) href', () => {
    assert.equal(extractResultUrl('https://example.com/page'), 'https://example.com/page');
  });

  it('upgrades a scheme-relative href to https', () => {
    assert.equal(extractResultUrl('//example.com/page'), 'https://example.com/page');
  });

  it('rejects non-http(s) targets', () => {
    assert.equal(extractResultUrl('javascript:alert(1)'), undefined);
    assert.equal(extractResultUrl('file:///etc/passwd'), undefined);
  });

  it('rejects an empty href', () => {
    assert.equal(extractResultUrl(''), undefined);
  });
});

describe('parseSearchResults', () => {
  const resultDiv = (href: string, title: string, snippet: string): string => `
    <div class="result results_links results_links_deep web-result">
      <div class="links_main links_deep result__body">
        <h2 class="result__title">
          <a rel="nofollow" class="result__a" href="${href}">${title}</a>
        </h2>
        <a class="result__snippet" href="${href}">${snippet}</a>
      </div>
    </div>`;

  it('parses a single result with a DDG redirect href', () => {
    const html = resultDiv(
      '//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com%2Fabout',
      'Example &amp; Company',
      'We build <b>great</b> things since 2001.',
    );
    const results = parseSearchResults(html);
    assert.equal(results.length, 1);
    assert.deepEqual(results[0], {
      url: 'https://example.com/about',
      title: 'Example & Company',
      snippet: 'We build great things since 2001.',
    });
  });

  it('parses multiple results and preserves order', () => {
    const html =
      resultDiv('https://a.example/1', 'One', 'First snippet') +
      resultDiv('https://b.example/2', 'Two', 'Second snippet') +
      resultDiv('https://c.example/3', 'Three', 'Third snippet');
    const results = parseSearchResults(html);
    assert.equal(results.length, 3);
    assert.deepEqual(
      results.map((r) => r.title),
      ['One', 'Two', 'Three'],
    );
    assert.equal(results[1].snippet, 'Second snippet');
  });

  it('skips results whose target is not http(s)', () => {
    const html =
      resultDiv('javascript:void(0)', 'Bad', '') + resultDiv('https://ok.example', 'Good', 'S');
    const results = parseSearchResults(html);
    assert.equal(results.length, 1);
    assert.equal(results[0].title, 'Good');
  });

  it('honors the result limit', () => {
    const html = Array.from({ length: 5 }, (_, i) =>
      resultDiv(`https://r${i}.example/`, `R${i}`, `S${i}`),
    ).join('');
    assert.equal(parseSearchResults(html, 3).length, 3);
  });

  it('returns an empty array for an empty page', () => {
    assert.deepEqual(parseSearchResults(''), []);
  });

  it('counts snippets for sanity checks', () => {
    const html =
      resultDiv('https://a.example', 'A', 'S') + resultDiv('https://b.example', 'B', 'S');
    assert.equal(countSnippets(html), 2);
  });
});

describe('isBlockedResponse', () => {
  it('treats challenge status codes as blocked', () => {
    assert.equal(isBlockedResponse(202, 'anything'), true);
    assert.equal(isBlockedResponse(403, '<html>no</html>'), true);
    assert.equal(isBlockedResponse(429, '<html>slow down</html>'), true);
  });

  it('treats 5xx responses as unavailable, not blocked', () => {
    assert.equal(isBlockedResponse(500, '<html>oops</html>'), false);
  });

  it('treats 200 pages containing challenge markers as blocked', () => {
    const body =
      '<html><body><h1>Anomaly detected</h1><form id="challenge-form">verify</form></body></html>';
    assert.equal(isBlockedResponse(200, body), true);
  });

  it('does not flag a normal result page', () => {
    const body = resultBody('https://example.com', 'Example', 'A snippet about free tools.');
    assert.equal(isBlockedResponse(200, body), false);
  });

  function resultBody(href: string, title: string, snippet: string): string {
    return `<html><a class="result__a" href="${href}">${title}</a><a class="result__snippet" href="${href}">${snippet}</a></html>`;
  }
});
