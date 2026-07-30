import React, { useState } from 'react';
import { X, Eye, MessageSquare, Clock, Award, User, Flame } from 'lucide-react';
import { ITask, TaskStatusType } from '../types';
import MoSCoWBadge from './MoSCoWBadge';

interface TaskDetailModalProps {
  task: ITask | null;
  onClose: () => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatusType) => void;
  onAddComment: (taskId: string, author: string, commentText: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onUpdateStatus,
  onAddComment
}) => {
  const [commentText, setCommentText] = useState('');
  const [author, setAuthor] = useState('Tejas Jaiswal');

  if (!task) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(task.id, author, commentText);
    setCommentText('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>{task.id}</span>
              <MoSCoWBadge moscow={task.moscow} />
            </div>
            <h2 style={{ fontSize: '1.4rem' }}>{task.title}</h2>
          </div>
          <button className="nav-btn" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          {task.description}
        </p>

        {/* Interaction Telemetry Bar */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '1rem', 
          background: 'rgba(15, 23, 42, 0.5)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          border: '1px solid var(--border-color)' 
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Eye size={14} /> Views
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>{task.views || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MessageSquare size={14} /> Comments
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>{task.comments ? task.comments.length : task.commentCount || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={14} /> Days in Backlog
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>{task.daysInBacklog || 1}d</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              <Flame size={14} /> Smart Score
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c084fc', marginTop: '0.2rem' }}>
              {task.priorityScore ? task.priorityScore.toFixed(1) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Task Properties */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Assignee</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
              <User size={16} /> {task.assignee}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Story Points</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
              <Award size={16} /> {task.storyPoints} pts
            </div>
          </div>
        </div>

        {/* Status Switcher */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Workflow Status</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['TO_DO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as TaskStatusType[]).map(statusKey => (
              <button
                key={statusKey}
                className={`nav-btn ${task.status === statusKey ? 'active' : ''}`}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', flex: 1 }}
                onClick={() => onUpdateStatus(task.id, statusKey)}
              >
                {statusKey.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Comments Stream */}
        <div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} /> Discussion ({task.comments ? task.comments.length : 0})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
            {task.comments && task.comments.length > 0 ? (
              task.comments.map(c => (
                <div key={c.id} style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.author}</span>
                    <span>{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem' }}>{c.text}</p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No comments yet. Be the first to start the discussion!</p>
            )}
          </div>

          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.6rem 0.9rem',
                color: '#fff',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn-primary">Post</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
