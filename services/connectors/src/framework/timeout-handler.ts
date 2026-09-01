/**
 * Timeout handling for connector network operations.
 *
 * Wraps an operation in a timeout and rejects with a {@link TimeoutError} if it
 * does not settle within the configured window. The underlying operation keeps
 * running but its result is discarded once the timeout fires.
 */

export class TimeoutError extends Error {
  public readonly timeoutMs: number;

  public constructor(timeoutMs: number) {
    super(`operation timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

export interface TimeoutOptions {
  timeoutMs: number;
}

export async function withTimeout<T>(operation: Promise<T>, options: TimeoutOptions): Promise<T> {
  const { timeoutMs } = options;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(timeoutMs)), timeoutMs);
  });

  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
