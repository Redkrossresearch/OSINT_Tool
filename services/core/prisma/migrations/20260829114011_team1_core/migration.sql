-- AlterTable
ALTER TABLE "audit_events" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "cases" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "evidence" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "investigations" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "objectives" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "observations" ALTER COLUMN "id" DROP DEFAULT;
