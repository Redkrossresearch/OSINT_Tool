import { EntitySchema, IpEntitySchema, type Entity } from '@osint-tool/entities';

// NFC composes canonically equivalent Unicode sequences (e.g. e + accent).
// Canonicalization applies stable field-specific rules without changing display casing.
const text = (value: string): string => value.normalize('NFC').trim();
const optionalText = (value: string | undefined): string | undefined =>
  value === undefined ? undefined : text(value);
const domain = (value: string): string => text(value).toLowerCase().replace(/\.$/, '');

function ip(value: string): string {
  const address = text(value);
  // Validate before URL parsing, which would otherwise accept non-standard IPv4 forms.
  IpEntitySchema.parse({ type: 'ip', confidence: 1, attributes: { address } });
  return address.includes(':') ? new URL(`http://[${address}]/`).hostname.slice(1, -1) : address;
}

/**
 * Accepts the Entity structure with unnormalized string values; validates the
 * normalized result with T3-001. Invalid values throw rather than receiving defaults.
 * Names/aliases/metadata: NFC + outer trim, preserving case and internal whitespace.
 * Domains: NFC + trim + lowercase + remove one terminal dot. Emails: NFC + trim +
 * lowercase (including the local part, per T3-002); tags and dots remain intact.
 * IPs: strict IP validation, then IPv6 compression/lowercasing via the URL parser.
 * URLs: outer trim only, preserving case, escaping, query order, and fragments.
 * Confidence and coordinates are unchanged. Parsing returns a detached object;
 * inputs are never mutated. Every rule is deterministic and idempotent.
 */
export function normalizeEntity(entity: Entity): Entity {
  let normalized: Entity;
  switch (entity.type) {
    case 'person':
      normalized = {
        ...entity,
        attributes: {
          ...entity.attributes,
          name: text(entity.attributes.name),
          ...(entity.attributes.aliases !== undefined
            ? { aliases: entity.attributes.aliases.map(text) }
            : {}),
        },
      };
      break;
    case 'company':
      normalized = {
        ...entity,
        attributes: {
          ...entity.attributes,
          name: text(entity.attributes.name),
          ...(entity.attributes.domain !== undefined
            ? { domain: domain(entity.attributes.domain) }
            : {}),
          ...(entity.attributes.industry !== undefined
            ? { industry: optionalText(entity.attributes.industry) }
            : {}),
        },
      };
      break;
    case 'domain':
      normalized = {
        ...entity,
        attributes: { ...entity.attributes, domain: domain(entity.attributes.domain) },
      };
      break;
    case 'ip':
      normalized = {
        ...entity,
        attributes: { ...entity.attributes, address: ip(entity.attributes.address) },
      };
      break;
    case 'email':
      normalized = {
        ...entity,
        attributes: {
          ...entity.attributes,
          address: text(entity.attributes.address).toLowerCase().normalize('NFC'),
        },
      };
      break;
    case 'url':
      normalized = {
        ...entity,
        attributes: { ...entity.attributes, url: entity.attributes.url.trim() },
      };
      break;
    case 'repository':
      normalized = {
        ...entity,
        attributes: {
          ...entity.attributes,
          name: text(entity.attributes.name),
          owner: text(entity.attributes.owner),
          url: entity.attributes.url.trim(),
          ...(entity.attributes.language !== undefined
            ? { language: optionalText(entity.attributes.language) }
            : {}),
        },
      };
      break;
    case 'technology':
      normalized = {
        ...entity,
        attributes: {
          ...entity.attributes,
          name: text(entity.attributes.name),
          ...(entity.attributes.version !== undefined
            ? { version: optionalText(entity.attributes.version) }
            : {}),
          ...(entity.attributes.category !== undefined
            ? { category: optionalText(entity.attributes.category) }
            : {}),
        },
      };
      break;
    case 'location':
      normalized = {
        ...entity,
        attributes: {
          ...entity.attributes,
          name: text(entity.attributes.name),
          ...(entity.attributes.country !== undefined
            ? { country: optionalText(entity.attributes.country) }
            : {}),
        },
      };
      break;
    default: {
      const exhaustive: never = entity;
      throw new TypeError(`Unsupported entity: ${String(exhaustive)}`);
    }
  }
  return EntitySchema.parse(normalized);
}
