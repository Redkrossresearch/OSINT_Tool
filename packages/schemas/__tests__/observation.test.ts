import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { ObservationSchema } from '../src/observation.js';

const validObservation = {
  id: 'obs-001',
  evidence_id: 'evidence-001',
  type: 'WEB_PAGE',
  data: {
    title: 'Example',
    url: 'https://example.com',
  },
  confidence: 0.85,
  source_ref: {
    connector_name: 'web-search',
    query: 'example.com',
    timestamp: new Date(),
    parameters: {
      limit: 10,
    },
  },
  timestamp: new Date(),
};

describe('ObservationSchema', () => {
  it('accepts valid observation data', () => {
    const result = ObservationSchema.safeParse(validObservation);

    assert.equal(result.success, true);
  });

  it('rejects confidence below 0', () => {
    const result = ObservationSchema.safeParse({
      ...validObservation,
      confidence: -0.1,
    });

    assert.equal(result.success, false);
  });

  it('rejects confidence above 1', () => {
    const result = ObservationSchema.safeParse({
      ...validObservation,
      confidence: 1.1,
    });

    assert.equal(result.success, false);
  });

  it('rejects observation without source_ref', () => {
    const withoutSourceRef = { ...validObservation };
    delete withoutSourceRef.source_ref;

    const result = ObservationSchema.safeParse(withoutSourceRef);

    assert.equal(result.success, false);
  });
});
