import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { EntitySchema, RelationshipSchema } from '../../../../packages/entities/index.js';
import { RELATIONSHIP_TYPES } from '../../../../packages/entities/relationship-types.js';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const prismaPath = 'services/graph/prisma/schema.prisma';
const migrationRoot = new URL('../../prisma/migrations/', import.meta.url);
const schema = readFileSync(new URL('../../prisma/schema.prisma', import.meta.url), 'utf8');
const migrations = readdirSync(migrationRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const migration = migrations
  .map((name) => readFileSync(new URL(`${name}/migration.sql`, migrationRoot), 'utf8'))
  .join('\n');
const prisma = fileURLToPath(
  new URL('../../../../services/core/node_modules/.bin/prisma', import.meta.url),
);

function prismaRun(args: string[]): string {
  const result = spawnSync(prisma, args, {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, DATABASE_URL: 'postgresql://localhost/osint' },
    timeout: 60_000,
  });
  assert.equal(result.status, 0, `${result.error ?? ''}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

const indexes = [
  'entities_type_idx',
  'entities_investigation_id_idx',
  'relationships_source_entity_id_type_idx',
  'relationships_source_evidence_id_type_idx',
  'relationships_target_entity_id_type_idx',
  'relationships_type_idx',
  'relationships_investigation_id_valid_to_valid_from_idx',
  'relationship_evidence_evidence_id_idx',
];

// Only fixed test fixtures are quoted here, never application/user SQL input.
const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
const investigation = '00000000-0000-4000-8000-000000000001';
const otherInvestigation = '00000000-0000-4000-8000-000000000002';
const evidence = '00000000-0000-4000-8000-000000000003';
const otherEvidence = '00000000-0000-4000-8000-000000000004';
const secondEvidence = '00000000-0000-4000-8000-000000000005';

function check(sql: string, label: string): string {
  return `DO $check$ BEGIN IF NOT (${sql}) THEN RAISE EXCEPTION ${quote(label)}; END IF; END $check$;`;
}
function rejects(sql: string, state: string): string {
  return `DO $reject$ BEGIN
    BEGIN ${sql}; EXCEPTION WHEN SQLSTATE '${state}' THEN RETURN; END;
    RAISE EXCEPTION 'Expected SQLSTATE ${state}';
  END $reject$;`;
}
function relationshipInsert(
  id: string,
  type: string,
  source: string | null,
  target = 'company',
  sourceEvidence: string | null = null,
): string {
  return `INSERT INTO relationships
    (id, investigation_id, type, source_entity_id, source_entity_type,
     source_evidence_id, target_entity_id, target_entity_type, confidence, valid_from)
    VALUES (${quote(id)}, '${investigation}', ${quote(type)},
      ${source === null ? 'NULL, NULL' : `${quote(source)}, ${quote(source)}`},
      ${sourceEvidence === null ? 'NULL' : quote(sourceEvidence)}, ${quote(target)}, ${quote(target)},
      0.123456789, '2026-09-01')`;
}

describe('T3-008 graph persistence schema', () => {
  it('contains all models, PostgreSQL types, temporal fields, and ordered evidence associations', () => {
    for (const name of ['Entity', 'Relationship', 'RelationshipEvidence']) {
      assert.match(schema, new RegExp(`model ${name} \\{`));
    }
    for (const table of ['entities', 'relationships', 'relationship_evidence']) {
      assert.ok(migration.includes(`CREATE TABLE "${table}"`));
    }
    assert.match(schema, /attributes\s+Json\s+@db.JsonB/);
    assert.match(migration, /"attributes" JSONB NOT NULL/);
    for (const column of [
      'valid_from',
      'valid_to',
      'source_entity_id',
      'source_evidence_id',
      'target_entity_id',
      'confidence',
      'investigation_id',
    ]) {
      assert.ok(migration.includes(`"${column}"`));
    }
    assert.match(migration, /PRIMARY KEY \("relationship_id","position"\)/);
    assert.match(schema, /validTo\s+DateTime\?/);
    for (const option of EntitySchema.options)
      assert.ok(migration.includes(quote(option.shape.type.value)));
    for (const type of RELATIONSHIP_TYPES) assert.ok(migration.includes(quote(type)));
  });

  it('contains traversal indexes, restrictive foreign keys, and SQL-only integrity constraints', () => {
    for (const index of indexes) assert.ok(migration.includes(`CREATE INDEX "${index}"`));
    assert.equal((migration.match(/FOREIGN KEY/g) ?? []).length, 7);
    assert.equal((migration.match(/ON DELETE RESTRICT ON UPDATE RESTRICT/g) ?? []).length, 7);
    for (const name of [
      'relationships_exactly_one_source',
      'relationships_source_type_present',
      'relationships_endpoint_types',
      'relationships_valid_interval',
      'entities_confidence_range',
      'relationships_confidence_range',
      'relationships_evidence_scope',
      'relationship_evidence_scope',
    ]) {
      assert.ok(migration.includes(`"${name}"`));
    }
    assert.doesNotMatch(
      migration,
      /(?:CREATE|ALTER|DROP) TABLE "(?:evidence|investigations|cases)"/,
    );
  });

  it('has deterministic migrations and validates with the repository-pinned Prisma CLI', () => {
    assert.ok(migrations.length > 0);
    for (const name of migrations) assert.match(name, /^\d{14}_[a-z_]+$/);
    assert.match(
      readFileSync(new URL('migration_lock.toml', migrationRoot), 'utf8'),
      /provider = "postgresql"/,
    );
    prismaRun(['validate', '--schema', prismaPath]);
  });

  it('matches Prisma-generated DDL before the additional hand-maintained constraints', () => {
    const generated = prismaRun([
      'migrate',
      'diff',
      '--from-empty',
      '--to-schema-datamodel',
      prismaPath,
      '--script',
    ]);
    assert.ok(migration.startsWith(generated.trimEnd()), 'Prisma models and migration DDL drifted');
  });

  it(
    'runs real Core and graph migrations, checks catalogs, and enforces contracts in PostgreSQL',
    {
      skip:
        !process.env.GRAPH_SCHEMA_TEST_DATABASE_URL &&
        'Set GRAPH_SCHEMA_TEST_DATABASE_URL to a local PostgreSQL test database',
      timeout: 60_000,
    },
    () => {
      const databaseUrl = new URL(process.env.GRAPH_SCHEMA_TEST_DATABASE_URL!);
      assert.ok(
        ['localhost', '127.0.0.1', '[::1]'].includes(databaseUrl.hostname),
        'Tests require a local database',
      );
      const namespace = `graph_test_${randomUUID().replaceAll('-', '')}`;
      const coreRoot = new URL('../../../../services/core/prisma/migrations/', import.meta.url);
      const coreMigrations = readdirSync(coreRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort()
        .map((name) => readFileSync(new URL(`${name}/migration.sql`, coreRoot), 'utf8'))
        .join('\n');
      const statements = [
        'BEGIN;',
        "SET LOCAL lock_timeout = '5s';",
        "SET LOCAL statement_timeout = '30s';",
        `CREATE SCHEMA "${namespace}";`,
        `SET LOCAL search_path TO "${namespace}", public;`,
        coreMigrations,
        migration,
        `INSERT INTO cases (id, title, created_by, updated_at) VALUES ('${investigation}', 'Graph test', '${investigation}', now());`,
        `INSERT INTO investigations (id, case_id, updated_at) VALUES ('${investigation}', '${investigation}', now()), ('${otherInvestigation}', '${investigation}', now());`,
        `INSERT INTO evidence (id, investigation_id, type, source, content, metadata, hash) VALUES
        ('${evidence}', '${investigation}', 'test', '{}', 'test', '{}', repeat('a', 64)),
        ('${secondEvidence}', '${investigation}', 'test', '{}', 'test', '{}', repeat('b', 64)),
        ('${otherEvidence}', '${otherInvestigation}', 'test', '{}', 'test', '{}', repeat('c', 64));`,
      ];
      for (const type of EntitySchema.options.map((option) => option.shape.type.value)) {
        statements.push(`INSERT INTO entities (id, investigation_id, type, attributes, confidence, updated_at)
        VALUES (${quote(type)}, '${investigation}', ${quote(type)}, '{}', 0.123456789, now());`);
      }
      // Compare every endpoint/type combination against the real T3-006 validator.
      const types = EntitySchema.options.map((option) => option.shape.type.value);
      let counter = 0;
      for (const type of RELATIONSHIP_TYPES) {
        for (const source of [...types, 'evidence']) {
          for (const target of types) {
            const accepted = RelationshipSchema.safeParse({
              type,
              source:
                source === 'evidence'
                  ? { kind: 'evidence', id: evidence }
                  : { kind: 'entity', id: source, type: source },
              target: { kind: 'entity', id: target, type: target },
              confidence: 0.123456789,
              evidence: [],
            }).success;
            const sql = relationshipInsert(
              `matrix-${counter++}`,
              type,
              source === 'evidence' ? null : source,
              target,
              source === 'evidence' ? evidence : null,
            );
            statements.push(accepted ? `${sql};` : rejects(sql, '23514'));
          }
        }
      }
      statements.push(
        `${relationshipInsert('works', 'WORKS_FOR', 'person')};`,
        `${relationshipInsert('mention', 'MENTIONS', null, 'person', evidence)};`,
        `INSERT INTO relationship_evidence VALUES ('works', '${investigation}', 0, '${evidence}'), ('works', '${investigation}', 1, '${secondEvidence}'), ('works', '${investigation}', 2, '${evidence}');`,
        check(
          `(SELECT array_agg(evidence_id ORDER BY position)::text[] = ARRAY['${evidence}', '${secondEvidence}', '${evidence}'] FROM relationship_evidence WHERE relationship_id = 'works')`,
          'Evidence array order/duplicates lost',
        ),
        check(
          "(SELECT valid_to IS NULL AND confidence = 0.123456789 FROM relationships WHERE id = 'mention')",
          'Active default or confidence precision lost',
        ),
        check(
          "(SELECT data_type = 'jsonb' FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'entities' AND column_name = 'attributes')",
          'Attributes must be JSONB',
        ),
      );
      for (const [table, columns] of Object.entries({
        entities: [
          'id',
          'type',
          'attributes',
          'confidence',
          'investigation_id',
          'created_at',
          'updated_at',
        ],
        relationships: [
          'id',
          'type',
          'source_entity_id',
          'source_entity_type',
          'source_evidence_id',
          'target_entity_id',
          'target_entity_type',
          'confidence',
          'investigation_id',
          'valid_from',
          'valid_to',
        ],
        relationship_evidence: ['relationship_id', 'investigation_id', 'position', 'evidence_id'],
      })) {
        for (const column of columns)
          statements.push(
            check(
              `EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = '${table}' AND column_name = '${column}')`,
              `Missing ${table}.${column}`,
            ),
          );
      }
      for (const index of indexes)
        statements.push(
          check(
            `EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = current_schema() AND indexname = '${index}')`,
            `Missing ${index}`,
          ),
        );
      statements.push(
        check(
          "(SELECT count(*) = 7 FROM pg_constraint WHERE connamespace = current_schema()::regnamespace AND contype = 'f' AND conrelid IN ('entities'::regclass, 'relationships'::regclass, 'relationship_evidence'::regclass))",
          'Foreign keys missing',
        ),
      );
      const invalid: [string, string][] = [
        [relationshipInsert('none', 'MENTIONS', null), '23514'],
        [relationshipInsert('both', 'MENTIONS', 'person', 'company', evidence), '23514'],
        ["UPDATE relationships SET source_entity_type = NULL WHERE id = 'works'", '23514'],
        ["UPDATE relationships SET source_entity_id = 'missing' WHERE id = 'works'", '23503'],
        ["UPDATE relationships SET target_entity_id = 'missing' WHERE id = 'works'", '23503'],
        ["UPDATE relationships SET target_entity_id = NULL WHERE id = 'works'", '23502'],
        ["UPDATE relationships SET source_entity_id = 'company' WHERE id = 'works'", '23503'],
        [
          `UPDATE relationships SET investigation_id = '${otherInvestigation}' WHERE id = 'works'`,
          '23503',
        ],
        [
          `UPDATE relationships SET source_evidence_id = '${otherEvidence}' WHERE id = 'mention'`,
          '23503',
        ],
        [
          `UPDATE relationships SET source_evidence_id = '${investigation}' WHERE id = 'mention'`,
          '23503',
        ],
        [
          `INSERT INTO relationship_evidence VALUES ('works', '${investigation}', 3, '${otherEvidence}')`,
          '23503',
        ],
        [
          `INSERT INTO relationship_evidence VALUES ('works', '${investigation}', 3, '${investigation}')`,
          '23503',
        ],
        [
          `INSERT INTO relationship_evidence VALUES ('missing', '${investigation}', 3, '${evidence}')`,
          '23503',
        ],
        [
          `INSERT INTO relationship_evidence VALUES ('works', '${investigation}', -1, '${evidence}')`,
          '23514',
        ],
        [
          `INSERT INTO relationship_evidence VALUES ('works', '${investigation}', 0, '${evidence}')`,
          '23505',
        ],
        ["UPDATE entities SET attributes = '[]' WHERE id = 'person'", '23514'],
        ["UPDATE entities SET id = '' WHERE id = 'location'", '23514'],
        ["UPDATE relationships SET id = '' WHERE id = 'works'", '23514'],
        ["UPDATE relationships SET valid_to = '2026-08-01' WHERE id = 'works'", '23514'],
        ["UPDATE relationships SET valid_from = '-infinity' WHERE id = 'works'", '23514'],
        ["UPDATE relationships SET valid_to = 'infinity' WHERE id = 'works'", '23514'],
        ["DELETE FROM entities WHERE id = 'person'", '23503'],
        [`DELETE FROM evidence WHERE id = '${evidence}'`, '23503'],
        [`DELETE FROM evidence WHERE id = '${secondEvidence}'`, '23503'],
        [`DELETE FROM investigations WHERE id = '${investigation}'`, '23503'],
      ];
      for (const table of ['entities', 'relationships']) {
        for (const confidence of ['-0.1', '1.1', "'NaN'", "'Infinity'", "'-Infinity'"])
          invalid.push([`UPDATE ${table} SET confidence = ${confidence}`, '23514']);
      }
      for (const [sql, state] of invalid) statements.push(rejects(sql, state));
      statements.push(
        "UPDATE relationships SET valid_to = valid_from WHERE id = 'works';",
        "UPDATE relationships SET valid_to = '2026-09-02' WHERE id = 'works';",
        rejects("DELETE FROM entities WHERE id = 'person'", '23503'),
        check(
          "EXISTS (SELECT 1 FROM relationships WHERE id = 'works' AND valid_to = '2026-09-02')",
          'Historical relationship lost',
        ),
        'ROLLBACK;',
      );
      // Credentials are passed in environment, not command arguments or test output.
      const result = spawnSync('psql', ['-X', '-q', '-w', '-v', 'ON_ERROR_STOP=1'], {
        input: statements.join('\n'),
        encoding: 'utf8',
        timeout: 55_000,
        env: {
          ...process.env,
          PGHOST: databaseUrl.hostname,
          PGPORT: databaseUrl.port || '5432',
          PGDATABASE: decodeURIComponent(databaseUrl.pathname.slice(1)),
          PGUSER: decodeURIComponent(databaseUrl.username),
          PGPASSWORD: decodeURIComponent(databaseUrl.password),
        },
      });
      assert.equal(result.status, 0, `${result.error ?? ''}\n${result.stdout}\n${result.stderr}`);
    },
  );
});
