import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  CompanyEntitySchema,
  ConfidenceSchema,
  DomainEntitySchema,
  EmailEntitySchema,
  EntitySchema,
  IpEntitySchema,
  LocationEntitySchema,
  PersonEntitySchema,
  RepositoryEntitySchema,
  TechnologyEntitySchema,
  UrlEntitySchema,
} from '@osint-tool/entities';

const variants = [
  ['person', PersonEntitySchema, { name: 'Alice', aliases: ['alice'] }],
  ['company', CompanyEntitySchema, { name: 'Acme', domain: 'example.com', industry: 'Software' }],
  ['domain', DomainEntitySchema, { domain: 'example.com' }],
  ['ip', IpEntitySchema, { address: '192.0.2.1' }],
  ['email', EmailEntitySchema, { address: 'alice@example.com' }],
  ['url', UrlEntitySchema, { url: 'https://example.com/path?q=value' }],
  [
    'repository',
    RepositoryEntitySchema,
    {
      name: 'project',
      owner: 'alice',
      url: 'https://github.com/alice/project',
      language: 'TypeScript',
    },
  ],
  [
    'technology',
    TechnologyEntitySchema,
    { name: 'TypeScript', version: '5', category: 'Language' },
  ],
  [
    'location',
    LocationEntitySchema,
    { name: 'Mumbai', country: 'India', coordinates: { latitude: 19.076, longitude: 72.8777 } },
  ],
];

describe('entity variants and public schema exports', () => {
  for (const [type, schema, attributes] of variants) {
    const entity = { type, attributes, confidence: 0.8 };

    it(`accepts ${type} through its schema and the union without changing data`, () => {
      assert.deepEqual(schema.parse(entity), entity);
      assert.deepEqual(EntitySchema.parse(entity), entity);
    });

    it(`rejects missing, wrong, and unknown attributes for ${type}`, () => {
      for (const invalid of [
        undefined,
        {},
        { wrong: 'value' },
        { ...attributes, wrong: 'value' },
      ]) {
        assert.equal(schema.safeParse({ ...entity, attributes: invalid }).success, false);
        assert.equal(EntitySchema.safeParse({ ...entity, attributes: invalid }).success, false);
      }
      assert.equal(schema.safeParse({ ...entity, type: 'unknown' }).success, false);
      assert.equal(EntitySchema.safeParse({ ...entity, extra: true }).success, false);
    });

    it(`enforces confidence for ${type}`, () => {
      for (const confidence of [-0.01, 1.01, NaN, Infinity, -Infinity, '0.5', null, undefined]) {
        assert.equal(schema.safeParse({ ...entity, confidence }).success, false);
        assert.equal(EntitySchema.safeParse({ ...entity, confidence }).success, false);
      }
      for (const confidence of [0, 0.5, 1]) {
        assert.equal(EntitySchema.safeParse({ ...entity, confidence }).success, true);
      }
    });
  }

  it('rejects unknown or absent discriminators and non-object inputs', () => {
    for (const input of [
      null,
      [],
      'person',
      {},
      { type: 'unknown', attributes: {}, confidence: 1 },
    ]) {
      assert.equal(EntitySchema.safeParse(input).success, false);
    }
  });

  it('selects the schema using type, rejecting attributes belonging to another variant', () => {
    assert.equal(
      EntitySchema.safeParse({
        type: 'person',
        confidence: 1,
        attributes: { address: '192.0.2.1' },
      }).success,
      false,
    );
  });

  it('exports the shared confidence validator', () => {
    assert.equal(ConfidenceSchema.safeParse(0).success, true);
    assert.equal(ConfidenceSchema.safeParse(1).success, true);
    assert.equal(ConfidenceSchema.safeParse(2).success, false);
  });
});

describe('attribute validation', () => {
  const invalidAttributes = [
    ['person', { name: '' }],
    ['person', { name: '   ' }],
    ['person', { name: 'Alice', aliases: [12] }],
    ['company', { name: 'Acme', domain: '-invalid.com' }],
    ['company', { name: 42 }],
    ['email', { address: 'not-an-email' }],
    ['url', { url: 'not-a-url' }],
    ['url', { url: '/relative/path' }],
    ['ip', { address: '256.1.2.3' }],
    ['ip', { address: '2001:db8:::1' }],
    ['repository', { name: 'project', owner: 'alice', url: 'invalid' }],
    ['repository', { name: 'project', url: 'https://example.com' }],
    ['technology', { name: 'TypeScript', version: 5 }],
    ['location', { name: 'Mumbai', country: 1 }],
  ];

  for (const [type, attributes] of invalidAttributes) {
    it(`rejects invalid ${type} attributes ${JSON.stringify(attributes)}`, () => {
      assert.equal(EntitySchema.safeParse({ type, attributes, confidence: 0.5 }).success, false);
    });
  }

  it('accepts IPv6', () => {
    assert.equal(
      EntitySchema.safeParse({ type: 'ip', attributes: { address: '2001:db8::1' }, confidence: 1 })
        .success,
      true,
    );
  });

  it('enforces domain syntax and DNS label and total lengths', () => {
    for (const domain of [
      'localhost',
      'https://example.com',
      'a..com',
      '-a.com',
      'a-.com',
      'a_b.com',
      '192.0.2.1',
      `${'a'.repeat(64)}.com`,
      `${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(63)}.com`,
    ]) {
      assert.equal(
        DomainEntitySchema.safeParse({ type: 'domain', attributes: { domain }, confidence: 1 })
          .success,
        false,
      );
    }
    for (const domain of [
      'example.com',
      'sub.example.com',
      'EXAMPLE.COM',
      `${'a'.repeat(63)}.com`,
    ]) {
      assert.equal(
        DomainEntitySchema.safeParse({ type: 'domain', attributes: { domain }, confidence: 1 })
          .success,
        true,
      );
    }
  });

  it('accepts minimal optional attributes', () => {
    for (const type of ['person', 'company', 'technology', 'location']) {
      assert.equal(
        EntitySchema.safeParse({ type, attributes: { name: 'Example' }, confidence: 1 }).success,
        true,
      );
    }
  });

  it('validates coordinate bounds and requires both coordinates when supplied', () => {
    const valid = [
      { latitude: -90, longitude: -180 },
      { latitude: 90, longitude: 180 },
      { latitude: 0, longitude: 0 },
    ];
    const invalid = [
      { latitude: -90.01, longitude: 0 },
      { latitude: 90.01, longitude: 0 },
      { latitude: 0, longitude: -180.01 },
      { latitude: 0, longitude: 180.01 },
      { latitude: Infinity, longitude: 0 },
      { latitude: 0, longitude: NaN },
      { latitude: '0', longitude: 0 },
      { latitude: 0 },
      { longitude: 0 },
    ];
    for (const coordinates of valid) {
      assert.equal(
        LocationEntitySchema.safeParse({
          type: 'location',
          attributes: { name: 'Place', coordinates },
          confidence: 1,
        }).success,
        true,
      );
    }
    for (const coordinates of invalid) {
      assert.equal(
        EntitySchema.safeParse({
          type: 'location',
          attributes: { name: 'Place', coordinates },
          confidence: 1,
        }).success,
        false,
      );
    }
  });
});
