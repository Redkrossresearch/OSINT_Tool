import {
  CaseResponseSchema,
  CaseCreateSchema,
  CaseUpdateSchema,
  UuidSchema,
  type Case,
} from '@osint-tool/schemas';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

import { NotFoundError } from './errors.js';

const CaseInputSchema = CaseCreateSchema.extend({ created_by: UuidSchema });

type CaseCreateInput = z.infer<typeof CaseCreateSchema> & { created_by: string };

const toCase = (record: {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}): Case =>
  CaseResponseSchema.parse({
    id: record.id,
    title: record.title,
    description: record.description ?? undefined,
    status: record.status,
    created_by: record.createdBy,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
  });

export class CaseService {
  public constructor(private readonly db: PrismaClient) {}

  public async create(input: unknown): Promise<Case> {
    const parsed = CaseInputSchema.parse(input) as CaseCreateInput;
    const record = await this.db.case.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        status: parsed.status,
        createdBy: parsed.created_by,
      },
    });

    return toCase(record);
  }

  public async list(): Promise<Case[]> {
    const records = await this.db.case.findMany({ orderBy: { createdAt: 'desc' } });
    return records.map(toCase);
  }

  public async getById(id: string): Promise<Case> {
    const caseId = UuidSchema.parse(id);
    const record = await this.db.case.findUnique({ where: { id: caseId } });

    if (!record) {
      throw new NotFoundError(`Case ${caseId} was not found`);
    }

    return toCase(record);
  }

  public async update(id: string, input: unknown): Promise<Case> {
    const caseId = UuidSchema.parse(id);
    const parsed = CaseUpdateSchema.parse(input);
    const record = await this.db.case.update({
      where: { id: caseId },
      data: {
        ...(parsed.title === undefined ? {} : { title: parsed.title }),
        ...(parsed.description === undefined ? {} : { description: parsed.description }),
        ...(parsed.status === undefined ? {} : { status: parsed.status }),
      },
    });

    return toCase(record);
  }

  public async delete(id: string): Promise<void> {
    const caseId = UuidSchema.parse(id);
    await this.db.case.delete({ where: { id: caseId } });
  }
}
