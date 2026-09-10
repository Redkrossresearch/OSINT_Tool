import { ConfidenceSchema, type Entity } from '@osint-tool/entities';
import {
  ObservationSchema,
  type Observation,
} from '../../../../packages/schemas/src/observation.js';
import { normalizeEntity } from './entity-normalizer.js';

const OriginSchema = ObservationSchema.pick({ id: true, evidence_id: true, source_ref: true });
export type ResolutionOrigin = Pick<Observation, 'id' | 'evidence_id' | 'source_ref'>;

export interface ResolutionInput {
  readonly entity: Entity;
  /** The caller retains the observation association lost by extractEntities' Entity[]. */
  readonly origin: ResolutionOrigin;
}

export interface ResolutionEvidence {
  field: string;
  kind: 'exact' | 'shared_attribute' | 'fuzzy' | 'conflict';
  values: [string, string];
  reason: string;
  similarity?: number;
  distance?: number;
}

export interface ResolutionResult {
  /** A comparison candidate, never an assertion that records were merged. */
  status: 'candidate' | 'conflict' | 'none';
  method: 'exact' | 'shared_attribute' | 'fuzzy' | 'none';
  confidence: number;
  evidence: ResolutionEvidence[];
  reason: string;
  source: [ResolutionOrigin, ResolutionOrigin];
  originals: [Entity, Entity];
  /** ADR-004 score condition only; caller still needs a provenance-writing workflow. */
  meetsMergeScoreRequirement: boolean;
  requiresHumanConfirmation: boolean;
}

// Resource bound, not a resolution threshold. Reject rather than truncate identity.
export const MAX_COMPARISON_LENGTH = 1024;

/** Unicode code-point distance: O(m*n) time, O(min(m,n)) DP row plus O(m+n) code points. */
export function levenshteinDistance(left: string, right: string): number {
  if (left.length > MAX_COMPARISON_LENGTH || right.length > MAX_COMPARISON_LENGTH) {
    throw new RangeError(
      `Comparison strings must be at most ${MAX_COMPARISON_LENGTH} UTF-16 units.`,
    );
  }
  let a = Array.from(left);
  let b = Array.from(right);
  if (a.length < b.length) [a, b] = [b, a];
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const previous = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + Number(a[i - 1] !== b[j - 1]));
      diagonal = previous;
    }
  }
  return row[b.length];
}

interface Identity {
  field: string;
  value: string;
  textual: boolean;
  identifiers: Record<string, string>;
  aliases: string[];
}

function identity(entity: Entity): Identity {
  const base = { textual: false, identifiers: {}, aliases: [] };
  switch (entity.type) {
    case 'person':
      return {
        ...base,
        field: 'name',
        value: entity.attributes.name,
        textual: true,
        aliases: entity.attributes.aliases ?? [],
      };
    case 'company':
      return {
        ...base,
        field: 'name',
        value: entity.attributes.name,
        textual: true,
        identifiers:
          entity.attributes.domain === undefined ? {} : { domain: entity.attributes.domain },
      };
    case 'domain':
      return { ...base, field: 'domain', value: entity.attributes.domain };
    case 'ip':
    case 'email':
      return { ...base, field: 'address', value: entity.attributes.address };
    case 'url':
      return { ...base, field: 'url', value: entity.attributes.url };
    case 'repository':
      return {
        ...base,
        field: 'owner/name',
        value: JSON.stringify([entity.attributes.owner, entity.attributes.name]),
        identifiers: { url: entity.attributes.url },
      };
    case 'technology':
      return {
        ...base,
        field: 'name',
        value: entity.attributes.name,
        textual: true,
        identifiers:
          entity.attributes.version === undefined ? {} : { version: entity.attributes.version },
      };
    case 'location':
      return {
        ...base,
        field: 'name',
        value: entity.attributes.name,
        textual: true,
        identifiers: {
          ...(entity.attributes.country === undefined
            ? {}
            : { country: entity.attributes.country }),
          ...(entity.attributes.coordinates === undefined
            ? {}
            : {
                coordinates: JSON.stringify([
                  entity.attributes.coordinates.latitude,
                  entity.attributes.coordinates.longitude,
                ]),
              }),
        },
      };
  }
}

