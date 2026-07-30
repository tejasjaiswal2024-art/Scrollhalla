import React from 'react';
import { ShieldAlert, Sparkles, TrendingUp, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';
import { ITask, ISprintRisk } from '../types';
import MoSCoWBadge from '../components/MoSCoWBadge';
import { Link } from 'react-router-dom';

interface DashboardViewProps {
  tasks: ITask[];
  sprintRisk: ISprintRisk | null;
  onSelectTask: (task: ITask) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ tasks, sprintRisk, onSelectTask }) => {
  const totalStoryPoints = tasks.reduce((sum, t) => sum + Number(t.storyPoints || 0), 0);
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;

  const moscowCounts = {
    MUST_HAVE: tasks.filter(t => t.moscow === 'MUST_HAVE').length,
    SHOULD_HAVE: tasks.filter(t => t.moscow === 'SHOULD_HAVE').length,
    COULD_HAVE: tasks.filter(t => t.moscow === 'COULD_HAVE').length,
    WONT_HAVE: tasks.filter(t => t.moscow === 'WONT_HAVE').length
  };

  const topBacklog = [...tasks]
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
    .slice(0, 4);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Sprint 14 Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time telemetry, risk analysis, and dynamic Smart Backlog scoring.</p>
        </div>
        <Link to="/kanban" className="btn-primary">
          Open Kanban Board
        </Link>
      </div>

      {/* Stats & Risk Banner */}
      <div className="dashboard-grid">
        {/* Sprint Risk Score Widget */}
        <div className={`glass-panel stat-card risk-widget ${sprintRisk ? sprintRisk.riskLevel : 'LOW'}`}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldAlert size={16} /> SPRINT RISK SCORE
              </span>
              <span style={{
                background: sprintRisk?.riskLevel === 'CRITICAL' ? '#ef4444' : sprintRisk?.riskLevel === 'HIGH' ? '#f97316' : '#10b981',
                padding: '0.2rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#fff'
              }}>
                {sprintRisk ? sprintRisk.riskLevel : 'LOW'} RISK
              </span>
            </div>
            <div className="text-gradient-silver" style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '0.5rem' }}>
              {sprintRisk ? `${sprintRisk.riskScorePercentage}%` : '18%'}
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
            💡 {sprintRisk?.mitigationAdvice || 'Infrastructure operational. Maintain sprint velocity.'}
          </div>
        </div>

        {/* Sprint Velocity Card */}
        <div className="glass-panel stat-card">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <TrendingUp size={16} /> SPRINT CAPACITY
            </span>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '0.5rem' }}>
              {totalStoryPoints} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>pts</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', marginTop: '1rem' }}>
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <CheckCircle2 size={14} /> {completedTasks} Done
            </span>
            <span style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Clock size={14} /> {inProgressTasks} In Progress
            </span>
          </div>
        </div>

        {/* MoSCoW Breakdown Card */}
        <div className="glass-panel stat-card">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              MoSCoW TAG BREAKDOWN
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem' }}><MoSCoWBadge moscow="MUST_HAVE" />: <strong>{moscowCounts.MUST_HAVE}</strong></div>
              <div style={{ fontSize: '0.8rem' }}><MoSCoWBadge moscow="SHOULD_HAVE" />: <strong>{moscowCounts.SHOULD_HAVE}</strong></div>
              <div style={{ fontSize: '0.8rem' }}><MoSCoWBadge moscow="COULD_HAVE" />: <strong>{moscowCounts.COULD_HAVE}</strong></div>
              <div style={{ fontSize: '0.8rem' }}><MoSCoWBadge moscow="WONT_HAVE" />: <strong>{moscowCounts.WONT_HAVE}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Backlog Recommended Queue */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#c084fc" /> Smart Backlog Priority Queue (Xikipedia Algorithm)
          </h2>
          <Link to="/backlog" className="nav-btn" style={{ fontSize: '0.85rem' }}>
            View Full Backlog <ArrowUpRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {topBacklog.map(task => (
            <div
              key={task.id}
              className="glass-panel"
              onClick={() => onSelectTask(task)}
              style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  background: 'rgba(192, 132, 252, 0.15)',
                  color: '#c084fc',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: '1px solid rgba(192, 132, 252, 0.3)'
                }}>
                  {task.priorityScore ? task.priorityScore.toFixed(1) : '95.0'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{task.title}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{task.id}</span>
                    <span>•</span>
                    <span>{task.assignee}</span>
                    <span>•</span>
                    <span>👁️ {task.views} views</span>
                    <span>•</span>
                    <span>💬 {task.comments ? task.comments.length : task.commentCount} comments</span>
                  </div>
                </div>
              </div>

              <MoSCoWBadge moscow={task.moscow} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
