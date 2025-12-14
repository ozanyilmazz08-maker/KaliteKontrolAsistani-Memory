import React, { useState } from 'react';
import { X, Download, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface RoomTrendModalProps {
  room: any;
  onClose: () => void;
}

export default function RoomTrendModal({ room, onClose }: RoomTrendModalProps) {
  const [selectedParameter, setSelectedParameter] = useState('particle');
  const [timeRange, setTimeRange] = useState('24h');
  const [showDeviationForm, setShowDeviationForm] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<Array<{id: string, data: any, timestamp: number}>>([]);

  // Mock trend data
  const generateTrendData = () => {
    const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
    const baseValue = selectedParameter === 'particle' ? 3200 : 
                      selectedParameter === 'temp' ? 21 :
                      selectedParameter === 'humidity' ? 45 : 12;
    
    return Array.from({ length: hours }, (_, i) => ({
      time: i,
      value: baseValue + Math.random() * (selectedParameter === 'particle' ? 400 : 2)
    }));
  };

  const trendData = generateTrendData();
  const maxValue = Math.max(...trendData.map(d => d.value));
  const minValue = Math.min(...trendData.map(d => d.value));

  // Export CSV function
  const handleExportData = () => {
    const csvHeader = `Time,${selectedParameter},Unit\n`;
    const csvRows = trendData.map((point, idx) => 
      `${idx},${point.value.toFixed(2)},${selectedParameter === 'particle' ? 'particles/m³' : selectedParameter === 'temp' ? '°C' : selectedParameter === 'humidity' ? '%RH' : 'Pa'}`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${room.name}_${selectedParameter}_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Trend data exported successfully', {
      description: `${room.name}_${selectedParameter}_${timeRange}.csv downloaded`
    });
  };

  // Generate PDF function
  const handleGeneratePDF = () => {
    toast.loading('Generating PDF report...', { duration: 2000 });
    
    setTimeout(() => {
      // Create a mock PDF content
      const pdfContent = `
========================================
CLEANROOM MONITORING - TREND REPORT
========================================

Room: ${room.name}
Grade: ${room.grade}
ISO Class: ${room.isoClass}
Room ID: ${room.id}

Report Generated: ${new Date().toLocaleString()}
Time Range: ${timeRange === '24h' ? 'Last 24 Hours' : timeRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
Parameter: ${selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1)}

========================================
STATISTICS SUMMARY
========================================

Current Value: ${trendData[trendData.length - 1].value.toFixed(2)}
Maximum: ${maxValue.toFixed(2)}
Minimum: ${minValue.toFixed(2)}
Average: ${(trendData.reduce((sum, d) => sum + d.value, 0) / trendData.length).toFixed(2)}

========================================
CONTROL LIMITS
========================================

Alert Limit: ${selectedParameter === 'particle' ? '3,000 particles/m³' : selectedParameter === 'temp' ? '22°C' : selectedParameter === 'humidity' ? '50% RH' : '10 Pa'}
Action Limit: ${selectedParameter === 'particle' ? '3,500 particles/m³' : selectedParameter === 'temp' ? '24°C' : selectedParameter === 'humidity' ? '55% RH' : '8 Pa'}
Target: ${selectedParameter === 'particle' ? '2,500 particles/m³' : selectedParameter === 'temp' ? '21°C' : selectedParameter === 'humidity' ? '45% RH' : '15 Pa'}

========================================
TREND DATA POINTS (First 20)
========================================

${trendData.slice(0, 20).map((point, idx) => `Time ${idx}: ${point.value.toFixed(2)}`).join('\n')}

========================================
EXCURSION EVENTS
========================================

${selectedParameter === 'particle' ? 'Particle Count Exceeded Action Limit\nValue: 3,520 particles/m³ (Limit: 3,500)\nTimestamp: 2024-12-11 08:35\nDuration: 5 minutes\nStatus: Active' : 'No excursions detected in this period'}

========================================
END OF REPORT
========================================
`;
      
      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${room.name}_Trend_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF report generated successfully!', {
        description: `${room.name}_Trend_Report_${new Date().toISOString().split('T')[0]}.pdf downloaded`
      });
    }, 2000);
  };

  // Create Deviation function
  const handleCreateDeviation = () => {
    setShowDeviationForm(true);
  };

  // Save Draft function
  const handleSaveDraft = () => {
    const draftId = `DRAFT-${Date.now()}`;
    const draftData = {
      roomName: room.name,
      parameter: selectedParameter,
      maxValue: maxValue.toFixed(1),
      timeRange: timeRange
    };
    setSavedDrafts([...savedDrafts, {id: draftId, data: draftData, timestamp: Date.now()}]);
    toast.success('Draft saved successfully', {
      description: `Draft ${draftId.substring(0, 20)}... saved. You can continue editing later.`
    });
  };

  // Submit Deviation function
  const handleSubmitDeviation = () => {
    toast.success('Deviation created successfully', {
      description: `DEV-2024-0157 created and assigned to selected user`
    });
    setShowDeviationForm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50" onClick={onClose}>
        <div 
          className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-gray-900">{room.name} - Trend Analysis</h2>
              <p className="text-gray-600 mt-1">{room.grade} · {room.isoClass} · ID: {room.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Controls */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-2">Parameter</label>
                <select
                  value={selectedParameter}
                  onChange={(e) => setSelectedParameter(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="particle">Particle Count (0.5µm)</option>
                  <option value="temp">Temperature</option>
                  <option value="humidity">Humidity</option>
                  <option value="pressure">Differential Pressure</option>
                  <option value="airflow">Airflow Velocity</option>
                  <option value="micro">Microbial Count</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-gray-700 mb-2">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-gray-600 mb-1">Current Value</p>
                <p className="text-blue-900 text-2xl">{trendData[trendData.length - 1].value.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-gray-600 mb-1">Maximum</p>
                <p className="text-red-900 text-2xl">{maxValue.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-gray-600 mb-1">Minimum</p>
                <p className="text-green-900 text-2xl">{minValue.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-gray-600 mb-1">Average</p>
                <p className="text-purple-900 text-2xl">
                  {(trendData.reduce((sum, d) => sum + d.value, 0) / trendData.length).toFixed(1)}
                </p>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="p-6 bg-gray-50 border-2 border-gray-300 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">
                  {selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1)} Trend
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{timeRange === '24h' ? 'Last 24 Hours' : timeRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'}</span>
                </div>
              </div>

              {/* Simple Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-1">
                {trendData.slice(0, 50).map((point, idx) => {
                  const height = ((point.value - minValue) / (maxValue - minValue)) * 100;
                  const isExcursion = selectedParameter === 'particle' && point.value > 3500;
                  
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t transition-all ${
                        isExcursion ? 'bg-red-500' : 'bg-blue-500'
                      } hover:opacity-80 cursor-pointer`}
                      style={{ height: `${height}%` }}
                      title={`Value: ${point.value.toFixed(1)}`}
                    />
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>Time: 0h</span>
                <span>Time: {timeRange === '24h' ? '24h' : timeRange === '7d' ? '7d' : '30d'}</span>
              </div>
            </div>

            {/* Excursion Events */}
            {selectedParameter === 'particle' && (
              <div>
                <h4 className="text-gray-900 mb-3">Excursion Events in Period</h4>
                <div className="space-y-2">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-900">Particle Count Exceeded Action Limit</p>
                        <p className="text-red-700 mt-1">Value: 3,520 particles/m³ (Limit: 3,500)</p>
                        <p className="text-gray-600 mt-1">2024-12-11 08:35 · Duration: 5 minutes</p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Control Limits Reference */}
            <div>
              <h4 className="text-gray-900 mb-3">Control Limits</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-600">Alert Limit</p>
                  <p className="text-gray-900">
                    {selectedParameter === 'particle' ? '3,000 particles/m³' :
                     selectedParameter === 'temp' ? '22°C' :
                     selectedParameter === 'humidity' ? '50% RH' :
                     selectedParameter === 'pressure' ? '10 Pa' : 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-600">Action Limit</p>
                  <p className="text-gray-900">
                    {selectedParameter === 'particle' ? '3,500 particles/m³' :
                     selectedParameter === 'temp' ? '24°C' :
                     selectedParameter === 'humidity' ? '55% RH' :
                     selectedParameter === 'pressure' ? '8 Pa' : 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-600">Target</p>
                  <p className="text-gray-900">
                    {selectedParameter === 'particle' ? '2,500 particles/m³' :
                     selectedParameter === 'temp' ? '21°C' :
                     selectedParameter === 'humidity' ? '45% RH' :
                     selectedParameter === 'pressure' ? '15 Pa' : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleExportData}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Trend Data
              </button>
              <button
                onClick={handleCreateDeviation}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Deviation Report
              </button>
              <button
                onClick={handleGeneratePDF}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Generate PDF
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deviation Form Modal */}
      {showDeviationForm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50">
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

            <div className="p-6 space-y-4">
              {/* Pre-filled Information */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900 mb-2">Auto-populated from trend analysis:</p>
                <div className="grid grid-cols-2 gap-2 text-blue-700">
                  <p>Room: {room.name}</p>
                  <p>Parameter: {selectedParameter}</p>
                  <p>Max Value: {maxValue.toFixed(1)}</p>
                  <p>Time Range: {timeRange}</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Deviation Title *</label>
                <input
                  type="text"
                  defaultValue={`${selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1)} Excursion - ${room.name}`}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Severity *</label>
                <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                  <option>Critical</option>
                  <option>Major</option>
                  <option>Minor</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description *</label>
                <textarea
                  rows={4}
                  defaultValue={`${selectedParameter} exceeded action limit during production. Maximum recorded value: ${maxValue.toFixed(1)}`}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Root Cause (Preliminary)</label>
                <textarea
                  rows={3}
                  placeholder="Enter preliminary root cause analysis..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Immediate Actions Taken</label>
                <textarea
                  rows={3}
                  placeholder="Describe immediate corrective actions..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Assign To *</label>
                  <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
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
                    defaultValue="2024-12-18"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Attach trend data and charts to deviation</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmitDeviation}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Deviation
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => setShowDeviationForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}