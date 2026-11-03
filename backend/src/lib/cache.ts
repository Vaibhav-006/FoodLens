import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

// Use in-memory Map as fallback if Redis not configured
class InMemoryCache {
  private store = new Map<string, { value: string; expiresAt: number }>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) { this.store.delete(key); return null; }
    return entry.value;
  }

  async set(key: string, value: string, _mode: string, ttl: number): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
  }

  async del(key: string): Promise<void> { this.store.delete(key); }
}

export const cache = redisUrl
  ? new Redis(redisUrl)
  : new InMemoryCache() as unknown as Redis;

export const CACHE_TTL = {
  product: 60 * 60 * 24 * 7,    // 7 days
  ingredient: 60 * 60 * 24 * 30, // 30 days
  comparison: 60 * 60,            // 1 hour
};

