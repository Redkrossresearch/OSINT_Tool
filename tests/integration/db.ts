import { prisma } from '../../services/core/src/config/database.ts';

export const resetDatabase = async (): Promise<void> => {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE evidence, observations, audit_events, objectives, investigations, cases RESTART IDENTITY CASCADE',
  );
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};
