import React, { useState } from 'react';
import { Sparkles, Plus, Filter, Eye, MessageSquare, Clock } from 'lucide-react';
import { ITask, MoscowType } from '../types';
import MoSCoWBadge from '../components/MoSCoWBadge';

interface ProjectBacklogViewProps {
  tasks: ITask[];
  onSelectTask: (task: ITask) => void;
  onCreateTask: (newTask: Omit<ITask, 'id' | 'views' | 'comments' | 'createdAt'>) => void;
}

export const ProjectBacklogView: React.FC<ProjectBacklogViewProps> = ({
  tasks,
  onSelectTask,
  onCreateTask
}) => {
  const [filterMoscow, setFilterMoscow] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMoscow, setNewMoscow] = useState<MoscowType>('SHOULD_HAVE');
  const [newPoints, setNewPoints] = useState(3);
  const [newAssignee, setNewAssignee] = useState('Tejas Jaiswal');

  const filteredTasks = tasks.filter(t => {
    if (filterMoscow === 'ALL') return true;
    return t.moscow === filterMoscow;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateTask({
      title: newTitle,
      description: newDesc,
      moscow: newMoscow,
      storyPoints: Number(newPoints),
      assignee: newAssignee,
      status: 'TO_DO'
    });
    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={24} color="#c084fc" /> Smart Project Backlog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tasks scored dynamically via Xikipedia engagement telemetry (Views × 1.5 + Comments × 4.0 + Log(Days) × 2.5) × MoSCoW Weight.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} /> New Backlog Task
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Filter size={16} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>MoSCoW Filter:</span>
        {['ALL', 'MUST_HAVE', 'SHOULD_HAVE', 'COULD_HAVE', 'WONT_HAVE'].map(m => (
          <button
            key={m}
            className={`nav-btn ${filterMoscow === m ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            onClick={() => setFilterMoscow(m)}
          >
            {m === 'ALL' ? 'All Priorities' : m.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank / Score</th>
              <th>Task Details</th>
              <th>MoSCoW Priority</th>
              <th>Status</th>
              <th>Interaction Telemetry</th>
              <th>Assignee</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((t, idx) => (
              <tr key={t.id} onClick={() => onSelectTask(t)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>#{idx + 1}</span>
                    <span style={{
                      background: 'rgba(192, 132, 252, 0.15)',
                      color: '#c084fc',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      {t.priorityScore ? t.priorityScore.toFixed(1) : '85.0'}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.id} • {t.storyPoints} Story Points</div>
                </td>
                <td>
                  <MoSCoWBadge moscow={t.moscow} />
                </td>
                <td>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.08)'
                  }}>
                    {t.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span><Eye size={12} /> {t.views || 0}</span>
                    <span><MessageSquare size={12} /> {t.comments ? t.comments.length : t.commentCount || 0}</span>
                    <span><Clock size={12} /> {t.daysInBacklog || 1}d</span>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{t.assignee}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Task Creation Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1rem' }}>Create New Backlog Task</h2>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement Sprint Risk RSS Telemetry"
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Task requirements and technical details..."
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>MoSCoW Tag</label>
                  <select
                    value={newMoscow}
                    onChange={e => setNewMoscow(e.target.value as MoscowType)}
                    style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem', color: '#fff' }}
                  >
                    <option value="MUST_HAVE">Must Have</option>
                    <option value="SHOULD_HAVE">Should Have</option>
                    <option value="COULD_HAVE">Could Have</option>
                    <option value="WONT_HAVE">Won't Have</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Story Points</label>
                  <input
                    type="number"
                    min={1}
                    max={13}
                    value={newPoints}
                    onChange={e => setNewPoints(Number(e.target.value))}
                    style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBacklogView;
