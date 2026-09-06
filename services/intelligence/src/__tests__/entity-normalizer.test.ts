import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { EntitySchema, type Entity } from '@osint-tool/entities';
import { normalizeEntity } from '../services/entity-normalizer.js';

const fixtures: [Entity, Entity['attributes']][] = [
  [
    {
      type: 'person',
      confidence: 0.7,
      attributes: { name: '  Jose\u0301  Smith ', aliases: [' JOSÉ ', ' A&B '] },
    },
    { name: 'José  Smith', aliases: ['JOSÉ', 'A&B'] },
  ],
  [
    {
      type: 'company',
      confidence: 0.7,
      attributes: { name: ' Acme & Co ', domain: ' Example.COM. ', industry: ' Software ' },
    },
    { name: 'Acme & Co', domain: 'example.com', industry: 'Software' },
  ],
  [
    { type: 'domain', confidence: 0.7, attributes: { domain: ' Example.COM. ' } },
    { domain: 'example.com' },
  ],
  [
    {
      type: 'ip',
      confidence: 0.7,
      attributes: { address: ' 2001:0DB8:0000:0000:0000:0000:0000:0001 ' },
    },
    { address: '2001:db8::1' },
  ],
  [
    { type: 'email', confidence: 0.7, attributes: { address: ' User.Name+TAG@Example.COM ' } },
    { address: 'user.name+tag@example.com' },
  ],
  [
    {
      type: 'url',
      confidence: 0.7,
      attributes: { url: ' https://Example.COM/Case/%2f?b=2&a=1#Fragment ' },
    },
    { url: 'https://Example.COM/Case/%2f?b=2&a=1#Fragment' },
  ],
  [
    {
      type: 'repository',
      confidence: 0.7,
      attributes: {
        name: ' Project ',
        owner: ' Alice ',
        url: ' https://example.com/Alice/Project ',
        language: ' TypeScript ',
      },
    },
    {
      name: 'Project',
      owner: 'Alice',
      url: 'https://example.com/Alice/Project',
      language: 'TypeScript',
    },
  ],
  [
    {
      type: 'technology',
      confidence: 0.7,
      attributes: { name: ' React ', version: ' V1 ', category: ' UI ' },
    },
    { name: 'React', version: 'V1', category: 'UI' },
  ],
  [
    {
      type: 'location',
      confidence: 0.7,
      attributes: {
        name: ' Montre\u0301al ',
        country: ' Canada ',
        coordinates: { latitude: 45.5, longitude: -73.5 },
      },
    },
    { name: 'Montréal', country: 'Canada', coordinates: { latitude: 45.5, longitude: -73.5 } },
  ],
];

describe('type-aware normalization', () => {
  for (const [input, attributes] of fixtures) {
    it(`normalizes ${input.type} and preserves confidence and discriminator`, () => {
      const result = normalizeEntity(input);
      assert.deepEqual(result, { type: input.type, confidence: input.confidence, attributes });
      assert.equal(EntitySchema.safeParse(result).success, true);
    });
    it(`is deterministic and idempotent for ${input.type}`, () => {
      const result = normalizeEntity(input);
      assert.deepEqual(normalizeEntity(input), result);
      assert.deepEqual(normalizeEntity(result), result);
    });
    it(`does not mutate or retain caller-owned attributes for ${input.type}`, () => {
      const original = structuredClone(input);
      const result = normalizeEntity(input);
      assert.deepEqual(input, original);
      assert.notEqual(result, input);
      assert.notEqual(result.attributes, input.attributes);
      if (result.type === 'person' && input.type === 'person') {
        assert.notEqual(result.attributes.aliases, input.attributes.aliases);
      }
      if (result.type === 'location' && input.type === 'location') {
        assert.notEqual(result.attributes.coordinates, input.attributes.coordinates);
      }
    });
  }
});

