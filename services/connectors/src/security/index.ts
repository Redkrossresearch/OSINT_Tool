export { SecurityValidationError, type SecurityErrorCode } from './security-validation-error.js';

export {
  parseTargetUrl,
  isNonPublicAddress,
  resolvePublicTarget,
  validatePublicUrl,
  defaultResolver,
  type ResolvedTarget,
  type HostResolver,
  type ResolveOptions,
} from './ssrf-protection.js';

export {
  validateCollectorInput,
  validateQuery,
  validateUrl,
  DEFAULT_MAX_QUERY_LENGTH,
  DEFAULT_MAX_URL_LENGTH,
} from './input-validator.js';

export {
  validateObservation,
  validateObservations,
  validateConnectorResult,
  DEFAULT_MAX_RESPONSE_BYTES,
} from './output-validator.js';
