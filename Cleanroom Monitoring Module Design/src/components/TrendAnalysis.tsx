import React, { useState } from 'react';
import { GlobalContext } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { Calendar, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TrendAnalysisProps {
  globalContext: GlobalContext;
}

export default function TrendAnalysis({ globalContext }: TrendAnalysisProps) {
  const [selectedParameters, setSelectedParameters] = useState(['particle_05', 'temp']);
  const [selectedRooms, setSelectedRooms] = useState(['R-201', 'R-301']);
  const [groupBy, setGroupBy] = useState('parameter');
  const [showLimits, setShowLimits] = useState(true);
  const [showEvents, setShowEvents] = useState(true);

  // Mock data for particle counts
  const particleData = [
    { time: '00:00', value: 2100, alert: 3000, action: 3500, event: null },
    { time: '02:00', value: 2250, alert: 3000, action: 3500, event: null },
    { time: '04:00', value: 2400, alert: 3000, action: 3500, event: null },
    { time: '06:00', value: 2650, alert: 3000, action: 3500, event: null },
    { time: '08:00', value: 2900, alert: 3000, action: 3500, event: 'shift_change' },
    { time: '10:00', value: 3100, alert: 3000, action: 3500, event: null },
    { time: '12:00', value: 3250, alert: 3000, action: 3500, event: null },
    { time: '14:00', value: 3450, alert: 3000, action: 3500, event: null },
    { time: '16:00', value: 3520, alert: 3000, action: 3500, event: 'excursion' },
    { time: '18:00', value: 3480, alert: 3000, action: 3500, event: null },
    { time: '20:00', value: 3100, alert: 3000, action: 3500, event: null },
    { time: '22:00', value: 2800, alert: 3000, action: 3500, event: null },
  ];

  const temperatureData = [
    { time: '00:00', value: 20.8, lower: 20, upper: 22 },
    { time: '02:00', value: 20.9, lower: 20, upper: 22 },
    { time: '04:00', value: 21.0, lower: 20, upper: 22 },
    { time: '06:00', value: 21.1, lower: 20, upper: 22 },
    { time: '08:00', value: 21.2, lower: 20, upper: 22 },
    { time: '10:00', value: 21.3, lower: 20, upper: 22 },
    { time: '12:00', value: 21.4, lower: 20, upper: 22 },
    { time: '14:00', value: 21.3, lower: 20, upper: 22 },
    { time: '16:00', value: 21.2, lower: 20, upper: 22 },
    { time: '18:00', value: 21.1, lower: 20, upper: 22 },
    { time: '20:00', value: 21.0, lower: 20, upper: 22 },
    { time: '22:00', value: 20.9, lower: 20, upper: 22 },
  ];

  const pressureData = [
    { time: '00:00', value: 15, alert: 10, target: 15 },
    { time: '02:00', value: 14.8, alert: 10, target: 15 },
    { time: '04:00', value: 14.5, alert: 10, target: 15 },
    { time: '06:00', value: 14.2, alert: 10, target: 15 },
    { time: '08:00', value: 13.8, alert: 10, target: 15 },
    { time: '10:00', value: 13.5, alert: 10, target: 15 },
    { time: '12:00', value: 12.8, alert: 10, target: 15 },
    { time: '14:00', value: 12.2, alert: 10, target: 15 },
    { time: '16:00', value: 11.5, alert: 10, target: 15 },
    { time: '18:00', value: 10.8, alert: 10, target: 15 },
    { time: '20:00', value: 12.5, alert: 10, target: 15 },
    { time: '22:00', value: 14.0, alert: 10, target: 15 },
  ];

  const parameters = [
    { id: 'particle_05', label: 'Particles ≥0.5µm' },
    { id: 'particle_5', label: 'Particles ≥5.0µm' },
    { id: 'micro', label: 'Microbial CFU' },
    { id: 'temp', label: 'Temperature' },
    { id: 'humidity', label: 'Humidity' },
    { id: 'pressure', label: 'Differential Pressure' },
    { id: 'airflow', label: 'Airflow Velocity' }
  ];

  const rooms = [
    { id: 'R-201', label: 'Room 201 - Filling' },
    { id: 'R-301', label: 'Room 301 - Aseptic Core' },
    { id: 'R-105', label: 'Room 105 - Weighing' },
    { id: 'R-204', label: 'Room 204 - Compounding' }
  ];

  const toggleParameter = (paramId: string) => {
    if (selectedParameters.includes(paramId)) {
      setSelectedParameters(selectedParameters.filter(p => p !== paramId));
    } else {
      setSelectedParameters([...selectedParameters, paramId]);
    }
  };

  const toggleRoom = (roomId: string) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter(r => r !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const exportData = () => {
    // Gather all selected data
    const exportRows: string[] = [];
    
    // Add header
    exportRows.push('Time,Parameter,Room,Value,Unit,Alert_Limit,Action_Limit');
    
    // Add particle data if selected
    if (selectedParameters.includes('particle_05')) {
      particleData.forEach(point => {
        selectedRooms.forEach(room => {
          exportRows.push(`${point.time},Particle_0.5um,${room},${point.value},particles/m³,${point.alert},${point.action}`);
        });
      });
    }
    
    // Add temperature data if selected
    if (selectedParameters.includes('temp')) {
      temperatureData.forEach(point => {
        selectedRooms.forEach(room => {
          exportRows.push(`${point.time},Temperature,${room},${point.value},°C,${point.lower},${point.upper}`);
        });
      });
    }
    
    // Add pressure data if selected
    if (selectedParameters.includes('pressure')) {
      pressureData.forEach(point => {
        selectedRooms.forEach(room => {
          exportRows.push(`${point.time},Differential_Pressure,${room},${point.value},Pa,${point.alert},${point.target}`);
        });
      });
    }
    
    // Create CSV content
    const csvContent = exportRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EM_Trend_Export_${new Date().toISOString().split('T')[0]}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Trend data exported to CSV successfully', {
      description: `${exportRows.length - 1} data points exported for ${selectedParameters.length} parameters across ${selectedRooms.length} rooms`
    });
  };

  const calculateStats = (data: any[], key: string) => {
    const values = data.map(d => d[key]);
    return {
      mean: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2)
    };
  };

  return (
    <div className="flex gap-6">
      {/* Left Sidebar - Selection */}
      <div className="w-64 flex-shrink-0 space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-3">Parameters</h3>
          <div className="space-y-2">
            {parameters.map(param => (
              <label key={param.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedParameters.includes(param.id)}
                  onChange={() => toggleParameter(param.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{param.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-3">Rooms / Zones</h3>
          <div className="space-y-2">
            {rooms.map(room => (
              <label key={room.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedRooms.includes(room.id)}
                  onChange={() => toggleRoom(room.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{room.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-3">Group By</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="groupBy"
                value="parameter"
                checked={groupBy === 'parameter'}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">By Parameter</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="groupBy"
                value="room"
                checked={groupBy === 'room'}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">By Room</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-3">Display Options</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLimits}
                onChange={(e) => setShowLimits(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">Show Alert/Action Limits</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showEvents}
                onChange={(e) => setShowEvents(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">Show Events</span>
            </label>
          </div>
        </div>

        <button
          onClick={exportData}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export Data
        </button>
      </div>

      {/* Center - Charts */}
      <div className="flex-1 space-y-6">
        {/* Particle Count Chart */}
        {selectedParameters.includes('particle_05') && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-gray-900">Particle Count ≥0.5µm - Room 201</h3>
              <p className="text-gray-600 mt-1">
                ISO 14644-1 Class 7 (Grade B) · Last 24 hours
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={particleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Particles/m³', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                
                {showLimits && (
                  <>
                    <ReferenceLine y={3000} stroke="#f59e0b" strokeDasharray="5 5" label="Alert" />
                    <ReferenceLine y={3500} stroke="#ef4444" strokeDasharray="5 5" label="Action" />
                  </>
                )}
                
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Particle Count"
                />
              </LineChart>
            </ResponsiveContainer>

            {showEvents && (
              <div className="mt-4 flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded">
                  <Calendar className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-900">08:00 - Shift Change</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-900">16:00 - Excursion Detected</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Temperature Chart */}
        {selectedParameters.includes('temp') && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-gray-900">Temperature - Room 201</h3>
              <p className="text-gray-600 mt-1">
                Target: 20-22°C · Last 24 hours
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  domain={[19, 23]}
                  label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                
                {showLimits && (
                  <>
                    <ReferenceLine y={20} stroke="#10b981" strokeDasharray="3 3" label="Lower" />
                    <ReferenceLine y={22} stroke="#10b981" strokeDasharray="3 3" label="Upper" />
                  </>
                )}
                
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  fill="#10b98120"
                  strokeWidth={2}
                  name="Temperature"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pressure Chart */}
        {selectedParameters.includes('pressure') && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-gray-900">Differential Pressure - Room 105</h3>
              <p className="text-gray-600 mt-1">
                Target: 15 Pa (Alert: 10 Pa) · Last 24 hours
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pressureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  domain={[0, 20]}
                  label={{ value: 'Pa', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                
                {showLimits && (
                  <>
                    <ReferenceLine y={10} stroke="#f59e0b" strokeDasharray="5 5" label="Alert" />
                    <ReferenceLine y={15} stroke="#10b981" strokeDasharray="3 3" label="Target" />
                  </>
                )}
                
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  name="Diff. Pressure"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Right - Analysis Tools */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">Statistical Analysis</h3>
          </div>

          {selectedParameters.includes('particle_05') && (
            <div className="pb-4 border-b border-gray-200">
              <h4 className="text-gray-900 mb-2">Particle Count ≥0.5µm</h4>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Mean:</span>
                  <span className="text-gray-900">{calculateStats(particleData, 'value').mean} p/m³</span>
                </div>
                <div className="flex justify-between">
                  <span>Min:</span>
                  <span className="text-gray-900">{calculateStats(particleData, 'value').min} p/m³</span>
                </div>
                <div className="flex justify-between">
                  <span>Max:</span>
                  <span className="text-red-600">{calculateStats(particleData, 'value').max} p/m³</span>
                </div>
                <div className="flex justify-between">
                  <span>Excursions:</span>
                  <span className="text-red-600">1 event</span>
                </div>
              </div>
            </div>
          )}

          {selectedParameters.includes('temp') && (
            <div className="pb-4 border-b border-gray-200">
              <h4 className="text-gray-900 mb-2">Temperature</h4>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Mean:</span>
                  <span className="text-gray-900">{calculateStats(temperatureData, 'value').mean}°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Min:</span>
                  <span className="text-gray-900">{calculateStats(temperatureData, 'value').min}°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Max:</span>
                  <span className="text-gray-900">{calculateStats(temperatureData, 'value').max}°C</span>
                </div>
                <div className="flex justify-between">
                  <span>In Range:</span>
                  <span className="text-green-600">100%</span>
                </div>
              </div>
            </div>
          )}

          {selectedParameters.includes('pressure') && (
            <div className="pb-4 border-b border-gray-200">
              <h4 className="text-gray-900 mb-2">Differential Pressure</h4>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Mean:</span>
                  <span className="text-gray-900">{calculateStats(pressureData, 'value').mean} Pa</span>
                </div>
                <div className="flex justify-between">
                  <span>Min:</span>
                  <span className="text-yellow-600">{calculateStats(pressureData, 'value').min} Pa</span>
                </div>
                <div className="flex justify-between">
                  <span>Max:</span>
                  <span className="text-gray-900">{calculateStats(pressureData, 'value').max} Pa</span>
                </div>
                <div className="flex justify-between">
                  <span>Alert Level:</span>
                  <span className="text-yellow-600">2 readings</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <h4 className="text-gray-900">Trend Detection</h4>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-900">Increasing trend detected</p>
                <p className="text-yellow-700 mt-1">
                  Particle counts showing upward trend over last 12h
                </p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-900">Correlation detected</p>
                <p className="text-blue-700 mt-1">
                  Pressure decrease coincides with particle increase
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 mb-3">Risk-Based Sampling</h4>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-purple-900">Recommendation</p>
              <p className="text-purple-700 mt-1">
                Increase sampling frequency in Room 201 due to borderline values
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}