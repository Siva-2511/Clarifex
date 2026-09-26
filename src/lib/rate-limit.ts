import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory sliding-window fallback for local development or unconfigured environment
const inMemoryCache = new Map<string, number[]>();

function inMemoryRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000,
) {
  const now = Date.now();
  const timestamps = inMemoryCache.get(identifier) || [];
  const windowStart = now - windowMs;

  const validTimestamps = timestamps.filter((t) => t > windowStart);

  if (validTimestamps.length >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil((validTimestamps[0] + windowMs - now) / 1000),
    };
  }

  validTimestamps.push(now);
  inMemoryCache.set(identifier, validTimestamps);

  return {
    success: true,
    limit,
    remaining: limit - validTimestamps.length,
    reset: Math.ceil(windowMs / 1000),
  };
}

let upstashRatelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    upstashRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "clarifex:ratelimit",
    });
  } catch (e) {
    console.warn("Failed to initialize Upstash Redis rate limiter, using in-memory fallback.");
  }
}

/**
 * Sliding window rate limit check.
 * Defaults to 5 requests per 15 minutes.
 */
export async function rateLimit(identifier: string) {
  if (upstashRatelimit) {
    try {
      const result = await upstashRatelimit.limit(identifier);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (e) {
      console.warn("Upstash rate limit check failed, falling back to memory:", e);
      return inMemoryRateLimit(identifier);
    }
  }

  return inMemoryRateLimit(identifier);
}
