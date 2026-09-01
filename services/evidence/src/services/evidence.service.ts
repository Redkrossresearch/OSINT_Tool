import {
  EvidenceMetadataSchema,
  EvidenceSchema,
  EvidenceTypeSchema,
  ProvenanceAction,
  ProvenanceEntrySchema,
  SourceRefSchema,
  UuidSchema,
  type Evidence,
  type ProvenanceEntry,
} from '@osint-tool/schemas';
import { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';

import { computeHash } from '../lib/hash.js';
import { EvidenceConflictError, EvidenceNotFoundError } from './errors.js';
import { asRecord } from './serialization.js';

export const EvidenceCreateInputSchema = z.object({
  investigation_id: UuidSchema,
  type: EvidenceTypeSchema,
  source: SourceRefSchema,
  content: z.string(),
  metadata: EvidenceMetadataSchema,
});

const toEvidence = (record: {
  id: string;
  investigationId: string;
  type: string;
  source: Prisma.JsonValue;
  content: string;
  metadata: Prisma.JsonValue;
  hash: string;
  createdAt: Date;
}): Evidence =>
  EvidenceSchema.parse({
    id: record.id,
    investigation_id: record.investigationId,
    type: record.type,
    source: record.source,
    content: record.content,
    metadata: record.metadata,
    hash: record.hash,
    created_at: record.createdAt,
  });

export class EvidenceService {
  public constructor(private readonly db: PrismaClient) {}

  public async create(input: unknown, actor: string): Promise<Evidence> {
    const parsed = EvidenceCreateInputSchema.parse(input);
    const parsedActor = z.string().min(1, 'Actor is required').parse(actor);
    const record = await this.db.$transaction(async (tx) => {
      const evidence = await tx.evidence.create({
        data: {
          investigationId: parsed.investigation_id,
          type: parsed.type,
          source: parsed.source as Prisma.InputJsonValue,
          content: parsed.content,
          metadata: parsed.metadata as Prisma.InputJsonValue,
          hash: computeHash(parsed.content),
        },
      });

      await tx.auditEvent.create({
        data: {
          investigationId: parsed.investigation_id,
          action: 'EVIDENCE_ADDED',
          actor: parsedActor,
          details: {
            evidence_id: evidence.id,
            provenance_action: ProvenanceAction.STORED,
          },
        },
      });

      return evidence;
    });

    return toEvidence(record);
  }

  public async listByInvestigation(investigationId: string): Promise<Evidence[]> {
    const parsedInvestigationId = UuidSchema.parse(investigationId);
    const records = await this.db.evidence.findMany({
      where: { investigationId: parsedInvestigationId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(toEvidence);
  }

  public async getById(id: string): Promise<Evidence> {
    const evidenceId = UuidSchema.parse(id);
    const record = await this.db.evidence.findUnique({ where: { id: evidenceId } });

    if (!record) {
      throw new EvidenceNotFoundError(`Evidence ${evidenceId} was not found`);
    }

    return toEvidence(record);
  }

  public async listProvenance(id: string): Promise<ProvenanceEntry[]> {
    const evidence = await this.getById(id);
    const events = await this.db.auditEvent.findMany({
      where: { investigationId: evidence.investigation_id },
      orderBy: { timestamp: 'asc' },
    });

    return events.flatMap((event) => {
      const details = asRecord(event.details);
      if (details.evidence_id !== evidence.id || typeof details.provenance_action !== 'string') {
        return [];
      }

      return [
        ProvenanceEntrySchema.parse({
          id: event.id,
          evidence_id: evidence.id,
          action: details.provenance_action,
          actor: event.actor,
          timestamp: event.timestamp,
          details,
        }),
      ];
    });
  }

  public async update(id: string, input: unknown): Promise<never> {
    void id;
    void input;
    throw new EvidenceConflictError('Evidence is immutable and cannot be updated');
  }

  public async delete(id: string): Promise<never> {
    void id;
    throw new EvidenceConflictError('Evidence is immutable and cannot be deleted');
  }
}