describe('normalization edge cases', () => {
  it('composes equivalent Unicode and preserves meaningful special characters', () => {
    const make = (name: string): Entity => ({
      type: 'person',
      confidence: 1,
      attributes: { name },
    });
    assert.deepEqual(
      normalizeEntity(make(' Jose\u0301 O’Neil & 李 ')),
      normalizeEntity(make('José O’Neil & 李')),
    );
  });
  it('preserves absent optional attributes for all applicable variants', () => {
    for (const type of ['person', 'company', 'technology', 'location'] as const) {
      assert.deepEqual(
        normalizeEntity({ type, confidence: 0, attributes: { name: ' Example ' } }),
        { type, confidence: 0, attributes: { name: 'Example' } },
      );
    }
    const repository: Entity = {
      type: 'repository',
      confidence: 1,
      attributes: { name: 'Project', owner: 'Owner', url: 'https://example.com' },
    };
    assert.deepEqual(normalizeEntity(repository), repository);
  });
  it('preserves empty optional arrays', () => {
    const input: Entity = {
      type: 'person',
      confidence: 1,
      attributes: { name: 'Alice', aliases: [] },
    };
    assert.deepEqual(normalizeEntity(input), input);
  });
  it('rejects empty and whitespace-only required strings', () => {
    for (const empty of ['', ' ', '\t\n']) {
      for (const input of [
        { type: 'person', attributes: { name: empty } },
        { type: 'domain', attributes: { domain: empty } },
        { type: 'email', attributes: { address: empty } },
        { type: 'ip', attributes: { address: empty } },
        { type: 'url', attributes: { url: empty } },
      ] as const) {
        assert.throws(() => normalizeEntity({ ...input, confidence: 1 }));
      }
    }
  });
  it('rejects whitespace-only optional values rather than dropping them', () => {
    assert.throws(() =>
      normalizeEntity({
        type: 'technology',
        confidence: 1,
        attributes: { name: 'React', version: ' ' },
      }),
    );
    assert.throws(() =>
      normalizeEntity({
        type: 'person',
        confidence: 1,
        attributes: { name: 'Alice', aliases: [' '] },
      }),
    );
  });
  it('normalizes IPv4 without accepting octal, shorthand, or invalid representations', () => {
    assert.deepEqual(
      normalizeEntity({ type: 'ip', confidence: 1, attributes: { address: ' 192.0.2.1 ' } })
        .attributes,
      { address: '192.0.2.1' },
    );
    for (const address of [
      '192.168.001.001',
      '127.1',
      '0x7f000001',
      '256.0.0.1',
      '2001:::1',
      '[::1]',
      '::1/128',
    ]) {
      assert.throws(() => normalizeEntity({ type: 'ip', confidence: 1, attributes: { address } }));
    }
  });
  it('canonicalizes equivalent IPv6 forms including embedded IPv4', () => {
    for (const [address, expected] of [
      ['2001:0DB8:0:0:0:0:0:1', '2001:db8::1'],
      ['2001:db8::1', '2001:db8::1'],
      ['0:0:0:0:0:0:0:0', '::'],
      ['::ffff:192.0.2.1', '::ffff:c000:201'],
      ['0:0:0:0:0:FFFF:C000:0201', '::ffff:c000:201'],
    ]) {
      const result = normalizeEntity({ type: 'ip', confidence: 1, attributes: { address } });
      assert.deepEqual(result.attributes, { address: expected });
      assert.deepEqual(normalizeEntity(result), result);
    }
  });
  it('preserves internal domain structure and rejects multiple trailing dots', () => {
    assert.deepEqual(
      normalizeEntity({
        type: 'domain',
        confidence: 1,
        attributes: { domain: ' Sub.Example.COM. ' },
      }).attributes,
      { domain: 'sub.example.com' },
    );
    for (const domain of ['example.com..', 'a..com', 'exa mple.com']) {
      assert.throws(() =>
        normalizeEntity({ type: 'domain', confidence: 1, attributes: { domain } }),
      );
    }
  });
  it('rejects invalid confidence without adjusting it', () => {
    assert.throws(() =>
      normalizeEntity({ type: 'person', confidence: 2, attributes: { name: 'Alice' } }),
    );
  });
});
