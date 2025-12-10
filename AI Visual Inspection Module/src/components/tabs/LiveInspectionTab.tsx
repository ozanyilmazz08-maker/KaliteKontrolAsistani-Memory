import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Eye, Layers, Check, X, AlertCircle } from 'lucide-react';

export function LiveInspectionTab() {
  const [selectedDefect, setSelectedDefect] = useState<number | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'defects' | 'explain' | 'trace'>('defects');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [overrideReason, setOverrideReason] = useState('');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const defects = [
    { id: 1, type: 'Solder Bridge', location: 'U12, pins 3-4', severity: 'Critical', confidence: 98.2, x: 35, y: 40 },
    { id: 2, type: 'Insufficient Solder', location: 'R45, pad 1', severity: 'Major', confidence: 94.5, x: 65, y: 30 },
    { id: 3, type: 'Component Shift', location: 'C23', severity: 'Minor', confidence: 87.3, x: 50, y: 60 },
  ];

  const totalImages = 50; // Mock total

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoomLevel(100);

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
      setSelectedDefect(null);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < totalImages - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setSelectedDefect(null);
    }
  };

  const handleAcceptPart = () => {
    console.log('Part accepted');
    // Logic to accept part
    handleNextImage();
  };

  const handleRejectPart = () => {
    console.log('Part rejected with reason:', selectedReason, overrideReason);
    // Logic to reject part
    handleNextImage();
  };

  const handleSendToRework = () => {
    console.log('Part sent to rework');
    // Logic to send to rework
    handleNextImage();
  };

  return (
    <div className="space-y-4">
      {/* Sub-header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-sm text-gray-600">Current Product</div>
              <div className="text-gray-900">PCB-001 Main Board</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Model</div>
              <div className="text-gray-900">CNN-v2.3.1</div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-gray-600">Throughput: </span>
                <span className="text-gray-900">875 units/hr</span>
              </div>
              <div>
                <span className="text-gray-600">Defect Rate: </span>
                <span className="text-gray-900">2.4%</span>
              </div>
              <div>
                <span className="text-gray-600">FP Rate: </span>
                <span className="text-gray-900">1.5%</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Pause Inspection
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Capture Snapshot
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Main Image Viewer */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Live View - Part #SMT-20251210-{String(currentImageIndex + 1).padStart(4, '0')}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  showHeatmap ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Show Heatmap
              </button>
              <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded-lg" title="Zoom In">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded-lg" title="Zoom Out">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button onClick={handleZoomReset} className="p-2 hover:bg-gray-100 rounded-lg" title="Fit to Screen">
                <Maximize2 className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 ml-2">{zoomLevel}%</span>
            </div>
          </div>

          {/* PCB Image with Defect Overlays */}
          <div className="relative bg-gray-900 rounded-lg aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="relative w-full h-full bg-gradient-to-br from-green-900 to-green-950 p-8"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                {/* Simulated PCB */}
                <div className="w-full h-full border-2 border-yellow-600/30 relative">
                  {/* Defect overlays */}
                  {defects.map((defect) => (
                    <div
                      key={defect.id}
                      className={`absolute w-16 h-16 border-2 rounded cursor-pointer transition-all ${
                        selectedDefect === defect.id
                          ? 'border-white scale-110 z-10'
                          : defect.severity === 'Critical'
                          ? 'border-red-500'
                          : defect.severity === 'Major'
                          ? 'border-orange-500'
                          : 'border-yellow-500'
                      }`}
                      style={{ left: `${defect.x}%`, top: `${defect.y}%` }}
                      onClick={() => setSelectedDefect(defect.id)}
                    >
                      <div className="absolute -top-6 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {defect.type}
                      </div>
                    </div>
                  ))}

                  {/* Simulated components */}
                  <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-gray-800 rounded-sm"></div>
                  <div className="absolute top-1/3 left-2/3 w-12 h-6 bg-gray-700 rounded-sm"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-gray-800 rounded"></div>
                </div>

                {showHeatmap && (
                  <div className="absolute inset-0 bg-gradient-radial from-red-500/40 via-yellow-500/20 to-transparent pointer-events-none"></div>
                )}
              </div>
            </div>
          </div>

          {/* View Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Compare with Golden Sample
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                <Layers className="w-4 h-4 inline mr-1" />
                Multi-Camera View
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePreviousImage}
                disabled={currentImageIndex === 0}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-600">
                {currentImageIndex + 1} / {totalImages}
              </span>
              <button 
                onClick={handleNextImage}
                disabled={currentImageIndex === totalImages - 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Right Detail Panel */}
        <div className="w-96 bg-white rounded-lg border border-gray-200 p-4">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-200">
            {[
              { id: 'info' as const, label: 'Part Info' },
              { id: 'defects' as const, label: 'Defects' },
              { id: 'explain' as const, label: 'Explainability' },
              { id: 'trace' as const, label: 'Traceability' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDetailTab(tab.id)}
                className={`px-3 py-2 text-sm border-b-2 transition-colors ${
                  activeDetailTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeDetailTab === 'info' && (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Part ID</div>
                <div className="text-gray-900">SMT-20251210-{String(currentImageIndex + 1).padStart(4, '0')}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Lot/Batch</div>
                <div className="text-gray-900">LOT-2024-W50-A</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Product</div>
                <div className="text-gray-900">PCB-001 Main Board</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Station</div>
                <div className="text-gray-900">AOI #2, Camera Group A</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Inspection Time</div>
                <div className="text-gray-900">2024-12-10 14:32:15</div>
              </div>
            </div>
          )}

          {activeDetailTab === 'defects' && (
            <div className="space-y-2">
              {defects.map((defect) => (
                <div
                  key={defect.id}
                  onClick={() => setSelectedDefect(defect.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedDefect === defect.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-gray-900">{defect.type}</div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        defect.severity === 'Critical'
                          ? 'bg-red-100 text-red-700'
                          : defect.severity === 'Major'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {defect.severity}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Location: {defect.location}</div>
                  <div className="text-sm text-gray-600">Confidence: {defect.confidence}%</div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${defect.confidence}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeDetailTab === 'explain' && (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">Attention Heatmap</div>
                <div className="aspect-video bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 rounded-lg opacity-60"></div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-gray-700">
                  The model focused primarily on solder joints at pins 3-7 of component U12, where it detected a solder bridge with high confidence.
                </div>
              </div>
            </div>
          )}

          {activeDetailTab === 'trace' && (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-2">Linked Records</div>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-50 rounded text-sm">NC-2024-1847</div>
                  <div className="p-2 bg-gray-50 rounded text-sm">Supplier Lot: SUP-A-20241201</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-2">Process Snapshot</div>
                <div className="space-y-1 text-sm">
                  <div>Board Temp: 245°C</div>
                  <div>Line Speed: 1.2 m/min</div>
                  <div>Ambient: 22°C, 45% RH</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decision Bar */}
      <div className="sticky bottom-0 bg-white border-t-2 border-gray-300 shadow-lg rounded-t-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            AI Decision: <span className="text-red-600">Reject</span> (3 critical defects detected)
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleAcceptPart}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Check className="w-5 h-5" />
              Accept Part
            </button>
            <button 
              onClick={handleRejectPart}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <X className="w-5 h-5" />
              Reject Part
            </button>
            <button 
              onClick={handleSendToRework}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              <AlertCircle className="w-5 h-5" />
              Send to Rework
            </button>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <span className="text-sm text-gray-600">Override reason:</span>
          {['False positive – part is OK', 'False negative – defect missed', 'Poor image quality', 'Other'].map((reason) => (
            <button 
              key={reason} 
              onClick={() => setSelectedReason(reason)}
              className={`px-3 py-1 border rounded-full text-sm transition-colors ${
                selectedReason === reason 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {reason}
            </button>
          ))}
          <input
            type="text"
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            placeholder="Additional comments..."
            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}