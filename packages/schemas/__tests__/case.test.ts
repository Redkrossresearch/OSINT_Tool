import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CaseStatus,
  CaseStatusSchema,
  CaseCreateSchema,
  CaseUpdateSchema,
  CaseResponseSchema,
} from '../src/case.js';

describe('CaseStatus', () => {
  it('should contain valid status values', () => {
    assert.equal(CaseStatus.OPEN, 'OPEN');
    assert.equal(CaseStatus.ACTIVE, 'ACTIVE');
    assert.equal(CaseStatus.CLOSED, 'CLOSED');
  });
});

describe('CaseStatusSchema', () => {
  it('should accept OPEN status', () => {
    const result = CaseStatusSchema.safeParse('OPEN');
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data, 'OPEN');
    }
  });

  it('should accept ACTIVE status', () => {
    const result = CaseStatusSchema.safeParse('ACTIVE');
    assert.equal(result.success, true);
  });

  it('should accept CLOSED status', () => {
    const result = CaseStatusSchema.safeParse('CLOSED');
    assert.equal(result.success, true);
  });

  it('should reject invalid status', () => {
    const result = CaseStatusSchema.safeParse('INVALID');
    assert.equal(result.success, false);
  });
});

describe('CaseCreateSchema', () => {
  it('should pass validation for valid case with required fields', () => {
    const validCase = {
      title: 'Investigate phishing domain',
    };
    const result = CaseCreateSchema.safeParse(validCase);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.title, 'Investigate phishing domain');
      assert.equal(result.data.status, CaseStatus.OPEN);
      assert.equal(result.data.description, undefined);
    }
  });

  it('should pass validation with optional description', () => {
    const validCase = {
      title: 'Investigate phishing domain',
      description: 'Domain was used to send phishing emails',
      status: CaseStatus.ACTIVE,
    };
    const result = CaseCreateSchema.safeParse(validCase);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.description, 'Domain was used to send phishing emails');
      assert.equal(result.data.status, CaseStatus.ACTIVE);
    }
  });

  it('should fail validation when title is missing', () => {
    const invalidCase = {
      description: 'No title',
    };
    const result = CaseCreateSchema.safeParse(invalidCase);
    assert.equal(result.success, false);
  });

  it('should fail validation when title is empty string', () => {
    const invalidCase = {
      title: '',
    };
    const result = CaseCreateSchema.safeParse(invalidCase);
    assert.equal(result.success, false);
  });

  it('should fail validation with invalid status', () => {
    const invalidCase = {
      title: 'Valid title',
      status: 'NOT_A_STATUS',
    };
    const result = CaseCreateSchema.safeParse(invalidCase);
    assert.equal(result.success, false);
  });
});

describe('CaseUpdateSchema', () => {
  it('should allow partial updates with just title', () => {
    const update = { title: 'Updated title' };
    const result = CaseUpdateSchema.safeParse(update);
    assert.equal(result.success, true);
  });

  it('should allow partial updates with just description', () => {
    const update = { description: 'New description' };
    const result = CaseUpdateSchema.safeParse(update);
    assert.equal(result.success, true);
  });

  it('should allow empty update object', () => {
    const update = {};
    const result = CaseUpdateSchema.safeParse(update);
    assert.equal(result.success, true);
  });

  it('should fail with invalid status', () => {
    const update = { status: 'INVALID' };
    const result = CaseUpdateSchema.safeParse(update);
    assert.equal(result.success, false);
  });
});

describe('CaseResponseSchema', () => {
  it('should pass validation for valid response', () => {
    const validResponse = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'My Case',
      description: 'A case',
      status: CaseStatus.ACTIVE,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T12:00:00.000Z',
    };
    const result = CaseResponseSchema.safeParse(validResponse);
    assert.equal(result.success, true);
    if (result.success) {
      assert.ok(result.data.created_at instanceof Date);
      assert.ok(result.data.updated_at instanceof Date);
    }
  });

  it('should fail validation when id is not a UUID', () => {
    const invalidResponse = {
      id: 'not-a-uuid',
      title: 'My Case',
      status: CaseStatus.OPEN,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    };
    const result = CaseResponseSchema.safeParse(invalidResponse);
    assert.equal(result.success, false);
  });

  it('should fail validation when required fields are missing', () => {
    const invalidResponse = {
      title: 'My Case',
    };
    const result = CaseResponseSchema.safeParse(invalidResponse);
    assert.equal(result.success, false);
  });
});
