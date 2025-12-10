import { useState } from 'react';
import { Upload, Cable, CheckCircle, AlertCircle, Edit, FileDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function MeasurementEntry() {
  const [measurementData, setMeasurementData] = useState([
    { point: 1, measured: '400.02', deviation: '+0.02', status: 'pass' },
    { point: 2, measured: '400.01', deviation: '+0.01', status: 'pass' },
    { point: 3, measured: '400.03', deviation: '+0.03', status: 'pass' }
  ]);
  const [notes, setNotes] = useState('');

  const handleMeasuredValueChange = (point: number, value: string) => {
    setMeasurementData(prev => 
      prev.map(data => 
        data.point === point ? { ...data, measured: value } : data
      )
    );
  };

  const handleImportFromCMM = () => {
    console.log('Importing data from CMM');
    toast.info('CMM dosyasından ölçüm verileri aktarılıyor (DMIS/CSV formatı)...');
  };

  const handleImportFromDevice = () => {
    console.log('Importing data from connected device');
    toast.info('Bağlı ölçüm cihazından gerçek zamanlı veri aktarılıyor...');
  };

  const handleEditPoint = (point: number) => {
    console.log('Editing measurement point:', point);
    toast.info(`Ölçüm noktası ${point} için detaylı düzenleyici açılıyor...`);
  };

  const handleSaveMeasurement = () => {
    console.log('Saving measurement data:', { measurementData, notes });
    toast.success('Ölçüm verileri başarıyla kaydedildi!');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-gray-900">Characteristic #1: Overall Length</h3>
            <p className="text-sm text-gray-600 mt-1">Sample 1 - Serial: WS2401A-001-FAI</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleImportFromCMM}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import from CMM
            </button>
            <button 
              onClick={handleImportFromDevice}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Import from Device
            </button>
          </div>
        </div>
      </div>

      {/* Specification */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Nominal:</span>
            <div className="text-gray-900 mt-1">400.00 mm</div>
          </div>
          <div>
            <span className="text-gray-600">Tolerance:</span>
            <div className="text-gray-900 mt-1">±0.05 mm</div>
          </div>
          <div>
            <span className="text-gray-600">Upper Limit:</span>
            <div className="text-gray-900 mt-1">400.05 mm</div>
          </div>
          <div>
            <span className="text-gray-600">Lower Limit:</span>
            <div className="text-gray-900 mt-1">399.95 mm</div>
          </div>
        </div>
      </div>

      {/* Measurement Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h4 className="text-sm text-gray-900">Measurement Data</h4>
          <span className="text-xs text-gray-600">Method: CMM · Device: CMM-01</span>
        </div>
        
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-600">Measurement Point</th>
              <th className="px-4 py-3 text-left text-xs text-gray-600">Measured Value (mm)</th>
              <th className="px-4 py-3 text-left text-xs text-gray-600">Deviation (mm)</th>
              <th className="px-4 py-3 text-left text-xs text-gray-600">Result</th>
              <th className="px-4 py-3 text-left text-xs text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {measurementData.map((data) => (
              <tr key={data.point} className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-900">Point {data.point}</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={data.measured}
                    onChange={(e) => handleMeasuredValueChange(data.point, e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded w-32 text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${
                    data.status === 'pass' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.deviation}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded text-xs ${
                    data.status === 'pass' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {data.status === 'pass' ? 'Within Tolerance' : 'Out of Tolerance'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => handleEditPoint(data.point)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Average</div>
          <div className="text-xl text-gray-900">400.02 mm</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Min</div>
          <div className="text-xl text-gray-900">400.01 mm</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Max</div>
          <div className="text-xl text-gray-900">400.03 mm</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Std Dev</div>
          <div className="text-xl text-gray-900">0.008 mm</div>
        </div>
      </div>

      {/* Overall Result */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-green-900">Characteristic PASSED</h4>
            <p className="text-sm text-green-700 mt-1">All measurement points are within specified tolerance.</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm text-gray-900 mb-3">Measurement Notes</h4>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
          rows={3}
          placeholder="Add any observations, environmental conditions, or special notes..."
        ></textarea>
        <button 
          onClick={handleSaveMeasurement}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Save Measurement Data
        </button>
      </div>
    </div>
  );
}