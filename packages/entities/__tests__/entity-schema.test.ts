import type { z } from 'zod';
import type {
  BaseEntity,
  CompanyEntity,
  DomainEntity,
  EmailEntity,
  Entity,
  EntitySchema,
  EntityType,
  IpEntity,
  LocationEntity,
  PersonEntity,
  RepositoryEntity,
  TechnologyEntity,
  UrlEntity,
} from '../index.js';

type Assert<T extends true> = T;
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

// Compiled by the package build/typecheck; verifies public type exports and narrowing.
export type EntityTypeChecks = [
  Assert<Equal<Entity, z.infer<typeof EntitySchema>>>,
  Assert<Equal<PersonEntity, Extract<Entity, { type: 'person' }>>>,
  Assert<Equal<CompanyEntity, Extract<Entity, { type: 'company' }>>>,
  Assert<Equal<DomainEntity, Extract<Entity, { type: 'domain' }>>>,
  Assert<Equal<IpEntity, Extract<Entity, { type: 'ip' }>>>,
  Assert<Equal<EmailEntity, Extract<Entity, { type: 'email' }>>>,
  Assert<Equal<UrlEntity, Extract<Entity, { type: 'url' }>>>,
  Assert<Equal<RepositoryEntity, Extract<Entity, { type: 'repository' }>>>,
  Assert<Equal<TechnologyEntity, Extract<Entity, { type: 'technology' }>>>,
  Assert<Equal<LocationEntity, Extract<Entity, { type: 'location' }>>>,
  Assert<
    Equal<
      EntityType,
      | 'person'
      | 'company'
      | 'domain'
      | 'ip'
      | 'email'
      | 'url'
      | 'repository'
      | 'technology'
      | 'location'
    >
  >,
  Assert<Equal<BaseEntity, { type: EntityType; confidence: number }>>,
  Assert<Equal<PersonEntity['attributes']['name'], string>>,
  Assert<Equal<IpEntity['attributes'], { address: string }>>,
];
