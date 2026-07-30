import React from 'react';
import { Plus, Flame } from 'lucide-react';
import { ITask, TaskStatusType } from '../types';
import MoSCoWBadge from '../components/MoSCoWBadge';
import { Link } from 'react-router-dom';

interface KanbanBoardViewProps {
  tasks: ITask[];
  onSelectTask: (task: ITask) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatusType) => void;
}

const columns: Array<{ id: TaskStatusType; title: string; icon: string }> = [
  { id: 'TO_DO', title: 'To Do', icon: '📝' },
  { id: 'IN_PROGRESS', title: 'In Progress', icon: '⚡' },
  { id: 'IN_REVIEW', title: 'Code Review', icon: '🔍' },
  { id: 'DONE', title: 'Completed', icon: '✅' }
];

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({
  tasks,
  onSelectTask,
  onUpdateStatus
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Interactive Agile Kanban Board</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Visual workflow management tagged with MoSCoW prioritization indicators.
          </p>
        </div>
        <Link to="/backlog" className="btn-primary">
          <Plus size={18} /> Add Task
        </Link>
      </div>

      <div className="kanban-grid">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="glass-panel kanban-column">
              <div className="column-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{col.icon}</span>
                  <span>{col.title}</span>
                </span>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}>
                  {colTasks.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    className="task-card"
                    onClick={() => onSelectTask(task)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{task.id}</span>
                      <MoSCoWBadge moscow={task.moscow} />
                    </div>

                    <div className="task-card-title">{task.title}</div>
                    
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '0.5rem' }}>
                      {task.description}
                    </p>

                    <div className="task-card-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>👤</span> {task.assignee}
                      </span>
                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        <span title="Views">👁️ {task.views || 0}</span>
                        <span title="Comments">💬 {task.comments ? task.comments.length : task.commentCount || 0}</span>
                        {task.priorityScore && (
                          <span style={{ color: '#c084fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                            <Flame size={12} /> {task.priorityScore.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoardView;
