import React, { useState } from 'react';
import { Bookmark, Clock, ExternalLink, Search, Trash2 } from 'lucide-react';
import { IRssArticle } from '../types';

interface BookmarksViewProps {
  bookmarkedArticles: IRssArticle[];
  onOpenArticle: (article: IRssArticle) => void;
  onToggleBookmark: (articleId: string) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedArticles,
  onOpenArticle,
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = bookmarkedArticles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.sourceTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '1.25rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)' }}>
          <Bookmark size={22} color="var(--accent-gold)" fill="var(--accent-gold)" /> Saved Articles ({bookmarkedArticles.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Articles saved for distraction-free offline reading.
        </p>
      </div>

      {/* Search Bar */}
      {bookmarkedArticles.length > 0 && (
        <div className="paper-card" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search saved articles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '0.85rem' }}
          />
        </div>
      )}

      {bookmarkedArticles.length === 0 ? (
        <div className="paper-card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Bookmark size={40} style={{ opacity: 0.3, marginBottom: '0.85rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>No Saved Articles Yet</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', lineHeight: '1.5' }}>
            Tap the bookmark icon while browsing your feed to save stories here for later.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filtered.map(article => (
            <div
              key={article.id}
              className="paper-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}
            >
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onOpenArticle(article)}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{
                    background: 'rgba(140, 107, 64, 0.12)',
                    color: 'var(--accent-gold)',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {article.sourceTitle}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Clock size={12} /> {article.estimatedReadTimeMinutes || 3} min
                  </span>
                </div>

                <h3 className="serif-text" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', lineHeight: '1.35' }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                  {article.content}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  className="reel-action-btn"
                  onClick={() => onToggleBookmark(article.id)}
                  style={{ width: '36px', height: '36px', color: 'var(--accent-gold)' }}
                  title="Remove Bookmark"
                >
                  <Trash2 size={16} />
                </button>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reel-action-btn"
                  style={{ width: '36px', height: '36px' }}
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksView;
