import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { SecurityValidationError } from '../security-validation-error.js';
import { validateCollectorInput, validateQuery, validateUrl } from '../input-validator.js';

function validObjective() {
  return {
    id: '550e8400-e29b-41d4-a716-446655440000',
    investigation_id: '550e8400-e29b-41d4-a716-446655440001',
    type: 'DOMAIN',
    domain: 'example.com',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  };
}

describe('validateCollectorInput', () => {
  it('accepts a valid collector input', () => {
    const input = { objective: validObjective(), query: 'example.com' };
    const result = validateCollectorInput(input);
    assert.equal(result.query, 'example.com');
    assert.equal(result.objective.type, 'DOMAIN');
  });

  it('trims whitespace from the query', () => {
    const input = { objective: validObjective(), query: '  example.com  ' };
    const result = validateCollectorInput(input);
    assert.equal(result.query, 'example.com');
  });

  it('rejects null input', () => {
    assert.throws(
      () => validateCollectorInput(null),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_INPUT',
    );
  });

  it('rejects undefined input', () => {
    assert.throws(
      () => validateCollectorInput(undefined),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_INPUT',
    );
  });

  it('rejects a string input', () => {
    assert.throws(
      () => validateCollectorInput('bad'),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_INPUT',
    );
  });

  it('rejects input with invalid objective', () => {
    const input = { objective: { type: 'INVALID' }, query: 'test' };
    assert.throws(
      () => validateCollectorInput(input),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_INPUT',
    );
  });

  it('rejects input with missing objective', () => {
    const input = { query: 'test' };
    assert.throws(
      () => validateCollectorInput(input),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_INPUT',
    );
  });

  it('rejects input with empty query', () => {
    const input = { objective: validObjective(), query: '' };
    assert.throws(
      () => validateCollectorInput(input),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'EMPTY_QUERY',
    );
  });

  it('rejects input with whitespace-only query', () => {
    const input = { objective: validObjective(), query: '   ' };
    assert.throws(
      () => validateCollectorInput(input),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'EMPTY_QUERY',
    );
  });

  it('rejects input with query exceeding max length', () => {
    const input = { objective: validObjective(), query: 'a'.repeat(3000) };
    assert.throws(
      () => validateCollectorInput(input),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'QUERY_TOO_LONG',
    );
  });
});

describe('validateQuery', () => {
  it('accepts a valid query and trims it', () => {
    assert.equal(validateQuery('  hello  '), 'hello');
  });

  it('rejects a non-string query', () => {
    assert.throws(
      () => validateQuery(123),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_INPUT',
    );
  });

  it('rejects an empty string', () => {
    assert.throws(
      () => validateQuery(''),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'EMPTY_QUERY',
    );
  });

  it('rejects a whitespace-only string', () => {
    assert.throws(
      () => validateQuery('   '),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'EMPTY_QUERY',
    );
  });

  it('rejects a query exceeding max length', () => {
    const long = 'x'.repeat(3000);
    assert.throws(
      () => validateQuery(long),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'QUERY_TOO_LONG',
    );
  });

  it('respects custom max length', () => {
    assert.equal(validateQuery('hello', 10), 'hello');
    assert.throws(
      () => validateQuery('hello world', 5),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'QUERY_TOO_LONG',
    );
  });
});

describe('validateUrl', () => {
  it('accepts a valid https URL', () => {
    const url = validateUrl('https://example.com/path');
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'example.com');
  });

  it('accepts a valid http URL', () => {
    const url = validateUrl('http://example.com/path');
    assert.equal(url.protocol, 'http:');
  });

  it('rejects a non-string URL', () => {
    assert.throws(
      () => validateUrl(123),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'INVALID_INPUT',
    );
  });

  it('rejects a malformed URL', () => {
    assert.throws(
      () => validateUrl('not-a-url'),
      SecurityValidationError,
    );
  });

  it('rejects non-http(s) schemes', () => {
    assert.throws(
      () => validateUrl('ftp://example.com'),
      SecurityValidationError,
    );
    assert.throws(
      () => validateUrl('file:///etc/passwd'),
      SecurityValidationError,
    );
  });

  it('rejects URLs with credentials', () => {
    assert.throws(
      () => validateUrl('http://user:pass@example.com/'),
      SecurityValidationError,
    );
  });

  it('rejects URLs exceeding max length', () => {
    const longUrl = `https://example.com/${'a'.repeat(3000)}`;
    assert.throws(
      () => validateUrl(longUrl),
      (error: unknown) =>
        error instanceof SecurityValidationError && error.code === 'QUERY_TOO_LONG',
    );
  });
});
