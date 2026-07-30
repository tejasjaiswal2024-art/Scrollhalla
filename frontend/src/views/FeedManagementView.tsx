import React, { useState } from 'react';
import { Rss, Plus, CheckCircle2, Trash2, Globe, Sparkles } from 'lucide-react';
import { IRssSubscription } from '../types';

export const FeedManagementView: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<IRssSubscription[]>([
    { id: 'SUB-1', title: 'GitHub System Status', feedUrl: 'https://www.githubstatus.com/history.rss', category: 'DevOps & Infra', itemCount: 12, createdAt: new Date().toISOString() },
    { id: 'SUB-2', title: 'Hacker News RSS', feedUrl: 'https://news.ycombinator.com/rss', category: 'Tech & Engineering', itemCount: 30, createdAt: new Date().toISOString() },
    { id: 'SUB-3', title: 'DEV Community RSS', feedUrl: 'https://dev.to/feed', category: 'Software Development', itemCount: 25, createdAt: new Date().toISOString() }
  ]);

  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [category, setCategory] = useState('General Tech');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const newSub: IRssSubscription = {
      id: `SUB-${Date.now()}`,
      title: newTitle || newUrl.replace('https://', '').split('/')[0],
      feedUrl: newUrl,
      category,
      itemCount: 15,
      createdAt: new Date().toISOString()
    };

    setSubscriptions([newSub, ...subscriptions]);
    setNewUrl('');
    setNewTitle('');
    setSuccessMsg('RSS Feed Subscription added successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDelete = (id: string) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Rss size={24} color="#f59e0b" /> Feed Subscription Management
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Add RSS/Atom channel URLs to harvest feeds into your centralized timeline.
        </p>
      </div>

      {/* Add Subscription Card */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} color="#6366f1" /> Subscribe to New RSS/Atom Feed
        </h2>

        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#6ee7b7', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleAddSubscription}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>RSS Feed URL</label>
              <input
                type="url"
                required
                placeholder="https://example.com/rss.xml"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.65rem', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Channel Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. TechCrunch"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.65rem', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.65rem', color: '#fff' }}
              >
                <option value="General Tech">General Tech</option>
                <option value="DevOps & Infra">DevOps & Infra</option>
                <option value="Software Development">Software Development</option>
                <option value="Agile & OOAD">Agile & OOAD</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> Add Subscription
          </button>
        </form>
      </div>

      {/* Active Subscriptions List */}
      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Active Subscriptions ({subscriptions.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {subscriptions.map(sub => (
            <div key={sub.id} className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1.5rem' }}>🌐</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{sub.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.feedUrl}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {sub.category}
                </span>
                <button className="nav-btn" onClick={() => handleDelete(sub.id)} style={{ color: '#ef4444', padding: '0.4rem' }} title="Delete Subscription">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedManagementView;
