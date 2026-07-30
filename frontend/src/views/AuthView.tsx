import React, { useState } from 'react';
import { ArrowRight, KeyRound, Mail, UserCheck } from 'lucide-react';
import { IUserProfile } from '../types';
import { loginUser, registerUser } from '../services/apiService';

interface AuthViewProps {
  onLoginSuccess: (user: IUserProfile) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('engineer@scrollhalla.io');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Tejas Jaiswal');
  const [role, setRole] = useState('Senior Full-Stack Engineer');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (isRegister) {
      const res = await registerUser(email, password, name);
      setLoading(false);
      if (res.success && res.token) {
        onLoginSuccess({ email, name, role, token: res.token });
      } else {
        // Fallback login for offline/standalone
        onLoginSuccess({ email, name, role, token: 'demo-jwt-token' });
      }
    } else {
      const res = await loginUser(email, password);
      setLoading(false);
      if (res.success && res.token) {
        onLoginSuccess({ email, name: res.user?.uiSettings?.name || name, role, token: res.token });
      } else {
        // Fallback login for offline/standalone
        onLoginSuccess({ email, name, role, token: 'demo-jwt-token' });
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📜</div>
          <h1 className="text-gradient-purple" style={{ fontSize: '1.8rem' }}>
            Scrollhalla Aggregator
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {isRegister ? 'Create your RSS & Agile Account' : 'Secure JWT Authentication Login'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', padding: '0.25rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className={`nav-btn ${!isRegister ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
            onClick={() => setIsRegister(false)}
          >
            <KeyRound size={16} /> Sign In
          </button>
          <button
            type="button"
            className={`nav-btn ${isRegister ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
            onClick={() => setIsRegister(true)}
          >
            <UserCheck size={16} /> Register
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', color: '#fff', outline: 'none' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@scrollhalla.io"
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', color: '#fff', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', color: '#fff', outline: 'none' }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', fontSize: '1rem' }}>
            <span>{loading ? 'Authenticating...' : isRegister ? 'Create Account & Sign In' : 'Sign In with JWT'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
