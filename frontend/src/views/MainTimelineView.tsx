import React, { useState, useEffect } from 'react';
import { Heart, Bookmark, Share2, BookOpen, ExternalLink, RefreshCw, Clock, CheckCircle2 } from 'lucide-react';
import { IRssArticle } from '../types';
import { fetchFeedTimeline } from '../services/apiService';

interface MainTimelineViewProps {
  onOpenArticle: (article: IRssArticle) => void;
  onToggleBookmark: (articleId: string) => void;
  onToggleLike: (articleId: string) => void;
  likedArticleIds: string[];
  bookmarkedArticleIds: string[];
}

export const MainTimelineView: React.FC<MainTimelineViewProps> = ({
  onOpenArticle,
  onToggleBookmark,
  onToggleLike,
  likedArticleIds,
  bookmarkedArticleIds
}) => {
  const [articles, setArticles] = useState<IRssArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    setLoading(true);
    const data = await fetchFeedTimeline();
    setArticles(data);
    setLoading(false);
  };

  const handleShare = (article: IRssArticle) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.link);
    }
    setToastMessage(`Link copied for "${article.sourceTitle}"!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const formatPublishTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffHours = Math.round((Date.now() - date.getTime()) / (1000 * 3600));
      if (diffHours < 1) return 'Published just now';
      if (diffHours < 24) return `Published ${diffHours}h ago`;
      return `Published on ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } catch (err) {
      return `Published on ${dateStr}`;
    }
  };

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Header */}
      <div className="top-header">
        <div className="header-brand">
          <span>📜</span>
          <span>Scrollhalla</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button className="reel-action-btn" onClick={loadTimeline} style={{ width: '36px', height: '36px' }} title="Refresh Stream">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--accent-dark)',
          color: 'var(--bg-paper)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <CheckCircle2 size={14} /> {toastMessage}
        </div>
      )}

      {/* Vertical Reels Feed Container */}
      <div className="reels-feed-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <RefreshCw size={28} className="spin" style={{ marginBottom: '1rem' }} />
            <div>Harvesting RSS telemetry stream...</div>
          </div>
        ) : (
          articles.map(article => {
            const isLiked = likedArticleIds.includes(article.id);
            const isBookmarked = bookmarkedArticleIds.includes(article.id);

            return (
              <div key={article.id} className="reel-card">
                {/* Overlay Action Buttons (Instagram Reels Style) */}
                <div className="reel-overlay-actions">
                  <button
                    className={`reel-action-btn ${isLiked ? 'active' : ''}`}
                    onClick={() => onToggleLike(article.id)}
                    title={isLiked ? 'Tune Down' : 'Tune Up (Like)'}
                  >
                    <Heart size={20} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
                  </button>

                  <button
                    className={`reel-action-btn ${isBookmarked ? 'active' : ''}`}
                    onClick={() => onToggleBookmark(article.id)}
                    title="Save to Bookmarks"
                  >
                    <Bookmark size={20} fill={isBookmarked ? '#f59e0b' : 'none'} color={isBookmarked ? '#f59e0b' : 'currentColor'} />
                  </button>

                  <button
                    className="reel-action-btn"
                    onClick={() => onOpenArticle(article)}
                    title="Focus Reader Mode"
                  >
                    <BookOpen size={20} />
                  </button>

                  <button
                    className="reel-action-btn"
                    onClick={() => handleShare(article)}
                    title="Share Article Link"
                  >
                    <Share2 size={18} />
                  </button>

                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reel-action-btn"
                    title="Original Link"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>

                {/* Article Card Content */}
                <div>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{
                      background: 'rgba(140, 107, 64, 0.12)',
                      color: 'var(--accent-gold)',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {article.sourceTitle}
                    </span>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {article.estimatedReadTimeMinutes || 3} min
                    </span>
                  </div>

                  <h2
                    className="serif-text"
                    onClick={() => onOpenArticle(article)}
                    style={{ fontSize: '1.35rem', lineHeight: '1.35', fontWeight: 700, marginBottom: '1rem', cursor: 'pointer' }}
                  >
                    {article.title}
                  </h2>

                  <p style={{
                    fontSize: '0.92rem',
                    lineHeight: '1.6',
                    color: 'var(--text-muted)',
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.content}
                  </p>
                </div>

                {/* Footer Metadata explicitly stating original pubDate */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-paper)', paddingTop: '0.85rem', marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  <span title={`Original Article PubDate: ${article.pubDate}`}>
                    {formatPublishTime(article.pubDate)}
                  </span>
                  <span onClick={() => onOpenArticle(article)} style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-main)' }}>
                    Read Article →
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MainTimelineView;
