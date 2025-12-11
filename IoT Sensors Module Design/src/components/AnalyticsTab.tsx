import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine, Cell, BarChart, Bar } from 'recharts';
import { AlertCircle, TrendingUp, Brain, Clock, AlertTriangle, CheckCircle, Wrench, X, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { downloadJSON } from '../utils/exportHelpers';

interface Anomaly {
  id: number;
  sensor: string;
  equipment: string;
  startTime: string;
  endTime: string;
  type: string;
  impact: string;
  status: 'new' | 'in-progress' | 'resolved';
  suggestion: string;
  timestamp: number; // for time filtering
  workOrderId?: string;
  ncCapaId?: string;
  investigationStarted?: boolean;
}

// Predictive maintenance data
const equipmentHealth = [
  { id: 'M-12', name: 'Motor M-12', health: 92, rul: '245 days', risk: 'low' },
  { id: 'M-13', name: 'Motor M-13', health: 88, rul: '180 days', risk: 'low' },
  { id: 'M-14', name: 'Motor M-14', health: 95, rul: '>300 days', risk: 'low' },
  { id: 'M-15', name: 'Motor M-15', health: 68, rul: '45 days', risk: 'high' },
  { id: 'P-1', name: 'Pump P-1', health: 85, rul: '120 days', risk: 'medium' },
  { id: 'P-2', name: 'Pump P-2', health: 91, rul: '220 days', risk: 'low' },
];

export function AnalyticsTab() {
  const [selectedEquipment, setSelectedEquipment] = useState('All Equipment');
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<number | null>(1);
  const [timeRange, setTimeRange] = useState('24h');
  const [enableAnomalyDetection, setEnableAnomalyDetection] = useState(true);
  const [enableQualityCorrelation, setEnableQualityCorrelation] = useState(true);
  const [enablePredictiveModels, setEnablePredictiveModels] = useState(false);
  const [enableDigitalTwin, setEnableDigitalTwin] = useState(false);
  const [showAnomalyDetailsModal, setShowAnomalyDetailsModal] = useState(false);

  // State for anomalies with ability to update status
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: 1,
      sensor: 'V-128',
      equipment: 'Motor M-15',
      startTime: '14:32',
      endTime: 'Ongoing',
      type: 'Elevated vibration',
      impact: 'Potential bearing failure',
      status: 'new',
      suggestion: 'Inspect bearing on Motor M-15 within 48 hours',
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    },
    {
      id: 2,
      sensor: 'T-042',
      equipment: 'Oven #2',
      startTime: '12:15',
      endTime: '12:45',
      type: 'Temperature drift',
      impact: 'Quality degradation observed',
      status: 'in-progress',
      suggestion: 'Check calibration of temperature sensor T-042',
      timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    },
    {
      id: 3,
      sensor: 'P-203',
      equipment: 'Press #1',
      startTime: '09:30',
      endTime: '09:35',
      type: 'Pressure spike',
      impact: 'No quality impact detected',
      status: 'resolved',
      suggestion: 'Monitor for recurrence',
      timestamp: Date.now() - 7 * 60 * 60 * 1000, // 7 hours ago
    },
    {
      id: 4,
      sensor: 'C-091',
      equipment: 'Motor M-12',
      startTime: '08:20',
      endTime: '08:22',
      type: 'Current anomaly',
      impact: 'Energy efficiency concern',
      status: 'resolved',
      suggestion: 'Scheduled maintenance confirmed',
      timestamp: Date.now() - 8 * 60 * 60 * 1000, // 8 hours ago
    },
    {
      id: 5,
      sensor: 'V-130',
      equipment: 'Pump P-1',
      startTime: '07:45',
      endTime: '07:50',
      type: 'Vibration spike',
      impact: 'Minor concern',
      status: 'resolved',
      suggestion: 'Lubrication completed',
      timestamp: Date.now() - 10 * 60 * 60 * 1000, // 10 hours ago
    },
    {
      id: 6,
      sensor: 'T-055',
      equipment: 'Motor M-13',
      startTime: '06:20',
      endTime: '06:25',
      type: 'Temperature variation',
      impact: 'Within tolerance',
      status: 'resolved',
      suggestion: 'Normal operation resumed',
      timestamp: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
    },
    {
      id: 7,
      sensor: 'P-210',
      equipment: 'Pump P-2',
      startTime: '03:15',
      endTime: '03:18',
      type: 'Pressure fluctuation',
      impact: 'No impact',
      status: 'resolved',
      suggestion: 'Self-corrected',
      timestamp: Date.now() - 18 * 60 * 60 * 1000, // 18 hours ago
    },
  ]);

  // Generate dynamic anomaly detection data based on selected equipment
  const anomalyData = useMemo(() => {
    const dataPoints = timeRange === '1h' ? 20 : timeRange === '24h' ? 50 : timeRange === '7d' ? 84 : 120;
    const variance = selectedEquipment.includes('Motor M-15') ? 20 : 10;
    
    return Array.from({ length: dataPoints }, (_, i) => {
      const baseValue = 245 + Math.sin(i / 5) * 10;
      const isAnomaly = selectedEquipment.includes('Motor M-15') 
        ? (i % 12 === 0 || i === 35 || i === 42)
        : (i % 18 === 0);
      return {
        time: i,
        actual: isAnomaly ? baseValue + (Math.random() > 0.5 ? variance : -variance) : baseValue + (Math.random() - 0.5) * 3,
        expected: baseValue,
        isAnomaly,
      };
    });
  }, [selectedEquipment, timeRange]);

  // Generate dynamic quality correlation data
  const correlationData = useMemo(() => {
    const points = timeRange === '1h' ? 15 : timeRange === '24h' ? 30 : 50;
    const hasIssue = selectedEquipment.includes('Motor M-15') || selectedEquipment === 'All Equipment';
    
    return Array.from({ length: points }, (_, i) => ({
      vibration: 0.3 + Math.random() * 0.8,
      defectRate: 1 + Math.random() * 4 + (hasIssue && i > points * 0.6 ? 2 : 0),
    }));
  }, [selectedEquipment, timeRange]);

  // Filter anomalies based on time range and equipment
  const filteredAnomalies = useMemo(() => {
    const now = Date.now();
    const timeLimit = timeRange === '1h' ? 60 * 60 * 1000 :
                      timeRange === '24h' ? 24 * 60 * 60 * 1000 :
                      timeRange === '7d' ? 7 * 24 * 60 * 60 * 1000 :
                      30 * 24 * 60 * 60 * 1000;
    
    return anomalies.filter(anomaly => {
      const withinTimeRange = (now - anomaly.timestamp) <= timeLimit;
      const matchesEquipment = selectedEquipment === 'All Equipment' || 
                               anomaly.equipment === selectedEquipment;
      return withinTimeRange && matchesEquipment;
    });
  }, [anomalies, selectedEquipment, timeRange]);

  const selectedAnomaly = selectedAnomalyId 
    ? anomalies.find(a => a.id === selectedAnomalyId) 
    : null;

  // Calculate active anomalies count
  const activeAnomaliesCount = filteredAnomalies.filter(a => a.status === 'new').length;
  const resolvedAnomaliesCount = filteredAnomalies.filter(a => a.status === 'resolved').length;

  const handleUpdateStatus = (id: number, newStatus: 'new' | 'in-progress' | 'resolved') => {
    setAnomalies(prev => prev.map(anomaly => 
      anomaly.id === id 
        ? { ...anomaly, status: newStatus, endTime: newStatus === 'resolved' ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : anomaly.endTime }
        : anomaly
    ));
    toast.success(`Anomaly #${id} status updated to ${newStatus}`);
  };

  const handleStartInvestigation = (id: number) => {
    setAnomalies(prev => prev.map(anomaly => 
      anomaly.id === id 
        ? { ...anomaly, investigationStarted: true, status: 'in-progress' }
        : anomaly
    ));
    toast.success('Investigation started - Assigned to Maintenance Team');
  };

  const handleCreateWorkOrder = (id: number) => {
    const workOrderId = `WO-2024-${String(Math.floor(1000 + Math.random() * 9000))}`;
    setAnomalies(prev => prev.map(anomaly => 
      anomaly.id === id 
        ? { ...anomaly, workOrderId }
        : anomaly
    ));
    toast.success(`Work order created: ${workOrderId}`);
  };

  const handleLinkToNCCAPA = (id: number) => {
    const ncCapaId = `NC-2024-${String(Math.floor(100 + Math.random() * 900))}`;
    setAnomalies(prev => prev.map(anomaly => 
      anomaly.id === id 
        ? { ...anomaly, ncCapaId }
        : anomaly
    ));
    toast.success(`NC/CAPA record created: ${ncCapaId}`);
  };

  const handleExport = () => {
    toast.info('Exporting analytics report...');
    downloadJSON(filteredAnomalies, `anomalies_report_${timeRange}.json`);
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Left: Selection & Context */}
      <div className="w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-sm text-gray-900 mb-4">Analysis Context</h3>

        <div className="mb-6">
          <label className="text-sm text-gray-700 mb-2 block">Equipment</label>
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="All Equipment">All Equipment</option>
            {equipmentHealth.map(eq => (
              <option key={eq.id} value={eq.name}>{eq.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-700 mb-2 block">Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="1h">Last 1 hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-700 mb-2 block">Analysis Type</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={enableAnomalyDetection}
                onChange={() => setEnableAnomalyDetection(!enableAnomalyDetection)}
              />
              <span className="text-sm text-gray-700">Anomaly detection</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={enableQualityCorrelation}
                onChange={() => setEnableQualityCorrelation(!enableQualityCorrelation)}
              />
              <span className="text-sm text-gray-700">Quality correlation</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={enablePredictiveModels}
                onChange={() => setEnablePredictiveModels(!enablePredictiveModels)}
              />
              <span className="text-sm text-gray-700">Predictive models</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={enableDigitalTwin}
                onChange={() => setEnableDigitalTwin(!enableDigitalTwin)}
              />
              <span className="text-sm text-gray-700">Digital twin sync</span>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-sm text-gray-900 mb-3">ML Model Status</h4>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-900">Anomaly Detector</p>
              </div>
              <p className="text-xs text-gray-600">Accuracy: 94.2%</p>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-900">Quality Predictor</p>
              </div>
              <p className="text-xs text-gray-600">R²: 0.87</p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-blue-900">RUL Estimator</p>
              </div>
              <p className="text-xs text-gray-600">Training...</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 mt-6">
          <h4 className="text-sm text-gray-900 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => toast.success('Model retraining initiated - This may take several minutes')}>
              Retrain Models
            </button>
            <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={handleExport}>
              Export Analysis
            </button>
            <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => toast.info('Scheduling weekly analytics report...')}>
              Schedule Report
            </button>
          </div>
        </div>
      </div>

      {/* Center: Visualizations */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <h2 className="text-lg text-gray-900 mb-6">Analytics & Anomalies</h2>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Active Anomalies</p>
              <p className="text-2xl text-red-600">{activeAnomaliesCount}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Resolved (24h)</p>
              <p className="text-2xl text-green-600">{resolvedAnomaliesCount}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Avg Detection Time</p>
              <p className="text-2xl text-gray-900">2.3 <span className="text-sm">min</span></p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">False Positive Rate</p>
              <p className="text-2xl text-gray-900">5.8%</p>
            </div>
          </div>

          {/* Anomaly Detection Chart */}
          {enableAnomalyDetection && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm text-gray-900">Anomaly Detection - Temperature Sensor T-042</h3>
                  <p className="text-xs text-gray-600">Blue = Expected baseline, Red dots = Detected anomalies</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors" onClick={() => setShowAnomalyDetailsModal(true)}>
                  View Details
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={anomalyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="expected" stroke="#3b82f6" strokeWidth={2} dot={false} name="Expected" />
                  <Line type="monotone" dataKey="actual" stroke="#94a3b8" strokeWidth={1} dot={false} name="Actual" />
                  <Scatter
                    data={anomalyData.filter(d => d.isAnomaly)}
                    dataKey="actual"
                    fill="#ef4444"
                    name="Anomaly"
                  >
                    {anomalyData.filter(d => d.isAnomaly).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#ef4444" />
                    ))}
                  </Scatter>
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Quality Correlation */}
          {enableQualityCorrelation && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm text-gray-900">Quality Correlation Analysis</h3>
                  <p className="text-xs text-gray-600">Vibration vs Defect Rate (Pearson r = 0.78, p &lt; 0.001)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Strong Correlation</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="vibration"
                    name="Vibration"
                    label={{ value: 'Vibration (g)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    dataKey="defectRate"
                    name="Defect Rate"
                    label={{ value: 'Defect Rate (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={correlationData} fill="#3b82f6" />
                  <ReferenceLine
                    segment={[{ x: 0.3, y: 1.5 }, { x: 1.1, y: 4.5 }]}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </ScatterChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-900 mb-2">Insights</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Vibration levels above 0.8g correlate with 3x increase in defect rate</li>
                  <li>• Recommend lowering vibration alert threshold to 0.7g</li>
                  <li>• Maintenance on Motor M-15 could reduce defects by estimated 15%</li>
                </ul>
              </div>
            </div>
          )}

          {/* Predictive Maintenance */}
          {enablePredictiveModels && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm text-gray-900 mb-4">Predictive Maintenance Indicators</h3>
              <div className="space-y-3">
                {equipmentHealth.map(equipment => (
                  <div
                    key={equipment.id}
                    className={`p-4 rounded-lg border-2 ${
                      equipment.risk === 'high' ? 'border-red-200 bg-red-50' :
                      equipment.risk === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Wrench className={`w-5 h-5 ${
                          equipment.risk === 'high' ? 'text-red-600' :
                          equipment.risk === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                        <div>
                          <h4 className="text-sm text-gray-900">{equipment.name}</h4>
                          <p className="text-xs text-gray-600">Health Score: {equipment.health}/100</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{equipment.rul}</p>
                        <p className="text-xs text-gray-600">Est. RUL</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          equipment.risk === 'high' ? 'bg-red-500' :
                          equipment.risk === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${equipment.health}%` }}
                      ></div>
                    </div>
                    {equipment.risk === 'high' && (
                      <p className="text-xs text-red-700 mt-2">⚠ Schedule inspection within 2 weeks</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Digital Twin Sync */}
          {enableDigitalTwin && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm text-gray-900">Digital Twin Synchronization</h3>
                  <p className="text-xs text-gray-600">Real-time sync with virtual factory model</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs">🔄 Live Sync</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-900 mb-2">Synchronization Status</p>
                  <div className="space-y-2 text-xs text-gray-700">
                    <div className="flex justify-between">
                      <span>Equipment Models:</span>
                      <span className="text-green-600">✓ 177 sensors synced</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Process Parameters:</span>
                      <span className="text-green-600">✓ 342 parameters synced</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Sync:</span>
                      <span className="text-gray-900">2 seconds ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prediction Accuracy:</span>
                      <span className="text-gray-900">89.4%</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-900 mb-2">Simulation Insights</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Predicted temperature rise in Zone 3 within next 2 hours</li>
                    <li>• Recommend reducing Motor M-15 load by 12%</li>
                    <li>• Energy optimization: 8.4 kWh potential savings today</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Empty state when all disabled */}
          {!enableAnomalyDetection && !enableQualityCorrelation && !enablePredictiveModels && !enableDigitalTwin && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-sm text-gray-900 mb-2">No Analysis Types Selected</h3>
              <p className="text-xs text-gray-600">Please enable at least one analysis type from the sidebar to view analytics</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Anomaly Events & Actions */}
      <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-sm text-gray-900 mb-4">Anomaly Events & Suggestions</h3>

        <div className="space-y-3">
          {filteredAnomalies.map(anomaly => (
            <div
              key={anomaly.id}
              onClick={() => setSelectedAnomalyId(anomaly.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedAnomalyId === anomaly.id
                  ? 'border-blue-500 bg-blue-50'
                  : anomaly.status === 'new'
                  ? 'border-red-200 bg-red-50 hover:border-red-300'
                  : anomaly.status === 'in-progress'
                  ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-300'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className={`w-4 h-4 ${
                    anomaly.status === 'new' ? 'text-red-600' :
                    anomaly.status === 'in-progress' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`} />
                  <span className={`text-xs px-2 py-1 rounded ${
                    anomaly.status === 'new' ? 'bg-red-100 text-red-700' :
                    anomaly.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {anomaly.status === 'new' ? 'New' :
                     anomaly.status === 'in-progress' ? 'In Progress' : 'Resolved'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{anomaly.startTime}</span>
              </div>

              <h4 className="text-sm text-gray-900 mb-1">{anomaly.type}</h4>
              <p className="text-xs text-gray-700 mb-1">{anomaly.equipment} ({anomaly.sensor})</p>
              <p className="text-xs text-gray-600 mb-2">Impact: {anomaly.impact}</p>

              <div className="p-2 bg-white rounded border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Suggested Action:</p>
                <p className="text-xs text-gray-900">{anomaly.suggestion}</p>
              </div>

              {/* Show linked items */}
              {(anomaly.workOrderId || anomaly.ncCapaId || anomaly.investigationStarted) && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="space-y-1">
                    {anomaly.workOrderId && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">Work Order:</span>
                        <span className="text-blue-600">{anomaly.workOrderId}</span>
                      </div>
                    )}
                    {anomaly.ncCapaId && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">NC/CAPA:</span>
                        <span className="text-blue-600">{anomaly.ncCapaId}</span>
                      </div>
                    )}
                    {anomaly.investigationStarted && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-green-600">✓ Investigation assigned</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedAnomaly && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm text-gray-900 mb-3">Action Management</h4>
            <div className="space-y-2">
              {selectedAnomaly.status === 'new' && (
                <>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm" onClick={() => handleStartInvestigation(selectedAnomaly.id)}>
                    Start Investigation
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm" onClick={() => handleCreateWorkOrder(selectedAnomaly.id)}>
                    Create Work Order
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm" onClick={() => handleLinkToNCCAPA(selectedAnomaly.id)}>
                    Link to NC/CAPA
                  </button>
                </>
              )}
              {selectedAnomaly.status === 'in-progress' && (
                <>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm" onClick={() => handleUpdateStatus(selectedAnomaly.id, 'resolved')}>
                    Mark as Resolved
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm" onClick={() => toast.info('Status update saved')}>
                    Update Status
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm" onClick={() => toast.success('Note added successfully')}>
                    Add Notes
                  </button>
                </>
              )}
              {selectedAnomaly.status === 'resolved' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-900 mb-1">✓ Resolved</p>
                  <p className="text-xs text-gray-600">Duration: {selectedAnomaly.startTime} - {selectedAnomaly.endTime}</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h5 className="text-xs text-gray-600 mb-2">Related Items</h5>
              <div className="space-y-1">
                <button className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors" onClick={() => toast.info('Opening SPC Chart T-042-001...')}>
                  → SPC Chart T-042-001
                </button>
                <button className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors" onClick={() => toast.info('Opening FMEA Item #089...')}>
                  → FMEA Item #089
                </button>
                <button className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors" onClick={() => toast.info('Opening Maintenance Log M-15...')}>
                  → Maintenance Log M-15
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Anomaly Details Modal */}
      {showAnomalyDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAnomalyDetailsModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-lg text-gray-900">Anomaly Detection Analysis - T-042</h2>
                <p className="text-sm text-gray-600 mt-1">Detailed anomaly detection with ML model insights</p>
              </div>
              <button onClick={() => setShowAnomalyDetailsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Detailed Chart */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-gray-900">Full Time Series Analysis</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center gap-1.5"
                      onClick={() => {
                        downloadJSON(anomalyData, 'anomaly_detection_data.json');
                        toast.success('Anomaly data exported');
                      }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Data
                    </button>
                    <button 
                      className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-white transition-colors"
                      onClick={() => toast.info('Applying sensitivity filter...')}
                    >
                      <Filter className="w-3.5 h-3.5 inline mr-1" />
                      Filter
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={anomalyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="time" 
                      label={{ value: 'Time (minutes)', position: 'insideBottom', offset: -5 }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <ReferenceLine y={250} stroke="#10b981" strokeDasharray="5 5" label="UCL" />
                    <ReferenceLine y={240} stroke="#f59e0b" strokeDasharray="5 5" label="LCL" />
                    <Line type="monotone" dataKey="expected" stroke="#3b82f6" strokeWidth={2} dot={false} name="Expected" />
                    <Line type="monotone" dataKey="actual" stroke="#6b7280" strokeWidth={2} dot={false} name="Actual" />
                    <Scatter
                      data={anomalyData.filter(d => d.isAnomaly)}
                      dataKey="actual"
                      fill="#ef4444"
                      name="Anomaly"
                    >
                      {anomalyData.filter(d => d.isAnomaly).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#ef4444" />
                      ))}
                    </Scatter>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Anomaly Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Detected Anomalies</p>
                  <p className="text-2xl text-red-600">{anomalyData.filter(d => d.isAnomaly).length}</p>
                  <p className="text-xs text-gray-600 mt-1">in {timeRange}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Avg Deviation</p>
                  <p className="text-2xl text-blue-600">±{((anomalyData.filter(d => d.isAnomaly).reduce((sum, d) => sum + Math.abs(d.actual - d.expected), 0) / anomalyData.filter(d => d.isAnomaly).length) || 0).toFixed(1)}°C</p>
                  <p className="text-xs text-gray-600 mt-1">from baseline</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Detection Accuracy</p>
                  <p className="text-2xl text-purple-600">94.2%</p>
                  <p className="text-xs text-gray-600 mt-1">ML model confidence</p>
                </div>
              </div>

              {/* Anomaly Event Log */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-sm text-gray-900 mb-4">Anomaly Event Log</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {anomalyData.filter(d => d.isAnomaly).map((anomaly, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Anomaly #{idx + 1}</span>
                        <div>
                          <p className="text-sm text-gray-900">Time: {anomaly.time} min</p>
                          <p className="text-xs text-gray-600">Value: {anomaly.actual.toFixed(2)}°C (Expected: {anomaly.expected.toFixed(2)}°C)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">Δ {Math.abs(anomaly.actual - anomaly.expected).toFixed(2)}°C</p>
                        <p className="text-xs text-gray-600">{anomaly.actual > anomaly.expected ? 'Above' : 'Below'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ML Model Insights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm text-gray-900 mb-3">Model Configuration</h4>
                  <div className="space-y-2 text-xs text-gray-700">
                    <div className="flex justify-between">
                      <span>Algorithm:</span>
                      <span className="text-gray-900">Isolation Forest</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training Data:</span>
                      <span className="text-gray-900">30 days history</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sensitivity:</span>
                      <span className="text-gray-900">Medium (0.05)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span className="text-gray-900">2 hours ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm text-gray-900 mb-3">Performance Metrics</h4>
                  <div className="space-y-2 text-xs text-gray-700">
                    <div className="flex justify-between">
                      <span>Precision:</span>
                      <span className="text-gray-900">96.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recall:</span>
                      <span className="text-gray-900">92.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>F1 Score:</span>
                      <span className="text-gray-900">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>False Positives:</span>
                      <span className="text-gray-900">5.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
              <button 
                onClick={() => setShowAnomalyDetailsModal(false)} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  downloadJSON({
                    sensor: 'T-042',
                    timeRange,
                    data: anomalyData,
                    anomalies: anomalyData.filter(d => d.isAnomaly),
                    stats: {
                      totalAnomalies: anomalyData.filter(d => d.isAnomaly).length,
                      avgDeviation: (anomalyData.filter(d => d.isAnomaly).reduce((sum, d) => sum + Math.abs(d.actual - d.expected), 0) / anomalyData.filter(d => d.isAnomaly).length) || 0,
                      accuracy: 94.2
                    }
                  }, `detailed_anomaly_report_${timeRange}.json`);
                  toast.success('Detailed report exported');
                }} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Full Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}