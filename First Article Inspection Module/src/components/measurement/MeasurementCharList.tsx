import { CheckCircle2, XCircle, Clock, Filter } from 'lucide-react';
import { useState } from 'react';

interface MeasurementCharListProps {
  selectedCharId: string;
  onSelectChar: (id: string) => void;
}

const characteristics = [
  { id: 'CHAR-001', number: 1, description: 'Overall Length', criticality: 'Critical', status: 'Passed' },
  { id: 'CHAR-002', number: 2, description: 'Hole Diameter Ø30', criticality: 'Critical', status: 'Passed' },
  { id: 'CHAR-003', number: 3, description: 'Position Tolerance', criticality: 'Critical', status: 'In Progress' },
  { id: 'CHAR-004', number: 4, description: 'Surface Finish', criticality: 'Major', status: 'Passed' },
  { id: 'CHAR-005', number: 5, description: 'Flatness', criticality: 'Major', status: 'Passed' },
  { id: 'CHAR-006', number: 6, description: 'Material Hardness', criticality: 'Critical', status: 'Not Measured' },
  { id: 'CHAR-007', number: 7, description: 'Width Dimension', criticality: 'Major', status: 'Passed' },
  { id: 'CHAR-008', number: 8, description: 'Visual Inspection', criticality: 'Minor', status: 'Failed' }
];

export function MeasurementCharList({ selectedCharId, onSelectChar }: MeasurementCharListProps) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'failed' | 'unmeasured'>('all');

  const filteredCharacteristics = characteristics.filter(char => {
    if (filter === 'critical') return char.criticality === 'Critical';
    if (filter === 'failed') return char.status === 'Failed';
    if (filter === 'unmeasured') return char.status === 'Not Measured';
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Not Measured': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const handleFilterClick = (newFilter: 'all' | 'critical' | 'failed' | 'unmeasured') => {
    setFilter(filter === newFilter ? 'all' : newFilter);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-sm text-gray-900 mb-3">Characteristics</h3>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => handleFilterClick('critical')}
            className={`px-3 py-1.5 text-xs rounded flex items-center gap-2 transition-colors ${
              filter === 'critical' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-3 h-3" />
            Show Critical Only
          </button>
          <button 
            onClick={() => handleFilterClick('failed')}
            className={`px-3 py-1.5 text-xs rounded flex items-center gap-2 transition-colors ${
              filter === 'failed' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <XCircle className="w-3 h-3" />
            Show Failed Only
          </button>
          <button 
            onClick={() => handleFilterClick('unmeasured')}
            className={`px-3 py-1.5 text-xs rounded flex items-center gap-2 transition-colors ${
              filter === 'unmeasured' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            Show Unmeasured Only
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {filteredCharacteristics.map((char) => (
          <div
            key={char.id}
            onClick={() => onSelectChar(char.id)}
            className={`p-3 rounded-lg cursor-pointer transition-colors border ${
              selectedCharId === char.id
                ? 'bg-blue-50 border-blue-300'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">{char.number}</span>
                {getStatusIcon(char.status)}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                char.criticality === 'Critical' ? 'bg-red-100 text-red-700' :
                char.criticality === 'Major' ? 'bg-orange-100 text-orange-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {char.criticality}
              </span>
            </div>
            <div className="text-xs text-gray-600 leading-tight">{char.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}