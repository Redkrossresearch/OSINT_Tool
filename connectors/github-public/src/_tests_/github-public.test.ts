import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';

import type { Objective } from '@osint-tool/schemas';

import { GitHubPublicConnector } from '../index.js';

const profileFixture = {
  login: 'octocat',
  id: 1,
  name: 'Octocat',
  html_url: 'https://github.com/octocat',
  public_repos: 8,
  followers: 100,
  following: 10,
};

const repoFixture = {
  id: 1296269,
  full_name: 'octocat/Hello-World',
  html_url: 'https://github.com/octocat/Hello-World',
  language: 'JavaScript',
  stargazers_count: 30,
  forks_count: 20,
  description: 'My first repository',
};

const languagesFixture = { JavaScript: 100000, CSS: 5000 };

const topicsFixture = { names: ['demo', 'octocat'] };

function makeObjective(type: Objective['type'], extra: Record<string, unknown> = {}): Objective {
  return {
    id: '00000000-0000-0000-0000-000000000001',
    investigation_id: '00000000-0000-0000-0000-000000000002',
    created_at: new Date(),
    updated_at: new Date(),
    type,
    ...extra,
  } as Objective;
}

async function collectAll(connector: GitHubPublicConnector, input: {
  objective: Objective;
  query: string;
}) {
  const observations = [];
  for await (const observation of connector.collect(input)) {
    observations.push(observation);
  }
  return observations;
}

describe('GitHubPublicConnector', () => {
  const originalFetch = globalThis.fetch;

  function stubFetch(routes: Record<string, unknown>): void {
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const match = Object.entries(routes).find(([route]) => url.includes(route));
      if (match !== undefined) {
        const [path, body] = match;
        void path;
        return {
          ok: true,
          status: 200,
          json: async () => body,
        } as unknown as Response;
      }
      return {
        ok: false,
        status: 404,
        json: async () => null,
      } as unknown as Response;
    }) as typeof fetch;
  }

  beforeEach(() => {
    globalThis.fetch = originalFetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('is not configured until configure() is called', async () => {
    const connector = new GitHubPublicConnector();
    await assert.rejects(
      () => collectAll(connector, {
        objective: makeObjective('PERSON', { name: 'octocat' }),
        query: 'octocat',
      }),
      (error: unknown) => error instanceof Error && error.message.includes('not been configured'),
    );
  });

  it('collects a user profile without an API key or token', async () => {
    let profileRequestInit: RequestInit | undefined;

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input) === 'https://api.github.com/users/octocat') {
        profileRequestInit = init;
      }
      return {
        ok: true,
        status: 200,
        json: async () => profileFixture,
      } as unknown as Response;
    }) as typeof fetch;

    const connector = new GitHubPublicConnector();
    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    const observations = await collectAll(connector, {
      objective: makeObjective('PERSON', { name: 'octocat' }),
      query: 'octocat',
    });

    assert.ok(profileRequestInit !== undefined);
    const headers = profileRequestInit?.headers as Record<string, string> | undefined;
    assert.equal(headers?.Authorization, undefined);
    assert.equal(typeof headers?.['User-Agent'], 'string');

    assert.ok(observations.length >= 1);
    const profile = observations.find((o) => o.data.category === 'github-profile');
    assert.ok(profile !== undefined);
    assert.equal(profile.data.login, 'octocat');
    assert.equal(profile.type, 'GITHUB_DATA');
    assert.ok(profile.confidence >= 0 && profile.confidence <= 1);
  });

  it('populates source_ref with connector name, query, timestamp and parameters', async () => {
    stubFetch({ '/users/octocat': profileFixture, '/users/octocat/repos': [] });

    const connector = new GitHubPublicConnector();
    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    const observations = await collectAll(connector, {
      objective: makeObjective('PERSON', { name: 'octocat' }),
      query: 'octocat',
    });

    assert.ok(observations.length >= 1);
    const profile = observations.find((o) => o.data.category === 'github-profile');
    assert.ok(profile !== undefined);
    assert.equal(profile.source_ref.connector_name, 'github-public');
    assert.equal(profile.source_ref.query, 'octocat');
    assert.ok(profile.source_ref.timestamp instanceof Date);
    assert.equal(profile.source_ref.parameters.objective_type, 'PERSON');
    assert.equal(profile.source_ref.parameters.login, 'octocat');
  });

  it('collects repository, languages and topics for a owner/repo query', async () => {
    stubFetch({
      '/repos/octocat/Hello-World/languages': languagesFixture,
      '/repos/octocat/Hello-World/topics': topicsFixture,
      '/repos/octocat/Hello-World': repoFixture,
    });

    const connector = new GitHubPublicConnector();
    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    const observations = await collectAll(connector, {
      objective: makeObjective('COMPANY', { company_name: 'octocat' }),
      query: 'octocat/Hello-World',
    });

    const categories = observations.map((o) => o.data.category);
    assert.ok(categories.includes('github-repository'));
    assert.ok(categories.includes('github-repository-languages'));
    assert.ok(categories.includes('github-repository-topics'));

    const repository = observations.find((o) => o.data.category === 'github-repository');
    assert.equal(repository?.data.full_name, 'octocat/Hello-World');

    const topics = observations.find((o) => o.data.category === 'github-repository-topics');
    assert.deepEqual(topics?.data.values, ['demo', 'octocat']);
  });

  it('yields no repository observations when endpoints return 404', async () => {
    stubFetch({});

    const connector = new GitHubPublicConnector();
    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    const observations = await collectAll(connector, {
      objective: makeObjective('COMPANY', { company_name: 'missing' }),
      query: 'missing/notexist',
    });

    const categories = observations.map((o) => o.data.category);
    assert.ok(!categories.includes('github-repository'));
  });

  it('reports healthy after a successful collection', async () => {
    stubFetch({ '/users/octocat': profileFixture, '/users/octocat/repos': [] });

    const connector = new GitHubPublicConnector();
    await connector.configure({ timeoutMs: 5000, maxRetries: 0 });

    const observations = await collectAll(connector, {
      objective: makeObjective('PERSON', { name: 'octocat' }),
      query: 'octocat',
    });
    void observations;

    const health = await connector.health();
    assert.equal(health.status, 'healthy');
  });
});
