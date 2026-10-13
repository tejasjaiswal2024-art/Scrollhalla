import jwt from 'jsonwebtoken';
import { authenticateJWT, AuthRequest } from '../../src/middleware/authMiddleware';

const res = () => {
  const r: any = {};
  r.status = jest.fn(() => r);
  r.json = jest.fn(() => r);
  return r;
};

describe('authenticateJWT middleware', () => {
  it('401s when the header is missing', () => {
    const r = res(); const next = jest.fn();
    authenticateJWT({ headers: {} } as AuthRequest, r, next);
    expect(r.status).toHaveBeenCalledWith(401);
    expect(r.json).toHaveBeenCalledWith({ success: false, message: 'Access denied. No authentication token provided.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('401s for a non-Bearer scheme', () => {
    const r = res(); const next = jest.fn();
    authenticateJWT({ headers: { authorization: 'Basic abc' } } as AuthRequest, r, next);
    expect(r.status).toHaveBeenCalledWith(401);
  });

  it('403s for a forged token', () => {
    const r = res(); const next = jest.fn();
    const bad = jwt.sign({ userId: 'u' }, 'wrong-secret');
    authenticateJWT({ headers: { authorization: `Bearer ${bad}` } } as AuthRequest, r, next);
    expect(r.status).toHaveBeenCalledWith(403);
    expect(r.json).toHaveBeenCalledWith({ success: false, message: 'Invalid or expired authentication token.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('403s for an expired token', () => {
    const r = res(); const next = jest.fn();
    const old = jwt.sign({ userId: 'u', email: 'e', exp: Math.floor(Date.now() / 1000) - 10 }, 'test_secret');
    authenticateJWT({ headers: { authorization: `Bearer ${old}` } } as AuthRequest, r, next);
    expect(r.status).toHaveBeenCalledWith(403);
  });

  it('attaches the decoded user and calls next for a valid token', () => {
    const r = res(); const next = jest.fn();
    const req = { headers: { authorization: `Bearer ${jwt.sign({ userId: 'u1', email: 'a@b.c' }, 'test_secret')}` } } as AuthRequest;
    authenticateJWT(req, r, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toMatchObject({ userId: 'u1', email: 'a@b.c' });
    expect(r.status).not.toHaveBeenCalled();
  });
});
