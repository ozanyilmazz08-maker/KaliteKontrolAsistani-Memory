import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * ATOM: Select Component
 * Dropdown with distinct visual states
 * - Collapsed (default)
 * - Expanded (options visible)
 * - Selected (value shown)
 */

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  fullWidth = false
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-3 py-2 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
          flex items-center justify-between gap-2 bg-white hover:border-gray-400
          ${isOpen ? 'border-blue-500 shadow-sm' : 'border-gray-300'}
          ${fullWidth ? 'w-full' : 'min-w-[150px]'}
        `}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors
                  ${option.value === value ? 'bg-blue-100 text-blue-900' : 'text-gray-700'}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
