import React, { useState } from 'react';
import { Search, Compass, Plus, CheckCircle2, Rss } from 'lucide-react';

const awesomeCategories = [
  { name: 'Tech & Engineering', count: '45 feeds', icon: '💻' },
  { name: 'Science & Discovery', count: '28 feeds', icon: '🧪' },
  { name: 'Minimalist Design', count: '19 feeds', icon: '🎨' },
  { name: 'Independent Blogs', count: '62 feeds', icon: '✍️' },
  { name: 'World News', count: '34 feeds', icon: '🌐' }
];

const featuredFeeds = [
  { id: 'F1', title: 'Hacker News RSS', url: 'https://news.ycombinator.com/rss', category: 'Tech & Engineering', subs: '142k readers', subscribed: true },
  { id: 'F2', title: 'DEV Community', url: 'https://dev.to/feed', category: 'Software Development', subs: '98k readers', subscribed: true },
  { id: 'F3', title: 'Ars Technica', url: 'http://feeds.arstechnica.com/arstechnica/index', category: 'Tech & Science', subs: '210k readers', subscribed: false },
  { id: 'F4', title: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', category: 'Science & Discovery', subs: '85k readers', subscribed: false },
  { id: 'F5', title: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/', category: 'Minimalist Design', subs: '64k readers', subscribed: false }
];

export const ExploreView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribedIds, setSubscribedIds] = useState<string[]>(['F1', 'F2']);
  const [customUrl, setCustomUrl] = useState('');
  const [addedMsg, setAddedMsg] = useState('');

  const toggleSubscribe = (id: string) => {
    if (subscribedIds.includes(id)) {
      setSubscribedIds(subscribedIds.filter(i => i !== id));
    } else {
      setSubscribedIds([...subscribedIds, id]);
    }
  };

  const handleCustomSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setAddedMsg('Subscribed to custom RSS URL!');
    setCustomUrl('');
    setTimeout(() => setAddedMsg(''), 3000);
  };

  const filteredFeeds = featuredFeeds.filter(f =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '1.25rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)' }}>
          <Compass size={24} color="var(--accent-gold)" /> Explore RSS Directory
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Discover curated feeds from awesome-rss-feeds and independent authors.
        </p>
      </div>

      {/* Search Input */}
      <div className="paper-card" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <Search size={18} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search RSS feeds, topics, or blogs..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }}
        />
      </div>

      {/* Curated Category Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.85rem' }}>Curated Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {awesomeCategories.map(cat => (
            <div key={cat.name} className="paper-card" style={{ padding: '0.85rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{cat.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{cat.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom RSS URL Input */}
      <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Rss size={18} color="var(--accent-gold)" /> Subscribe via Custom URL
        </h3>

        {addedMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle2 size={14} /> {addedMsg}
          </div>
        )}

        <form onSubmit={handleCustomSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="url"
            required
            placeholder="https://site.com/rss.xml"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            style={{ flex: 1, background: 'var(--bg-paper)', border: '1px solid var(--border-paper)', borderRadius: '8px', padding: '0.6rem', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }}
          />
          <button type="submit" className="btn-paper-primary" style={{ width: 'auto', padding: '0.6rem 1rem' }}>
            Subscribe
          </button>
        </form>
      </div>

      {/* Recommended Feed List */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.85rem' }}>Recommended Feed Channels</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredFeeds.map(feed => {
            const isSubbed = subscribedIds.includes(feed.id);

            return (
              <div key={feed.id} className="paper-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{feed.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {feed.category} • {feed.subs}
                  </div>
                </div>

                <button
                  className={isSubbed ? 'btn-paper-secondary' : 'btn-paper-primary'}
                  onClick={() => toggleSubscribe(feed.id)}
                  style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                >
                  {isSubbed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExploreView;
