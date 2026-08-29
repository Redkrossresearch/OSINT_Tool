import express, { type Express } from 'express';

import { prisma } from '../../services/core/src/config/database.ts';
import { CaseService } from '../../services/core/src/services/case.service.ts';
import { InvestigationService } from '../../services/core/src/services/investigation.service.ts';
import { ObjectiveService } from '../../services/core/src/services/objective.service.ts';
import { EvidenceService } from '../../services/evidence/src/services/evidence.service.ts';
import { createCaseRouter } from '../../services/core/src/routes/case.routes.ts';
import { createInvestigationRouter } from '../../services/core/src/routes/investigation.routes.ts';
import { createObjectiveRouter } from '../../services/core/src/routes/objective.routes.ts';
import { createEvidenceRouter } from '../../services/evidence/src/routes/evidence.routes.ts';
import { errorHandler } from '../../services/core/src/middleware/error-handler.ts';

export const createIntegrationApp = (): Express => {
  const app = express();
  app.use(express.json());
  app.use('/api/cases', createCaseRouter(new CaseService(prisma)));
  app.use('/api/investigations', createInvestigationRouter(new InvestigationService(prisma)));
  app.use('/api/objectives', createObjectiveRouter(new ObjectiveService(prisma)));
  app.use('/api/evidence', createEvidenceRouter(new EvidenceService(prisma)));
  app.use(errorHandler);
  return app;
};
