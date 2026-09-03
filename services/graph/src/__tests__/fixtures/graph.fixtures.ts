export interface GraphEntity {
  id: string;
  type: 'Person' | 'Company' | 'Domain' | 'IP' | 'Email' | 'URL' | 'Repository' | 'Technology' | 'Location';
  canonical_name: string;
  attributes: Record<string, unknown>;
  confidence: number;
  created_at: Date;
}

export interface GraphRelationship {
  id: string;
  source_entity_id: string;
  target_entity_id: string;
  type: 'OWNS' | 'WORKS_FOR' | 'USES' | 'HOSTED_ON' | 'REGISTERED_TO' | 'MENTIONS' | 'ASSOCIATED_WITH' | 'RESOLVES_TO';
  confidence: number;
  evidence_id: string;
  valid_from: Date;
  valid_to: Date | null;
  attributes: Record<string, unknown>;
}

export interface NeighborhoodResult {
  entity: GraphEntity;
  neighbors: Array<{ entity: GraphEntity; relationship: GraphRelationship }>;
  depth: number;
}

export interface PathResult {
  path: GraphEntity[];
  relationships: GraphRelationship[];
  total_hops: number;
}

export interface SubgraphResult {
  entities: GraphEntity[];
  relationships: GraphRelationship[];
}

export const alice: GraphEntity = {
  id: 'ent-001', type: 'Person', canonical_name: 'Alice Johnson',
  attributes: { emails: ['alice@example.com'] }, confidence: 0.9, created_at: new Date('2026-01-15'),
};

export const bob: GraphEntity = {
  id: 'ent-002', type: 'Person', canonical_name: 'Bob Smith',
  attributes: { emails: ['bob@acme.com'] }, confidence: 0.85, created_at: new Date('2026-01-16'),
};

export const acmeCorp: GraphEntity = {
  id: 'ent-010', type: 'Company', canonical_name: 'Acme Corp',
  attributes: { domain: 'acme.com', industry: 'tech' }, confidence: 0.91, created_at: new Date('2026-01-10'),
};

export const acmeDomain: GraphEntity = {
  id: 'ent-020', type: 'Domain', canonical_name: 'acme.com',
  attributes: { registrar: 'GoDaddy', creation_date: '2000-01-01' }, confidence: 0.95, created_at: new Date('2026-01-08'),
};

export const acmeIP: GraphEntity = {
  id: 'ent-030', type: 'IP', canonical_name: '203.0.113.50',
  attributes: { version: 4, geolocation: 'US' }, confidence: 0.92, created_at: new Date('2026-01-09'),
};

export const aliceEmail: GraphEntity = {
  id: 'ent-040', type: 'Email', canonical_name: 'alice@example.com',
  attributes: { domain: 'example.com' }, confidence: 0.9, created_at: new Date('2026-01-15'),
};

export const exampleDomain: GraphEntity = {
  id: 'ent-021', type: 'Domain', canonical_name: 'example.com',
  attributes: { registrar: 'Namecheap' }, confidence: 0.88, created_at: new Date('2026-01-12'),
};

export const reactTech: GraphEntity = {
  id: 'ent-050', type: 'Technology', canonical_name: 'React',
  attributes: { version: '18.0', category: 'frontend' }, confidence: 0.9, created_at: new Date('2026-01-01'),
};

export const charsieEntity: GraphEntity = {
  id: 'ent-060', type: 'Person', canonical_name: 'Charlie Brown',
  attributes: { emails: ['charlie@test.io'] }, confidence: 0.75, created_at: new Date('2026-02-01'),
};

export const isolatedEntity: GraphEntity = {
  id: 'ent-070', type: 'Repository', canonical_name: 'lonely/project',
  attributes: { language: 'Rust' }, confidence: 0.8, created_at: new Date('2026-03-01'),
};

export const relAliceWorksForAcme: GraphRelationship = {
  id: 'rel-001', source_entity_id: 'ent-001', target_entity_id: 'ent-010',
  type: 'WORKS_FOR', confidence: 0.9, evidence_id: 'ev-001',
  valid_from: new Date('2025-01-01'), valid_to: null,
  attributes: { role: 'engineer' },
};

export const relBobWorksForAcme: GraphRelationship = {
  id: 'rel-002', source_entity_id: 'ent-002', target_entity_id: 'ent-010',
  type: 'WORKS_FOR', confidence: 0.85, evidence_id: 'ev-002',
  valid_from: new Date('2025-06-01'), valid_to: null,
  attributes: { role: 'manager' },
};

export const relAcmeOwnsDomain: GraphRelationship = {
  id: 'rel-003', source_entity_id: 'ent-010', target_entity_id: 'ent-020',
  type: 'OWNS', confidence: 0.95, evidence_id: 'ev-003',
  valid_from: new Date('2000-01-01'), valid_to: null,
  attributes: {},
};

