// Keep tests hermetic: no real Redis, deterministic JWT secret.
process.env.REDIS_HOST = '127.0.0.1';
process.env.REDIS_PORT = '1';
process.env.JWT_SECRET = 'test_secret';
