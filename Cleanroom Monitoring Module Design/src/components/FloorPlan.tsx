import React, { useState, useEffect } from 'react';
import { GlobalContext } from '../App';
import { Layers, MapPin, ZoomIn, ZoomOut, Download, X } from 'lucide-react';
import { toast } from 'sonner';

interface FloorPlanProps {
  globalContext: GlobalContext;
  preselectedRoomId?: string | null;
}

export default function FloorPlan({ globalContext, preselectedRoomId }: FloorPlanProps) {
  const [selectedParameter, setSelectedParameter] = useState('particle');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(preselectedRoomId || 'R-201');
  const [showSensors, setShowSensors] = useState(true);
  const [timeContext, setTimeContext] = useState('current');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showRoomDetailModal, setShowRoomDetailModal] = useState(false);
  const [showDeviationForm, setShowDeviationForm] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draftData, setDraftData] = useState<any>(null);
  const [savedDrafts, setSavedDrafts] = useState<Array<{id: string, data: any, timestamp: number}>>([]);

  // Update selected room when preselectedRoomId changes
  useEffect(() => {
    if (preselectedRoomId) {
      setSelectedRoom(preselectedRoomId);
    }
  }, [preselectedRoomId]);

  const parameters = [
    { id: 'particle', label: 'Particle Count (≥0.5µm)' },
    { id: 'particle5', label: 'Particle Count (≥5.0µm)' },
    { id: 'micro', label: 'Microbial CFU' },
    { id: 'temp', label: 'Temperature' },
    { id: 'humidity', label: 'Humidity' },
    { id: 'pressure', label: 'Differential Pressure' },
    { id: 'airflow', label: 'Airflow Velocity' }
  ];

  // Dynamic values based on parameter and time context
  const getParameterValue = (parameterId: string, context: string) => {
    const baseValues: Record<string, Record<string, number>> = {
      particle: { current: 3520, max24h: 3680, avg24h: 3200, min24h: 2980 },
      particle5: { current: 24, max24h: 29, avg24h: 22, min24h: 18 },
      micro: { current: 8, max24h: 10, avg24h: 7, min24h: 5 },
      temp: { current: 21.2, max24h: 21.8, avg24h: 21.0, min24h: 20.5 },
      humidity: { current: 45, max24h: 48, avg24h: 45, min24h: 42 },
      pressure: { current: 12, max24h: 13, avg24h: 12, min24h: 11 },
      airflow: { current: 0.45, max24h: 0.48, avg24h: 0.45, min24h: 0.42 }
    };
    
    return baseValues[parameterId]?.[context] || baseValues[parameterId]?.current || 0;
  };

  const getParameterUnit = (parameterId: string) => {
    const units: Record<string, string> = {
      particle: 'particles/m³',
      particle5: 'particles/m³',
      micro: 'CFU/m³',
      temp: '°C',
      humidity: '%RH',
      pressure: 'Pa',
      airflow: 'm/s'
    };
    return units[parameterId] || '';
  };

  const getParameterStatus = (parameterId: string, value: number) => {
    const limits: Record<string, { alert: number; action: number }> = {
      particle: { alert: 3000, action: 3500 },
      particle5: { alert: 25, action: 29 },
      micro: { alert: 8, action: 10 },
      temp: { alert: 22, action: 24 },
      humidity: { alert: 50, action: 55 },
      pressure: { alert: 10, action: 8 },
      airflow: { alert: 0.4, action: 0.35 }
    };

    const limit = limits[parameterId];
    if (!limit) return 'ok';

    if (parameterId === 'pressure' || parameterId === 'airflow') {
      // For pressure and airflow, lower is worse
      if (value <= limit.action) return 'excursion';
      if (value <= limit.alert) return 'warning';
    } else {
      // For others, higher is worse
      if (value >= limit.action) return 'excursion';
      if (value >= limit.alert) return 'warning';
    }
    return 'ok';
  };

  const roomDetails = {
    'R-201': {
      name: 'Room 201 - Filling Suite',
      grade: 'Grade B',
      isoClass: 'ISO 7',
      id: 'R-201',
      classification: {
        particle_05um: '≤ 3,520 particles/m³',
        particle_5um: '≤ 29 particles/m³',
        microCFU: '≤ 10 CFU/m³'
      },
      lastSampling: {
        particle: '2 min ago',
        micro: '1 hour ago'
      }
    },
    'R-301': {
      name: 'Room 301 - Aseptic Core',
      grade: 'Grade A',
      isoClass: 'ISO 5',
      id: 'R-301',
      classification: {
        particle_05um: '≤ 3,520 particles/m³',
        particle_5um: '≤ 20 particles/m³',
        microCFU: '≤ 1 CFU/m³'
      },
      lastSampling: {
        particle: '1 min ago',
        micro: '30 min ago'
      }
    }
  };

  const rooms = [
    { id: 'R-301', name: 'R-301', x: 120, y: 80, width: 140, height: 100, grade: 'A' },
    { id: 'R-201', name: 'R-201', x: 300, y: 80, width: 160, height: 100, grade: 'B' },
    { id: 'R-105', name: 'R-105', x: 120, y: 220, width: 140, height: 120, grade: 'C' },
    { id: 'R-204', name: 'R-204', x: 300, y: 220, width: 160, height: 120, grade: 'C' },
    { id: 'R-102', name: 'R-102', x: 500, y: 80, width: 140, height: 260, grade: 'D' }
  ];

  const sensors = [
    { id: 'PC-201-1', x: 330, y: 110, type: 'particle', room: 'R-201' },
    { id: 'PC-201-2', x: 420, y: 150, type: 'particle', room: 'R-201' },
    { id: 'TH-201', x: 375, y: 130, type: 'temp-humidity', room: 'R-201' },
    { id: 'DP-201', x: 300, y: 130, type: 'pressure', room: 'R-201' },
    { id: 'PC-301', x: 190, y: 130, type: 'particle', room: 'R-301' },
    { id: 'PC-105', x: 190, y: 280, type: 'particle', room: 'R-105' }
  ];

  const getRoomColor = (roomId: string) => {
    const value = getParameterValue(selectedParameter, timeContext);
    const status = getParameterStatus(selectedParameter, value);
    
    switch (status) {
      case 'ok': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'excursion': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const currentRoom = selectedRoom ? roomDetails[selectedRoom as keyof typeof roomDetails] : null;
  const currentValue = currentRoom ? getParameterValue(selectedParameter, timeContext) : 0;
  const currentUnit = getParameterUnit(selectedParameter);
  const currentStatus = currentRoom ? getParameterStatus(selectedParameter, currentValue) : 'ok';

  // Export Trend Data function
  const handleExportTrendData = () => {
    const trendData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      value: currentValue + (Math.random() - 0.5) * (currentValue * 0.1)
    }));

    const csvHeader = `Hour,${selectedParameter},Unit\n`;
    const csvRows = trendData.map(point => 
      `${point.hour},${point.value.toFixed(2)},${currentUnit}`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentRoom?.name}_${selectedParameter}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Trend data exported successfully', {
      description: `${currentRoom?.name}_${selectedParameter}.csv downloaded`
    });
  };

  // Save Draft function
  const handleSaveDraft = () => {
    const draftId = `DRAFT-${Date.now()}`;
    const draft = {
      id: draftId,
      data: {
        selectedParameter,
        selectedRoom,
        showSensors,
        timeContext,
        zoomLevel,
        panPosition,
        draftData
      },
      timestamp: Date.now()
    };
    setSavedDrafts([...savedDrafts, draft]);
    toast.success('Draft saved successfully', {
      description: `Draft ${draftId.substring(0, 20)}... saved`
    });
  };

  // Submit Deviation function
  const handleSubmitDeviation = () => {
    toast.success('Deviation created successfully', {
      description: `DEV-2024-0158 created for ${currentRoom?.name}`
    });
    setShowDeviationForm(false);
    setShowRoomDetailModal(false);
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  // Handle drag
  const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging) {
      e.preventDefault();
      setPanPosition({ 
        x: e.clientX - dragStart.x, 
        y: e.clientY - dragStart.y 
      });
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex gap-6" style={{ 
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      {/* Left - Layer Controls */}
      <div className="space-y-4" style={{ flex: '0 0 256px', minWidth: '256px' }}>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-gray-600" />
            <h3 className="text-gray-900">Overlay Controls</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Parameter</label>
              <select
                value={selectedParameter}
                onChange={(e) => {
                  setSelectedParameter(e.target.value);
                  toast.success('Parameter changed', {
                    description: `Now showing: ${parameters.find(p => p.id === e.target.value)?.label}`
                  });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {parameters.map(param => (
                  <option key={param.id} value={param.id}>{param.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Time Context</label>
              <select
                value={timeContext}
                onChange={(e) => {
                  setTimeContext(e.target.value);
                  toast.success('Time context changed', {
                    description: `Now showing: ${e.target.value === 'current' ? 'Current Snapshot' : e.target.value}`
                  });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="current">Current Snapshot</option>
                <option value="max24h">Max (Last 24h)</option>
                <option value="avg24h">Average (Last 24h)</option>
                <option value="min24h">Min (Last 24h)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showSensors"
                checked={showSensors}
                onChange={(e) => {
                  setShowSensors(e.target.checked);
                  toast.success(e.target.checked ? 'Sensors shown' : 'Sensors hidden');
                }}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="showSensors" className="text-gray-700">Show sensor positions</label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-3">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-gray-700">In Spec</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span className="text-gray-700">Warning / Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-gray-700">Excursion / Action</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-3">View Controls</h3>
          <div className="space-y-4">
            {/* Zoom Slider */}
            <div>
              <label className="block text-gray-700 mb-2">Zoom Level: {Math.round(zoomLevel * 100)}%</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => {
                  const newZoom = parseFloat(e.target.value);
                  setZoomLevel(newZoom);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50%</span>
                <span>100%</span>
                <span>200%</span>
              </div>
            </div>

            {/* Buttons */}
            <button 
              onClick={() => {
                const newZoom = Math.min(zoomLevel + 0.2, 2);
                setZoomLevel(newZoom);
                toast.success('Zoomed in', { description: `Zoom level: ${Math.round(newZoom * 100)}%` });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
              <span>Zoom In</span>
            </button>
            <button 
              onClick={() => {
                const newZoom = Math.max(zoomLevel - 0.2, 0.5);
                setZoomLevel(newZoom);
                toast.success('Zoomed out', { description: `Zoom level: ${Math.round(newZoom * 100)}%` });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
              <span>Zoom Out</span>
            </button>
            <button 
              onClick={() => {
                setZoomLevel(1);
                setPanPosition({ x: 0, y: 0 });
                toast.success('View reset', { description: 'Zoom level: 100%, Position reset' });
              }}
              className="w-full px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset View
            </button>
          </div>
        </div>
      </div>

      {/* Center - Floor Plan */}
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-gray-900">{globalContext.building} - Floor Plan</h2>
            <p className="text-gray-600 mt-1">
              Showing: {parameters.find(p => p.id === selectedParameter)?.label} · {timeContext === 'current' ? 'Current' : timeContext}
            </p>
          </div>

          {/* SVG Floor Plan */}
          <div 
            className="overflow-hidden border border-gray-300 rounded-lg bg-gray-50"
            style={{ 
              position: 'relative', 
              width: '100%',
              maxWidth: '760px',
              height: '500px'
            }}
          >
            <div
              className="cursor-move"
              onMouseDown={handleDragStart}
              onMouseMove={handleDrag}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.2s ease',
                width: '760px',
                height: '420px'
              }}
            >
              <svg 
                viewBox="0 0 760 420" 
                width="760"
                height="420"
                className="bg-gray-50"
              >
                {/* Grid background */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Building outline */}
                <rect x="100" y="60" width="560" height="300" fill="none" stroke="#9ca3af" strokeWidth="3" />

                {/* Rooms */}
                {rooms.map(room => {
                  const roomColor = getRoomColor(room.id);
                  return (
                    <g key={room.id}>
                      <rect
                        x={room.x}
                        y={room.y}
                        width={room.width}
                        height={room.height}
                        fill={roomColor}
                        fillOpacity={selectedRoom === room.id ? "0.4" : "0.2"}
                        stroke={selectedRoom === room.id ? "#1f2937" : roomColor}
                        strokeWidth={selectedRoom === room.id ? "3" : "2"}
                        className="cursor-pointer transition-all hover:fill-opacity-30"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoom(room.id);
                          toast.info(`Selected: ${room.name}`, { description: `Grade ${room.grade}` });
                        }}
                      />
                      <text
                        x={room.x + room.width / 2}
                        y={room.y + room.height / 2 - 10}
                        textAnchor="middle"
                        className="text-gray-900 pointer-events-none"
                        fontSize="14"
                      >
                        {room.name}
                      </text>
                      <text
                        x={room.x + room.width / 2}
                        y={room.y + room.height / 2 + 10}
                        textAnchor="middle"
                        className="text-gray-600 pointer-events-none"
                        fontSize="12"
                      >
                        Grade {room.grade}
                      </text>
                    </g>
                  );
                })}

                {/* Sensors */}
                {showSensors && sensors.map(sensor => (
                  <g key={sensor.id}>
                    <circle
                      cx={sensor.x}
                      cy={sensor.y}
                      r="6"
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-8 transition-all"
                    />
                    <title>{sensor.id} ({sensor.type})</title>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Room Detail Panel */}
      {currentRoom && (
        <div style={{ flex: '0 0 320px', minWidth: '320px', maxWidth: '320px' }}>
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
            <h3 className="text-gray-900 mb-3">{currentRoom.name}</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 mb-1">Classification</p>
                <p className="text-gray-900">{currentRoom.grade} · {currentRoom.isoClass}</p>
              </div>

              <div>
                <p className="text-gray-600 mb-2">Classification Limits</p>
                <div className="space-y-1 text-gray-700">
                  <p>Particles ≥0.5µm: {currentRoom.classification.particle_05um}</p>
                  <p>Particles ≥5.0µm: {currentRoom.classification.particle_5um}</p>
                  <p>Microbial: {currentRoom.classification.microCFU}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-600 mb-2">Current Readings</p>
                <div className="space-y-2">
                  {parameters.map(param => {
                    const value = getParameterValue(param.id, timeContext);
                    const unit = getParameterUnit(param.id);
                    const status = getParameterStatus(param.id, value);
                    const bgColor = status === 'excursion' ? 'bg-red-50 border-red-200' : 
                                   status === 'warning' ? 'bg-yellow-50 border-yellow-200' : 
                                   'bg-green-50 border-green-200';
                    const textColor = status === 'excursion' ? 'text-red-700' : 
                                     status === 'warning' ? 'text-yellow-700' : 
                                     'text-green-700';
                    
                    return (
                      <div key={param.id} className={`flex justify-between p-2 ${bgColor} border rounded`}>
                        <span className="text-gray-700">{param.label}:</span>
                        <span className={textColor}>{value.toFixed(param.id.includes('temp') || param.id.includes('airflow') ? 2 : 0)} {unit}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-gray-600 mb-2">Sampling Status</p>
                <div className="space-y-1 text-gray-700">
                  <p>Last particle: {currentRoom.lastSampling.particle}</p>
                  <p>Last microbial: {currentRoom.lastSampling.micro}</p>
                </div>
              </div>

              {currentStatus !== 'ok' && (
                <div>
                  <p className="text-gray-600 mb-2">Active Issues</p>
                  <div className={`p-3 ${currentStatus === 'excursion' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg`}>
                    <p className={currentStatus === 'excursion' ? 'text-red-900' : 'text-yellow-900'}>
                      {selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1)} {currentStatus === 'excursion' ? 'Excursion' : 'Alert'}
                    </p>
                    <p className={currentStatus === 'excursion' ? 'text-red-700' : 'text-yellow-700'}>
                      Value: {currentValue.toFixed(2)} {currentUnit}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowRoomDetailModal(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Detailed Trends
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Detail Modal */}
      {showRoomDetailModal && currentRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowRoomDetailModal(false)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-gray-900">{currentRoom.name} - Detailed Trends</h2>
                <p className="text-gray-600 mt-1">{currentRoom.grade} · {currentRoom.isoClass}</p>
              </div>
              <button onClick={() => setShowRoomDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Status Summary */}
              <div className="grid grid-cols-3 gap-4">
                {['particle', 'temp', 'pressure'].map(paramId => {
                  const value = getParameterValue(paramId, timeContext);
                  const unit = getParameterUnit(paramId);
                  const status = getParameterStatus(paramId, value);
                  const bgColor = status === 'excursion' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
                  const textColor = status === 'excursion' ? 'text-red-900' : 'text-green-900';
                  const statusText = status === 'excursion' ? 'Exceeds action limit' : 'Within spec';
                  const statusTextColor = status === 'excursion' ? 'text-red-700' : 'text-green-700';
                  
                  return (
                    <div key={paramId} className={`p-4 ${bgColor} border rounded-lg`}>
                      <p className="text-gray-600 mb-1">{parameters.find(p => p.id === paramId)?.label}</p>
                      <p className={`${textColor} text-2xl`}>{value.toFixed(paramId === 'temp' ? 1 : 0)} {unit}</p>
                      <p className={`${statusTextColor} mt-1`}>{statusText}</p>
                    </div>
                  );
                })}
              </div>

              {/* Trend Chart */}
              <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-600 mb-2">24-Hour Trend Chart</p>
                <p className="text-gray-500 mb-4">{selectedParameter} trend for {currentRoom.name}</p>
                <div className="h-48 flex items-end justify-around gap-2">
                  {Array.from({ length: 24 }, (_, i) => {
                    const val = currentValue + (Math.random() - 0.5) * (currentValue * 0.15);
                    const maxVal = currentValue * 1.1;
                    const height = (val / maxVal) * 100;
                    const status = getParameterStatus(selectedParameter, val);
                    const barColor = status === 'excursion' ? 'bg-red-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
                    
                    return (
                      <div 
                        key={i} 
                        className={`flex-1 ${barColor} rounded-t transition-all hover:opacity-80`} 
                        style={{ height: `${height}%` }}
                        title={`Hour ${i}: ${val.toFixed(2)} ${currentUnit}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleExportTrendData}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Trend Data
                </button>
                <button
                  onClick={() => setShowDeviationForm(true)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Deviation
                </button>
                <button
                  onClick={() => setShowRoomDetailModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deviation Form Modal */}
      {showDeviationForm && currentRoom && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div 
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-gray-900">Create Deviation Report</h3>
              <button onClick={() => setShowDeviationForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmitDeviation();
            }} className="p-6 space-y-4">
              {/* Pre-filled Information */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 mb-2">Auto-populated from trend analysis:</p>
                <div className="grid grid-cols-2 gap-2 text-blue-700">
                  <p>Room: {currentRoom.name}</p>
                  <p>Parameter: {selectedParameter}</p>
                  <p>Value: {currentValue.toFixed(2)} {currentUnit}</p>
                  <p>Time: {timeContext}</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Deviation Title *</label>
                <input
                  type="text"
                  id="deviationTitle"
                  name="title"
                  defaultValue={`${selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1)} Excursion - ${currentRoom.name}`}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Severity *</label>
                <select
                  id="severity"
                  name="severity"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option>Critical</option>
                  <option>Major</option>
                  <option>Minor</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={`${selectedParameter} exceeded limits. Recorded value: ${currentValue.toFixed(2)} ${currentUnit}`}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Root Cause (Preliminary)</label>
                <textarea
                  id="rootCause"
                  name="rootCause"
                  rows={3}
                  placeholder="Enter preliminary root cause analysis..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Immediate Actions Taken</label>
                <textarea
                  id="immediateActions"
                  name="immediateActions"
                  rows={3}
                  placeholder="Describe any immediate corrective actions..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Assign To *</label>
                  <select
                    id="assignTo"
                    name="assignTo"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option>Sarah Chen</option>
                    <option>Mike Johnson</option>
                    <option>Emily Davis</option>
                    <option>QA Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Target Date *</label>
                  <input
                    type="date"
                    id="targetDate"
                    name="targetDate"
                    defaultValue="2024-12-18"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="attachTrendData"
                  name="attachTrendData"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="attachTrendData" className="text-gray-700">Attach trend data and charts to deviation</label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Deviation
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget.closest('form');
                    if (form) {
                      const formData = new FormData(form);
                      const draftId = `DRAFT-${Date.now()}`;
                      const deviationData = {
                        id: draftId,
                        status: 'draft',
                        room: currentRoom.name,
                        roomId: currentRoom.id,
                        parameter: selectedParameter,
                        parameterValue: currentValue,
                        parameterUnit: currentUnit,
                        timeContext: timeContext,
                        title: formData.get('title'),
                        severity: formData.get('severity'),
                        description: formData.get('description'),
                        rootCause: formData.get('rootCause'),
                        immediateActions: formData.get('immediateActions'),
                        assignTo: formData.get('assignTo'),
                        targetDate: formData.get('targetDate'),
                        attachTrendData: formData.get('attachTrendData') === 'on',
                        createdAt: new Date().toISOString(),
                        createdBy: 'Current User'
                      };
                      
                      // Save to localStorage
                      const existingDrafts = JSON.parse(localStorage.getItem('deviationDrafts') || '[]');
                      existingDrafts.push(deviationData);
                      localStorage.setItem('deviationDrafts', JSON.stringify(existingDrafts));
                      
                      // Update state
                      setSavedDrafts(prev => [...prev, { 
                        id: draftId, 
                        data: deviationData, 
                        timestamp: Date.now() 
                      }]);
                      
                      toast.success('Draft saved successfully', {
                        description: `${draftId} saved to drafts (${existingDrafts.length} total drafts)`,
                        duration: 5000
                      });
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeviationForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}