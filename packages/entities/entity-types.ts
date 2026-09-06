import type { z } from 'zod';

import type {
  CompanyEntitySchema,
  DomainEntitySchema,
  EmailEntitySchema,
  EntitySchema,
  IpEntitySchema,
  LocationEntitySchema,
  PersonEntitySchema,
  RepositoryEntitySchema,
  TechnologyEntitySchema,
  UrlEntitySchema,
} from './entity-schema.js';

// Infer from the validators so runtime schemas and TypeScript types cannot drift.
export type PersonEntity = z.infer<typeof PersonEntitySchema>;
export type CompanyEntity = z.infer<typeof CompanyEntitySchema>;
export type DomainEntity = z.infer<typeof DomainEntitySchema>;
export type IpEntity = z.infer<typeof IpEntitySchema>;
export type EmailEntity = z.infer<typeof EmailEntitySchema>;
export type UrlEntity = z.infer<typeof UrlEntitySchema>;
export type RepositoryEntity = z.infer<typeof RepositoryEntitySchema>;
export type TechnologyEntity = z.infer<typeof TechnologyEntitySchema>;
export type LocationEntity = z.infer<typeof LocationEntitySchema>;
export type Entity = z.infer<typeof EntitySchema>;
export type EntityType = Entity['type'];
export type BaseEntity = Pick<Entity, 'type' | 'confidence'>;
