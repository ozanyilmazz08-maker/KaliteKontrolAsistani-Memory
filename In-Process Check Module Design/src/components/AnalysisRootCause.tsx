import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import Dialog from './Dialog';

interface AnalysisRootCauseProps {
  context: any;
}

// Mock combined data showing defects vs process parameters
const trendData = [
  { hour: '08:00', oocRate: 0, speed: 450, temp: 68, energy: 12.3 },
  { hour: '09:00', oocRate: 0, speed: 460, temp: 70, energy: 12.8 },
  { hour: '10:00', oocRate: 0, speed: 470, temp: 72, energy: 13.2 },
  { hour: '11:00', oocRate: 8.3, speed: 485, temp: 75, energy: 14.1 },
  { hour: '12:00', oocRate: 0, speed: 450, temp: 71, energy: 12.5 },
  { hour: '13:00', oocRate: 0, speed: 455, temp: 69, energy: 12.6 },
  { hour: '14:00', oocRate: 0, speed: 448, temp: 68, energy: 12.4 },
];

const correlationData = [
  { name: 'Spindle Speed', oocCorr: 0.82, energyCorr: 0.91 },
  { name: 'Temperature', oocCorr: 0.76, energyCorr: 0.68 },
  { name: 'Feed Rate', oocCorr: 0.45, energyCorr: 0.52 },
  { name: 'Tool Age', oocCorr: 0.38, energyCorr: 0.41 },
  { name: 'Coolant Flow', oocCorr: -0.22, energyCorr: -0.18 },
];

const rootCauseCandidates = [
  {
    id: 1,
    description: 'OOC events correlate strongly (r=0.82) with spindle speed above 480 RPM',
    evidence: 'Temporal alignment between speed increases and OOC occurrences',
    confidence: 'High',
    correlationValue: 0.82,
    status: 'new'
  },
  {
    id: 2,
    description: 'Process temperature elevation during 10:00-12:00 period coincides with quality issues',
    evidence: 'Temperature reached 75°C, 5°C above optimal range',
    confidence: 'High',
    correlationValue: 0.76,
    status: 'new'
  },
  {
    id: 3,
    description: 'Energy consumption spike indicates potential mechanical binding or resistance',
    evidence: 'Energy use increased 14% during OOC period',
    confidence: 'Medium',
    correlationValue: 0.68,
    status: 'new'
  }
];

const suggestedActions = [
  {
    id: 1,
    action: 'Review spindle speed parameter limits for Drilling operation',
    rationale: 'Strong correlation between high speed and OOC events suggests speed limit may need reduction',
    priority: 'High',
    assignedTo: 'Process Engineer',
    status: 'new'
  },
  {
    id: 2,
    action: 'Increase sampling frequency during high-speed periods (>470 RPM)',
    rationale: 'Risk-based approach to catch issues earlier when operating near limits',
    priority: 'High',
    assignedTo: 'Quality Engineer',
    status: 'in-evaluation'
  },
  {
    id: 3,
    action: 'Check maintenance schedule for cooling system',
    rationale: 'Temperature elevation may indicate cooling system degradation',
    priority: 'Medium',
    assignedTo: 'Maintenance',
    status: 'new'
  },
  {
    id: 4,
    action: 'Analyze tool wear patterns for correlation with speed and temperature',
    rationale: 'High speed may be accelerating tool wear, contributing to quality variation',
    priority: 'Medium',
    assignedTo: 'Process Engineer',
    status: 'new'
  }
];

