import React, { useState } from 'react';
import { Check, ArrowRight, User, Sparkles, Rss } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IUserProfile } from '../types';
import { curatedAwesomeFeeds } from '../services/apiService';

interface OnboardingViewProps {
  onCompleteOnboarding: (user: IUserProfile) => void;
}

const interestCategories = [
  { id: 'tech', label: 'Tech & Software', icon: '💻' },
  { id: 'news', label: 'World News', icon: '🌐' },
  { id: 'india', label: 'India & World', icon: '📰' },
  { id: 'ai', label: 'AI & Machine Learning', icon: '🤖' },
  { id: 'science', label: 'Science & Discovery', icon: '🧪' },
  { id: 'design', label: 'Minimalist Design', icon: '🎨' },
  { id: 'opensource', label: 'Open Source', icon: '🛠️' },
  { id: 'blogs', label: 'Independent Blogs', icon: '✍️' }
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onCompleteOnboarding }) => {
  const [name, setName] = useState('Tejas Jaiswal');
  const [email, setEmail] = useState('tejas.jaiswal2024@vitstudent.ac.in');
  const [selectedTags, setSelectedTags] = useState<string[]>(['tech', 'news', 'ai', 'india']);
  const [selectedFeedIds, setSelectedFeedIds] = useState<string[]>(['SUB-1', 'SUB-2', 'SUB-3', 'SUB-5']);
  const navigate = useNavigate();

  const toggleTag = (id: string) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter(t => t !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  const toggleFeed = (id: string) => {
    if (selectedFeedIds.includes(id)) {
      setSelectedFeedIds(selectedFeedIds.filter(f => f !== id));
    } else {
      setSelectedFeedIds([...selectedFeedIds, id]);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: IUserProfile = {
      name,
      email,
      role: 'Senior Software Engineer',
      onboarded: true,
      selectedInterestTags: selectedTags,
      articlesReadCount: 0,
      savedArticlesCount: 1,
      likedArticlesCount: 2,
      algorithmWeights: {
        techWeight: selectedTags.includes('tech') ? 1.5 : 1.0,
        newsWeight: selectedTags.includes('news') ? 1.4 : 1.0,
        designWeight: selectedTags.includes('design') ? 1.3 : 1.0,
        scienceWeight: selectedTags.includes('science') ? 1.2 : 1.0
      },
      uiSettings: { theme: 'paper', density: 'compact' }
    };

    localStorage.setItem('scrollhalla_onboarded', 'true');
    localStorage.setItem('scrollhalla_user', JSON.stringify(updatedUser));
    onCompleteOnboarding(updatedUser);
    navigate('/timeline');
  };

  return (
    <div style={{ padding: '1.5rem 1.25rem 5rem 1.25rem', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>📜</div>
        <h1 className="serif-text" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Welcome to Scrollhalla
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
          Personalize your e-reader setup. Select interests and initial RSS channels to seed your reading timeline.
        </p>
      </div>

      <form onSubmit={handleFinish}>
        {/* Step 1: User Profile Details */}
        <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={18} color="var(--accent-gold)" /> Step 1: Reader Profile
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Full Name / Reader ID</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-paper)', border: '1px solid var(--border-paper)', borderRadius: '8px', padding: '0.6rem', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-paper)', border: '1px solid var(--border-paper)', borderRadius: '8px', padding: '0.6rem', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Step 2: Interest Tag Grid (Xikipedia Inspired) */}
        <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={18} color="var(--accent-gold)" /> Step 2: Select Interest Topics
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Scrollhalla's dynamic algorithm scores feeds according to your selected preferences.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {interestCategories.map(cat => {
              const isSelected = selectedTags.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`tag-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleTag(cat.id)}
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  {isSelected && <Check size={14} style={{ marginLeft: '0.2rem' }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Curated RSS Channels (awesome-rss-feeds / News Sources) */}
        <div className="paper-card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Rss size={18} color="var(--accent-gold)" /> Step 3: Subscribe to Key News Channels
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
            Includes top global & Indian news feeds (Reuters, BBC, The Hindu, NDTV, Hacker News).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {curatedAwesomeFeeds.map(feed => {
              const isSubbed = selectedFeedIds.includes(feed.id);
              return (
                <div
                  key={feed.id}
                  onClick={() => toggleFeed(feed.id)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: `1px solid ${isSubbed ? 'var(--accent-dark)' : 'var(--border-paper)'}`,
                    background: isSubbed ? 'rgba(31, 31, 31, 0.05)' : 'var(--bg-paper)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{feed.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{feed.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{feed.category}</div>
                    </div>
                  </div>

                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `1px solid ${isSubbed ? 'var(--accent-dark)' : 'var(--border-paper)'}`,
                    background: isSubbed ? 'var(--accent-dark)' : 'transparent',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem'
                  }}>
                    {isSubbed && <Check size={12} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button type="submit" className="btn-paper-primary" style={{ padding: '0.85rem' }}>
          <span>Complete Setup & Start Reading</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
};

export default OnboardingView;
