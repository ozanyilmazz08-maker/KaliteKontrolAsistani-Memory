import { useState } from 'react';
import { GlobalContext } from '../../App';
import { MeasurementCharList } from '../measurement/MeasurementCharList';
import { MeasurementEntry } from '../measurement/MeasurementEntry';
import { MeasurementContext } from '../measurement/MeasurementContext';
import { ChevronDown } from 'lucide-react';

interface MeasurementDataCaptureProps {
  globalContext: GlobalContext;
}

export function MeasurementDataCapture({ globalContext }: MeasurementDataCaptureProps) {
  const [selectedCharId, setSelectedCharId] = useState<string>('CHAR-001');
  const [selectedSample, setSelectedSample] = useState<number>(1);

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Left: Characteristic List */}
      <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm text-gray-900 mb-3">Part / Sample Selector</h3>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            value={selectedSample}
            onChange={(e) => setSelectedSample(Number(e.target.value))}
          >
            <option value={1}>Sample 1 (Primary FAI Part)</option>
            <option value={2}>Sample 2 (Verification)</option>
            <option value={3}>Sample 3 (Verification)</option>
          </select>
          <div className="mt-2 text-xs text-gray-600">
            Serial: WS2401A-001-FAI
          </div>
        </div>
        <MeasurementCharList 
          selectedCharId={selectedCharId}
          onSelectChar={setSelectedCharId}
        />
      </div>

      {/* Center: Measurement Entry */}
      <div className="flex-1 overflow-y-auto p-6">
        <MeasurementEntry 
          charId={selectedCharId}
          sampleNumber={selectedSample}
        />
      </div>

      {/* Right: Context & Traceability */}
      <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
        <MeasurementContext charId={selectedCharId} />
      </div>
    </div>
  );
}