export const relDomainResolvesToIP: GraphRelationship = {
  id: 'rel-004', source_entity_id: 'ent-020', target_entity_id: 'ent-030',
  type: 'RESOLVES_TO', confidence: 0.92, evidence_id: 'ev-004',
  valid_from: new Date('2026-01-01'), valid_to: null,
  attributes: { dns_type: 'A' },
};

export const relAliceMentionsEmail: GraphRelationship = {
  id: 'rel-005', source_entity_id: 'ent-001', target_entity_id: 'ent-040',
  type: 'MENTIONS', confidence: 0.88, evidence_id: 'ev-005',
  valid_from: new Date('2026-01-15'), valid_to: null,
  attributes: {},
};

export const relAcmeUsesReact: GraphRelationship = {
  id: 'rel-006', source_entity_id: 'ent-010', target_entity_id: 'ent-050',
  type: 'USES', confidence: 0.87, evidence_id: 'ev-006',
  valid_from: new Date('2025-03-01'), valid_to: null,
  attributes: {},
};

export const relAliceAssocExample: GraphRelationship = {
  id: 'rel-007', source_entity_id: 'ent-001', target_entity_id: 'ent-021',
  type: 'ASSOCIATED_WITH', confidence: 0.7, evidence_id: 'ev-007',
  valid_from: new Date('2026-01-20'), valid_to: null,
  attributes: {},
};

export const relBobUsesReact: GraphRelationship = {
  id: 'rel-008', source_entity_id: 'ent-002', target_entity_id: 'ent-050',
  type: 'USES', confidence: 0.8, evidence_id: 'ev-008',
  valid_from: new Date('2025-07-01'), valid_to: null,
  attributes: {},
};

export const relAliceDomainRegisteredTo: GraphRelationship = {
  id: 'rel-009', source_entity_id: 'ent-021', target_entity_id: 'ent-001',
  type: 'REGISTERED_TO', confidence: 0.82, evidence_id: 'ev-009',
  valid_from: new Date('2020-01-01'), valid_to: new Date('2025-12-31'),
  attributes: {},
};

export const relCharlieAssociated: GraphRelationship = {
  id: 'rel-010', source_entity_id: 'ent-060', target_entity_id: 'ent-010',
  type: 'ASSOCIATED_WITH', confidence: 0.75, evidence_id: 'ev-010',
  valid_from: new Date('2026-02-01'), valid_to: null,
  attributes: {},
};

export const relDomainHostedOn: GraphRelationship = {
  id: 'rel-011', source_entity_id: 'ent-021', target_entity_id: 'ent-030',
  type: 'HOSTED_ON', confidence: 0.91, evidence_id: 'ev-011',
  valid_from: new Date('2025-01-01'), valid_to: null,
  attributes: {},
};

export function buildSmallGraph() {
  return {
    entities: [
      alice, bob, acmeCorp, acmeDomain, acmeIP,
      aliceEmail, exampleDomain, reactTech, charsieEntity, isolatedEntity,
    ],
    relationships: [
      relAliceWorksForAcme, relBobWorksForAcme, relAcmeOwnsDomain,
      relDomainResolvesToIP, relAliceMentionsEmail, relAcmeUsesReact,
      relAliceAssocExample, relBobUsesReact, relAliceDomainRegisteredTo,
      relCharlieAssociated, relDomainHostedOn,
    ],
  };
}

export function buildCyClicGraph() {
  const a: GraphEntity = { id: 'cyc-01', type: 'Domain', canonical_name: 'a.com', attributes: {}, confidence: 0.9, created_at: new Date() };
  const b: GraphEntity = { id: 'cyc-02', type: 'IP', canonical_name: '1.1.1.1', attributes: {}, confidence: 0.9, created_at: new Date() };
  const c: GraphEntity = { id: 'cyc-03', type: 'Domain', canonical_name: 'c.com', attributes: {}, confidence: 0.9, created_at: new Date() };

  const r1: GraphRelationship = { id: 'cyr-01', source_entity_id: 'cyc-01', target_entity_id: 'cyc-02', type: 'RESOLVES_TO', confidence: 0.9, evidence_id: 'cev-01', valid_from: new Date(), valid_to: null, attributes: {} };
  const r2: GraphRelationship = { id: 'cyr-02', source_entity_id: 'cyc-02', target_entity_id: 'cyc-03', type: 'HOSTED_ON', confidence: 0.9, evidence_id: 'cev-02', valid_from: new Date(), valid_to: null, attributes: {} };
  const r3: GraphRelationship = { id: 'cyr-03', source_entity_id: 'cyc-03', target_entity_id: 'cyc-01', type: 'OWNS', confidence: 0.9, evidence_id: 'cev-03', valid_from: new Date(), valid_to: null, attributes: {} };

  return { entities: [a, b, c], relationships: [r1, r2, r3] };
}

export const investigationId = 'inv-001';
