// Redis points at port 1 (see helpers/env.ts), so the service must
// transparently fall back to its in-memory store.
import { CacheService } from '../../src/config/redis';

describe('CacheService (Redis with in-memory fallback)', () => {
  const cache = new CacheService();
  beforeAll(() => new Promise(r => setTimeout(r, 200)));

  it('round-trips a value without Redis', async () => {
    await cache.set('k', 'v', 60);
    expect(await cache.get('k')).toBe('v');
  });

  it('returns null for unknown keys', async () => {
    expect(await cache.get('missing')).toBeNull();
  });

  it('expires entries after their TTL', async () => {
    jest.useFakeTimers({ now: Date.now() });
    await cache.set('ttl', 'x', 1);
    expect(await cache.get('ttl')).toBe('x');
    jest.setSystemTime(Date.now() + 1500);
    expect(await cache.get('ttl')).toBeNull();
    jest.useRealTimers();
  });
});
