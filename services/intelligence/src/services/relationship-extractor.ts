import {
  EntitySchema,
  EntityRefSchema,
  RelationshipSchema,
  type Entity,
  type EntityRef,
  type Relationship,
  type RelationshipType,
} from '@osint-tool/entities';
import {
  ObservationSchema,
  type Observation,
} from '../../../../packages/schemas/src/observation.js';

/** Caller-owned identity association; no persistence or ID generation is performed. */
export interface RelationshipCandidate {
  readonly entity: Entity;
  readonly ref: EntityRef;
}

const FIELDS = ['title', 'text', 'content', 'description', 'url'] as const;
const MAX_CANDIDATES = 128;
const MAX_TEXT_LENGTH = 32_000;
const MAX_MENTIONS = 2048;
const MAX_GAP = 80;

const PATTERNS: ReadonlyArray<readonly [RelationshipType, RegExp]> = [
  ['OWNS', /^\s+owns\s+$/i],
  ['WORKS_FOR', /^\s+works for\s+$/i],
  ['USES', /^\s+uses\s+$/i],
  ['HOSTED_ON', /^\s+(?:is )?hosted on\s+$/i],
  ['REGISTERED_TO', /^\s+(?:is )?registered to\s+$/i],
  ['RESOLVES_TO', /^\s+resolves to\s+$/i],
];

function label(entity: Entity): string {
  switch (entity.type) {
    case 'domain':
      return entity.attributes.domain;
    case 'email':
    case 'ip':
      return entity.attributes.address;
    case 'url':
    case 'repository':
      return entity.attributes.url;
    default:
      return entity.attributes.name;
  }
}

interface Mention {
  start: number;
  end: number;
  candidate: RelationshipCandidate;
}

const identityCharacter = /[\p{L}\p{N}_@./:-]/u;

/**
 * Scan only existing T3-003 text fields, in field/text order. Match exact primary
 * labels (repository URL), without normalization or guessing aliases/identities.
 * Reject overlapping mentions: identical names with different IDs are ambiguous.
 * MENTIONS asserts only literal appearance, including in negated/quoted text.
 * Strong edges require an entire unqualified clause: "<source> <verb> <target>".
 * Adjacent mentions separated only by whitespace, comma, &, or "and", within 80
 * UTF-16 units in one clause, yield ASSOCIATED_WITH in textual order, never ownership.
 * Scores are local rule strengths, not calibrated probabilities or accept thresholds:
 * min(observation confidence, involved entity confidence) * 1/.9/.5 for literal
 * mention/explicit predicate/proximity. Evidence always uses observation.evidence_id.
 * Keep the first exact edge per type/endpoints/evidence; never merge entity identities.
 * Invalid inputs and conflicting ID assignments throw; insufficient text returns [].
 * Resource limits reject oversized inputs rather than silently truncate evidence.
 */
export function extractRelationships(
  observation: Observation,
  candidates: readonly RelationshipCandidate[],
): Relationship[] {
  const input = ObservationSchema.parse(observation);
  if (!Array.isArray(candidates)) throw new TypeError('Candidates must be an array.');
  if (candidates.length > MAX_CANDIDATES)
    throw new RangeError('At most 128 candidates are supported.');
  const unique = new Map<string, RelationshipCandidate>();
  for (const candidate of candidates) {
    const entity = EntitySchema.parse(candidate?.entity);
    const ref = EntityRefSchema.parse(candidate?.ref);
    if (entity.type !== ref.type)
      throw new TypeError('Entity reference type must match entity type.');
    const previous = unique.get(ref.id);
    if (previous && JSON.stringify(previous.entity) !== JSON.stringify(entity)) {
      throw new TypeError('One entity ID cannot identify conflicting candidates.');
    }
    if (!previous) unique.set(ref.id, { entity, ref });
  }
  const texts = FIELDS.map((field) => input.data[field]).filter(
    (value): value is string => typeof value === 'string',
  );
  if (texts.reduce((size, text) => size + text.length, 0) > MAX_TEXT_LENGTH) {
    throw new RangeError('Observation text must not exceed 32000 UTF-16 units.');
  }
  const result: Relationship[] = [];
  const seen = new Set<string>();
  const evidence = { kind: 'evidence' as const, id: input.evidence_id };
  let mentionCount = 0;
  function emit(
    type: RelationshipType,
    source: RelationshipCandidate | undefined,
    target: RelationshipCandidate,
    strength: number,
  ): void {
    const parsed = RelationshipSchema.safeParse({
      type,
      source: source?.ref ?? evidence,
      target: target.ref,
      confidence:
        Math.min(input.confidence, target.entity.confidence, source?.entity.confidence ?? 1) *
        strength,
      evidence: [evidence],
    });
    if (!parsed.success) return; // T3-006 alone decides legal endpoint combinations.
    const key = JSON.stringify([
      type,
      parsed.data.source.kind,
      parsed.data.source.id,
      target.ref.id,
      input.evidence_id,
    ]);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(parsed.data);
    }
  }
  for (const text of texts) {
    const mentions: Mention[] = [];
    for (const candidate of unique.values()) {
      const name = label(candidate.entity);
      let offset = 0;
      while (offset < text.length) {
        const start = text.indexOf(name, offset);
        if (start < 0) break;
        const end = start + name.length;
        offset = end;
        const before = text[start - 1];
        const after = text[end];
        // A final sentence dot is punctuation, whereas a dot inside a hostname is not.
        const sentenceDot =
          after === '.' && (text[end + 1] === undefined || /\s/.test(text[end + 1]));
        if (
          (before && identityCharacter.test(before)) ||
          (after && identityCharacter.test(after) && !sentenceDot)
        )
          continue;
        if (++mentionCount > MAX_MENTIONS)
          throw new RangeError('At most 2048 textual mentions are supported.');
        mentions.push({ start, end, candidate });
      }
    }
    mentions.sort(
      (a, b) =>
        a.start - b.start || a.end - b.end || a.candidate.ref.id.localeCompare(b.candidate.ref.id),
    );
    const unambiguous = mentions.filter(
      (mention, index) =>
        !mentions.some(
          (other, otherIndex) =>
            index !== otherIndex && mention.start < other.end && other.start < mention.end,
        ),
    );
    for (const mention of unambiguous) emit('MENTIONS', undefined, mention.candidate, 1);
    for (let index = 0; index + 1 < unambiguous.length; index++) {
      const left = unambiguous[index];
      const right = unambiguous[index + 1];
      const gap = text.slice(left.end, right.start);
      if (gap.length > MAX_GAP || /[;\n!?]|\.(?:\s|$)/.test(gap)) continue;
      const prefix =
        text
          .slice(0, left.start)
          .split(/[;\n!?]|\.(?=\s|$)/)
          .at(-1) ?? '';
      const remaining = text.slice(right.end);
      const suffix = remaining.split(/[;\n!?]|\.(?=\s|$)/)[0];
      const terminator = /[;\n!?]|\.(?=\s|$)/.exec(remaining)?.[0];
      // Anchoring the whole clause excludes negation, uncertainty, and quoted claims.
      if (!prefix.trim() && !suffix.trim() && terminator !== '?') {
        for (const [type, pattern] of PATTERNS) {
          if (pattern.test(gap)) emit(type, left.candidate, right.candidate, 0.9);
        }
      }
      if (/^(?:\s|,|&|\band\b)+$/i.test(gap)) {
        emit('ASSOCIATED_WITH', left.candidate, right.candidate, 0.5);
      }
    }
  }
  return result;
}
