import React, { useState } from 'react';
import { X, ExternalLink, Bookmark, Clock, Type, ArrowLeft } from 'lucide-react';
import { IRssArticle } from '../types';

interface ReaderViewModalProps {
  article: IRssArticle | null;
  onClose: () => void;
  onToggleBookmark: (articleId: string) => void;
}

export const ReaderViewModal: React.FC<ReaderViewModalProps> = ({
  article,
  onClose,
  onToggleBookmark
}) => {
  const [fontSize, setFontSize] = useState<number>(1.1); // rem

  if (!article) return null;

  const increaseFontSize = () => setFontSize(prev => Math.min(1.4, prev + 0.1));
  const decreaseFontSize = () => setFontSize(prev => Math.max(0.9, prev - 0.1));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--bg-paper)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      {/* Top Reading Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(244, 241, 234, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-paper)',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 100
      }}>
        <button className="reel-action-btn" onClick={onClose} style={{ width: '38px', height: '38px' }} title="Back">
          <ArrowLeft size={18} />
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Clock size={12} /> {article.estimatedReadTimeMinutes || 3} min
          </span>

          {/* Font Controls */}
          <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--bg-card)', border: '1px solid var(--border-paper)', borderRadius: '20px', padding: '0.15rem 0.4rem' }}>
            <button onClick={decreaseFontSize} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '0.2rem 0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>A-</button>
            <button onClick={increaseFontSize} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '0.2rem 0.4rem', fontSize: '0.9rem', fontWeight: 700 }}>A+</button>
          </div>

          <button
            className="reel-action-btn"
            onClick={() => onToggleBookmark(article.id)}
            style={{ width: '38px', height: '38px', color: article.isBookmarked ? 'var(--accent-gold)' : 'var(--text-main)' }}
            title="Toggle Bookmark"
          >
            <Bookmark size={18} fill={article.isBookmarked ? 'var(--accent-gold)' : 'none'} />
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="reel-action-btn"
            style={{ width: '38px', height: '38px' }}
            title="Original Source"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Reading Progress Line */}
      <div style={{ height: '3px', width: '100%', background: 'var(--accent-gold)' }} />

      {/* Article Focus Body */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1.5rem 6rem 1.5rem', width: '100%' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{
            background: 'rgba(140, 107, 64, 0.12)',
            color: 'var(--accent-gold)',
            padding: '0.25rem 0.75rem',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'inline-block',
            marginBottom: '0.75rem'
          }}>
            {article.sourceTitle}
          </span>

          <h1 className="serif-text" style={{ fontSize: '2.1rem', lineHeight: '1.3', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            {article.title}
          </h1>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Published: {new Date(article.pubDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* E-Reader Anthropic/Claude Style Content Text */}
        <article
          className="serif-text"
          style={{
            fontSize: `${fontSize}rem`,
            lineHeight: '1.85',
            color: 'var(--text-main)',
            letterSpacing: '-0.1px'
          }}
        >
          <p style={{ marginBottom: '1.25rem' }}>
            {article.content || 'Full article text extracted from the RSS feed stream.'}
          </p>

          <p style={{ marginBottom: '1.25rem' }}>
            In modern software engineering and content curation, reading tools that eliminate distraction and focus on high-density typography foster deeper comprehension. Scrollhalla integrates dynamic Xikipedia telemetry with an e-ink inspired aesthetic to deliver zero-latency RSS consumption.
          </p>
        </article>

        {/* Footer Navigation Action */}
        <div style={{ borderTop: '1px solid var(--border-paper)', paddingTop: '1.5rem', marginTop: '3rem', textAlign: 'center' }}>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-paper-primary"
            style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto' }}
          >
            Open Full Original Article <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReaderViewModal;
