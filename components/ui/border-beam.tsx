'use client';
import React from 'react';

type BorderBeamProps = {
  duration?: number;
  size?: number;
  className?: string;
  reverse?: boolean;
};

export const BorderBeam = ({
  duration = 8,
  size = 300,
  className = '',
  reverse = false,
}: BorderBeamProps) => {
  return (
    <span
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{
        borderRadius: 'inherit',
        boxShadow: reverse
          ? `0 0 ${size}px 0 rgba(0, 153, 255, 0.25)`
          : `0 0 ${size}px 0 rgba(255, 60, 60, 0.18)`,
        transition: `box-shadow ${duration}s linear`,
      }}
    />
  );
};
