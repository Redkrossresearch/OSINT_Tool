import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseHtml } from '../html.js';

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Example Domain</title>
  <meta name="description" content="A test page">
  <meta property="og:title" content="OG Title">
</head>
<body>
  <h1>Hello</h1>
  <p>Hello &amp; welcome to this page. Extra   spaces here.</p>
  <script>var nope = "should be stripped";</script>
  <a href="/about">About</a>
  <a href="https://other.example.com/x">External</a>
</body>
</html>`;

describe('parseHtml', () => {
  it('extracts the page title', () => {
    const parsed = parseHtml(SAMPLE_HTML, 'https://example.com/');
    assert.equal(parsed.title, 'Example Domain');
  });

  it('extracts metadata keyed by name and property', () => {
    const parsed = parseHtml(SAMPLE_HTML, 'https://example.com/');
    assert.equal(parsed.meta['description'], 'A test page');
    assert.equal(parsed.meta['og:title'], 'OG Title');
  });

  it('extracts stripped and decoded text content', () => {
    const parsed = parseHtml(SAMPLE_HTML, 'https://example.com/');
    assert.ok(parsed.text.includes('Hello & welcome to this page.'));
    assert.ok(parsed.text.includes('Extra spaces here.'));
    assert.ok(!parsed.text.includes('<h1>'));
    assert.ok(!parsed.text.includes('var nope'));
    assert.ok(!parsed.text.includes('should be stripped'));
  });

  it('extracts absolute links resolved against the base URL', () => {
    const parsed = parseHtml(SAMPLE_HTML, 'https://example.com/');
    assert.ok(parsed.links.includes('https://example.com/about'));
    assert.ok(parsed.links.includes('https://other.example.com/x'));
  });

  it('handles missing title', () => {
    const parsed = parseHtml('<html><body>no title</body></html>', 'https://example.com/');
    assert.equal(parsed.title, '');
  });

  it('ignores malformed link hrefs', () => {
    const parsed = parseHtml('<a href="http://[::1">broken</a>', 'https://example.com/');
    assert.deepEqual(parsed.links, []);
  });
});
