import { ObservationSchema, type Observation } from '@osint-tool/schemas';
import { ConnectorResultSchema, type ConnectorResult } from '../framework/connector-result.js';
import { SecurityValidationError } from './security-validation-error.js';

/**
 * Default maximum response body size in bytes (10 MB).
 *
 * This is a **guideline** for connectors to enforce when streaming HTTP
 * response bodies. Actual enforcement remains the responsibility of each
 * connector's HTTP client implementation.
 */
export const DEFAULT_MAX_RESPONSE_BYTES = 10 * 1024 * 1024;

/**
 * Validate a single observation object against the project's `ObservationSchema`.
 * Returns the validated `Observation` on success.
 */
export function validateObservation(output: unknown): Observation {
  const result = ObservationSchema.safeParse(output);
  if (!result.success) {
    throw new SecurityValidationError(
      'INVALID_OUTPUT',
      `invalid observation: ${result.error.message}`,
      result.error,
    );
  }
  return result.data;
}

/**
 * Validate an array of observation objects. Returns the validated array on
 * success. Rejects non-array input and any individual invalid observation.
 */
export function validateObservations(outputs: unknown): Observation[] {
  if (!Array.isArray(outputs)) {
    throw new SecurityValidationError('INVALID_OUTPUT', 'observations must be an array');
  }
  return outputs.map((item, index) => {
    const result = ObservationSchema.safeParse(item);
    if (!result.success) {
      throw new SecurityValidationError(
        'INVALID_OUTPUT',
        `invalid observation at index ${index}: ${result.error.message}`,
        result.error,
      );
    }
    return result.data;
  });
}

/**
 * Validate a full connector result (success or error variant) against the
 * project's `ConnectorResultSchema`. Returns the validated `ConnectorResult`
 * on success.
 */
export function validateConnectorResult(output: unknown): ConnectorResult {
  const result = ConnectorResultSchema.safeParse(output);
  if (!result.success) {
    throw new SecurityValidationError(
      'INVALID_OUTPUT',
      `invalid connector result: ${result.error.message}`,
      result.error,
    );
  }
  return result.data as ConnectorResult;
}
