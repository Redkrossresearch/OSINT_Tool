import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { EntitySchema, type Entity } from '@osint-tool/entities';
import { ObservationSchema } from '../../../../packages/schemas/src/observation.js';
import { extractEntities } from '../services/entity-extractor.js';

function observation(data: Record<string, unknown> = {}) {
  return ObservationSchema.parse({
    id: 'obs-001',
    evidence_id: 'evidence-001',
    type: 'WEB_PAGE',
    data,
    confidence: 0.5,
    timestamp: '2026-09-06T00:00:00Z',
    source_ref: {
      connector_name: 'web-search',
      query: 'example.com',
      timestamp: '2026-09-06T00:00:00Z',
      parameters: {},
    },
  });
}

const email: Entity = {
  type: 'email',
  attributes: { address: 'alice@example.com' },
  confidence: 0.98,
};
const url: Entity = {
  type: 'url',
  attributes: { url: 'https://example.com/report' },
  confidence: 0.98,
};
const domain: Entity = { type: 'domain', attributes: { domain: 'example.com' }, confidence: 0.95 };
const person: Entity = { type: 'person', attributes: { name: 'Alice Smith' }, confidence: 0.7 };
const ip: Entity = { type: 'ip', attributes: { address: '203.0.113.10' }, confidence: 0.98 };
const extract = (text: string) => extractEntities(observation({ text }));

