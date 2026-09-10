import type { Entity } from '@osint-tool/entities';
import type { ResolutionInput } from '../../services/entity-resolver.js';

export function resolutionInput(entity: Entity, id: string): ResolutionInput {
  return {
    entity,
    origin: {
      id,
      evidence_id: `evidence-${id}`,
      source_ref: {
        connector_name: `source-${id}`,
        query: 'public records',
        timestamp: new Date('2026-09-01T00:00:00Z'),
        parameters: { filters: { tags: ['public', id] } },
      },
    },
  };
}

export function personInput(name: string, id: string, aliases?: string[]): ResolutionInput {
  return resolutionInput(
    {
      type: 'person',
      confidence: 0.7,
      attributes: { name, ...(aliases === undefined ? {} : { aliases }) },
    },
    id,
  );
}

// Same spelling is not a cross-type identity; no synthetic entity fields are used.
export const identicalLabels: Entity[] = [
  { type: 'person', confidence: 0.7, attributes: { name: 'Atlas' } },
  { type: 'company', confidence: 0.8, attributes: { name: 'Atlas' } },
  { type: 'technology', confidence: 0.9, attributes: { name: 'Atlas' } },
  { type: 'location', confidence: 1, attributes: { name: 'Atlas' } },
];
