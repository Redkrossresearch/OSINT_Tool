export class ServiceError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  public constructor(message: string, statusCode: number, code: string, details?: unknown) {
    super(message);
    this.name = 'ServiceError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends ServiceError {
  public constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends ServiceError {
  public constructor(message: string, details?: unknown) {
    super(message, 409, 'CONFLICT', details);
  }
}
