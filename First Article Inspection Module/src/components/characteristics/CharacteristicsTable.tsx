import { Filter, ArrowUpDown, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface CharacteristicsTableProps {
  selectedCharId: string | null;
  onSelectChar: (id: string) => void;
  onHoverChar: (id: string | null) => void;
}

const characteristics = [
  {
    id: 'CHAR-001',
    number: 1,
    description: 'Overall Length',
    drawingRef: 'Front View',
    type: 'Dimensional',
    requirement: '400.00 mm',
    tolerance: '±0.05 mm',
    method: 'CMM',
    device: 'CMM-01',
    criticality: 'Critical',
    status: 'Passed',
    actual: '400.02 mm'
  },
  {
    id: 'CHAR-002',
    number: 2,
    description: 'Hole Diameter Ø30',
    drawingRef: 'Section A-A',
    type: 'Dimensional',
    requirement: 'Ø30.00 mm',
    tolerance: '+0.05/-0.02 mm',
    method: 'CMM',
    device: 'CMM-01',
    criticality: 'Critical',
    status: 'Passed',
    actual: 'Ø30.01 mm'
  },
  {
    id: 'CHAR-003',
    number: 3,
    description: 'Position Tolerance',
    drawingRef: 'Front View',
    type: 'GD&T',
    requirement: 'Position Ø0.1',
    tolerance: 'MMC',
    method: 'CMM',
    device: 'CMM-01',
    criticality: 'Critical',
    status: 'In Progress',
    actual: '—'
  },
  {
    id: 'CHAR-004',
    number: 4,
    description: 'Surface Finish',
    drawingRef: 'Detail B',
    type: 'Attribute',
    requirement: 'Ra 1.6 μm',
    tolerance: 'Max',
    method: 'Optical',
    device: 'Profilometer-02',
    criticality: 'Major',
    status: 'Passed',
    actual: 'Ra 1.4 μm'
  },
  {
    id: 'CHAR-005',
    number: 5,
    description: 'Flatness',
    drawingRef: 'Front View',
    type: 'GD&T',
    requirement: 'Flatness 0.05',
    tolerance: '—',
    method: 'CMM',
    device: 'CMM-01',
    criticality: 'Major',
    status: 'Passed',
    actual: '0.03 mm'
  },
  {
    id: 'CHAR-006',
    number: 6,
    description: 'Material Hardness',
    drawingRef: 'Note 3',
    type: 'Material Test',
    requirement: 'HRC 45-50',
    tolerance: '—',
    method: 'Lab Test',
    device: 'Hardness Tester',
    criticality: 'Critical',
    status: 'Not Measured',
    actual: '—'
  },
  {
    id: 'CHAR-007',
    number: 7,
    description: 'Width Dimension',
    drawingRef: 'Front View',
    type: 'Dimensional',
    requirement: '300.00 mm',
    tolerance: '±0.10 mm',
    method: 'CMM',
    device: 'CMM-01',
    criticality: 'Major',
    status: 'Passed',
    actual: '299.98 mm'
  },
  {
    id: 'CHAR-008',
    number: 8,
    description: 'Visual Inspection',
    drawingRef: 'General',
    type: 'Attribute',
    requirement: 'No defects',
    tolerance: '—',
    method: 'Visual',
    device: 'Visual',
    criticality: 'Minor',
    status: 'Failed',
    actual: 'Surface scratch detected'
  }
];

export function CharacteristicsTable({ selectedCharId, onSelectChar, onHoverChar }: CharacteristicsTableProps) {
  const [criticalityFilter, setCriticalityFilter] = useState('All Criticality');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortBy, setSortBy] = useState<'number' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCharacteristics = characteristics
    .filter(char => {
      if (criticalityFilter === 'Critical Only') return char.criticality === 'Critical';
      if (criticalityFilter === 'Major & Critical') return char.criticality === 'Critical' || char.criticality === 'Major';
      return true;
    })
    .filter(char => {
      if (statusFilter === 'Failed Only') return char.status === 'Failed';
      if (statusFilter === 'Not Measured') return char.status === 'Not Measured';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'number') {
        return sortOrder === 'asc' ? a.number - b.number : b.number - a.number;
      }
      return 0;
    });

  const handleSort = () => {
    if (sortBy === 'number') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy('number');
      setSortOrder('asc');
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'Major': return 'bg-orange-100 text-orange-700';
      case 'Minor': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Not Measured': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div>
      {/* Header with filters */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-gray-900">Characteristics List</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <select 
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          >
            <option>All Criticality</option>
            <option>Critical Only</option>
            <option>Major & Critical</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          >
            <option>All Status</option>
            <option>Failed Only</option>
            <option>Not Measured</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left text-xs text-gray-600">
                <button 
                  onClick={handleSort}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  No. <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="px-3 py-2 text-left text-xs text-gray-600">Description</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600">Drawing Ref</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600">Type</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600">Requirement / Nominal</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600">Tolerance</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600">Method</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600">Device</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600">Criticality</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600">Status</th>
              <th className="px-3 py-2 text-left text-xs text-gray-600">Actual</th>
            </tr>
          </thead>
          <tbody>
            {filteredCharacteristics.map((char) => (
              <tr
                key={char.id}
                onClick={() => onSelectChar(char.id)}
                onMouseEnter={() => onHoverChar(char.id)}
                onMouseLeave={() => onHoverChar(null)}
                className={`border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors ${
                  selectedCharId === char.id ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-3 py-2 text-sm text-gray-900">{char.number}</td>
                <td className="px-3 py-2 text-sm text-gray-900">{char.description}</td>
                <td className="px-3 py-2 text-sm text-gray-600">{char.drawingRef}</td>
                <td className="px-3 py-2 text-sm text-gray-600">{char.type}</td>
                <td className="px-3 py-2 text-sm text-gray-900">{char.requirement}</td>
                <td className="px-3 py-2 text-sm text-gray-600">{char.tolerance}</td>
                <td className="px-3 py-2 text-sm text-gray-600">{char.method}</td>
                <td className="px-3 py-2 text-sm text-gray-600">{char.device}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${getCriticalityColor(char.criticality)}`}>
                    {char.criticality}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(char.status)}
                    <span className="text-sm">{char.status}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-sm text-gray-900">{char.actual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}