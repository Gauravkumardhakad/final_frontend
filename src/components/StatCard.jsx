// src/components/StatCard.jsx
import React from 'react';

const colorClasses = {
  blue: {
    border: 'border-blue-500',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    shadow: 'shadow-glow-blue',
  },
  cyan: {
    border: 'border-cyan-500',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    shadow: 'shadow-glow-cyan',
  },
  green: {
    border: 'border-green-500',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    shadow: 'shadow-glow-green',
  },
  yellow: {
    border: 'border-yellow-500',
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    shadow: 'shadow-glow-yellow',
  },
};

const StatCard = ({ title, value, icon: Icon, accentColor = 'blue' }) => {
  const colors = colorClasses[accentColor];

  return (
    <div
      className={`
        p-5 rounded-xl bg-slate-800/70 border border-slate-700
        transition-all duration-300 hover:border-slate-600
        hover:shadow-lg ${colors.shadow}
      `}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${colors.bg}`}>
          <Icon size={24} className={colors.text} />
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;