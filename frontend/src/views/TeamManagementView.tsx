import React from 'react';
import { Users, Award, Briefcase } from 'lucide-react';
import { ITeamMember } from '../types';

interface TeamManagementViewProps {
  teamMembers: ITeamMember[];
}

export const TeamManagementView: React.FC<TeamManagementViewProps> = ({ teamMembers }) => {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={24} color="#818cf8" /> Agile Team Workload Management
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Workload allocation, velocity tracking, and member role assignments.
        </p>
      </div>

      <div className="dashboard-grid">
        {teamMembers.map(member => (
          <div key={member.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2.5rem' }}>{member.avatar || '👨‍💻'}</div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{member.name}</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{member.role}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'rgba(15, 23, 42, 0.4)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Award size={14} /> Target Velocity
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>{member.velocity} pts</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Briefcase size={14} /> Assigned Tasks
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem' }}>{member.assignedTasksCount || 0} tasks</div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <span>Capacity Utilization</span>
                <span style={{ fontWeight: 700, color: member.capacityUtilizationPercentage > 80 ? '#ef4444' : '#10b981' }}>
                  {member.capacityUtilizationPercentage || 45}%
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${member.capacityUtilizationPercentage || 45}%`,
                  height: '100%',
                  background: member.capacityUtilizationPercentage > 80 
                    ? 'linear-gradient(90deg, #f97316, #ef4444)' 
                    : 'linear-gradient(90deg, #6366f1, #a855f7)',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManagementView;
