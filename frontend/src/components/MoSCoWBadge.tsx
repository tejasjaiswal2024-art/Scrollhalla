import React from 'react';
import { MoscowType } from '../types';

interface MoSCoWBadgeProps {
  moscow: MoscowType | string;
}

const moscowLabels: Record<string, string> = {
  MUST_HAVE: 'Must Have',
  SHOULD_HAVE: 'Should Have',
  COULD_HAVE: 'Could Have',
  WONT_HAVE: "Won't Have"
};

const moscowIcons: Record<string, string> = {
  MUST_HAVE: '🔥',
  SHOULD_HAVE: '⭐',
  COULD_HAVE: '💡',
  WONT_HAVE: '🚫'
};

export const MoSCoWBadge: React.FC<MoSCoWBadgeProps> = ({ moscow }) => {
  const label = moscowLabels[moscow] || moscow;
  const icon = moscowIcons[moscow] || '📌';

  return (
    <span className={`moscow-tag moscow-${moscow}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
};

export default MoSCoWBadge;
