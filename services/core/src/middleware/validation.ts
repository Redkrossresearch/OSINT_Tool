import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

type ValidationTarget = 'body' | 'params' | 'query';

const validateTarget =
  (target: ValidationTarget, schema: ZodType): RequestHandler =>
  (request, _response, next) => {
    try {
      const parsed = schema.parse(request[target]);
      if (target === 'body') request.body = parsed;
      if (target === 'params') request.params = parsed;
      if (target === 'query') request.query = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };

export const validateBody = (schema: ZodType): RequestHandler => validateTarget('body', schema);
export const validateParams = (schema: ZodType): RequestHandler => validateTarget('params', schema);
export const validateQuery = (schema: ZodType): RequestHandler => validateTarget('query', schema);
