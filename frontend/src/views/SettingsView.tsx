import React, { useState } from 'react';
import { Settings, Moon, Sun, User, RefreshCw, Download, Upload, CheckCircle2 } from 'lucide-react';
import { IUserProfile } from '../types';

interface SettingsViewProps {
  currentUser: IUserProfile | null;
  onUpdateUser: (updatedUser: IUserProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, onUpdateUser }) => {
  const [theme, setTheme] = useState<'paper' | 'dark'>('paper');
  const [name, setName] = useState(currentUser?.name || 'Tejas Jaiswal');
  const [email, setEmail] = useState(currentUser?.email || 'engineer@scrollhalla.io');
  const [savedMsg, setSavedMsg] = useState('');

  const toggleTheme = (selectedTheme: 'paper' | 'dark') => {
    setTheme(selectedTheme);
    if (selectedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      email,
      role: currentUser?.role || 'Senior Software Engineer'
    });
    setSavedMsg('Settings saved!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div style={{ padding: '1.25rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)' }}>
          <Settings size={22} color="var(--accent-dark)" /> Settings & Preferences
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Personalize your e-reader aesthetic, sync intervals, and OPML data.
        </p>
      </div>

      {savedMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '0.6rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={16} /> {savedMsg}
        </div>
      )}

      {/* User Profile Card */}
      <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-dark)', color: 'var(--bg-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>
          {name.charAt(0)}
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{name}</h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{email}</div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Reading Aesthetic Card */}
        <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sun size={18} /> Reading Aesthetic & Theme
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              onClick={() => toggleTheme('paper')}
              className="paper-card"
              style={{
                padding: '0.85rem',
                cursor: 'pointer',
                border: theme === 'paper' ? '2px solid var(--accent-dark)' : '1px solid var(--border-paper)',
                background: '#F4F1EA',
                color: '#2D2D2D'
              }}
            >
              <Sun size={18} color="#8C6B40" />
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginTop: '0.3rem' }}>Warm Paper</div>
              <div style={{ fontSize: '0.72rem', color: '#6B6862' }}>#F4F1EA Off-White</div>
            </div>

            <div
              onClick={() => toggleTheme('dark')}
              className="paper-card"
              style={{
                padding: '0.85rem',
                cursor: 'pointer',
                border: theme === 'dark' ? '2px solid var(--accent-gold)' : '1px solid var(--border-paper)',
                background: '#161616',
                color: '#E5E1D8'
              }}
            >
              <Moon size={18} color="#D4AF37" />
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginTop: '0.3rem' }}>E-Ink Dark</div>
              <div style={{ fontSize: '0.72rem', color: '#A09C94' }}>#161616 Dark Mode</div>
            </div>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={18} /> Background Worker Sync
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Cron Harvest Interval</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Background node-cron worker & Redis cache</div>
            </div>
            <span style={{ fontWeight: 700, background: 'rgba(0,0,0,0.06)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}>
              Every 15 min
            </span>
          </div>
        </div>

        {/* OPML Import / Export */}
        <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>Feed Data Management</h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn-paper-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
              <Download size={16} /> Export OPML
            </button>
            <button type="button" className="btn-paper-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
              <Upload size={16} /> Import OPML
            </button>
          </div>
        </div>

        <button type="submit" className="btn-paper-primary">
          Save Settings & Preferences
        </button>
      </form>
    </div>
  );
};

export default SettingsView;
