import { MoreVertical, Copy, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FAIOrdersTableProps {
  selectedOrderId: string | null;
  onSelectOrder: (id: string) => void;
}

const faiOrders = [
  {
    id: 'FAI-2024-001',
    partNumber: 'WS-2401-A',
    partName: 'Wing Spar Section',
    drawingNumber: 'DWG-2401-001',
    revision: 'C',
    customer: 'OEM-X',
    supplier: 'Internal',
    type: 'Initial Production',
    status: 'In Measurement',
    dueDate: '2024-12-15',
    owner: 'J. Chen',
    criticalChars: { total: 45, open: 12 },
    hasControlPlan: true
  },
  {
    id: 'FAI-2024-002',
    partNumber: 'LG-8903-C',
    partName: 'Landing Gear Mount',
    drawingNumber: 'DWG-8903-045',
    revision: 'B',
    customer: 'Boeing',
    supplier: 'Supplier A',
    type: 'Revision Change',
    status: 'Awaiting Customer',
    dueDate: '2024-12-20',
    owner: 'M. Rodriguez',
    criticalChars: { total: 32, open: 0 },
    hasControlPlan: true
  },
  {
    id: 'FAI-2024-003',
    partNumber: 'AV-3421-B',
    partName: 'Avionics Panel',
    drawingNumber: 'DWG-3421-012',
    revision: 'A',
    customer: 'Airbus',
    supplier: 'Supplier B',
    type: 'Initial Production',
    status: 'Rejected',
    dueDate: '2024-12-05',
    owner: 'T. Patel',
    criticalChars: { total: 28, open: 8 },
    hasControlPlan: false
  },
  {
    id: 'FAI-2024-004',
    partNumber: 'FT-5612-D',
    partName: 'Fuel Tank Bracket',
    drawingNumber: 'DWG-5612-078',
    revision: 'D',
    customer: 'Lockheed Martin',
    supplier: 'Internal',
    type: 'Process Change',
    status: 'Draft',
    dueDate: '2024-12-25',
    owner: 'K. Johnson',
    criticalChars: { total: 18, open: 18 },
    hasControlPlan: true
  },
  {
    id: 'FAI-2024-005',
    partNumber: 'HF-9801-A',
    partName: 'Hydraulic Fitting',
    drawingNumber: 'DWG-9801-023',
    revision: 'B',
    customer: 'OEM-X',
    supplier: 'Supplier C',
    type: 'Supplier Resubmission',
    status: 'In Measurement',
    dueDate: '2024-12-18',
    owner: 'L. Anderson',
    criticalChars: { total: 22, open: 5 },
    hasControlPlan: true
  },
  {
    id: 'FAI-2024-006',
    partNumber: 'CB-4521-C',
    partName: 'Control Box Housing',
    drawingNumber: 'DWG-4521-056',
    revision: 'A',
    customer: 'Boeing',
    supplier: 'Internal',
    type: 'Initial Production',
    status: 'Approved',
    dueDate: '2024-11-30',
    owner: 'S. Kim',
    criticalChars: { total: 35, open: 0 },
    hasControlPlan: true
  }
];

export function FAIOrdersTable({ selectedOrderId, onSelectOrder }: FAIOrdersTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'In Measurement': return 'bg-blue-100 text-blue-700';
      case 'Awaiting Customer': return 'bg-yellow-100 text-yellow-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleOpenFAI = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    console.log('Opening FAI:', orderId);
    toast.info(`${orderId} siparişi açılıyor...`);
  };

  const handleDuplicateFAI = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    console.log('Duplicating FAI:', orderId);
    toast.info(`${orderId} siparişinin kopyası oluşturuluyor...`);
  };

  const handleExportFAI = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    console.log('Exporting FAI:', orderId);
    toast.info(`${orderId} siparişi Excel/PDF formatında dışa aktarılıyor...`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs text-gray-600">FAI ID</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Part Number / Name</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Drawing & Rev</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Customer</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Supplier</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Type</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Status</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Due Date</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Owner</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Critical Chars</th>
            <th className="px-4 py-3 text-left text-xs text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {faiOrders.map((order) => (
            <tr 
              key={order.id}
              onClick={() => onSelectOrder(order.id)}
              className={`border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors ${
                selectedOrderId === order.id ? 'bg-blue-50' : ''
              }`}
            >
              <td className="px-4 py-3 text-sm text-gray-900">{order.id}</td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-900">{order.partNumber}</div>
                <div className="text-xs text-gray-500">{order.partName}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-900">{order.drawingNumber}</div>
                <div className="text-xs text-gray-500">Rev {order.revision}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{order.customer}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{order.supplier}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{order.type}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{order.dueDate}</td>
              <td className="px-4 py-3 text-sm text-gray-900">{order.owner}</td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-900">{order.criticalChars.open}/{order.criticalChars.total}</div>
                {order.hasControlPlan && (
                  <div className="text-xs text-green-600">Control Plan ✓</div>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button 
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                    onClick={(e) => handleOpenFAI(e, order.id)}
                    title="Open FAI"
                  >
                    <FileText className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                    onClick={(e) => handleDuplicateFAI(e, order.id)}
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                    onClick={(e) => handleExportFAI(e, order.id)}
                    title="Export"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}