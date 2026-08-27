import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ObjectiveType,
  ObjectiveTypeSchema,
  ObjectiveSchema,
  ObjectiveCreateSchema,
} from '../src/objective.js';

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_UUID_2 = '550e8400-e29b-41d4-a716-446655440001';
const VALID_DATE = '2024-01-01T00:00:00.000Z';

describe('ObjectiveType', () => {
  it('should contain all four objective type values', () => {
    assert.equal(ObjectiveType.PERSON, 'PERSON');
    assert.equal(ObjectiveType.DOMAIN, 'DOMAIN');
    assert.equal(ObjectiveType.COMPANY, 'COMPANY');
    assert.equal(ObjectiveType.IP, 'IP');
  });
});

describe('ObjectiveTypeSchema', () => {
  it('should accept PERSON', () => {
    const result = ObjectiveTypeSchema.safeParse('PERSON');
    assert.equal(result.success, true);
  });

  it('should accept DOMAIN', () => {
    const result = ObjectiveTypeSchema.safeParse('DOMAIN');
    assert.equal(result.success, true);
  });

  it('should accept COMPANY', () => {
    const result = ObjectiveTypeSchema.safeParse('COMPANY');
    assert.equal(result.success, true);
  });

  it('should accept IP', () => {
    const result = ObjectiveTypeSchema.safeParse('IP');
    assert.equal(result.success, true);
  });

  it('should reject invalid type', () => {
    const result = ObjectiveTypeSchema.safeParse('INVALID');
    assert.equal(result.success, false);
  });
});

describe('ObjectiveCreateSchema - PERSON type', () => {
  it('should accept valid PERSON objective with required fields', () => {
    const valid = {
      type: ObjectiveType.PERSON,
      name: 'John Doe',
    };
    const result = ObjectiveCreateSchema.safeParse(valid);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.type, 'PERSON');
      assert.equal(result.data.name, 'John Doe');
    }
  });

  it('should accept PERSON with optional aliases', () => {
    const valid = {
      type: ObjectiveType.PERSON,
      name: 'John Doe',
      aliases: ['JD', 'Johnny'],
    };
    const result = ObjectiveCreateSchema.safeParse(valid);
    assert.equal(result.success, true);
  });

  it('should reject PERSON when name is missing', () => {
    const invalid = {
      type: ObjectiveType.PERSON,
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  it('should reject PERSON when name is empty', () => {
    const invalid = {
      type: ObjectiveType.PERSON,
      name: '',
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });
});

describe('ObjectiveCreateSchema - DOMAIN type', () => {
  it('should accept valid DOMAIN objective', () => {
    const valid = {
      type: ObjectiveType.DOMAIN,
      domain: 'example.com',
    };
    const result = ObjectiveCreateSchema.safeParse(valid);
    assert.equal(result.success, true);
  });

  it('should accept valid DOMAIN with subdomain', () => {
    const valid = {
      type: ObjectiveType.DOMAIN,
      domain: 'sub.example.co.uk',
    };
    const result = ObjectiveCreateSchema.safeParse(valid);
    assert.equal(result.success, true);
  });

  it('should reject DOMAIN when domain is missing', () => {
    const invalid = {
      type: ObjectiveType.DOMAIN,
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  it('should reject invalid domain format', () => {
    const invalid = {
      type: ObjectiveType.DOMAIN,
      domain: 'not a domain',
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  it('should reject empty domain', () => {
    const invalid = {
      type: ObjectiveType.DOMAIN,
      domain: '',
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });
});

describe('ObjectiveCreateSchema - COMPANY type', () => {
  it('should accept valid COMPANY objective', () => {
    const valid = {
      type: ObjectiveType.COMPANY,
      company_name: 'Acme Corp',
    };
    const result = ObjectiveCreateSchema.safeParse(valid);
    assert.equal(result.success, true);
  });

  it('should accept COMPANY with optional registration number', () => {
    const valid = {
      type: ObjectiveType.COMPANY,
      company_name: 'Acme Corp',
      registration_number: 'CIN123456',
    };
    const result = ObjectiveCreateSchema.safeParse(valid);
    assert.equal(result.success, true);
  });

  it('should reject COMPANY when company_name is missing', () => {
    const invalid = {
      type: ObjectiveType.COMPANY,
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  it('should reject COMPANY when company_name is empty', () => {
    const invalid = {
      type: ObjectiveType.COMPANY,
      company_name: '',
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });
});

describe('ObjectiveCreateSchema - IP type', () => {
  it('should accept valid IPv4 address', () => {
    const valid = {
      type: ObjectiveType.IP,
      ip_address: '192.168.1.1',
    };
    const result = ObjectiveCreateSchema.safeParse(valid);
    assert.equal(result.success, true);
  });

  it('should accept valid IPv6 address', () => {
    const valid = {
      type: ObjectiveType.IP,
      ip_address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    };
    const result = ObjectiveCreateSchema.safeParse(valid);
    assert.equal(result.success, true);
  });

  it('should reject IP when ip_address is missing', () => {
    const invalid = {
      type: ObjectiveType.IP,
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  it('should reject invalid IP address', () => {
    const invalid = {
      type: ObjectiveType.IP,
      ip_address: '999.999.999.999',
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  it('should reject empty IP address', () => {
    const invalid = {
      type: ObjectiveType.IP,
      ip_address: '',
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });
});

describe('ObjectiveCreateSchema - invalid discriminator tests', () => {
  it('should reject objective with missing type discriminator', () => {
    const invalid = {
      name: 'John Doe',
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  it('should reject objective with invalid type', () => {
    const invalid = {
      type: 'DEVICE',
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  it('should reject objective with PERSON type but domain-specific field', () => {
    const invalid = {
      type: ObjectiveType.PERSON,
      domain: 'example.com',
    };
    const result = ObjectiveCreateSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });
});

describe('ObjectiveSchema (response/ full records', () => {
  it('should accept valid PERSON response with all metadata', () => {
    const valid = {
      id: VALID_UUID,
      investigation_id: VALID_UUID_2,
      type: ObjectiveType.PERSON,
      name: 'John Doe',
      created_at: VALID_DATE,
      updated_at: VALID_DATE,
    };
    const result = ObjectiveSchema.safeParse(valid);
    assert.equal(result.success, true);
    if (result.success) {
      assert.ok(result.data.created_at instanceof Date);
      assert.ok(result.data.updated_at instanceof Date);
    }
  });

  it('should accept valid DOMAIN response', () => {
    const valid = {
      id: VALID_UUID,
      investigation_id: VALID_UUID_2,
      type: ObjectiveType.DOMAIN,
      domain: 'example.com',
      created_at: VALID_DATE,
      updated_at: VALID_DATE,
    };
    const result = ObjectiveSchema.safeParse(valid);
    assert.equal(result.success, true);
  });

  it('should reject PERSON response when id is invalid UUID', () => {
    const invalid = {
      id: 'not-a-uuid',
      investigation_id: VALID_UUID_2,
      type: ObjectiveType.PERSON,
      name: 'John Doe',
      created_at: VALID_DATE,
      updated_at: VALID_DATE,
    };
    const result = ObjectiveSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  it('should reject response when missing common fields', () => {
    const invalid = {
      type: ObjectiveType.COMPANY,
      company_name: 'Acme Corp',
    };
    const result = ObjectiveSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });
});
