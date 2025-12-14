import React from 'react';

/**
 * ATOM: Card Component
 * Container with clear boundaries and shadow
 * - Always contains children (no empty cards)
 * - Clear visual separation from background
 * - Hover state for interactive cards
 */

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
}

export default function Card({
  children,
  onClick,
  padding = 'md',
  shadow = 'sm',
  border = true,
  hover = false
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${border ? 'border border-gray-200' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${hover ? 'hover:shadow-md hover:border-gray-300 transition-all' : ''}
      `}
    >
      {children}
    </div>
  );
}
