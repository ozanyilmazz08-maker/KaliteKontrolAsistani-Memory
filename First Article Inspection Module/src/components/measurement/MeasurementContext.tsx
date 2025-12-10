import { AlertTriangle, Link2, Settings, Cable, CheckCircle2, Calendar, Package, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function MeasurementContext() {
  const handleCreateNC = () => {
    console.log('Creating nonconformance record');
    toast.warning('Başarısız karakteristik #8 için NC oluşturma formu açılıyor...');
  };

  const handleLinkNC = () => {
    console.log('Linking existing NC/CAPA');
    toast.info('Mevcut NC/CAPA kayıtlarını aramak ve bağlamak için pencere açılıyor...');
  };

  const handleViewDeviceDetails = () => {
    console.log('Viewing device details');
    toast.info('CMM-01 için detaylı kalibrasyon geçmişi ve teknik özellikler gösteriliyor...');
  };

  return (
    <div className="p-6">
      <h3 className="text-gray-900 mb-6">Measurement Context & Traceability</h3>

      {/* Who & When */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-700 mb-3">Who & When</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Settings className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <div className="text-sm text-gray-900">M. Chen</div>
              <div className="text-xs text-gray-600">Metrology Technician</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <div className="text-sm text-gray-900">2024-12-08</div>
              <div className="text-xs text-gray-600">14:32 PST</div>
            </div>
          </div>
        </div>
      </div>

      {/* Where & With What */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-700 mb-3">Where & With What</h4>
        <div className="space-y-3">
          <div 
            onClick={handleViewDeviceDetails}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <Cable className="w-5 h-5 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-gray-900">CMM-01</div>
              <div className="text-xs text-gray-600 mb-2">Zeiss Contura G2 - SN: 987654321</div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">Calibrated</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">Last Cal: 2024-11-15 · Next Due: 2025-02-15</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-5 h-5 flex items-center justify-center text-gray-500">
              📍
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-900">Climate Room A</div>
              <div className="text-xs text-gray-600">Temp: 20°C ± 1°C · Humidity: 45%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lot & Sample Info */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-700 mb-3">Lot & Sample Info</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Package className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <div className="text-sm text-gray-900">Serial Number</div>
              <div className="text-xs text-gray-600">WS2401A-001-FAI</div>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Lot/Batch:</span>
              <span className="text-gray-900">LOT-2024-W48</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Production Order:</span>
              <span className="text-gray-900">PO-2024-8845</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Work Order:</span>
              <span className="text-gray-900">WO-2024-3421</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nonconformance Section (when failed) */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm text-red-900">Failed Characteristic Detected</h4>
            <p className="text-xs text-red-700 mt-1">Characteristic #8 (Visual Inspection) failed.</p>
          </div>
        </div>
        <button 
          onClick={handleCreateNC}
          className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Create Nonconformance Record
        </button>
        <button 
          onClick={handleLinkNC}
          className="w-full mt-2 px-3 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 text-sm"
        >
          Link Existing NC/CAPA
        </button>
      </div>
    </div>
  );
}