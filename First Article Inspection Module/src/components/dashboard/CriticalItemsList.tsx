import { useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const criticalItems = [
  {
    id: 'FAI-2024-003',
    partNumber: 'WS-2401-A',
    part: 'Avionics Panel',
    customer: 'OEM-X',
    supplier: 'Supplier A',
    dueDate: '2024-12-05',
    daysOverdue: 5,
    riskLevel: 'High',
    owner: 'J. Chen'
  },
  {
    id: 'FAI-2024-012',
    partNumber: 'LG-8903-C',
    part: 'Landing Gear Mount',
    customer: 'Boeing',
    supplier: 'Internal',
    dueDate: '2024-12-08',
    daysOverdue: 2,
    riskLevel: 'High',
    owner: 'M. Rodriguez'
  },
  {
    id: 'FAI-2024-007',
    partNumber: 'HF-3421-B',
    part: 'Hydraulic Fitting',
    customer: 'Airbus',
    supplier: 'Supplier C',
    dueDate: '2024-12-10',
    daysOverdue: 0,
    riskLevel: 'Critical',
    owner: 'T. Patel'
  },
  {
    id: 'FAI-2024-015',
    partNumber: 'FT-5612-D',
    part: 'Fuel Tank Bracket',
    customer: 'Lockheed Martin',
    supplier: 'Supplier B',
    dueDate: '2024-12-11',
    daysOverdue: 0,
    riskLevel: 'High',
    owner: 'K. Johnson'
  }
];

export function CriticalItemsList() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredItems = criticalItems.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'critical') return item.riskLevel === 'Critical';
    if (activeFilter === 'escalated') return item.customer === 'OEM-X';
    if (activeFilter === 'audit') return item.daysOverdue > 0;
    return true;
  });

  const handleItemClick = (itemId: string) => {
    console.log('Opening critical item:', itemId);
    toast.info(`${itemId} kritik FAI siparişi açılıyor...`);
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-gray-900 mb-3">Critical & Overdue Items</h3>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setActiveFilter(activeFilter === 'critical' ? 'all' : 'critical')}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              activeFilter === 'critical' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            High Critical Chars
          </button>
          <button 
            onClick={() => setActiveFilter(activeFilter === 'escalated' ? 'all' : 'escalated')}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              activeFilter === 'escalated' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Customer Escalated
          </button>
          <button 
            onClick={() => setActiveFilter(activeFilter === 'audit' ? 'all' : 'audit')}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              activeFilter === 'audit' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Audit Priority
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleItemClick(item.id)}
            className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-900">{item.id}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    item.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {item.riskLevel}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{item.partNumber}</div>
                <div className="text-xs text-gray-500">{item.part}</div>
              </div>
              {item.daysOverdue > 0 && (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
            </div>

            <div className="space-y-1 text-xs text-gray-600 mb-2">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="text-gray-900">{item.customer}</span>
              </div>
              <div className="flex justify-between">
                <span>Supplier:</span>
                <span className="text-gray-900">{item.supplier}</span>
              </div>
              <div className="flex justify-between">
                <span>Owner:</span>
                <span className="text-gray-900">{item.owner}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">Due: {item.dueDate}</span>
              </div>
              {item.daysOverdue > 0 && (
                <span className="text-xs text-red-600">{item.daysOverdue} days overdue</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}