/**
 * Compare T3-003 Entity outputs with explicitly supplied observation provenance.
 * T3-002 is authoritative: no extra case folding or whitespace collapsing.
 * ADR-004 specifies exact=1, shared identifier=.8, and fuzzy in [.7,.9].
 * This implementation maps positive similarity linearly via .7+.2*similarity.
 * Fuzzy confidence is a policy score, not a calibrated same-person probability.
 * Zero similarity has no supporting evidence. Conflicts veto positive confidence
 * and require human confirmation; supporting evidence remains in the result.
 * Extraction confidence is preserved, never used as resolution confidence, and
 * T3-004's .85 auto-accept rule does not apply here. Shared aliases are weak name
 * evidence; version/country alone cannot identify an entity. No persistence,
 * mutation, generated IDs, timestamps, logging side effects, or merge operations.
 */
export function resolveEntities(left: ResolutionInput, right: ResolutionInput): ResolutionResult {
  const source: ResolutionResult['source'] = [
    OriginSchema.parse(left.origin),
    OriginSchema.parse(right.origin),
  ];
  const a = normalizeEntity(left.entity);
  const b = normalizeEntity(right.entity);
  const evidence: ResolutionEvidence[] = [];
  let method: ResolutionResult['method'] = 'none';
  let confidence = 0;
  let reason = 'Entity types are incompatible for same-entity resolution.';
  if (a.type === b.type) {
    const x = identity(a);
    const y = identity(b);
    reason = 'No matching identity evidence was found.';
    if (x.value === y.value) {
      evidence.push({
        field: x.field,
        kind: 'exact',
        values: [x.value, y.value],
        reason: 'Normalized identity values match exactly.',
      });
      method = 'exact';
      confidence = 1;
    } else if (x.textual) {
      if (x.value.length <= MAX_COMPARISON_LENGTH && y.value.length <= MAX_COMPARISON_LENGTH) {
        const distance = levenshteinDistance(x.value, y.value);
        const similarity =
          1 - distance / Math.max(Array.from(x.value).length, Array.from(y.value).length);
        evidence.push({
          field: x.field,
          kind: 'fuzzy',
          values: [x.value, y.value],
          distance,
          similarity,
          reason: `Normalized names have Levenshtein distance ${distance} and similarity ${similarity}; textual similarity does not establish identity.`,
        });
        method = 'fuzzy';
        confidence = similarity > 0 ? 0.7 + 0.2 * similarity : 0;
      } else {
        reason =
          'Fuzzy comparison skipped because an identity exceeds the comparison length limit.';
      }
    }
    for (const [field, value] of Object.entries(x.identifiers)) {
      const other = y.identifiers[field];
      if (other === undefined) continue;
      if (value !== other) {
        evidence.push({
          field,
          kind: 'conflict',
          values: [value, other],
          reason: `Normalized ${field} values conflict.`,
        });
      } else if (field !== 'version' && field !== 'country') {
        evidence.push({
          field,
          kind: 'shared_attribute',
          values: [value, other],
          reason: `Both entities share normalized ${field}; this is supporting evidence, not proof of identity.`,
        });
        if (method !== 'exact') {
          method = 'shared_attribute';
          confidence = 0.8;
        }
      }
    }
    if (a.type === 'person') {
      const names = new Set([y.value, ...y.aliases]);
      const shared = [...new Set([x.value, ...x.aliases])].filter((name) => names.has(name));
      for (const name of shared) {
        if (name === x.value && name === y.value) continue;
        evidence.push({
          field: 'aliases',
          kind: 'shared_attribute',
          values: [name, name],
          reason: 'A name/alias is shared; aliases are not unique identifiers.',
        });
        if (method !== 'exact') {
          method = 'shared_attribute';
          confidence = 0.8;
        }
      }
    }
    if (confidence > 0)
      reason = evidence
        .filter((item) => item.kind !== 'conflict')
        .map((item) => item.reason)
        .join(' ');
  }
  const conflict = evidence.some((item) => item.kind === 'conflict');
  if (conflict) {
    confidence = 0;
    reason =
      'Conflicting identifying attributes require human confirmation; supporting comparisons are retained in evidence.';
  }
  const meetsMergeScoreRequirement = confidence > 0.8;
  return structuredClone({
    status: conflict ? 'conflict' : confidence > 0 ? 'candidate' : 'none',
    method,
    confidence: ConfidenceSchema.parse(confidence),
    evidence,
    reason,
    source,
    originals: [left.entity, right.entity],
    meetsMergeScoreRequirement,
    requiresHumanConfirmation: !meetsMergeScoreRequirement,
  });
}
