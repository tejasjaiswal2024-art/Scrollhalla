import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const interestCategories = [
  { id: 'tech', label: 'Technology', icon: '💻' },
  { id: 'ai', label: 'AI & Machine Learning', icon: '🤖' },
  { id: 'science', label: 'Science & Space', icon: '🧪' },
  { id: 'design', label: 'Design & UX', icon: '🎨' },
  { id: 'philosophy', label: 'Philosophy', icon: '🏛️' },
  { id: 'opensource', label: 'Open Source', icon: '🌐' },
  { id: 'engineering', label: 'Software Engineering', icon: '🛠️' },
  { id: 'news', label: 'World News', icon: '📰' },
  { id: 'history', label: 'History', icon: '📚' },
  { id: 'culture', label: 'Culture & Essays', icon: '✍️' },
  { id: 'books', label: 'Books & Literature', icon: '📖' },
  { id: 'crypto', label: 'Crypto & Web3', icon: '⛓️' }
];

export const OnboardingView: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>(['tech', 'ai', 'design']);
  const navigate = useNavigate();

  const toggleTag = (id: string) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter(t => t !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  const handleContinue = () => {
    navigate('/timeline');
  };

  return (
    <div style={{ padding: '2rem 1.25rem 5rem 1.25rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📜</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
            Curate Your Reading Feed
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Select topics you are interested in. Scrollhalla uses a dynamic algorithm (inspired by Xikipedia) to score and prioritize feed items.
          </p>
        </div>

        {/* Interest Pills Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
          {interestCategories.map(cat => {
            const isSelected = selectedTags.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                className={`tag-pill ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleTag(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {isSelected && <Check size={14} style={{ marginLeft: '0.2rem' }} />}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ sticky: 'bottom', paddingBottom: '1rem' }}>
        <button className="btn-paper-primary" onClick={handleContinue}>
          <span>Build My Reading Feed ({selectedTags.length} Selected)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingView;
