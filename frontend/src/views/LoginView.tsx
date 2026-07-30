import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { IUserProfile } from '../types';

interface LoginViewProps {
  onLogin: (user: IUserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('Scrum Master');
  const [name, setName] = useState('Tejas Jaiswal');

  const roles = [
    { title: 'Scrum Master', desc: 'Sprint planning, backlog scoring & velocity tracking', icon: '👩‍💼' },
    { title: 'Senior Full-Stack Engineer', desc: 'Architecture, OOAD models & API development', icon: '👨‍💻' },
    { title: 'Product Owner', desc: 'MoSCoW prioritization tags & feature requirements', icon: '🎯' },
    { title: 'DevOps Specialist', desc: 'Docker containerization & CI/CD deployment risk monitoring', icon: '🛠️' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ name, role: selectedRole });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📜</div>
          <h1 className="text-gradient-purple" style={{ fontSize: '1.8rem' }}>
            Welcome to Scrollhalla
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Agile Project Management with OOAD Telemetry & Smart Backlogs
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: '#fff',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Select Agile Team Role
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {roles.map(r => (
                <div
                  key={r.title}
                  onClick={() => setSelectedRole(r.title)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: `1px solid ${selectedRole === r.title ? 'var(--primary-glow)' : 'var(--border-color)'}`,
                    background: selectedRole === r.title ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{r.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', fontSize: '1rem' }}>
            <span>Enter Scrollhalla Workspace</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
