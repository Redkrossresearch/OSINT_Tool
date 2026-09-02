import { ObjectiveSchema, type Objective } from '@osint-tool/schemas';
import { z } from 'zod';

import type { CollectorInput } from '../framework/connector-interface.js';
import { parseTargetUrl } from './ssrf-protection.js';
import { SecurityValidationError } from './security-validation-error.js';

export const DEFAULT_MAX_QUERY_LENGTH = 2048;
export const DEFAULT_MAX_URL_LENGTH = 2048;

const CollectorInputSchema = z.object({
  objective: ObjectiveSchema,
  query: z.string(),
});

/**
 * Validate and normalize a collector input. Fails closed on any malformed data.
 *
 * - Rejects null / undefined / non-object input.
 * - Validates the objective against the project's `ObjectiveSchema`.
 * - Validates and trims the query string.
 */
export function validateCollectorInput(input: unknown): CollectorInput {
  if (input === null || input === undefined || typeof input !== 'object') {
    throw new SecurityValidationError('INVALID_INPUT', 'collector input must be a non-null object');
  }

  const result = CollectorInputSchema.safeParse(input);
  if (!result.success) {
    throw new SecurityValidationError(
      'INVALID_INPUT',
      `invalid collector input: ${result.error.message}`,
      result.error,
    );
  }

  const query = validateQuery(result.data.query);

  return {
    objective: result.data.objective as Objective,
    query,
  };
}

/**
 * Validate a query string: trim whitespace, reject empty, enforce max length.
 *
 * Returns the trimmed query on success.
 */
export function validateQuery(
  query: unknown,
  maxLength: number = DEFAULT_MAX_QUERY_LENGTH,
): string {
  if (typeof query !== 'string') {
    throw new SecurityValidationError('INVALID_INPUT', 'query must be a string');
  }

  const trimmed = query.trim();

  if (trimmed.length === 0) {
    throw new SecurityValidationError('EMPTY_QUERY', 'query must not be empty');
  }

  if (trimmed.length > maxLength) {
    throw new SecurityValidationError(
      'QUERY_TOO_LONG',
      `query length ${trimmed.length} exceeds maximum of ${maxLength}`,
    );
  }

  return trimmed;
}

/**
 * Validate and parse a URL string. Rejects unsupported schemes, credentials,
 * and malformed URLs. Returns the parsed `URL` object on success.
 */
export function validateUrl(input: unknown): URL {
  if (typeof input !== 'string') {
    throw new SecurityValidationError('INVALID_INPUT', 'URL must be a string');
  }

  if (input.length > DEFAULT_MAX_URL_LENGTH) {
    throw new SecurityValidationError(
      'QUERY_TOO_LONG',
      `URL length ${input.length} exceeds maximum of ${DEFAULT_MAX_URL_LENGTH}`,
    );
  }

  // Delegate to the SSRF module's structural URL validation
  return parseTargetUrl(input);
}
