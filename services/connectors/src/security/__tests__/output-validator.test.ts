import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { SecurityValidationError } from '../security-validation-error.js';
import {
  validateObservation,
  validateObservations,
  validateConnectorResult,
  DEFAULT_MAX_RESPONSE_BYTES,
} from '../output-validator.js';

function validObservation() {
  return {
    id: 'obs-001',
    evidence_id: 'ev-001',
    type: 'DNS_RECORD',
    data: { recordType: 'A', value: '93.184.216.34' },
    confidence: 0.9,
    source_ref: {
      connector_name: 'test',
      query: 'example.com',
      timestamp: '2025-01-01T00:00:00Z',
      parameters: {},
    },
    timestamp: '2025-01-01T00:00:00Z',
  };
}

function validSuccessResult() {
  return {
    ok: true,
    metadata: {
      connector_name: 'test',
      query: 'example.com',
      timestamp: '2025-01-01T00:00:00Z',
      duration_ms: 150,
    },
    observations: [validObservation()],
  };
}

function validErrorResult() {
  return {
    ok: false,
    metadata: {
      connector_name: 'test',
      query: 'example.com',
      timestamp: '2025-01-01T00:00:00Z',
      duration_ms: 50,
    },
    error: {
      code: 'TIMEOUT',
      message: 'request timed out',
    },
  };
}

describe('validateObservation', () => {
  it('accepts a valid observation', () => {
    const result = validateObservation(validObservation());
    assert.equal(result.id, 'obs-001');
    assert.equal(result.type, 'DNS_RECORD');
  });

  it('rejects null', () => {
    assert.throws(
      () => validateObservation(null),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_OUTPUT',
    );
  });

  it('rejects undefined', () => {
    assert.throws(
      () => validateObservation(undefined),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_OUTPUT',
    );
  });

  it('rejects a string', () => {
    assert.throws(
      () => validateObservation('bad'),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_OUTPUT',
    );
  });

  it('rejects an object missing required fields', () => {
    assert.throws(
      () => validateObservation({ id: 'obs-1' }),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_OUTPUT',
    );
  });

  it('rejects an observation with invalid confidence range', () => {
    const bad = { ...validObservation(), confidence: 1.5 };
    assert.throws(
      () => validateObservation(bad),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_OUTPUT',
    );
  });

  it('rejects an observation with negative confidence', () => {
    const bad = { ...validObservation(), confidence: -0.5 };
    assert.throws(
      () => validateObservation(bad),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_OUTPUT',
    );
  });

  it('rejects an observation with empty id', () => {
    const bad = { ...validObservation(), id: '' };
    assert.throws(
      () => validateObservation(bad),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_OUTPUT',
    );
  });
});

describe('validateObservations', () => {
  it('accepts a valid array of observations', () => {
    const result = validateObservations([validObservation()]);
    assert.equal(result.length, 1);
  });

  it('accepts an empty array', () => {
    const result = validateObservations([]);
    assert.equal(result.length, 0);
  });

  it('rejects a non-array input', () => {
    assert.throws(
      () => validateObservations('not an array'),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_OUTPUT',
    );
  });

  it('rejects an array containing an invalid observation', () => {
    const bad = [validObservation(), { id: 'incomplete' }];
    assert.throws(
      () => validateObservations(bad),
      (error: unknown) =>
        error instanceof SecurityValidationError &&
        error.code === 'INVALID_OUTPUT' &&
        error.message.includes('index 1'),
    );
  });
});

describe('validateConnectorResult', () => {
  it('accepts a valid success result', () => {
    const result = validateConnectorResult(validSuccessResult());
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.observations.length, 1);
    }
  });

  it('accepts a valid error result', () => {
    const result = validateConnectorResult(validErrorResult());
    assert.equal(result.ok, false);
  });

  it('rejects a result with invalid ok discriminant', () => {
    const bad = { ok: 'yes', metadata: validSuccessResult().metadata, observations: [] };
    assert.throws(
      () => validateConnectorResult(bad),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_OUTPUT',
    );
  });

  it('rejects a result missing metadata', () => {
    const bad = { ok: true, observations: [] };
    assert.throws(
      () => validateConnectorResult(bad),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_OUTPUT',
    );
  });

  it('rejects a result missing error in error variant', () => {
    const bad = { ok: false, metadata: validErrorResult().metadata };
    assert.throws(
      () => validateConnectorResult(bad),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_OUTPUT',
    );
  });

  it('rejects null', () => {
    assert.throws(
      () => validateConnectorResult(null),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_OUTPUT',
    );
  });
});

describe('DEFAULT_MAX_RESPONSE_BYTES', () => {
  it('is set to 10 MB', () => {
    assert.equal(DEFAULT_MAX_RESPONSE_BYTES, 10 * 1024 * 1024);
  });
});
