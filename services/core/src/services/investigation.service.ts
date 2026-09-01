import {
  InvestigationCreateSchema,
  InvestigationSchema,
  InvestigationStateSchema,
  ObjectiveCreateSchema,
  ObjectiveSchema,
  UuidSchema,
  type Investigation,
} from '@osint-tool/schemas';
import { Prisma, PrismaClient } from '@prisma/client';

import { canTransition } from '../lib/state-machine.js';
import { ConflictError, NotFoundError } from './errors.js';
import { asRecord } from './serialization.js';

const InvestigationInputSchema = InvestigationCreateSchema.extend({
  objective: ObjectiveCreateSchema,
});

const InvestigationUpdateInputSchema = InvestigationSchema.pick({ state: true, plan: true })
  .partial()
  .extend({ objective: ObjectiveCreateSchema.optional() });

const toJsonObject = (value: Record<string, unknown>): Prisma.InputJsonObject =>
  value as Prisma.InputJsonObject;

type InvestigationRecord = {
  id: string;
  caseId: string;
  state: string;
  plan: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
  objectives: Array<{
    id: string;
    investigationId: string;
    type: string;
    data: Prisma.JsonValue;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

const toInvestigation = (record: InvestigationRecord): Investigation => {
  const objectiveRecord = record.objectives[0];
  if (!objectiveRecord) {
    throw new ConflictError(`Investigation ${record.id} has no objective`);
  }

  const objective = ObjectiveSchema.parse({
    ...asRecord(objectiveRecord.data),
    id: objectiveRecord.id,
    investigation_id: objectiveRecord.investigationId,
    type: objectiveRecord.type,
    created_at: objectiveRecord.createdAt,
    updated_at: objectiveRecord.updatedAt,
  });

  return InvestigationSchema.parse({
    id: record.id,
    case_id: record.caseId,
    state: record.state,
    objective,
    plan: Array.isArray(record.plan) ? record.plan : [],
    created_at: record.createdAt,
    updated_at: record.updatedAt,
  });
};

const investigationInclude = { objectives: true } as const;

export class InvestigationService {
  public constructor(private readonly db: PrismaClient) {}

  public async create(input: unknown): Promise<Investigation> {
    const parsed = InvestigationInputSchema.parse(input);
    const { objective, ...investigation } = parsed;
    const { type, ...objectiveData } = objective;
    const record = await this.db.investigation.create({
      data: {
        caseId: investigation.case_id,
        state: investigation.state,
        plan: investigation.plan,
        objectives: {
          create: {
            type,
            data: toJsonObject(objectiveData),
          },
        },
      },
      include: investigationInclude,
    });

    return toInvestigation(record);
  }

  public async list(): Promise<Investigation[]> {
    const records = await this.db.investigation.findMany({
      include: investigationInclude,
      orderBy: { createdAt: 'desc' },
    });
    return records.map((record) => toInvestigation(record));
  }

  public async getById(id: string): Promise<Investigation> {
    const investigationId = UuidSchema.parse(id);
    const record = await this.db.investigation.findUnique({
      where: { id: investigationId },
      include: investigationInclude,
    });

    if (!record) {
      throw new NotFoundError(`Investigation ${investigationId} was not found`);
    }

    return toInvestigation(record);
  }

  public async update(id: string, input: unknown, actor = 'system'): Promise<Investigation> {
    const investigationId = UuidSchema.parse(id);
    const parsed = InvestigationUpdateInputSchema.parse(input);
    const current = await this.db.investigation.findUnique({
      where: { id: investigationId },
      include: investigationInclude,
    });

    if (!current) {
      throw new NotFoundError(`Investigation ${investigationId} was not found`);
    }

    const currentState = InvestigationStateSchema.parse(current.state);
    const nextState = parsed.state ?? currentState;
    if (!canTransition(currentState, nextState)) {
      if (nextState !== current.state) {
        throw new ConflictError(
          `Invalid investigation transition from ${current.state} to ${nextState}`,
        );
      }
    }

    const record = await this.db.$transaction(async (tx) => {
      await tx.investigation.update({
        where: { id: investigationId },
        data: {
          ...(parsed.state === undefined ? {} : { state: parsed.state }),
          ...(parsed.plan === undefined ? {} : { plan: parsed.plan }),
        },
        include: investigationInclude,
      });

      if (parsed.state !== undefined && parsed.state !== current.state) {
        await tx.auditEvent.create({
          data: {
            investigationId,
            action: 'STATE_CHANGED',
            actor,
            details: { from: current.state, to: parsed.state },
          },
        });
      }

      if (parsed.objective !== undefined) {
        const objective = current.objectives[0];
        if (!objective) {
          throw new ConflictError(`Investigation ${investigationId} has no objective`);
        }
        const { type, ...data } = parsed.objective;
        await tx.objective.update({
          where: { id: objective.id },
          data: { type, data: toJsonObject(data) },
        });
      }

      return tx.investigation.findUniqueOrThrow({
        where: { id: investigationId },
        include: investigationInclude,
      });
    });

    return toInvestigation(record);
  }

  public async delete(id: string): Promise<void> {
    const investigationId = UuidSchema.parse(id);
    await this.db.investigation.delete({ where: { id: investigationId } });
  }
}
