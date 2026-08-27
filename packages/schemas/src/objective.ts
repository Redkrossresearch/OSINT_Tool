import { z } from 'zod';

export const ObjectiveType = {
  PERSON: 'PERSON',
  DOMAIN: 'DOMAIN',
  COMPANY: 'COMPANY',
  IP: 'IP',
} as const;

export type ObjectiveType = (typeof ObjectiveType)[keyof typeof ObjectiveType];

export const ObjectiveTypeSchema = z.enum([
  ObjectiveType.PERSON,
  ObjectiveType.DOMAIN,
  ObjectiveType.COMPANY,
  ObjectiveType.IP,
]);

const UuidSchema = z.string().uuid();

const ObjectiveCommonSchema = z.object({
  id: UuidSchema,
  investigation_id: UuidSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

const PersonObjectiveSchema = ObjectiveCommonSchema.extend({
  type: z.literal(ObjectiveType.PERSON),
  name: z.string().min(1, 'Person name is required'),
  aliases: z.array(z.string()).optional(),
});

const DomainObjectiveSchema = ObjectiveCommonSchema.extend({
  type: z.literal(ObjectiveType.DOMAIN),
  domain: z
    .string()
    .min(1, 'Domain is required')
    .regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, 'Invalid domain format'),
});

const CompanyObjectiveSchema = ObjectiveCommonSchema.extend({
  type: z.literal(ObjectiveType.COMPANY),
  company_name: z.string().min(1, 'Company name is required'),
  registration_number: z.string().optional(),
});

const IpObjectiveSchema = ObjectiveCommonSchema.extend({
  type: z.literal(ObjectiveType.IP),
  ip_address: z
    .string()
    .min(1, 'IP address is required')
    .ip({ version: 'v4' })
    .or(z.string().ip({ version: 'v6' })),
});

export const ObjectiveSchema = z.discriminatedUnion('type', [
  PersonObjectiveSchema,
  DomainObjectiveSchema,
  CompanyObjectiveSchema,
  IpObjectiveSchema,
]);

const PersonObjectiveCreateSchema = z.object({
  type: z.literal(ObjectiveType.PERSON),
  name: z.string().min(1, 'Person name is required'),
  aliases: z.array(z.string()).optional(),
});

const DomainObjectiveCreateSchema = z.object({
  type: z.literal(ObjectiveType.DOMAIN),
  domain: z
    .string()
    .min(1, 'Domain is required')
    .regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, 'Invalid domain format'),
});

const CompanyObjectiveCreateSchema = z.object({
  type: z.literal(ObjectiveType.COMPANY),
  company_name: z.string().min(1, 'Company name is required'),
  registration_number: z.string().optional(),
});

const IpObjectiveCreateSchema = z.object({
  type: z.literal(ObjectiveType.IP),
  ip_address: z
    .string()
    .min(1, 'IP address is required')
    .ip({ version: 'v4' })
    .or(z.string().ip({ version: 'v6' })),
});

export const ObjectiveCreateSchema = z.discriminatedUnion('type', [
  PersonObjectiveCreateSchema,
  DomainObjectiveCreateSchema,
  CompanyObjectiveCreateSchema,
  IpObjectiveCreateSchema,
]);

export type Objective = z.infer<typeof ObjectiveSchema>;
export type ObjectiveCreate = z.infer<typeof ObjectiveCreateSchema>;

export type PersonObjective = z.infer<typeof PersonObjectiveSchema>;
export type DomainObjective = z.infer<typeof DomainObjectiveSchema>;
export type CompanyObjective = z.infer<typeof CompanyObjectiveSchema>;
export type IpObjective = z.infer<typeof IpObjectiveSchema>;
