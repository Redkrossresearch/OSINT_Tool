import { CaseCreateSchema, CaseUpdateSchema, UuidSchema } from '@osint-tool/schemas';
import { Router } from 'express';
import { z } from 'zod';

import { asyncRoute } from './async-route.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { CaseService } from '../services/case.service.js';

const CreateCaseRequestSchema = CaseCreateSchema.extend({ created_by: UuidSchema });
const IdParamsSchema = z.object({ id: UuidSchema });

export const createCaseRouter = (service: CaseService): Router => {
  const router = Router();

  router.get(
    '/',
    asyncRoute(async (_request, response) => {
      response.json(await service.list());
    }),
  );

  router.get(
    '/:id',
    validateParams(IdParamsSchema),
    asyncRoute(async (request, response) => {
      response.json(await service.getById(request.params.id as string));
    }),
  );

  router.post(
    '/',
    validateBody(CreateCaseRequestSchema),
    asyncRoute(async (request, response) => {
      response.status(201).json(await service.create(request.body));
    }),
  );

  router.patch(
    '/:id',
    validateParams(IdParamsSchema),
    validateBody(CaseUpdateSchema),
    asyncRoute(async (request, response) => {
      response.json(await service.update(request.params.id as string, request.body));
    }),
  );

  router.delete(
    '/:id',
    validateParams(IdParamsSchema),
    asyncRoute(async (request, response) => {
      await service.delete(request.params.id as string);
      response.status(204).send();
    }),
  );

  return router;
};
