import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ObservationSchema } from '@osint-tool/schemas';

import { NormalizationError, type NormalizationInput } from '../normalizer.js';
import { NormalizationPipeline } from '../normalization-pipeline.js';
import { CertificateNormalizer } from '../certificate.normalizer.js';
import { DnsNormalizer } from '../dns.normalizer.js';
import { GithubNormalizer } from '../github.normalizer.js';
import { SearchNormalizer } from '../search.normalizer.js';
import { WebNormalizer } from '../web.normalizer.js';

const baseInput = (sourceType: NormalizationInput['sourceType'], rawData: unknown): NormalizationInput => ({
  sourceType,
  rawData,
  connectorName: 'test-connector',
  query: 'example.com',
});

const rawDataFor = (sourceType: NormalizationInput['sourceType']): unknown => {
  switch (sourceType) {
    case 'github':
      return { repository: 'octocat/Hello-World', data_category: 'repo' };
    case 'web':
      return { url: 'https://example.com', title: 'Example' };
    case 'dns':
      return [{ record_type: 'A', record_name: 'example.com' }];
    case 'certificate':
      return {
        serial_number: '123456',
        subject: 'CN=example.com',
        issuer: 'CN=Let\'s Encrypt',
        fingerprint_sha256: 'a'.repeat(64),
      };
    case 'search':
      return { engine: 'duckduckgo', query: 'example.com' };
  }
};

const createPipeline = (): NormalizationPipeline => {
  const pipeline = new NormalizationPipeline();
  pipeline.register(new GithubNormalizer());
  pipeline.register(new WebNormalizer());
  pipeline.register(new DnsNormalizer());
  pipeline.register(new CertificateNormalizer());
  pipeline.register(new SearchNormalizer());
  return pipeline;
};

describe('NormalizationPipeline', () => {
  it('dispatches to the correct normalizer and returns only valid observations', () => {
    const pipeline = createPipeline();

    for (const sourceType of ['github', 'web', 'dns', 'certificate', 'search'] as const) {
      const observations = pipeline.normalize(baseInput(sourceType, rawDataFor(sourceType)));
      assert.ok(observations.length >= 1, `${sourceType} produced no observations`);
      for (const observation of observations) {
        assert.ok(
          ObservationSchema.safeParse(observation).success,
          `${sourceType} produced an invalid observation`,
        );
        assert.equal(observation.source_ref.connector_name, 'test-connector');
      }
    }
  });

  it('rejects an unknown source type clearly', () => {
    const pipeline = createPipeline();

    assert.throws(
      () =>
        pipeline.normalize({
          ...baseInput('web', {}),
          sourceType: 'martian' as NormalizationInput['sourceType'],
        }),
      (error: unknown) =>
        error instanceof NormalizationError && error.message.includes('unsupported source type'),
    );
  });

  it('rejects an unregistered source type clearly', () => {
    const pipeline = new NormalizationPipeline();
    pipeline.register(new WebNormalizer());

    assert.throws(
      () => pipeline.normalize(baseInput('github', rawDataFor('github'))),
      (error: unknown) =>
        error instanceof NormalizationError &&
        error.message.includes("no normalizer registered for source type 'github'"),
    );
  });

  it('rejects duplicate registrations for the same source type', () => {
    const pipeline = new NormalizationPipeline();
    pipeline.register(new WebNormalizer());

    assert.throws(
      () => pipeline.register(new WebNormalizer()),
      (error: unknown) =>
        error instanceof NormalizationError && error.message.includes('already registered'),
    );
  });
});