describe('T3-003 extraction contracts', () => {
  it('extracts email without punctuation or email-domain derivation', () => {
    assert.deepEqual(extract('Contact Alice at alice@example.com.'), [email]);
  });
  it('preserves email case, dots and tags', () => {
    assert.deepEqual(extract('User.Name+TAG@Example.COM'), [
      {
        type: 'email',
        confidence: 0.98,
        attributes: { address: 'User.Name+TAG@Example.COM' },
      },
    ]);
  });
  it('extracts URL and its domain', () => {
    assert.deepEqual(extract('See https://example.com/report.'), [url, domain]);
  });
  it('preserves URL spelling and derives the parsed subdomain', () => {
    const value = 'https://Sub.Example.COM/Case/%2f?b=2&a=1#Fragment';
    assert.deepEqual(extract(value), [
      { type: 'url', confidence: 0.98, attributes: { url: value } },
      { type: 'domain', confidence: 0.95, attributes: { domain: 'sub.example.com' } },
    ]);
  });
  it('extracts IPv4', () => assert.deepEqual(extract('Server: 203.0.113.10.'), [ip]));
  for (const address of ['2001:db8::1', '::1', '::', '::ffff:192.0.2.1', '2001:0DB8:0:0:0:0:0:1']) {
    it(`extracts IPv6 ${address} without normalization`, () => {
      assert.deepEqual(extract(`Server: [${address}]`), [
        { type: 'ip', confidence: 0.98, attributes: { address } },
      ]);
    });
  }
  it('extracts an explicitly labelled person', () => {
    assert.deepEqual(extract('Name: Alice Smith'), [person]);
  });
  it('accepts two to four name tokens, tabs, hyphens and semicolon labels', () => {
    for (const name of [
      'Alice\tSmith',
      'Anne-Marie Smith',
      'Alice Mary Smith',
      'Alice Mary Jane Smith',
    ]) {
      assert.deepEqual(extract(`Details; Name: ${name}.`), [
        { type: 'person', confidence: 0.7, attributes: { name } },
      ]);
    }
  });
  it('removes prose punctuation outside closing URL delimiters', () => {
    assert.deepEqual(extract('See (https://example.com/report).'), [url, domain]);
    assert.deepEqual(extract('See [https://example.com/report],'), [url, domain]);
  });
  it('extracts multiple types in textual order with valid confidence and schemas', () => {
    const result = extract(
      'Name: Alice Smith\nContact: alice@example.com\nResearch: https://example.com/report\nServer: 203.0.113.10',
    );
    assert.deepEqual(result, [person, email, url, domain, ip]);
    for (const item of result) {
      assert.equal(EntitySchema.safeParse(item).success, true);
      assert.ok(Number.isFinite(item.confidence) && item.confidence >= 0 && item.confidence <= 1);
    }
  });
  it('handles enclosing punctuation and balanced URL parentheses', () => {
    assert.deepEqual(extract('(alice@example.com), [203.0.113.10]; (https://example.com/report)'), [
      email,
      ip,
      url,
      domain,
    ]);
    assert.deepEqual(extract('(https://example.com/report_(one))'), [
      { type: 'url', confidence: 0.98, attributes: { url: 'https://example.com/report_(one)' } },
      domain,
    ]);
  });
  it('supports explicit Unicode names and surrounding Unicode prose', () => {
    assert.deepEqual(extract('研究 🔎\nName: José O’Neil'), [
      { type: 'person', confidence: 0.7, attributes: { name: 'José O’Neil' } },
    ]);
  });
  it('suppresses exact duplicates across fields and keeps distinct spelling', () => {
    assert.deepEqual(
      extractEntities(
        observation({
          title: 'alice@example.com alice@example.com',
          text: 'alice@example.com Alice@example.com',
        }),
      ),
      [email, { type: 'email', confidence: 0.98, attributes: { address: 'Alice@example.com' } }],
    );
  });
  it('uses fixed field order regardless of data key insertion order', () => {
    assert.deepEqual(
      extractEntities(
        observation({
          url: 'https://example.com/report',
          description: '203.0.113.10',
          content: 'Name: Alice Smith',
          text: 'alice@example.com',
          title: 'Opening',
        }),
      ),
      [email, person, ip, url, domain],
    );
  });
  it('is repeatable and does not mutate input', () => {
    const input = observation({
      text: 'Name: Alice Smith\nalice@example.com https://example.com/report 203.0.113.10',
    });
    const original = structuredClone(input);
    Object.freeze(input.data);
    Object.freeze(input);
    const first = extractEntities(input);
    assert.deepEqual(extractEntities(input), first);
    assert.deepEqual(input, original);
    first.pop();
    assert.equal(extractEntities(input).length, 5);
  });
  it('accepts valid empty data', () => assert.deepEqual(extractEntities(observation()), []));
  it('ignores nested structures, unknown fields and provenance', () => {
    const input = observation({
      title: ['alice@example.com'],
      text: { content: 'alice@example.com' },
      content: 42,
      description: null,
      url: false,
      metadata: { text: 'alice@example.com' },
      raw: 'alice@example.com',
    });
    input.id = 'alice@example.com';
    input.evidence_id = 'alice@example.com';
    input.type = 'alice@example.com';
    input.source_ref.query = 'https://example.com/report';
    input.source_ref.connector_name = 'alice@example.com';
    input.source_ref.parameters = { text: 'alice@example.com' };
    assert.deepEqual(extractEntities(input), []);
  });
  for (const address of ['203.0.113.10', '[2001:db8::1]']) {
    it(`emits IP instead of domain for URL host ${address}`, () => {
      const result = extract(`https://${address}/report`);
      assert.deepEqual(
        result.map((item) => item.type),
        ['url', 'ip'],
      );
    });
  }
  it('does not extract overlapping email/IP content from URL paths', () => {
    const value = 'https://example.com/alice@example.com/203.0.113.10';
    assert.deepEqual(extract(value), [
      { type: 'url', confidence: 0.98, attributes: { url: value } },
      domain,
    ]);
  });
});

describe('conservative rejection', () => {
  for (const text of [
    'hello@',
    'a@@example.com',
    '.alice@example.com',
    'alice..smith@example.com',
    'alice@example.com..',
    'alice@-example.com',
    'alice@example.com_bad',
    'https://',
    'https:///example.com',
    'https://example..com',
    'https://-example.com',
    'https://example.com:bad',
    'https://999.999.999.999',
    'https://127.1',
    'https://user@example.com',
    'https://example.com\\evil',
    'abchttps://example.com',
    'https://bad_host/alice@example.com/203.0.113.10',
    '999.999.999.999',
    '256.0.0.1',
    '192.168.001.001',
    '1.2.3.4.5',
    'abc203.0.113.10xyz',
    '2001:::1',
    '2001:db8::xyz',
    '::ffff:999.0.0.1',
    'Version 1.2.3; Date 2026-09-06',
    'Version v1.2.3.4',
    'Ordinary Capitalized Sentence Words',
    'Alice Smith works here.',
    'Name: Alice',
    'Name: Alice Smith Jones Brown Green',
    'Name: Alice Smith works here',
    'example.com user@example',
    '研究 🧪 café — no entities',
  ]) {
    it(`rejects ${text}`, () => assert.deepEqual(extract(text), []));
  }
});
