import { Router, type ErrorRequestHandler } from 'express';

import { asyncRoute } from './async-route.js';
import { ConnectorRegistryError } from '../registry/connector-registry.js';
import type { ConnectorRegistry } from '../registry/connector-registry.js';
import type { ConnectorHealthChecker } from '../registry/health-checker.js';

export const createConnectorRouter = (
  registry: ConnectorRegistry,
  healthChecker: ConnectorHealthChecker,
): Router => {
  const router = Router();

  router.get(
    '/',
    asyncRoute(async (_request, response) => {
      response.json(registry.list());
    }),
  );

  router.get(
    '/health',
    asyncRoute(async (_request, response) => {
      response.json(await healthChecker.status());
    }),
  );

  const handleRegistryError: ErrorRequestHandler = (error, _request, response, next) => {
    if (error instanceof ConnectorRegistryError) {
      response.status(404).json({ error: { code: error.code, message: error.message } });
      return;
    }
    next(error);
  };
  router.use(handleRegistryError);

  return router;
};
