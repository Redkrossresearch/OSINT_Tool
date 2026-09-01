import { InvestigationStateSchema, UuidSchema } from '@osint-tool/schemas';
import { Router } from 'express';
import { z } from 'zod';

import { asyncRoute } from './async-route.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { InvestigationService } from '../services/investigation.service.js';

const IdParamsSchema = z.object({ id: UuidSchema });
const CreateInvestigationRequestSchema = z.object({
  case_id: UuidSchema,
  state: InvestigationStateSchema.optional(),
  plan: z.array(z.string()).optional(),
  objective: z.record(z.unknown()),
});
const UpdateInvestigationRequestSchema = z.object({
  state: InvestigationStateSchema.optional(),
  plan: z.array(z.string()).optional(),
  objective: z.record(z.unknown()).optional(),
});

export const createInvestigationRouter = (service: InvestigationService): Router => {
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
    validateBody(CreateInvestigationRequestSchema),
    asyncRoute(async (request, response) => {
      response.status(201).json(await service.create(request.body));
    }),
  );

  router.patch(
    '/:id',
    validateParams(IdParamsSchema),
    validateBody(UpdateInvestigationRequestSchema),
    asyncRoute(async (request, response) => {
      const actor = request.header('x-actor-id') ?? 'system';
      response.json(await service.update(request.params.id as string, request.body, actor));
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
