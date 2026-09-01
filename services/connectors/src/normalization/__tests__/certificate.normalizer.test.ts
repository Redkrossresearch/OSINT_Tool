import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { CertificateMetadataSchema, EvidenceMetadataType, ObservationSchema } from '@osint-tool/schemas';

import { NormalizationError, type NormalizationInput } from '../normalizer.js';
import { CertificateNormalizer } from '../certificate.normalizer.js';

const normalizer = new CertificateNormalizer();
const connectorName = 'certificate-search';

const fingerprint = 'a'.repeat(64);

const validCertificate = {
  serial_number: '123456',
  subject: 'CN=example.com',
  issuer: 'CN=Let\'s Encrypt',
  fingerprint_sha256: fingerprint,
  not_before: '2024-01-01T00:00:00.000Z',
  not_after: '2025-01-01T00:00:00.000Z',
};

const baseInput = (rawData: unknown, overrides: Partial<NormalizationInput> = {}) => ({
  sourceType: 'certificate' as const,
  rawData,
  connectorName,
  query: 'example.com',
  ...overrides,
});

describe('CertificateNormalizer', () => {
  it('produces one observation per certificate', () => {
    const observations = normalizer.normalize(
      baseInput([validCertificate, { ...validCertificate, serial_number: '654321' }]),
    );

    assert.equal(observations.length, 2);
    for (const observation of observations) {
      assert.equal(observation.type, EvidenceMetadataType.CERTIFICATE);
      assert.equal(observation.data.type, EvidenceMetadataType.CERTIFICATE);
      assert.equal(observation.data.subject, 'CN=example.com');
      assert.equal(observation.source_ref.connector_name, connectorName);
      assert.ok(ObservationSchema.safeParse(observation).success);
    }

    const serials = observations.map((observation) => observation.data.serial_number);
    assert.deepEqual(serials, ['123456', '654321']);
  });

  it('accepts a single certificate and its data matches the certificate metadata schema', () => {
    const [observation] = normalizer.normalize(baseInput(validCertificate));
    assert.equal(observation?.data.serial_number, '123456');
    assert.ok(CertificateMetadataSchema.safeParse(observation?.data).success);
  });

  it('rejects raw data with an invalid fingerprint', () => {
    assert.throws(
      () =>
        normalizer.normalize(
          baseInput({ ...validCertificate, fingerprint_sha256: 'nope' }),
        ),
      (error: unknown) =>
        error instanceof NormalizationError &&
        error.message.includes('certificate normalization failed'),
    );
  });
});