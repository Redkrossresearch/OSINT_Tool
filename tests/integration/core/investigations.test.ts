import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo, Server } from 'node:net';
import { createIntegrationApp } from '../app.ts';
import { resetDatabase, disconnectDatabase } from '../db.ts';

let server: Server;
let base: string;

before(async () => {
  const app = createIntegrationApp();
  server = app.listen(0);
  const addr = server.address() as AddressInfo;
  base = `http://127.0.0.1:${addr.port}`;
});

after(async () => {
  await resetDatabase().catch(() => {});
  server.closeAllConnections?.();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await disconnectDatabase().catch(() => {});
});

const createCase = async () =>
  (await (
    await fetch(`${base}/api/cases`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Case', created_by: randomUUID() }),
    })
  ).json()) as { id: string };

test('creates an investigation with an objective', async () => {
  const c = await createCase();
  const res = await fetch(`${base}/api/investigations`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ case_id: c.id, objective: { type: 'PERSON', name: 'John Doe' } }),
  });
  assert.equal(res.status, 201);
  const data = (await res.json()) as { id: string; state: string; objective: { type: string } };
  assert.equal(data.state, 'DRAFT');
  assert.equal(data.objective.type, 'PERSON');
});

test('rejects investigation without case_id (400)', async () => {
  const res = await fetch(`${base}/api/investigations`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ objective: { type: 'PERSON', name: 'X' } }),
  });
  assert.equal(res.status, 400);
});

test('valid transition DRAFT->PLANNING succeeds; invalid transition rejected', async () => {
  const c = await createCase();
  const inv = (await (
    await fetch(`${base}/api/investigations`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ case_id: c.id, objective: { type: 'PERSON', name: 'Jane' } }),
    })
  ).json()) as { id: string };

  const valid = await fetch(`${base}/api/investigations/${inv.id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json', 'x-actor-id': 'tester' },
    body: JSON.stringify({ state: 'PLANNING' }),
  });
  assert.equal(valid.status, 200);

  const invalid = await fetch(`${base}/api/investigations/${inv.id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json', 'x-actor-id': 'tester' },
    body: JSON.stringify({ state: 'COMPLETE' }),
  });
  assert.ok(invalid.status >= 400 && invalid.status < 500);
});

test('returns 404 for unknown investigation', async () => {
  const res = await fetch(`${base}/api/investigations/${randomUUID()}`);
  assert.equal(res.status, 404);
});
