import { EvidenceCreateInputSchema, EvidenceService } from '../services/evidence.service.js';
import { UuidSchema } from '@osint-tool/schemas';
import { Router } from 'express';
import { z } from 'zod';

import { asyncRoute } from './async-route.js';
import { validateBody, validateParams, validateQuery } from './validation.js';

const IdParamsSchema = z.object({ id: UuidSchema });
const InvestigationQuerySchema = z.object({ investigation_id: UuidSchema });

export const createEvidenceRouter = (service: EvidenceService): Router => {
  const router = Router();

  router.get(
    '/',
    validateQuery(InvestigationQuerySchema),
    asyncRoute(async (request, response) => {
      response.json(await service.listByInvestigation(request.query.investigation_id as string));
    }),
  );

  router.post(
    '/',
    validateBody(EvidenceCreateInputSchema),
    asyncRoute(async (request, response) => {
      const actor = request.header('x-actor-id') ?? '';
      response.status(201).json(await service.create(request.body, actor));
    }),
  );

  router.get(
    '/:id/provenance',
    validateParams(IdParamsSchema),
    asyncRoute(async (request, response) => {
      response.json(await service.listProvenance(request.params.id as string));
    }),
  );

  router.get(
    '/:id',
    validateParams(IdParamsSchema),
    asyncRoute(async (request, response) => {
      response.json(await service.getById(request.params.id as string));
    }),
  );

  router.patch(
    '/:id',
    validateParams(IdParamsSchema),
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
