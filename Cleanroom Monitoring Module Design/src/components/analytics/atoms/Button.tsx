import React from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * ATOM: Button Component
 * Base interactive element with clear visual affordances
 * - Distinct fill colors for different variants
 * - Hover states for interactivity
 * - Optional icon support
 * - Proper spacing and sizing
 */

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  fullWidth?: boolean;
  active?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  disabled = false,
  fullWidth = false,
  active = false
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: active 
      ? 'bg-blue-700 text-white shadow-md' 
      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md focus:ring-blue-500',
    secondary: active
      ? 'bg-gray-200 text-gray-900 border-2 border-gray-400'
      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500',
    ghost: active
      ? 'bg-gray-200 text-gray-900'
      : 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: active
      ? 'bg-red-700 text-white shadow-md'
      : 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md focus:ring-red-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed hover:bg-gray-100';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? disabledClasses : ''}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
