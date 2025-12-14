import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * ATOM: Input Component
 * Interactive form field with clear visual states
 * - Empty state (placeholder visible)
 * - Focused state (border highlight)
 * - Filled state (value present)
 * - Error state (red border + message)
 * - Icon support for context
 */

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  error?: string;
  type?: 'text' | 'number' | 'email' | 'search';
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Input({
  value,
  onChange,
  placeholder = '',
  icon: Icon,
  error,
  type = 'text',
  disabled = false,
  fullWidth = false
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = 'px-3 py-2 rounded-lg border-2 transition-all focus:outline-none';
  
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 bg-red-50'
    : isFocused
    ? 'border-blue-500 bg-white shadow-sm'
    : value
    ? 'border-gray-300 bg-white'
    : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300';

  const disabledClasses = 'opacity-50 cursor-not-allowed bg-gray-100';

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            ${baseClasses}
            ${stateClasses}
            ${disabled ? disabledClasses : ''}
            ${Icon ? 'pl-10' : ''}
            ${fullWidth ? 'w-full' : ''}
          `}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
