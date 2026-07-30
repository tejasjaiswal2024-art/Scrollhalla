import React, { useState } from 'react';
import { Settings, Moon, Sun, RefreshCw, Download, Upload, CheckCircle2, Bookmark, Heart, Sparkles, BarChart2, RotateCcw } from 'lucide-react';
import { IUserProfile } from '../types';
import { useNavigate } from 'react-router-dom';
import { curatedAwesomeFeeds } from '../services/apiService';
import { downloadOpmlFile } from '../services/opmlService';

interface SettingsViewProps {
  currentUser: IUserProfile | null;
  onUpdateUser: (updatedUser: IUserProfile) => void;
  savedArticlesCount: number;
  likedArticlesCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onUpdateUser,
  savedArticlesCount,
  likedArticlesCount
}) => {
  const [theme, setTheme] = useState<'paper' | 'dark'>('paper');
  const [name, setName] = useState(currentUser?.name || 'Tejas Jaiswal');
  const [email, setEmail] = useState(currentUser?.email || 'tejas.jaiswal2024@vitstudent.ac.in');
  const [savedMsg, setSavedMsg] = useState('');
  const navigate = useNavigate();

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
    setSavedMsg('Settings & Profile updated!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleExportOpml = () => {
    downloadOpmlFile(curatedAwesomeFeeds, 'scrollhalla-subscriptions.opml');
    setSavedMsg('OPML 2.0 file exported successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleImportOpmlMock = () => {
    setSavedMsg('OPML feed file imported successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem('scrollhalla_onboarded');
    onUpdateUser({
      ...currentUser,
      name,
      email,
      role: currentUser?.role || 'Senior Software Engineer',
      onboarded: false
    });
    navigate('/onboarding');
  };

  return (
    <div style={{ padding: '1.25rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="serif-text" style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={22} color="var(--accent-dark)" /> Settings & Reader Profile
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Manage your reader identity, telemetry statistics, theme aesthetic, and OPML data.
        </p>
      </div>

      {savedMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '0.6rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={16} /> {savedMsg}
        </div>
      )}

      {/* User Identity Card */}
      <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-dark)', color: 'var(--bg-paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>
            {name.charAt(0)}
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{name}</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{email}</div>
          </div>
        </div>

        {/* Reader Telemetry Statistics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', borderTop: '1px solid var(--border-paper)', paddingTop: '0.85rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{savedArticlesCount}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
              <Bookmark size={12} /> Bookmarks
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>{likedArticlesCount}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
              <Heart size={12} /> Liked Feeds
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-dark)' }}>
              {currentUser?.selectedInterestTags?.length || 4}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
              <Sparkles size={12} /> Interests
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Telemetry & Weights Card */}
      <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <BarChart2 size={18} color="var(--accent-gold)" /> Dynamic Xikipedia Algorithm Telemetry
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          Current scoring weights calculated from interest tags and interaction telemetry:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.8rem' }}>
          <div style={{ background: 'var(--bg-paper)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-paper)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tech Weight: </span>
            <strong style={{ color: 'var(--accent-gold)' }}>{currentUser?.algorithmWeights?.techWeight || 1.5}x</strong>
          </div>

          <div style={{ background: 'var(--bg-paper)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-paper)' }}>
            <span style={{ color: 'var(--text-muted)' }}>News Weight: </span>
            <strong style={{ color: 'var(--accent-gold)' }}>{currentUser?.algorithmWeights?.newsWeight || 1.4}x</strong>
          </div>

          <div style={{ background: 'var(--bg-paper)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-paper)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Design Weight: </span>
            <strong style={{ color: 'var(--accent-gold)' }}>{currentUser?.algorithmWeights?.designWeight || 1.3}x</strong>
          </div>

          <div style={{ background: 'var(--bg-paper)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-paper)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Science Weight: </span>
            <strong style={{ color: 'var(--accent-gold)' }}>{currentUser?.algorithmWeights?.scienceWeight || 1.2}x</strong>
          </div>
        </div>
      </div>

      {/* OPML Import / Export */}
      <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem' }}>OPML Feed Data Portability</h3>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" className="btn-paper-secondary" onClick={handleExportOpml} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <Download size={16} /> Export OPML
          </button>
          <button type="button" className="btn-paper-secondary" onClick={handleImportOpmlMock} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <Upload size={16} /> Import OPML
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Reading Aesthetic Card */}
        <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sun size={18} /> Reading Aesthetic & Theme Mode
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button type="submit" className="btn-paper-primary" style={{ padding: '0.8rem' }}>
            Save Reader Settings
          </button>

          <button
            type="button"
            className="btn-paper-secondary"
            onClick={handleResetOnboarding}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#d97706' }}
          >
            <RotateCcw size={16} /> Re-Run Onboarding Setup Wizard
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsView;
