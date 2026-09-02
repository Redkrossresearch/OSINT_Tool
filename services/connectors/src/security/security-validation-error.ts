export type SecurityErrorCode =
  | 'INVALID_URL'
  | 'BLOCKED_SCHEME'
  | 'CREDENTIALS_IN_URL'
  | 'INVALID_IP'
  | 'BLOCKED_ADDRESS'
  | 'DNS_FAILED'
  | 'TOO_MANY_REDIRECTS'
  | 'BODY_TOO_LARGE'
  | 'INVALID_INPUT'
  | 'EMPTY_QUERY'
  | 'QUERY_TOO_LONG'
  | 'INVALID_OUTPUT';

export class SecurityValidationError extends Error {
  public readonly code: SecurityErrorCode;
  public readonly cause?: unknown;

  public constructor(code: SecurityErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'SecurityValidationError';
    this.code = code;
    this.cause = cause;
  }
}
