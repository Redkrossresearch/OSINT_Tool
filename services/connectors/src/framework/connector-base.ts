import type { Observation } from '@osint-tool/schemas';

import type { ConnectorConfig, ConnectorConfigInput } from './connector-config.js';
import { validateConnectorConfig } from './connector-config.js';
import type { Connector, ConnectorHealth, CollectorInput } from './connector-interface.js';
import { TokenBucketRateLimiter } from './rate-limiter.js';
import { retry, RetriesExhaustedError } from './retry-handler.js';
import { withTimeout, TimeoutError } from './timeout-handler.js';

export type ConnectorErrorCode =
  | 'CONFIG_INVALID'
  | 'NOT_CONFIGURED'
  | 'TIMEOUT'
  | 'RATE_LIMITED'
  | 'RETRIES_EXHAUSTED'
  | 'COLLECTION_FAILED';

export class ConnectorError extends Error {
  public readonly code: ConnectorErrorCode;
  public readonly cause?: unknown;

  public constructor(code: ConnectorErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'ConnectorError';
    this.code = code;
    this.cause = cause;
  }
}

export abstract class BaseConnector implements Connector {
  public name: string;
  public version: string;
  public supportedObjectiveTypes: Connector['supportedObjectiveTypes'];

  protected config: ConnectorConfig | undefined;
  private rateLimiter: TokenBucketRateLimiter | undefined;
  protected lastHealth: ConnectorHealth = {
    status: 'unavailable',
    lastCheck: new Date(),
    error: 'connector has not been configured',
  };

  protected constructor(params: {
    name: string;
    version: string;
    supportedObjectiveTypes: Connector['supportedObjectiveTypes'];
  }) {
    this.name = params.name;
    this.version = params.version;
    this.supportedObjectiveTypes = params.supportedObjectiveTypes;
  }

  public async configure(config: ConnectorConfigInput): Promise<void> {
    this.config = validateConnectorConfig(config);
    this.rateLimiter =
      this.config.rateLimit !== undefined
        ? new TokenBucketRateLimiter(this.config.rateLimit, { connectorName: this.name })
        : undefined;
    this.lastHealth = { status: 'healthy', lastCheck: new Date() };
  }

  public async *collect(input: CollectorInput): AsyncGenerator<Observation> {
    if (this.config === undefined) {
      throw new ConnectorError('NOT_CONFIGURED', `${this.name} has not been configured`);
    }

    const source = this.fetchObservations(input);
    while (true) {
      const { value, done } = await source.next();
      if (done) break;
      this.lastHealth = { status: 'healthy', lastCheck: new Date() };
      yield value;
    }
  }

  public async health(): Promise<ConnectorHealth> {
    return { ...this.lastHealth };
  }

  protected async request<T>(operation: () => Promise<T>): Promise<T> {
    if (this.config === undefined) {
      throw new ConnectorError('NOT_CONFIGURED', `${this.name} has not been configured`);
    }

    const { timeoutMs, maxRetries } = this.config;

    const attemptOperation = async (): Promise<T> => {
      if (this.rateLimiter !== undefined) {
        await this.rateLimiter.acquire();
      }
      try {
        return await withTimeout(operation(), { timeoutMs });
      } catch (error) {
        if (error instanceof TimeoutError) {
          throw new ConnectorError('TIMEOUT', error.message, error);
        }
        throw error;
      }
    };

    try {
      const result = await retry(attemptOperation, {
        maxRetries,
        connectorName: this.name,
        isRetryable: (error) =>
          !(error instanceof ConnectorError && error.code === 'RATE_LIMITED'),
        onRetry: () => {
          this.lastHealth = { status: 'degraded', lastCheck: new Date() };
        },
      });
      this.lastHealth = { status: 'healthy', lastCheck: new Date() };
      return result;
    } catch (error) {
      if (error instanceof RetriesExhaustedError) {
        this.lastHealth = {
          status: 'degraded',
          lastCheck: new Date(),
          error: errorMessage(error.cause ?? error),
        };
        throw new ConnectorError('RETRIES_EXHAUSTED', error.message, error.cause);
      }
      throw error;
    }
  }

  protected abstract fetchObservations(input: CollectorInput): AsyncGenerator<Observation>;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
