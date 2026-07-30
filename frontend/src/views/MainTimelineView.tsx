import React, { useState, useEffect } from 'react';
import { Heart, Bookmark, Share2, BookOpen, ExternalLink, RefreshCw, Clock } from 'lucide-react';
import { IRssArticle } from '../types';
import { fetchFeedTimeline } from '../services/apiService';

interface MainTimelineViewProps {
  onOpenArticle: (article: IRssArticle) => void;
  onToggleBookmark: (articleId: string) => void;
}

export const MainTimelineView: React.FC<MainTimelineViewProps> = ({
  onOpenArticle,
  onToggleBookmark
}) => {
  const [articles, setArticles] = useState<IRssArticle[]>([]);
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    setLoading(true);
    const data = await fetchFeedTimeline();
    setArticles(data);
    setLoading(false);
  };

  const toggleLike = (id: string) => {
    if (likedArticles.includes(id)) {
      setLikedArticles(likedArticles.filter(item => item !== id));
    } else {
      setLikedArticles([...likedArticles, id]);
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
        <button className="reel-action-btn" onClick={loadTimeline} style={{ width: '36px', height: '36px' }} title="Refresh Stream">
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {/* Vertical Reels Feed Container */}
      <div className="reels-feed-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <RefreshCw size={28} className="spin" style={{ marginBottom: '1rem' }} />
            <div>Harvesting feeds from Redis cache...</div>
          </div>
        ) : (
          articles.map(article => {
            const isLiked = likedArticles.includes(article.id);

            return (
              <div key={article.id} className="reel-card">
                {/* Overlay Action Buttons (Instagram Reels Style) */}
                <div className="reel-overlay-actions">
                  <button
                    className={`reel-action-btn ${isLiked ? 'active' : ''}`}
                    onClick={() => toggleLike(article.id)}
                    title={isLiked ? 'Tune Down' : 'Tune Up (Like)'}
                  >
                    <Heart size={20} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
                  </button>

                  <button
                    className={`reel-action-btn ${article.isBookmarked ? 'active' : ''}`}
                    onClick={() => onToggleBookmark(article.id)}
                    title="Save to Bookmarks"
                  >
                    <Bookmark size={20} fill={article.isBookmarked ? '#f59e0b' : 'none'} color={article.isBookmarked ? '#f59e0b' : 'currentColor'} />
                  </button>

                  <button
                    className="reel-action-btn"
                    onClick={() => onOpenArticle(article)}
                    title="Focus Reader Mode"
                  >
                    <BookOpen size={20} />
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

                {/* Article Card Main Content */}
                <div>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{
                      background: article.feedType === 'RSS' ? 'rgba(140, 107, 64, 0.12)' : 'rgba(45, 45, 45, 0.1)',
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
                    style={{ fontSize: '1.4rem', lineHeight: '1.35', fontWeight: 700, marginBottom: '1rem', cursor: 'pointer' }}
                  >
                    {article.title}
                  </h2>

                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: 'var(--text-muted)',
                    display: '-webkit-box',
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.content}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-paper)', paddingTop: '0.85rem', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  <span>Published {new Date(article.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
