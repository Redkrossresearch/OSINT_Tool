import { Prisma } from '@prisma/client';
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { ServiceError } from '../services/errors.js';

const isStatusError = (
  error: unknown,
): error is { statusCode: number; code: string; message: string; details?: unknown } =>
  typeof error === 'object' &&
  error !== null &&
  'statusCode' in error &&
  typeof error.statusCode === 'number' &&
  'code' in error &&
  typeof error.code === 'string' &&
  'message' in error &&
  typeof error.message === 'string';

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.flatten(),
      },
    });
    return;
  }

  if (error instanceof ServiceError || isStatusError(error)) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details === undefined ? {} : { details: error.details }),
      },
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const status =
      error.code === 'P2025'
        ? 404
        : error.code === 'P2002'
          ? 409
          : error.code === 'P2003'
            ? 400
            : 500;
    const code =
      error.code === 'P2025' ? 'NOT_FOUND' : error.code === 'P2002' ? 'CONFLICT' : 'DATABASE_ERROR';
    response.status(status).json({
      error: { code, message: status === 500 ? 'Database operation failed' : error.message },
    });
    return;
  }

  response
    .status(500)
    .json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
};
