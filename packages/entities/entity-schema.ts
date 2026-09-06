import { z } from 'zod';

const TextSchema = z.string().min(1).regex(/\S/, 'Must contain non-whitespace characters');
const DomainNameSchema = z
  .string()
  .max(253)
  .regex(
    /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/,
    'Invalid domain format',
  );

/** Confidence is a finite score from 0 (no confidence) to 1 (maximum confidence). */
export const ConfidenceSchema = z.number().finite().min(0).max(1);

const EntityCommonSchema = z.object({ confidence: ConfidenceSchema }).strict();

export const PersonEntitySchema = EntityCommonSchema.extend({
  type: z.literal('person'),
  attributes: z
    .object({
      name: TextSchema,
      aliases: z.array(TextSchema).optional(),
    })
    .strict(),
});

export const CompanyEntitySchema = EntityCommonSchema.extend({
  type: z.literal('company'),
  attributes: z
    .object({
      name: TextSchema,
      domain: DomainNameSchema.optional(),
      industry: TextSchema.optional(),
    })
    .strict(),
});

export const DomainEntitySchema = EntityCommonSchema.extend({
  type: z.literal('domain'),
  attributes: z.object({ domain: DomainNameSchema }).strict(),
});

export const IpEntitySchema = EntityCommonSchema.extend({
  type: z.literal('ip'),
  attributes: z.object({ address: z.string().ip() }).strict(),
});

export const EmailEntitySchema = EntityCommonSchema.extend({
  type: z.literal('email'),
  attributes: z.object({ address: z.string().email() }).strict(),
});

export const UrlEntitySchema = EntityCommonSchema.extend({
  type: z.literal('url'),
  attributes: z.object({ url: z.string().url() }).strict(),
});

export const RepositoryEntitySchema = EntityCommonSchema.extend({
  type: z.literal('repository'),
  attributes: z
    .object({
      name: TextSchema,
      owner: TextSchema,
      url: z.string().url(),
      language: TextSchema.optional(),
    })
    .strict(),
});

export const TechnologyEntitySchema = EntityCommonSchema.extend({
  type: z.literal('technology'),
  attributes: z
    .object({
      name: TextSchema,
      version: TextSchema.optional(),
      category: TextSchema.optional(),
    })
    .strict(),
});

export const LocationEntitySchema = EntityCommonSchema.extend({
  type: z.literal('location'),
  attributes: z
    .object({
      name: TextSchema,
      country: TextSchema.optional(),
      coordinates: z
        .object({
          latitude: z.number().finite().min(-90).max(90),
          longitude: z.number().finite().min(-180).max(180),
        })
        .strict()
        .optional(),
    })
    .strict(),
});

/**
 * A discriminated union represents variants identified by a shared literal field.
 * Zod reads `type` to select exactly one of the nine schemas, then validates that
 * variant's attributes. TypeScript uses the same discriminator to narrow Entity.
 */
export const EntitySchema = z.discriminatedUnion('type', [
  PersonEntitySchema,
  CompanyEntitySchema,
  DomainEntitySchema,
  IpEntitySchema,
  EmailEntitySchema,
  UrlEntitySchema,
  RepositoryEntitySchema,
  TechnologyEntitySchema,
  LocationEntitySchema,
]);
