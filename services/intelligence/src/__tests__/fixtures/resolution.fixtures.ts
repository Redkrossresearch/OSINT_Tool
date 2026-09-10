export interface Entity {
  id: string;
  type: 'Person' | 'Company' | 'Domain' | 'IP' | 'Email' | 'URL' | 'Repository' | 'Technology' | 'Location';
  canonical_name: string;
  attributes: Record<string, unknown>;
  confidence: number;
  created_at: Date;
}

export interface ResolutionResult {
  matched: boolean;
  confidence: number;
  reason: string;
  evidence: string[];
  source: string;
  requires_human_review: boolean;
}

export const personAlice: Entity = {
  id: 'ent-001',
  type: 'Person',
  canonical_name: 'Alice Johnson',
  attributes: {
    emails: ['alice@example.com'],
    social_profiles: ['https://github.com/alicej'],
  },
  confidence: 0.9,
  created_at: new Date('2026-01-15'),
};

export const personAliceFuzzy: Entity = {
  id: 'ent-002',
  type: 'Person',
  canonical_name: 'Alice Jonson',
  attributes: {
    emails: ['alice@example.com'],
    social_profiles: [],
  },
  confidence: 0.7,
  created_at: new Date('2026-02-10'),
};

export const personAliceDifferentCase: Entity = {
  id: 'ent-003',
  type: 'Person',
  canonical_name: 'alice johnson',
  attributes: {
    emails: ['Alice@Example.com'],
    social_profiles: ['https://github.com/alicej'],
  },
  confidence: 0.85,
  created_at: new Date('2026-01-20'),
};

export const personBob: Entity = {
  id: 'ent-010',
  type: 'Person',
  canonical_name: 'Bob Smith',
  attributes: {
    emails: ['bob@different.org'],
    social_profiles: [],
  },
  confidence: 0.8,
  created_at: new Date('2026-03-01'),
};

export const personBobDifferentEmail: Entity = {
  id: 'ent-011',
  type: 'Person',
  canonical_name: 'Robert Smith',
  attributes: {
    emails: ['robert@different.org'],
    social_profiles: [],
  },
  confidence: 0.75,
  created_at: new Date('2026-03-05'),
};

export const domainExample: Entity = {
  id: 'ent-020',
  type: 'Domain',
  canonical_name: 'example.com',
  attributes: {
    registrar: 'GoDaddy',
    creation_date: '2000-01-01',
  },
  confidence: 0.95,
  created_at: new Date('2026-01-10'),
};

export const domainExampleTrailingDot: Entity = {
  id: 'ent-021',
  type: 'Domain',
  canonical_name: 'example.com.',
  attributes: {
    registrar: 'GoDaddy',
    creation_date: '2000-01-01',
  },
  confidence: 0.9,
  created_at: new Date('2026-01-12'),
};

export const domainAcme: Entity = {
  id: 'ent-022',
  type: 'Domain',
  canonical_name: 'acme.com',
  attributes: {
    registrar: 'Namecheap',
    creation_date: '1998-05-15',
  },
  confidence: 0.88,
  created_at: new Date('2026-02-20'),
};

export const ipAddr: Entity = {
  id: 'ent-030',
  type: 'IP',
  canonical_name: '192.168.1.100',
  attributes: {
    version: 4,
    geolocation: 'US',
  },
  confidence: 0.92,
  created_at: new Date('2026-01-18'),
};

export const ipAddrDuplicate: Entity = {
  id: 'ent-031',
  type: 'IP',
  canonical_name: '192.168.1.100',
  attributes: {
    version: 4,
    geolocation: 'US',
  },
  confidence: 0.85,
  created_at: new Date('2026-01-19'),
};

export const emailA: Entity = {
  id: 'ent-040',
  type: 'Email',
  canonical_name: 'alice@example.com',
  attributes: { domain: 'example.com' },
  confidence: 0.9,
  created_at: new Date('2026-01-15'),
};

export const emailADuplicate: Entity = {
  id: 'ent-041',
  type: 'Email',
  canonical_name: 'ALICE@EXAMPLE.COM',
  attributes: { domain: 'example.com' },
  confidence: 0.88,
  created_at: new Date('2026-01-16'),
};

