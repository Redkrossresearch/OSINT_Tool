-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('person', 'company', 'domain', 'ip', 'email', 'url', 'repository', 'technology', 'location');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('OWNS', 'WORKS_FOR', 'USES', 'HOSTED_ON', 'REGISTERED_TO', 'MENTIONS', 'ASSOCIATED_WITH', 'RESOLVES_TO');

-- CreateTable
CREATE TABLE "entities" (
    "id" TEXT NOT NULL,
    "investigation_id" UUID NOT NULL,
    "type" "EntityType" NOT NULL,
    "attributes" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relationships" (
    "id" TEXT NOT NULL,
    "investigation_id" UUID NOT NULL,
    "type" "RelationshipType" NOT NULL,
    "source_entity_id" TEXT,
    "source_entity_type" "EntityType",
    "source_evidence_id" UUID,
    "target_entity_id" TEXT NOT NULL,
    "target_entity_type" "EntityType" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_to" TIMESTAMP(3),

    CONSTRAINT "relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relationship_evidence" (
    "relationship_id" TEXT NOT NULL,
    "investigation_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "evidence_id" UUID NOT NULL,

    CONSTRAINT "relationship_evidence_pkey" PRIMARY KEY ("relationship_id","position")
);

-- CreateIndex
CREATE INDEX "entities_type_idx" ON "entities"("type");

-- CreateIndex
CREATE INDEX "entities_investigation_id_idx" ON "entities"("investigation_id");

-- CreateIndex
CREATE UNIQUE INDEX "entities_id_investigation_id_type_key" ON "entities"("id", "investigation_id", "type");

-- CreateIndex
CREATE INDEX "relationships_source_entity_id_type_idx" ON "relationships"("source_entity_id", "type");

-- CreateIndex
CREATE INDEX "relationships_source_evidence_id_type_idx" ON "relationships"("source_evidence_id", "type");

-- CreateIndex
CREATE INDEX "relationships_target_entity_id_type_idx" ON "relationships"("target_entity_id", "type");

-- CreateIndex
CREATE INDEX "relationships_type_idx" ON "relationships"("type");

-- CreateIndex
CREATE INDEX "relationships_investigation_id_valid_to_valid_from_idx" ON "relationships"("investigation_id", "valid_to", "valid_from");

-- CreateIndex
CREATE UNIQUE INDEX "relationships_id_investigation_id_key" ON "relationships"("id", "investigation_id");

-- CreateIndex
CREATE INDEX "relationship_evidence_evidence_id_idx" ON "relationship_evidence"("evidence_id");

-- AddForeignKey
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_source_entity_id_investigation_id_source_ent_fkey" FOREIGN KEY ("source_entity_id", "investigation_id", "source_entity_type") REFERENCES "entities"("id", "investigation_id", "type") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_target_entity_id_investigation_id_target_ent_fkey" FOREIGN KEY ("target_entity_id", "investigation_id", "target_entity_type") REFERENCES "entities"("id", "investigation_id", "type") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "relationship_evidence" ADD CONSTRAINT "relationship_evidence_relationship_id_investigation_id_fkey" FOREIGN KEY ("relationship_id", "investigation_id") REFERENCES "relationships"("id", "investigation_id") ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Core owns these tables. This migration only adds constraints to graph tables.
ALTER TABLE "entities" ADD CONSTRAINT "entities_investigation_id_fkey"
  FOREIGN KEY ("investigation_id") REFERENCES "investigations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_investigation_id_fkey"
  FOREIGN KEY ("investigation_id") REFERENCES "investigations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_source_evidence_id_fkey"
  FOREIGN KEY ("source_evidence_id") REFERENCES "evidence"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE "relationship_evidence" ADD CONSTRAINT "relationship_evidence_evidence_id_fkey"
  FOREIGN KEY ("evidence_id") REFERENCES "evidence"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "entities"
  ADD CONSTRAINT "entities_id_nonempty" CHECK (length("id") > 0),
  ADD CONSTRAINT "entities_attributes_object" CHECK (jsonb_typeof("attributes") = 'object'),
  ADD CONSTRAINT "entities_confidence_range" CHECK ("confidence" >= 0 AND "confidence" <= 1);

ALTER TABLE "relationships"
  ADD CONSTRAINT "relationships_id_nonempty" CHECK (length("id") > 0),
  ADD CONSTRAINT "relationships_confidence_range" CHECK ("confidence" >= 0 AND "confidence" <= 1),
  ADD CONSTRAINT "relationships_exactly_one_source" CHECK (
    ("source_entity_id" IS NOT NULL) <> ("source_evidence_id" IS NOT NULL)
  ),
  ADD CONSTRAINT "relationships_source_type_present" CHECK (
    ("source_entity_id" IS NOT NULL) = ("source_entity_type" IS NOT NULL)
  ),
  ADD CONSTRAINT "relationships_endpoint_types" CHECK (
    CASE "type"
      WHEN 'MENTIONS' THEN "source_evidence_id" IS NOT NULL
      WHEN 'OWNS' THEN "source_entity_id" IS NOT NULL
        AND "source_entity_type" IN ('person', 'company') AND "target_entity_type" IN ('domain', 'ip', 'company')
      WHEN 'WORKS_FOR' THEN "source_entity_id" IS NOT NULL
        AND "source_entity_type" = 'person' AND "target_entity_type" = 'company'
      WHEN 'USES' THEN "source_entity_id" IS NOT NULL
        AND "source_entity_type" IN ('person', 'company') AND "target_entity_type" = 'technology'
      WHEN 'HOSTED_ON' THEN "source_entity_id" IS NOT NULL
        AND "source_entity_type" = 'domain' AND "target_entity_type" = 'ip'
      WHEN 'REGISTERED_TO' THEN "source_entity_id" IS NOT NULL
        AND "source_entity_type" = 'domain' AND "target_entity_type" IN ('person', 'company')
      WHEN 'ASSOCIATED_WITH' THEN "source_entity_id" IS NOT NULL
      WHEN 'RESOLVES_TO' THEN "source_entity_id" IS NOT NULL
        AND "source_entity_type" = 'domain' AND "target_entity_type" = 'ip'
      ELSE FALSE
    END
  ),
  -- Matches GraphService's half-open intervals; equal endpoints are allowed.
  ADD CONSTRAINT "relationships_valid_interval" CHECK (
    isfinite("valid_from") AND ("valid_to" IS NULL OR (isfinite("valid_to") AND "valid_to" >= "valid_from"))
  );

ALTER TABLE "relationship_evidence"
  ADD CONSTRAINT "relationship_evidence_position_nonnegative" CHECK ("position" >= 0);

-- Core has no unique (id, investigation_id) key to reference without altering
-- Core. Check evidence scope on graph writes and lock the referenced row for the
-- transaction. The scoped adapter must still authorize every read/write, and
-- Core must not reassign referenced evidence to another investigation later.
CREATE FUNCTION "graph_check_evidence_scope"() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  referenced_id UUID;
BEGIN
  IF TG_TABLE_NAME = 'relationships' THEN
    referenced_id := NEW.source_evidence_id;
  ELSE
    referenced_id := NEW.evidence_id;
  END IF;
  IF referenced_id IS NOT NULL THEN
    PERFORM 1 FROM "evidence"
      WHERE "id" = referenced_id AND "investigation_id" = NEW.investigation_id
      FOR SHARE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Evidence must exist in the relationship investigation'
        USING ERRCODE = '23503';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "relationships_evidence_scope"
  BEFORE INSERT OR UPDATE ON "relationships"
  FOR EACH ROW EXECUTE FUNCTION "graph_check_evidence_scope"();
CREATE TRIGGER "relationship_evidence_scope"
  BEFORE INSERT OR UPDATE ON "relationship_evidence"
  FOR EACH ROW EXECUTE FUNCTION "graph_check_evidence_scope"();
