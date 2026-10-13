// In-memory stand-ins for the infrastructure adapters (Layer 5).
// Integration tests wire the real routes → controllers → services → models
// against these, so only network/database I/O is replaced.

export const memoryCache = new Map<string, string>();

export const cacheModuleMock = () => ({
  cacheService: {
    get: jest.fn(async (k: string) => memoryCache.get(k) ?? null),
    set: jest.fn(async (k: string, v: string) => { memoryCache.set(k, v); })
  }
});

type UserRow = { id: string; email: string; password: string; uiSettings: unknown; createdAt: Date };
export const users: UserRow[] = [];

export const prismaModuleMock = () => ({
  prisma: {
    user: {
      findUnique: jest.fn(async ({ where }: any) => {
        const u = users.find(x => (where.email ? x.email === where.email : x.id === where.id));
        if (!u) return null;
        return where.id ? { ...u, subscriptions: [], bookmarks: [] } : u;
      }),
      create: jest.fn(async ({ data }: any) => {
        const u = { id: `usr_${users.length + 1}`, createdAt: new Date(), ...data };
        users.push(u);
        return u;
      })
    },
    subscription: { findMany: jest.fn(async () => []) }
  }
});
