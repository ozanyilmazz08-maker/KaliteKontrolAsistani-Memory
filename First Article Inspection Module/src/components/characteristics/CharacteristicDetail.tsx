import { ExternalLink, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CharacteristicDetailProps {
  charId: string;
}

export function CharacteristicDetail({ charId }: CharacteristicDetailProps) {
  const handleOpenFMEA = () => {
    console.log('Opening FMEA reference');
    toast.info('FMEA-2401-045 FMEA sisteminde açılıyor...');
  };

  const handleOpenControlPlan = () => {
    console.log('Opening Control Plan');
    toast.info('Kontrol Planı CP-2401-001-C açılıyor...');
  };

  const handleViewRevisionHistory = (revision: string) => {
    console.log('Viewing revision history:', revision);
    toast.info(`${revision} revizyonu için detaylı geçmiş gösteriliyor...`);
  };

  return (
    <div className="p-6">
      <h3 className="text-gray-900 mb-6">Characteristic Details</h3>

      {/* Basic Info */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-700 mb-3">Basic Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Char No.:</span>
            <span className="text-gray-900">1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Description:</span>
            <span className="text-gray-900">Overall Length</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Drawing Ref:</span>
            <span className="text-gray-900">Front View</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="text-gray-900">Dimensional</span>
          </div>
        </div>
      </div>

      {/* Requirement */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-700 mb-3">Requirement</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Nominal:</span>
            <span className="text-gray-900">400.00 mm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tolerance:</span>
            <span className="text-gray-900">±0.05 mm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Upper Limit:</span>
            <span className="text-gray-900">400.05 mm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Lower Limit:</span>
            <span className="text-gray-900">399.95 mm</span>
          </div>
        </div>
      </div>

      {/* Criticality */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-700 mb-3">Criticality & Justification</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">Critical</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Critical dimension affecting structural integrity and interface fit with adjacent assemblies. Failure mode analysis indicates high risk to flight safety.
          </p>
          <div 
            onClick={handleOpenFMEA}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>FMEA Reference: FMEA-2401-045 (RPN: 240)</span>
          </div>
        </div>
      </div>

      {/* Measurement Plan */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-700 mb-3">Measurement Plan</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Method:</span>
            <span className="text-gray-900">CMM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Device:</span>
            <span className="text-gray-900">CMM-01</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Measurement Points:</span>
            <span className="text-gray-900">3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sample Size:</span>
            <span className="text-gray-900">1 (FAI)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Assigned To:</span>
            <span className="text-gray-900">M. Chen (Metrology)</span>
          </div>
        </div>
      </div>

      {/* Acceptance Criteria */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-700 mb-3">Acceptance Criteria</h4>
        <div 
          onClick={handleOpenControlPlan}
          className="p-3 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <p className="text-sm text-blue-600 mb-2">Reference: Control Plan CP-2401-001-C</p>
          <p className="text-sm text-gray-900">
            All measurements must be within specified tolerance. Any out-of-tolerance result requires immediate NC and customer notification.
          </p>
        </div>
      </div>

      {/* History */}
      <div>
        <h4 className="text-sm text-gray-700 mb-3">Revision History</h4>
        <div className="space-y-2">
          <div 
            onClick={() => handleViewRevisionHistory('Rev C')}
            className="text-sm p-2 bg-blue-50 rounded border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <div className="flex justify-between mb-1">
              <span className="text-gray-900">Rev C (Current)</span>
              <span className="text-gray-600">2024-11-01</span>
            </div>
            <p className="text-xs text-gray-600">Tolerance tightened from ±0.10 to ±0.05 per customer request</p>
          </div>
          <div 
            onClick={() => handleViewRevisionHistory('Rev B')}
            className="text-sm p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between mb-1">
              <span className="text-gray-900">Rev B</span>
              <span className="text-gray-600">2024-06-15</span>
            </div>
            <p className="text-xs text-gray-600">Original specification</p>
          </div>
        </div>
      </div>
    </div>
  );
}