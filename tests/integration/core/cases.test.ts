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

const postCase = (body: unknown) =>
  fetch(`${base}/api/cases`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

test('creates a case and returns it with an id', async () => {
  const res = await postCase({ title: 'Acme breach', created_by: randomUUID() });
  assert.equal(res.status, 201);
  const data = (await res.json()) as { id: string; title: string };
  assert.equal(data.title, 'Acme breach');
  assert.match(data.id, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
});

test('rejects case creation without title (400)', async () => {
  const res = await postCase({ created_by: randomUUID() });
  assert.equal(res.status, 400);
});

test('rejects case creation without created_by (400)', async () => {
  const res = await postCase({ title: 'No owner' });
  assert.equal(res.status, 400);
});

test('gets a case by id and returns 404 for unknown', async () => {
  const created = (await (await postCase({ title: 'Lookup', created_by: randomUUID() })).json()) as { id: string };
  const ok = await fetch(`${base}/api/cases/${created.id}`);
  assert.equal(ok.status, 200);
  const missing = await fetch(`${base}/api/cases/${randomUUID()}`);
  assert.equal(missing.status, 404);
});

test('updates and deletes a case', async () => {
  const created = (await (await postCase({ title: 'ToUpdate', created_by: randomUUID() })).json()) as { id: string };
  const patched = await fetch(`${base}/api/cases/${created.id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: 'Updated' }),
  });
  assert.equal(patched.status, 200);
  const del = await fetch(`${base}/api/cases/${created.id}`, { method: 'DELETE' });
  assert.equal(del.status, 204);
});
