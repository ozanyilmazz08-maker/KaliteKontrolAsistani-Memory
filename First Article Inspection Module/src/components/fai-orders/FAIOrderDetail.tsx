import { ExternalLink, FileText, Wrench, ChevronRight, Link2, AlertCircle, Target, ArrowRight, Ruler, FileCheck } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FAIOrderDetailProps {
  orderId: string;
}

export function FAIOrderDetail({ orderId }: FAIOrderDetailProps) {
  const handleGoToCharacteristics = () => {
    console.log('Navigating to Characteristics & Ballooning tab');
    toast.info('Karakteristik & Balon işaretleme sekmesine yönlendiriliyor...');
  };

  const handleGoToMeasurement = () => {
    console.log('Navigating to Measurement & Data Capture tab');
    toast.info('Ölçüm & Veri Toplama sekmesine yönlendiriliyor...');
  };

  const handleViewReport = () => {
    console.log('Opening FAI Report');
    toast.info(orderId + ' için FAI Raporu açılıyor...');
  };

  const handleOpenLinkedObject = (type: string, id: string) => {
    console.log('Opening linked object:', type, id);
    toast.info(`${type} açılıyor - ${id}`);
  };

  return (
    <div className="p-6">
      <h3 className="text-gray-900 mb-6">FAI Order Details</h3>

      {/* Summary Section */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-700 mb-3">Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">FAI ID:</span>
            <span className="text-gray-900">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Part Number:</span>
            <span className="text-gray-900">WS-2401-A</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Drawing:</span>
            <span className="text-gray-900">DWG-2401-001 Rev C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Customer:</span>
            <span className="text-gray-900">OEM-X</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Supplier:</span>
            <span className="text-gray-900">Internal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">FAI Type:</span>
            <span className="text-gray-900">Initial Production</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Risk/Criticality:</span>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">High</span>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-700 mb-3">Status Timeline</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-900">Created</div>
              <div className="text-xs text-gray-500">2024-11-15</div>
            </div>
          </div>
          <div className="ml-4 border-l-2 border-gray-200 h-4"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-900">In Measurement</div>
              <div className="text-xs text-gray-500">Current</div>
            </div>
          </div>
          <div className="ml-4 border-l-2 border-gray-200 h-4"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500">Internal Review</div>
              <div className="text-xs text-gray-400">Pending</div>
            </div>
          </div>
          <div className="ml-4 border-l-2 border-gray-200 h-4"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500">Customer Review</div>
              <div className="text-xs text-gray-400">Pending</div>
            </div>
          </div>
          <div className="ml-4 border-l-2 border-gray-200 h-4"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500">Approved</div>
              <div className="text-xs text-gray-400">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Objects */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-700 mb-3">Linked Objects</h4>
        <div className="space-y-2">
          <div 
            onClick={() => handleOpenLinkedObject('CAD/PLM Item', 'PLM-8845-A')}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <Link2 className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <div className="text-sm text-gray-900">CAD/PLM Item</div>
              <div className="text-xs text-gray-500">PLM-8845-A</div>
            </div>
          </div>
          <div 
            onClick={() => handleOpenLinkedObject('Control Plan', 'CP-2401-001-C')}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <div className="text-sm text-gray-900">Control Plan</div>
              <div className="text-xs text-gray-500">CP-2401-001-C</div>
            </div>
          </div>
          <div 
            onClick={() => handleOpenLinkedObject('NC/CAPA', 'NC-2024-125')}
            className="flex items-center gap-2 p-2 bg-yellow-50 rounded border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors"
          >
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <div className="flex-1">
              <div className="text-sm text-gray-900">NC/CAPA</div>
              <div className="text-xs text-gray-500">NC-2024-125</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h4 className="text-sm text-gray-700 mb-3">Quick Actions</h4>
        <button 
          onClick={handleGoToCharacteristics}
          className="w-full flex items-center justify-between px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="text-sm">Characteristics & Ballooning</span>
          </div>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button 
          onClick={handleGoToMeasurement}
          className="w-full flex items-center justify-between px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            <span className="text-sm">Measurement & Data Capture</span>
          </div>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button 
          onClick={handleViewReport}
          className="w-full flex items-center justify-between px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            <span className="text-sm">Open FAI Report</span>
          </div>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}