import type { RateLimitConfig } from './connector-config.js';

export type RateLimitEventType = 'granted' | 'queued';

export interface RateLimitEvent {
  connectorName: string;
  type: RateLimitEventType;
  waitMs: number;
  queueDepth: number;
}

export interface RateLimiter {
  acquire(): Promise<void>;
  readonly pending: number;
}

export interface RateLimiterOptions {
  connectorName?: string;
  onRateLimit?: (event: RateLimitEvent) => void;
}

interface Waiter {
  resolve: () => void;
}

/**
 * Token-bucket rate limiter that queues requests when the bucket is empty.
 *
 * Up to `requestsPerInterval` requests are granted immediately per refill
 * interval (`intervalMs`). Further requests are enqueued and released in
 * FIFO order as the bucket refills, so callers await their turn instead of
 * being rejected. Rate-limit events are reported through an optional
 * callback.
 */
export class TokenBucketRateLimiter implements RateLimiter {
  public readonly connectorName: string;

  private readonly capacity: number;
  private readonly refillIntervalMs: number;
  private readonly onRateLimit?: (event: RateLimitEvent) => void;

  private tokens: number;
  private queue: Waiter[] = [];
  private timer: NodeJS.Timeout | undefined;

  public constructor(config: RateLimitConfig, options: RateLimiterOptions = {}) {
    this.capacity = config.requestsPerInterval;
    this.refillIntervalMs = config.intervalMs;
    this.connectorName = options.connectorName ?? 'unnamed';
    this.onRateLimit = options.onRateLimit;
    this.tokens = this.capacity;
  }

  public get pending(): number {
    return this.queue.length;
  }

  public async acquire(): Promise<void> {
    if (this.tokens >= 1) {
      this.tokens -= 1;
      this.emit('granted', 0);
      return;
    }

    return new Promise<void>((resolve) => {
      this.queue.push({ resolve });
      this.emit('queued', this.refillIntervalMs);
      if (this.timer === undefined) {
        this.scheduleRefill();
      }
    });
  }

  /** Release all queued calls. Useful for tests and shutdown. */
  public dispose(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    const waiters = this.queue.splice(0);
    for (const waiter of waiters) {
      waiter.resolve();
    }
  }

  private scheduleRefill(): void {
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.refill();
      while (this.tokens >= 1 && this.queue.length > 0) {
        const waiter = this.queue.shift();
        if (waiter === undefined) break;
        this.tokens -= 1;
        waiter.resolve();
      }
      if (this.queue.length > 0) {
        this.scheduleRefill();
      }
    }, this.refillIntervalMs);
  }

  private refill(): void {
    this.tokens = this.capacity;
  }

  private emit(type: RateLimitEventType, waitMs: number): void {
    if (this.onRateLimit === undefined) return;
    this.onRateLimit({
      connectorName: this.connectorName,
      type,
      waitMs,
      queueDepth: this.queue.length,
    });
  }
}
