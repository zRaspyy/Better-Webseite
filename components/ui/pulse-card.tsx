'use client';
import React from 'react';

type CardHoverEffectProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'purple' | 'blue' | 'amber' | 'rose';
  glowEffect?: boolean;
  size?: 'lg' | 'md' | 'sm';
};

export const CardHoverEffect = ({
  icon,
  title,
  description,
  variant = 'purple',
  glowEffect = true,
  size = 'lg',
}: CardHoverEffectProps) => {
  const colorMap = {
    purple: 'from-purple-600 to-purple-400',
    blue: 'from-blue-600 to-blue-400',
    amber: 'from-amber-600 to-amber-400',
    rose: 'from-rose-600 to-rose-400',
  };
  return (
    <div
      className={`relative rounded-2xl p-6 bg-gradient-to-br ${colorMap[variant]} shadow-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_32px_0_rgba(255,60,60,0.25)]`}
      style={{
        minHeight: size === 'lg' ? 180 : 120,
        boxShadow: glowEffect ? '0 0 32px 0 rgba(255,60,60,0.13)' : undefined,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-xl font-bold text-white">{title}</span>
      </div>
      <div className="text-base text-gray-200">{description}</div>
    </div>
  );
};
