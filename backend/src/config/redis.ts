import Redis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

// In-Memory Fallback Cache for local resilience
const fallbackMemoryCache = new Map<string, { value: string; expiresAt: number }>();

export class CacheService {
  private client: Redis | null = null;
  private isConnected = false;

  constructor() {
    try {
      this.client = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null // Disable long retries to allow instant fallback
      });

      this.client.connect().then(() => {
        this.isConnected = true;
        console.log(`[Redis] Connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`);
      }).catch(err => {
        console.warn(`[Redis] Redis unavailable (${err.message}). Using resilient in-memory cache fallback.`);
        this.isConnected = false;
      });
    } catch (e) {
      this.isConnected = false;
    }
  }

  public async set(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.setex(key, ttlSeconds, value);
        return;
      } catch (err) {
        console.warn('[Redis] Set error, falling back to memory cache.');
      }
    }
    // Fallback store
    fallbackMemoryCache.set(key, {
      value,
      expiresAt: Date.now() + (ttlSeconds * 1000)
    });
  }

  public async get(key: string): Promise<string | null> {
    if (this.isConnected && this.client) {
      try {
        const data = await this.client.get(key);
        if (data) return data;
      } catch (err) {
        console.warn('[Redis] Get error, reading from memory fallback.');
      }
    }

    // Fallback retrieve
    const item = fallbackMemoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      fallbackMemoryCache.delete(key);
      return null;
    }
    return item.value;
  }
}

export const cacheService = new CacheService();
