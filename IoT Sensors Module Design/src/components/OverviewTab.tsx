import { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp, Wifi, Database, Zap, Clock, Leaf } from 'lucide-react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from 'sonner';
import { exportHealthReport } from '../utils/exportHelpers';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  sparklineData?: number[];
  icon?: React.ReactNode;
}

function KPICard({ title, value, unit, trend, sparklineData, icon }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl text-gray-900">{value}</span>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
        </div>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>

      <div className="flex items-center justify-between">
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}

        {sparklineData && sparklineData.length > 0 && (
          <div className="h-8 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData.map((v, i) => ({ value: v, index: i }))}>
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

interface OverviewTabProps {
  context: {
    site: string;
    area: string;
    line: string;
  };
}

export function OverviewTab({ context }: OverviewTabProps) {
  const [selectedSensorType, setSelectedSensorType] = useState<string[]>([]);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string[]>([]);
  const [selectedCriticality, setSelectedCriticality] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);

  const sensorTypes = ['Temperature', 'Vibration', 'Pressure', 'Humidity', 'Current', 'Optical', 'Particle', 'Gas'];
  const equipmentTypes = ['Motor', 'Pump', 'Oven', 'Cleanroom', 'Environment'];
  const criticalityLevels = ['Safety-Critical', 'Quality-Critical', 'Energy-Critical'];

  // Mock data for status distribution
  const statusData = [
    { name: 'Online', value: 142, color: '#10b981' },
    { name: 'Warning', value: 18, color: '#f59e0b' },
    { name: 'Error', value: 5, color: '#ef4444' },
    { name: 'Offline', value: 12, color: '#6b7280' },
  ];

  // Mock data for protocol distribution
  const protocolData = [
    { name: 'OPC UA', value: 78 },
    { name: 'MQTT', value: 62 },
    { name: 'Modbus', value: 28 },
    { name: 'Profinet', value: 9 },
  ];

  // Mock data for site health
  const siteHealthData = [
    { site: 'Line 1', health: 95 },
    { site: 'Line 2', health: 88 },
    { site: 'Line 3', health: 92 },
    { site: 'Line 4', health: 78 },
    { site: 'Line 5', health: 85 },
  ];

  // Mock events
  const recentEvents = [
    { id: 1, type: 'Data Gap', severity: 'high', message: 'Temperature sensor T-042 lost connection', time: '2 min ago', equipment: 'Oven #2' },
    { id: 2, type: 'High Latency', severity: 'medium', message: 'MQTT broker experiencing delays', time: '15 min ago', equipment: 'Network' },
    { id: 3, type: 'Threshold Breach', severity: 'high', message: 'Vibration exceeded limit on Motor M-15', time: '23 min ago', equipment: 'Motor M-15' },
    { id: 4, type: 'Connectivity', severity: 'low', message: 'Gateway G3 reconnected', time: '1 hour ago', equipment: 'Gateway G3' },
  ];

  const toggleFilter = (filterArray: string[], setFilter: (v: string[]) => void, value: string) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter(v => v !== value));
    } else {
      setFilter([...filterArray, value]);
    }
  };

  // Apply filters to data
  const getFilteredData = () => {
    let filtered = [...recentEvents];
    
    if (selectedSensorType.length > 0) {
      // Filter logic would go here in real implementation
    }
    
    if (selectedEquipmentType.length > 0) {
      filtered = filtered.filter(event => 
        selectedEquipmentType.some(type => event.equipment.toLowerCase().includes(type.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const filteredEvents = getFilteredData();

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Left: Filters Panel */}
      <div className="w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-sm text-gray-900 mb-4">Filters</h3>

        {/* Sensor Type */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-2">Sensor Type</p>
          <div className="space-y-2">
            {sensorTypes.map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSensorType.includes(type)}
                  onChange={() => toggleFilter(selectedSensorType, setSelectedSensorType, type)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Equipment Type */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-2">Equipment Type</p>
          <div className="space-y-2">
            {equipmentTypes.map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedEquipmentType.includes(type)}
                  onChange={() => toggleFilter(selectedEquipmentType, setSelectedEquipmentType, type)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Criticality */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-2">Criticality</p>
          <div className="space-y-2">
            {criticalityLevels.map(level => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCriticality.includes(level)}
                  onChange={() => toggleFilter(selectedCriticality, setSelectedCriticality, level)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-2">Time Range</p>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Custom range</option>
          </select>
        </div>
      </div>

      {/* Center: Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPICard
              title="Sensors Online"
              value="142/177"
              unit="80%"
              trend={2.3}
              sparklineData={[75, 78, 76, 79, 80, 82, 80]}
              icon={<Activity className="w-6 h-6" />}
            />
            <KPICard
              title="Streams Healthy"
              value="94"
              unit="%"
              trend={1.2}
              sparklineData={[90, 91, 93, 92, 94, 93, 94]}
              icon={<Database className="w-6 h-6" />}
            />
            <KPICard
              title="Avg Data Latency"
              value="247"
              unit="ms"
              trend={-5.4}
              sparklineData={[280, 270, 260, 250, 245, 248, 247]}
              icon={<Clock className="w-6 h-6" />}
            />
            <KPICard
              title="Energy/CO₂ Sensors"
              value="24/24"
              unit="Active"
              trend={0}
              icon={<Leaf className="w-6 h-6" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPICard
              title="Data Gap Incidents"
              value="8"
              unit="last 24h"
              trend={-12.5}
              icon={<AlertTriangle className="w-6 h-6" />}
            />
            <KPICard
              title="Quality Alerts Active"
              value="3"
              trend={-25}
            />
            <KPICard
              title="Uptime SLA"
              value="99.2"
              unit="%"
              trend={0.3}
            />
            <KPICard
              title="Config Changes (7d)"
              value="12"
              trend={20}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Sensor Status Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm text-gray-900 mb-4">Sensor Status Distribution</h3>
              <div className="flex items-center justify-between">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {statusData.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className="text-sm text-gray-500">({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Protocol Usage */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm text-gray-900 mb-4">Protocol Usage</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={protocolData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Site/Line Health */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-sm text-gray-900 mb-4">IoT Health by Line</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={siteHealthData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="site" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="health" radius={[0, 4, 4, 0]}>
                  {siteHealthData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.health >= 90 ? '#10b981' : entry.health >= 80 ? '#f59e0b' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Events & Alerts Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm text-gray-900 mb-4">Recent Events & Alerts</h3>
            <div className="space-y-3">
              {filteredEvents.map(event => (
                <div key={event.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => { setSelectedEvent(event); setShowEventDetail(true); }}>
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    event.severity === 'high' ? 'bg-red-500' :
                    event.severity === 'medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-900">{event.type}</span>
                      <span className="text-xs text-gray-500">·</span>
                      <span className="text-xs text-gray-500">{event.equipment}</span>
                    </div>
                    <p className="text-sm text-gray-700">{event.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{event.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Top Issues Panel */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-sm text-gray-900 mb-4">Top Issues</h3>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-900 mb-1">5 Sensors Offline</p>
                <p className="text-xs text-gray-600 mb-2">Critical quality sensors in Oven #2 area</p>
                <button className="text-xs text-blue-600 hover:text-blue-700" onClick={() => toast.info('Viewing offline sensors details...')}>View Details →</button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-900 mb-1">High Latency Cluster</p>
                <p className="text-xs text-gray-600 mb-2">18 sensors showing &gt;1s latency</p>
                <button className="text-xs text-blue-600 hover:text-blue-700" onClick={() => toast.info('Investigating latency issues...')}>Investigate →</button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-900 mb-1">Anomaly Detected</p>
                <p className="text-xs text-gray-600 mb-2">Unusual vibration pattern on Motor M-15</p>
                <button className="text-xs text-blue-600 hover:text-blue-700" onClick={() => toast.info('Opening anomaly analysis...')}>Analyze →</button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-900 mb-1">Data Quality Score</p>
                <p className="text-xs text-gray-600 mb-2">Overall: 94/100</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => toast.success('Running connectivity check...')}>
                Run Connectivity Check
              </button>
              <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => {
                exportHealthReport({
                  totalSensors: 177,
                  onlineSensors: 142,
                  offlineSensors: 12,
                  warningSensors: 18,
                  avgDataQuality: 94,
                  activeAlerts: 3
                });
                toast.success('Health report exported successfully!');
              }}>
                Export Health Report
              </button>
              <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => toast.info('Opening maintenance scheduler...')}>
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}