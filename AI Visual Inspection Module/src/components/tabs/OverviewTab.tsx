import { KPICard } from '../shared/KPICard';
import { FilterPanel } from '../shared/FilterPanel';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, Camera, Cpu } from 'lucide-react';
import { useState } from 'react';

const performanceData = [
  { time: '00:00', defectRate: 2.1, fpRate: 1.2, overrideRate: 0.8 },
  { time: '04:00', defectRate: 2.3, fpRate: 1.4, overrideRate: 0.9 },
  { time: '08:00', defectRate: 2.8, fpRate: 1.8, overrideRate: 1.2 },
  { time: '12:00', defectRate: 2.5, fpRate: 1.5, overrideRate: 1.0 },
  { time: '16:00', defectRate: 2.2, fpRate: 1.3, overrideRate: 0.7 },
  { time: '20:00', defectRate: 2.4, fpRate: 1.6, overrideRate: 0.9 },
];

const throughputData = [
  { time: '00:00', throughput: 850, inspectionTime: 45 },
  { time: '04:00', throughput: 820, inspectionTime: 48 },
  { time: '08:00', throughput: 890, inspectionTime: 42 },
  { time: '12:00', throughput: 875, inspectionTime: 44 },
  { time: '16:00', throughput: 900, inspectionTime: 41 },
  { time: '20:00', throughput: 865, inspectionTime: 46 },
];

export function OverviewTab() {
  const [filters, setFilters] = useState({
    timeRange: '24h',
    product: 'all',
    defectTypes: ['all'],
  });

  const handleKPIClick = (kpi: string) => {
    console.log(`KPI clicked: ${kpi}`);
    // Navigate to detailed view
  };

  const handleAlertClick = (alertId: number) => {
    console.log(`Alert clicked: ${alertId}`);
    // Open alert details
  };

  return (
    <div className="flex gap-6">
      {/* Filters Panel */}
      <FilterPanel onFilterChange={setFilters} />

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4">
          <KPICard
            title="Throughput"
            value={875}
            unit="units/hr"
            trend={3.2}
            sparklineData={[820, 850, 890, 875, 900, 865]}
            onClick={() => handleKPIClick('throughput')}
          />
          <KPICard
            title="Defect Rate"
            value="2.4"
            unit="%"
            trend={-0.3}
            sparklineData={[2.1, 2.3, 2.8, 2.5, 2.2, 2.4]}
            status="good"
            onClick={() => handleKPIClick('defect-rate')}
          />
          <KPICard
            title="False Positive Rate"
            value="1.5"
            unit="%"
            trend={0.2}
            sparklineData={[1.2, 1.4, 1.8, 1.5, 1.3, 1.6]}
            status="warning"
            onClick={() => handleKPIClick('fp-rate')}
          />
          <KPICard
            title="False Negative Risk"
            value="Low"
            status="good"
            onClick={() => handleKPIClick('fn-risk')}
          />
          <KPICard
            title="Avg Inspection Time"
            value={44}
            unit="ms"
            trend={-2.1}
            sparklineData={[45, 48, 42, 44, 41, 46]}
            onClick={() => handleKPIClick('inspection-time')}
          />
          <KPICard
            title="Model Health Score"
            value={94}
            unit="/100"
            status="good"
            onClick={() => handleKPIClick('model-health')}
          />
        </div>

        {/* Live Status Panel */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-4">Live Status</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Line Status</div>
                <div className="text-green-600">Running</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Active Cameras</div>
                <div className="text-gray-900">4 / 4</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Active Model</div>
                <div className="text-gray-900">CNN-v2.3.1</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Current Product</div>
              <div className="text-gray-900">PCB-001 Main Board</div>
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Defect and False Positive Rate Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="defectRate" stroke="#ef4444" name="Defect Rate" strokeWidth={2} />
              <Line type="monotone" dataKey="fpRate" stroke="#f59e0b" name="False Positive Rate" strokeWidth={2} />
              <Line type="monotone" dataKey="overrideRate" stroke="#6366f1" name="Override Rate" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Throughput and Inspection Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={throughputData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" label={{ value: 'Units/hr', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Time (ms)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="throughput" stroke="#10b981" name="Throughput" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="inspectionTime" stroke="#3b82f6" name="Inspection Time" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Recent Alerts</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">2 Critical</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">5 Warning</span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { time: '2 min ago', type: 'Model', severity: 'warning', msg: 'False positive rate trending up', id: 1 },
              { time: '15 min ago', type: 'Equipment', severity: 'critical', msg: 'Camera 3 focus degradation detected', id: 2 },
              { time: '1 hr ago', type: 'Model', severity: 'warning', msg: 'Input distribution drift detected', id: 3 },
              { time: '2 hr ago', type: 'Integration', severity: 'warning', msg: 'MES response time elevated', id: 4 },
            ].map((alert) => (
              <div key={alert.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className={`w-5 h-5 ${alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{alert.msg}</span>
                    <span className="text-xs text-gray-500">· {alert.type}</span>
                  </div>
                  <div className="text-xs text-gray-500">{alert.time}</div>
                </div>
                <button 
                  onClick={() => handleAlertClick(alert.id)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}