import { ChevronDown, Calendar, X } from 'lucide-react';
import { useState } from 'react';

interface FilterPanelProps {
  onFilterChange?: (filters: any) => void;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  const [product, setProduct] = useState('all');
  const [selectedDefects, setSelectedDefects] = useState<string[]>([
    'Missing Component',
    'Tombstone',
    'Solder Bridge',
    'Insufficient Solder',
    'Polarity Error',
  ]);

  const handleDefectToggle = (defect: string) => {
    setSelectedDefects(prev => {
      if (prev.includes(defect)) {
        return prev.filter(d => d !== defect);
      } else {
        return [...prev, defect];
      }
    });
  };

  const handleApply = () => {
    if (onFilterChange) {
      onFilterChange({
        timeRange,
        product,
        defectTypes: selectedDefects,
      });
    }
  };

  const handleReset = () => {
    setTimeRange('24h');
    setProduct('all');
    setSelectedDefects([
      'Missing Component',
      'Tombstone',
      'Solder Bridge',
      'Insufficient Solder',
      'Polarity Error',
    ]);
    if (onFilterChange) {
      onFilterChange({
        timeRange: '24h',
        product: 'all',
        defectTypes: [
          'Missing Component',
          'Tombstone',
          'Solder Bridge',
          'Insufficient Solder',
          'Polarity Error',
        ],
      });
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white rounded-lg border border-gray-200 p-2">
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-full flex items-center justify-center hover:bg-gray-100 rounded p-1"
          title="Show Filters"
        >
          <ChevronDown className="w-5 h-5 text-gray-600 rotate-90" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">Filters</h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Collapse Filters"
        >
          <ChevronDown className="w-4 h-4 text-gray-600 -rotate-90" />
        </button>
      </div>

      {/* Time Range */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Time Range</label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {['1h', '8h', '24h', '7d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                timeRange === range
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Last {range}
            </button>
          ))}
        </div>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          <Calendar className="w-4 h-4" />
          <span>Custom Range</span>
        </button>
      </div>

      {/* Product */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Product / Recipe</label>
        <select
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Products</option>
          <option value="pcb-001">PCB-001 Main Board</option>
          <option value="pcb-002">PCB-002 Controller</option>
          <option value="pcb-003">PCB-003 Display</option>
        </select>
      </div>

      {/* Defect Types */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm text-gray-700">Defect Types</label>
          <span className="text-xs text-gray-500">{selectedDefects.length} selected</span>
        </div>
        <div className="space-y-2">
          {[
            'Missing Component',
            'Tombstone',
            'Solder Bridge',
            'Insufficient Solder',
            'Polarity Error',
          ].map((defect) => (
            <label key={defect} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDefects.includes(defect)}
                onChange={() => handleDefectToggle(defect)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{defect}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Station Mode */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Station Mode</label>
        <div className="flex gap-2">
          {['Inline', 'Near-line', 'Offline'].map((mode) => (
            <button
              key={mode}
              className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50"
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <button 
          onClick={handleApply}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Apply Filters
        </button>
        <button 
          onClick={handleReset}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}