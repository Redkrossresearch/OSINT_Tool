import {
  ObjectiveCreateSchema,
  ObjectiveSchema,
  UuidSchema,
  type Objective,
} from '@osint-tool/schemas';
import { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';

import { NotFoundError } from './errors.js';
import { asRecord } from './serialization.js';

const toJsonObject = (value: Record<string, unknown>): Prisma.InputJsonObject =>
  value as Prisma.InputJsonObject;

const toObjective = (record: {
  id: string;
  investigationId: string;
  type: string;
  data: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}): Objective =>
  ObjectiveSchema.parse({
    ...asRecord(record.data),
    id: record.id,
    investigation_id: record.investigationId,
    type: record.type,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
  });

export class ObjectiveService {
  public constructor(private readonly db: PrismaClient) {}

  public async create(investigationId: string, input: unknown): Promise<Objective> {
    const parsedInvestigationId = UuidSchema.parse(investigationId);
    const parsed = ObjectiveCreateSchema.parse(input);
    const { type, ...data } = parsed;
    const record = await this.db.objective.create({
      data: {
        investigationId: parsedInvestigationId,
        type,
        data: toJsonObject(data),
      },
    });

    return toObjective(record);
  }

  public async listByInvestigation(investigationId: string): Promise<Objective[]> {
    const parsedInvestigationId = UuidSchema.parse(investigationId);
    const records = await this.db.objective.findMany({
      where: { investigationId: parsedInvestigationId },
      orderBy: { createdAt: 'asc' },
    });
    return records.map(toObjective);
  }

  public async getById(id: string): Promise<Objective> {
    const objectiveId = UuidSchema.parse(id);
    const record = await this.db.objective.findUnique({ where: { id: objectiveId } });

    if (!record) {
      throw new NotFoundError(`Objective ${objectiveId} was not found`);
    }

    return toObjective(record);
  }

  public async update(id: string, input: unknown): Promise<Objective> {
    const objectiveId = UuidSchema.parse(id);
    const current = await this.getById(objectiveId);
    const patch = z.record(z.unknown()).parse(input);
    const merged = {
      ...asRecord(current),
      ...patch,
    };
    delete merged.id;
    delete merged.investigation_id;
    delete merged.created_at;
    delete merged.updated_at;

    const parsed = ObjectiveCreateSchema.parse(merged);
    const { type, ...data } = parsed;
    const record = await this.db.objective.update({
      where: { id: objectiveId },
      data: {
        type,
        data: toJsonObject(data),
      },
    });

    return toObjective(record);
  }

  public async delete(id: string): Promise<void> {
    const objectiveId = UuidSchema.parse(id);
    await this.db.objective.delete({ where: { id: objectiveId } });
  }
}