export default function AnalysisRootCause({ context }: AnalysisRootCauseProps) {
  const [dateRange, setDateRange] = useState('today');
  const [selectedShift, setSelectedShift] = useState('all');
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [selectedChar, setSelectedChar] = useState('all');
  const [selectedLine, setSelectedLine] = useState('current');
  const [selectedLot, setSelectedLot] = useState('all');
  const [rootCauses, setRootCauses] = useState(rootCauseCandidates);
  const [actions, setActions] = useState(suggestedActions);

  const handleInvestigate = (id: number) => {
    const rootCause = rootCauses.find(rc => rc.id === id);
    toast.info(`Opening detailed investigation...`, {
      description: rootCause?.description
    });
  };

  const handleDismiss = (id: number) => {
    setRootCauses(prev => prev.filter(rc => rc.id !== id));
    toast.success('Root cause candidate dismissed');
  };

  const handleActionStatus = (id: number, newStatus: string) => {
    setActions(prev => prev.map(action =>
      action.id === id ? { ...action, status: newStatus } : action
    ));
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Filters & Dimensions */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-gray-900 mb-4">Analysis Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Characteristic(s)</label>
                <select
                  value={selectedChar}
                  onChange={(e) => setSelectedChar(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Characteristics</option>
                  <option value="hole-diameter">Hole Diameter</option>
                  <option value="torque">Torque</option>
                  <option value="depth-measurement">Depth Measurement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Line/Station</label>
                <select
                  value={selectedLine}
                  onChange={(e) => setSelectedLine(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="current">Current Station</option>
                  <option value="station-3">Station #3</option>
                  <option value="station-4">Station #4</option>
                  <option value="station-5">Station #5</option>
                  <option value="station-6">Station #6</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Shift</label>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Shifts</option>
                  <option value="a">Shift A (06:00-14:00)</option>
                  <option value="b">Shift B (14:00-22:00)</option>
                  <option value="c">Shift C (22:00-06:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Operator</label>
                <select
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Operators</option>
                  <option value="smith">J. Smith</option>
                  <option value="jones">M. Jones</option>
                  <option value="lee">K. Lee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Lot/Order</label>
                <select
                  value={selectedLot}
                  onChange={(e) => setSelectedLot(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Lots</option>
                  <option value="l-8840">L-8840</option>
                  <option value="l-8841">L-8841</option>
                  <option value="l-8842">L-8842</option>
                  <option value="l-8843">L-8843</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-2">
              <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900 mb-2">AI-Powered Analysis</p>
                <p className="text-xs text-blue-700">
                  Machine learning models analyze correlations between process parameters and quality outcomes to identify potential root causes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Multi-Variable Charts */}
        <div className="col-span-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-gray-900 mb-4">Combined Trend Analysis</h3>
            
            {/* OOC Rate vs Process Parameters */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">OOC Rate & Process Parameters Over Time</p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" label={{ value: 'OOC Rate (%)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Spindle Speed (RPM)', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="oocRate" stroke="#ef4444" strokeWidth={3} name="OOC Rate (%)" />
                  <Line yAxisId="right" type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={2} name="Spindle Speed" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-3">Temperature & Energy Consumption</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Energy (kWh)', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} name="Temperature" />
                  <Line yAxisId="right" type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={2} name="Energy Use" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Correlation Matrix */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Correlation Analysis</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Parameter</th>
                    <th className="text-center py-3 px-4 text-sm text-gray-600">vs OOC Events</th>
                    <th className="text-center py-3 px-4 text-sm text-gray-600">vs Energy Use</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {correlationData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{item.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[120px]">
                            <div 
                              className={`h-full rounded-full ${
                                Math.abs(item.oocCorr) > 0.7 ? 'bg-red-500' :
                                Math.abs(item.oocCorr) > 0.5 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.abs(item.oocCorr) * 100}%` }}
                            />
                          </div>
                          <span className={`text-sm tabular-nums ${
                            Math.abs(item.oocCorr) > 0.7 ? 'text-red-600' :
                            Math.abs(item.oocCorr) > 0.5 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {item.oocCorr > 0 ? '+' : ''}{item.oocCorr.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[120px]">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${Math.abs(item.energyCorr) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-blue-600 tabular-nums">
                            {item.energyCorr > 0 ? '+' : ''}{item.energyCorr.toFixed(2)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <p className="text-red-900">|r| {'>'} 0.7: Strong correlation</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <p className="text-yellow-900">0.5 {'<'} |r| {'<'} 0.7: Moderate</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <p className="text-green-900">|r| {'<'} 0.5: Weak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Suggestions */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="text-gray-900">Root Cause Candidates</h3>
            </div>
            
            <div className="space-y-3">
              {rootCauses.map(candidate => (
                <div key={candidate.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      candidate.confidence === 'High' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {candidate.confidence} Confidence
                    </span>
                    <span className="text-xs text-gray-500">r={candidate.correlationValue}</span>
                  </div>
                  
                  <p className="text-sm text-gray-900 mb-2">{candidate.description}</p>
                  
                  <div className="bg-gray-50 rounded p-2 mb-2">
                    <p className="text-xs text-gray-600">{candidate.evidence}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                      onClick={() => handleInvestigate(candidate.id)}
                    >
                      Investigate
                    </button>
                    <button
                      className="flex-1 px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
                      onClick={() => handleDismiss(candidate.id)}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-gray-900">Suggested Actions</h3>
            </div>
            
            <div className="space-y-3">
              {actions.map(action => (
                <div key={action.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      action.priority === 'High' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {action.priority} Priority
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      action.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      action.status === 'in-evaluation' ? 'bg-yellow-100 text-yellow-700' :
                      action.status === 'implemented' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {action.status === 'new' ? 'New' :
                       action.status === 'in-evaluation' ? 'In Review' :
                       action.status === 'implemented' ? 'Done' : 'Rejected'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-900 mb-2">{action.action}</p>
                  
                  <p className="text-xs text-gray-600 mb-2">{action.rationale}</p>
                  
                  <p className="text-xs text-gray-500">→ {action.assignedTo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}