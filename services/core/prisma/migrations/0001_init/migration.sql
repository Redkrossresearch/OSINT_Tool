CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "cases" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "created_by" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "investigations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "case_id" UUID NOT NULL,
  "state" TEXT NOT NULL DEFAULT 'DRAFT',
  "plan" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "investigations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "objectives" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "investigation_id" UUID NOT NULL,
  "type" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "objectives_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "evidence" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "investigation_id" UUID NOT NULL,
  "type" TEXT NOT NULL,
  "source" JSONB NOT NULL,
  "content" TEXT NOT NULL,
  "metadata" JSONB NOT NULL,
  "hash" CHAR(64) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "evidence_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "observations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "evidence_id" UUID NOT NULL,
  "type" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "confidence" DECIMAL(3,2) NOT NULL,
  "source_ref" JSONB NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "observations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "audit_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "investigation_id" UUID NOT NULL,
  "action" TEXT NOT NULL,
  "actor" TEXT NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "details" JSONB NOT NULL,
  CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "investigations_case_id_idx" ON "investigations"("case_id");
CREATE INDEX "objectives_investigation_id_idx" ON "objectives"("investigation_id");
CREATE INDEX "evidence_investigation_id_idx" ON "evidence"("investigation_id");
CREATE INDEX "observations_evidence_id_idx" ON "observations"("evidence_id");
CREATE INDEX "audit_events_investigation_id_timestamp_idx" ON "audit_events"("investigation_id", "timestamp");

ALTER TABLE "investigations" ADD CONSTRAINT "investigations_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_investigation_id_fkey" FOREIGN KEY ("investigation_id") REFERENCES "investigations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_investigation_id_fkey" FOREIGN KEY ("investigation_id") REFERENCES "investigations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "observations" ADD CONSTRAINT "observations_evidence_id_fkey" FOREIGN KEY ("evidence_id") REFERENCES "evidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_investigation_id_fkey" FOREIGN KEY ("investigation_id") REFERENCES "investigations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
