import { X, Save, TrendingUp, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useState } from 'react';

interface Sensor {
  id: string;
  name: string;
  type: string;
  variable: string;
  location: string;
  protocol: string;
  samplingMode: string;
  status: 'online' | 'offline' | 'warning';
  dataQuality: number;
  qualityLink: string;
  lastReading: string;
  lastTimestamp: string;
}

interface LiveDataModalProps {
  sensor: Sensor;
  onClose: () => void;
}

export function LiveDataModal({ sensor, onClose }: LiveDataModalProps) {
  // Mock real-time data
  const mockLiveData = Array.from({ length: 30 }, (_, i) => ({
    time: `${29 - i}s`,
    value: sensor.type === 'Temperature' 
      ? 245 + Math.random() * 2
      : sensor.type === 'Vibration'
      ? 0.7 + Math.random() * 0.1
      : 185 + Math.random() * 3
  })).reverse();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg text-gray-900">{sensor.name} - Live Data</h2>
            <p className="text-sm text-gray-600">{sensor.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Current Value */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Reading</p>
                <p className="text-3xl text-gray-900">{sensor.lastReading}</p>
                <p className="text-xs text-gray-500 mt-1">Updated {sensor.lastTimestamp}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-700" />
                <span className="text-sm text-green-700">Normal</span>
              </div>
            </div>
          </div>

          {/* Real-time Chart */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-900 mb-4">Live Streaming Data (Last 30 seconds)</h3>
            <div className="h-64 bg-white rounded-lg border border-gray-200 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockLiveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Min (30s)</p>
              <p className="text-lg text-gray-900">
                {Math.min(...mockLiveData.map(d => d.value)).toFixed(2)} {sensor.variable}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Max (30s)</p>
              <p className="text-lg text-gray-900">
                {Math.max(...mockLiveData.map(d => d.value)).toFixed(2)} {sensor.variable}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Avg (30s)</p>
              <p className="text-lg text-gray-900">
                {(mockLiveData.reduce((sum, d) => sum + d.value, 0) / mockLiveData.length).toFixed(2)} {sensor.variable}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Sample Rate</p>
              <p className="text-lg text-gray-900">{sensor.samplingMode}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Close
          </button>
          <button onClick={() => toast.success('Dashboard pinned!')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Pin to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

interface ConfigModalProps {
  sensor: Sensor;
  onClose: () => void;
}

export function ConfigModal({ sensor, onClose }: ConfigModalProps) {
  const handleSave = () => {
    toast.success('Configuration saved successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg text-gray-900">Edit Sensor Configuration</h2>
            <p className="text-sm text-gray-600">{sensor.id} - {sensor.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-sm text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Sensor ID</label>
                  <input type="text" defaultValue={sensor.id} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" disabled />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Display Name</label>
                  <input type="text" defaultValue={sensor.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Sensor Type</label>
                  <select defaultValue={sensor.type} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Temperature</option>
                    <option>Vibration</option>
                    <option>Pressure</option>
                    <option>Humidity</option>
                    <option>Current</option>
                    <option>Optical</option>
                    <option>Particle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Unit</label>
                  <input type="text" defaultValue={sensor.variable} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* Protocol Settings */}
            <div>
              <h3 className="text-sm text-gray-900 mb-4">Protocol & Connectivity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Protocol</label>
                  <select defaultValue={sensor.protocol.split(' ')[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>OPC UA</option>
                    <option>MQTT</option>
                    <option>Modbus</option>
                    <option>Profinet</option>
                    <option>EtherNet/IP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Gateway</label>
                  <select defaultValue="Gateway-04" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Gateway-01</option>
                    <option>Gateway-02</option>
                    <option>Gateway-03</option>
                    <option>Gateway-04</option>
                    <option>Gateway-05</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-2">Address/Topic/Node ID</label>
                  <input 
                    type="text" 
                    defaultValue={sensor.protocol.split('(')[1]?.replace(')', '') || ''} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="e.g., ns=2;s=Sensor.Value or sensors/topic/path"
                  />
                </div>
              </div>
            </div>

            {/* Sampling Configuration */}
            <div>
              <h3 className="text-sm text-gray-900 mb-4">Sampling Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Sampling Mode</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Fixed Rate</option>
                    <option>Event-Based</option>
                    <option>On-Change</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Sample Rate (Hz)</label>
                  <input type="number" defaultValue="1" step="0.1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Aggregation Method</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>None (Raw)</option>
                    <option>Mean</option>
                    <option>Min</option>
                    <option>Max</option>
                    <option>Last Value</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Aggregation Window (seconds)</label>
                  <input type="number" defaultValue="10" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* Thresholds & Alerts */}
            <div>
              <h3 className="text-sm text-gray-900 mb-4">Thresholds & Alerts</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Low Warning</label>
                  <input type="number" step="0.1" placeholder="Optional" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">High Warning</label>
                  <input type="number" step="0.1" placeholder="Optional" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Low Critical</label>
                  <input type="number" step="0.1" placeholder="Optional" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">High Critical</label>
                  <input type="number" step="0.1" placeholder="Optional" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => toast.success('Configuration test passed!')} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Test Connection
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

interface ViewHistoryModalProps {
  sensor: Sensor;
  onClose: () => void;
}

export function ViewHistoryModal({ sensor, onClose }: ViewHistoryModalProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Generate mock historical data
  const historyData = Array.from({ length: 50 }, (_, i) => ({
    time: new Date(Date.now() - (50 - i) * 3600000).toLocaleTimeString(),
    value: 245 + (Math.random() - 0.5) * 10
  }));

  const eventLog = [
    { time: '2024-12-10 14:32', event: 'Configuration updated', user: 'admin@company.com' },
    { time: '2024-12-10 12:15', event: 'Threshold warning triggered', user: 'System' },
    { time: '2024-12-09 18:45', event: 'Calibration performed', user: 'tech@company.com' },
    { time: '2024-12-09 09:30', event: 'Sensor restarted', user: 'ops@company.com' },
  ];

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    toast.info(`Viewing ${range} data`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg text-gray-900">Sensor History</h2>
            <p className="text-sm text-gray-600">{sensor.id} - {sensor.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Time Range Selector */}
          <div className="flex items-center gap-4 mb-6">
            <Clock className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <button 
                className={`px-3 py-1 rounded text-sm transition-colors ${selectedTimeRange === '24h' ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                onClick={() => handleTimeRangeChange('24h')}
              >
                24h
              </button>
              <button 
                className={`px-3 py-1 rounded text-sm transition-colors ${selectedTimeRange === '7d' ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                onClick={() => handleTimeRangeChange('7d')}
              >
                7d
              </button>
              <button 
                className={`px-3 py-1 rounded text-sm transition-colors ${selectedTimeRange === '30d' ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                onClick={() => handleTimeRangeChange('30d')}
              >
                30d
              </button>
              <button 
                className={`px-3 py-1 rounded text-sm transition-colors ${selectedTimeRange === 'custom' ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                onClick={() => {
                  setSelectedTimeRange('custom');
                  toast.info('Opening custom date picker...');
                }}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Historical Chart */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-900 mb-4">Historical Trend (Last 24 hours)</h3>
            <div className="h-72 bg-white rounded-lg border border-gray-200 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Min (24h)</p>
              <p className="text-lg text-gray-900">
                {Math.min(...historyData.map(d => d.value)).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Max (24h)</p>
              <p className="text-lg text-gray-900">
                {Math.max(...historyData.map(d => d.value)).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Avg (24h)</p>
              <p className="text-lg text-gray-900">
                {(historyData.reduce((sum, d) => sum + d.value, 0) / historyData.length).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Std Dev</p>
              <p className="text-lg text-gray-900">0.42</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-1">Data Points</p>
              <p className="text-lg text-gray-900">86,400</p>
            </div>
          </div>

          {/* Event Timeline */}
          <div className="mb-4">
            <h3 className="text-sm text-gray-900 mb-4">Event Timeline</h3>
            <div className="space-y-3">
              {eventLog.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    event.type === 'warning' ? 'bg-yellow-500' :
                    event.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{event.event}</p>
                    <p className="text-xs text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Close
          </button>
          <button onClick={() => toast.success('Exporting historical data...')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Historical Data
          </button>
        </div>
      </div>
    </div>
  );
}