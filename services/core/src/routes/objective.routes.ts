import { Router } from 'express';
import { z } from 'zod';
import { UuidSchema } from '@osint-tool/schemas';

import { asyncRoute } from './async-route.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { ObjectiveService } from '../services/objective.service.js';

const IdParamsSchema = z.object({ id: UuidSchema });
const CreateObjectiveRequestSchema = z.object({
  investigation_id: UuidSchema,
  objective: z.record(z.unknown()),
});

export const createObjectiveRouter = (service: ObjectiveService): Router => {
  const router = Router();

  router.get(
    '/:id',
    validateParams(IdParamsSchema),
    asyncRoute(async (request, response) => {
      response.json(await service.getById(request.params.id as string));
    }),
  );

  router.post(
    '/',
    validateBody(CreateObjectiveRequestSchema),
    asyncRoute(async (request, response) => {
      response
        .status(201)
        .json(await service.create(request.body.investigation_id, request.body.objective));
    }),
  );

  router.patch(
    '/:id',
    validateParams(IdParamsSchema),
    validateBody(z.record(z.unknown())),
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
