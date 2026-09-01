/**
 * Retry handling with exponential backoff for connector network operations.
 *
 * Attempts an operation up to `maxRetries + 1` times. Between failed attempts
 * it waits a backoff interval that grows exponentially from `baseDelayMs`
 * (e.g. 1s, 2s, 4s ...) and is capped at `maxBackoffMs`. Retry events can be
 * observed through an optional callback for logging.
 */

export interface RetryEvent {
  connectorName: string;
  attempt: number;
  error: unknown;
  backoffMs: number;
}

export interface RetryOptions {
  maxRetries: number;
  baseDelayMs?: number;
  maxBackoffMs?: number;
  connectorName?: string;
  isRetryable?: (error: unknown) => boolean;
  onRetry?: (event: RetryEvent) => void;
}

export class RetriesExhaustedError extends Error {
  public readonly attempts: number;
  public readonly cause?: unknown;

  public constructor(message: string, attempts: number, cause?: unknown) {
    super(message);
    this.name = 'RetriesExhaustedError';
    this.attempts = attempts;
    this.cause = cause;
  }
}

const DEFAULT_BASE_DELAY_MS = 1_000;
const DEFAULT_MAX_BACKOFF_MS = 8_000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  operation: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const {
    maxRetries,
    baseDelayMs = DEFAULT_BASE_DELAY_MS,
    maxBackoffMs = DEFAULT_MAX_BACKOFF_MS,
    connectorName = 'unnamed',
    isRetryable = () => true,
    onRetry,
  } = options;

  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (!isRetryable(error)) {
        throw error;
      }

      if (attempt >= maxRetries) {
        throw new RetriesExhaustedError(
          `${connectorName} exhausted ${maxRetries} retries: ${errorMessage(error)}`,
          attempt + 1,
          error,
        );
      }

      const backoffMs = Math.min(maxBackoffMs, baseDelayMs * 2 ** attempt);
      attempt += 1;
      if (onRetry !== undefined) {
        onRetry({ connectorName, attempt, error, backoffMs });
      }
      await delay(backoffMs);
    }
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
