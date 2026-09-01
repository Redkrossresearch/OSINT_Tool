import { randomUUID } from 'node:crypto';

import {
  ObjectiveType,
  type Observation,
  type SourceRef,
} from '@osint-tool/schemas';
import { BaseConnector } from '../../../services/connectors/src/framework/connector-base.js';

import type { CollectorInput } from '../../../services/connectors/src/framework/connector-interface.js';

const API_BASE = 'https://api.github.com';
const DEFAULT_CONFIDENCE = 0.95;
const USER_AGENT = 'osint-tool-github-connector';
const ACCEPT = 'application/vnd.github+json';

interface GithubApiResponse {
  ok: boolean;
  status: number;
  json: unknown;
}

export class GitHubPublicConnector extends BaseConnector {
  public constructor() {
    super({
      name: 'github-public',
      version: '1.0.0',
      supportedObjectiveTypes: [
        ObjectiveType.PERSON,
        ObjectiveType.COMPANY,
        ObjectiveType.DOMAIN,
      ],
    });
  }

  protected async *fetchObservations(input: CollectorInput): AsyncGenerator<Observation> {
    const query = input.query.trim();

    if (query.length === 0) {
      throw new Error('github-public: query must not be empty');
    }

    const parameters: Record<string, unknown> = {
      objective_type: input.objective.type,
    };

    const sourceRef: SourceRef = {
      connector_name: this.name,
      query,
      timestamp: new Date(),
      parameters,
    };

    const repositoryParts = splitRepositoryQuery(query);
    if (repositoryParts !== null) {
      const [owner, repo] = repositoryParts;

      parameters.endpoint = 'repositories';
      parameters.owner = owner;
      parameters.repository = repo;

      const repository = await this.getRepository(owner, repo);
      if (repository !== null) {
        yield this.observation(
          'github-repository',
          repository,
          sourceRef,
          parameters,
        );
      }

      const [languages, topics] = await Promise.all([
        this.getRepositoryLanguages(owner, repo),
        this.getRepositoryTopics(owner, repo),
      ]);

      if (languages !== null) {
        yield this.observation(
          'github-repository-languages',
          languages,
          sourceRef,
          { ...parameters, endpoint: 'languages' },
        );
      }

      if (topics !== null && topics.length > 0) {
        yield this.observation(
          'github-repository-topics',
          topics,
          sourceRef,
          { ...parameters, endpoint: 'topics' },
        );
      }

      return;
    }

    parameters.endpoint = 'users';
    parameters.login = query;

    const profile = await this.getUser(query);
    if (profile === null) {
      return;
    }

    yield this.observation('github-profile', profile, sourceRef, parameters);

    const repos = await this.getUserRepositories(query);
    if (repos !== null && repos.length > 0) {
      yield this.observation(
        'github-user-repositories',
        repos,
        sourceRef,
        { ...parameters, endpoint: 'repositories' },
      );
    }
  }

  private async getRepository(owner: string, repo: string): Promise<Record<string, unknown> | null> {
    return this.fetchJson(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
  }

  private async getRepositoryLanguages(
    owner: string,
    repo: string,
  ): Promise<Record<string, unknown> | null> {
    return this.fetchJson(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
    );
  }

  private async getRepositoryTopics(
    owner: string,
    repo: string,
  ): Promise<string[] | null> {
    const response = await this.fetchJson(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/topics`,
    );
    if (response === null || typeof response !== 'object') return null;
    const topics = (response as { names?: unknown }).names;
    return Array.isArray(topics) ? (topics as string[]) : null;
  }

  private async getUser(login: string): Promise<Record<string, unknown> | null> {
    return this.fetchJson(`/users/${encodeURIComponent(login)}`);
  }

  private async getUserRepositories(
    login: string,
  ): Promise<Record<string, unknown>[] | null> {
    const response = await this.fetchJson(
      `/users/${encodeURIComponent(login)}/repos?per_page=100&sort=updated`,
    );
    return Array.isArray(response) ? (response as Record<string, unknown>[]) : null;
  }

  private async fetchJson<T = Record<string, unknown>>(path: string): Promise<T | null> {
    const url = `${API_BASE}${path}`;

    const response = await this.request<GithubApiResponse>(async () => {
      const raw = await fetch(url, {
        headers: {
          Accept: ACCEPT,
          'User-Agent': USER_AGENT,
        },
        redirect: 'follow',
      });
      const json: unknown = await raw.json().catch(() => null);
      return { ok: raw.ok, status: raw.status, json };
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `github-public: GitHub API returned HTTP ${response.status} for ${path}`,
      );
    }

    return response.json as T;
  }

  private observation(
    category: string,
    data: unknown,
    sourceRef: SourceRef,
    parameters: Record<string, unknown>,
  ): Observation {
    const now = new Date();

    const payload: Record<string, unknown> = { category };
    if (Array.isArray(data)) {
      payload.values = data;
    } else if (typeof data === 'object' && data !== null) {
      Object.assign(payload, data);
    }

    return {
      id: randomUUID(),
      evidence_id: randomUUID(),
      type: 'GITHUB_DATA',
      data: payload,
      confidence: DEFAULT_CONFIDENCE,
      source_ref: {
        ...sourceRef,
        timestamp: now,
        parameters,
      },
      timestamp: now,
    };
  }
}

function splitRepositoryQuery(query: string): [string, string] | null {
  const parts = query.split('/');
  if (parts.length !== 2) return null;
  const [owner, repo] = parts;
  if (owner === undefined || repo === undefined || owner === '' || repo === '') {
    return null;
  }
  return [owner, repo];
}

export { GitHubPublicConnector as default };
