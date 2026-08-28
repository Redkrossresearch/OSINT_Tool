export class EvidenceServiceError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  public constructor(message: string, statusCode: number, code: string, details?: unknown) {
    super(message);
    this.name = 'EvidenceServiceError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class EvidenceNotFoundError extends EvidenceServiceError {
  public constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
  }
}

export class EvidenceConflictError extends EvidenceServiceError {
  public constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}