export const companyAcmeA: Entity = {
  id: 'ent-050',
  type: 'Company',
  canonical_name: 'Acme Corp',
  attributes: { domain: 'acme.com', industry: 'tech' },
  confidence: 0.91,
  created_at: new Date('2026-02-01'),
};

export const companyAcmeB: Entity = {
  id: 'ent-051',
  type: 'Company',
  canonical_name: 'Acme Corporation',
  attributes: { domain: 'acme.com', industry: 'technology' },
  confidence: 0.7,
  created_at: new Date('2026-02-05'),
};

export const urlEntityA: Entity = {
  id: 'ent-060',
  type: 'URL',
  canonical_name: 'https://example.com/page?q=1',
  attributes: { domain: 'example.com', path: '/page' },
  confidence: 0.9,
  created_at: new Date('2026-01-20'),
};

export const urlEntityB: Entity = {
  id: 'ent-061',
  type: 'URL',
  canonical_name: 'https://example.com/page?q=2',
  attributes: { domain: 'example.com', path: '/page' },
  confidence: 0.85,
  created_at: new Date('2026-01-21'),
};

export const repoA: Entity = {
  id: 'ent-070',
  type: 'Repository',
  canonical_name: 'user/project-alpha',
  attributes: { owner: 'user', language: 'TypeScript' },
  confidence: 0.93,
  created_at: new Date('2026-03-01'),
};

export const repoB: Entity = {
  id: 'ent-071',
  type: 'Repository',
  canonical_name: 'user/project-beta',
  attributes: { owner: 'user', language: 'Python' },
  confidence: 0.87,
  created_at: new Date('2026-03-02'),
};

export const locationA: Entity = {
  id: 'ent-080',
  type: 'Location',
  canonical_name: 'San Francisco, CA, USA',
  attributes: { country: 'USA', coordinates: { lat: 37.7749, lng: -122.4194 } },
  confidence: 0.88,
  created_at: new Date('2026-01-15'),
};

export const locationB: Entity = {
  id: 'ent-081',
  type: 'Location',
  canonical_name: 'San Francisco, California, USA',
  attributes: { country: 'USA', coordinates: { lat: 37.7749, lng: -122.4194 } },
  confidence: 0.82,
  created_at: new Date('2026-01-16'),
};

export const entityEmpty: Entity = {
  id: 'ent-090',
  type: 'Person',
  canonical_name: '',
  attributes: {},
  confidence: 0.5,
  created_at: new Date('2026-01-01'),
};

export const entityUnicode: Entity = {
  id: 'ent-100',
  type: 'Person',
  canonical_name: 'José García',
  attributes: { emails: ['jose@unicode.dev'] },
  confidence: 0.88,
  created_at: new Date('2026-02-20'),
};

export const entityUnicodeNFC: Entity = {
  id: 'ent-101',
  type: 'Person',
  canonical_name: 'José García',
  attributes: { emails: ['jose@unicode.dev'] },
  confidence: 0.9,
  created_at: new Date('2026-02-21'),
};

export const entityWithNulls: Entity = {
  id: 'ent-110',
  type: 'Domain',
  canonical_name: 'test.io',
  attributes: { registrar: null, creation_date: null },
  confidence: 0.6,
  created_at: new Date('2026-04-01'),
};

export const entityLongName: Entity = {
  id: 'ent-120',
  type: 'Technology',
  canonical_name: 'A'.repeat(500),
  attributes: { version: '1.0.0', category: 'framework' },
  confidence: 0.95,
  created_at: new Date('2026-05-01'),
};

export const entityCrossTypeA: Entity = {
  id: 'ent-130',
  type: 'Person',
  canonical_name: 'test.io',
  attributes: { emails: [] },
  confidence: 0.7,
  created_at: new Date('2026-01-01'),
};

export const entityCrossTypeB: Entity = {
  id: 'ent-131',
  type: 'Domain',
  canonical_name: 'test.io',
  attributes: { registrar: 'Namecheap', creation_date: '2015-01-01' },
  confidence: 0.9,
  created_at: new Date('2026-01-01'),
};
