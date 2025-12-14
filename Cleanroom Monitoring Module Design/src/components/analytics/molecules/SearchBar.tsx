import React from 'react';
import { Search, X } from 'lucide-react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

/**
 * MOLECULE: SearchBar
 * Combines atoms into functional search component
 * - Search icon (visual affordance)
 * - Input field (user entry)
 * - Clear button (action - only visible when filled)
 */

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search datasets, reports, visualizations...'
}: SearchBarProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="flex items-center gap-2 flex-1 max-w-2xl">
      <div className="flex-1 relative">
        <Input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          icon={Search}
          type="search"
          fullWidth
        />
        
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {onSearch && (
        <Button variant="primary" onClick={onSearch}>
          Search
        </Button>
      )}
    </div>
  );
}
