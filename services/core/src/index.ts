import express, { type Express } from 'express';

import { errorHandler } from './middleware/error-handler.js';
import { createCaseRouter } from './routes/case.routes.js';
import { createInvestigationRouter } from './routes/investigation.routes.js';
import { createObjectiveRouter } from './routes/objective.routes.js';
import { prisma } from './config/database.js';
import { CaseService } from './services/case.service.js';
import { InvestigationService } from './services/investigation.service.js';
import { ObjectiveService } from './services/objective.service.js';

export interface CoreServices {
  caseService: CaseService;
  investigationService: InvestigationService;
  objectiveService: ObjectiveService;
}

export const createCoreServices = (): CoreServices => ({
  caseService: new CaseService(prisma),
  investigationService: new InvestigationService(prisma),
  objectiveService: new ObjectiveService(prisma),
});

export const createApp = (services: CoreServices = createCoreServices()): Express => {
  const app = express();
  app.use(express.json());
  app.use('/api/cases', createCaseRouter(services.caseService));
  app.use('/api/investigations', createInvestigationRouter(services.investigationService));
  app.use('/api/objectives', createObjectiveRouter(services.objectiveService));
  app.use(errorHandler);
  return app;
};

export const app = createApp();
