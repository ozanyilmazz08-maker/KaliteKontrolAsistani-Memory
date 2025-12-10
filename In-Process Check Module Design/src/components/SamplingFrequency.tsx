import { useState } from 'react';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import Dialog from './Dialog';

interface SamplingFrequencyProps {
  context: any;
}

const samplingRules = [
  {
    id: 1,
    characteristic: 'Hole Diameter',
    station: 'Station #5',
    rule: 'Time-based',
    frequency: 'Every 30 minutes',
    active: true,
    controlPlan: 'CP-2024-A-001',
    criticality: 'High',
    fmeaRPN: 240
  },
  {
    id: 2,
    characteristic: 'Torque',
    station: 'Station #5',
    rule: 'Count-based',
    frequency: 'Every 50 parts',
    active: true,
    controlPlan: 'CP-2024-A-001',
    criticality: 'Medium',
    fmeaRPN: 120
  },
  {
    id: 3,
    characteristic: 'Visual: Surface Scratch',
    station: 'Station #5',
    rule: 'Per piece',
    frequency: 'Every part',
    active: true,
    controlPlan: 'CP-2024-A-001',
    criticality: 'High',
    fmeaRPN: 280
  },
  {
    id: 4,
    characteristic: 'Depth Measurement',
    station: 'Station #5',
    rule: 'Lot-based',
    frequency: 'Per lot (first, middle, last)',
    active: true,
    controlPlan: 'CP-2024-A-001',
    criticality: 'Low',
    fmeaRPN: 80
  }
];

const complianceData = [
  { time: '08:00', planned: true, actual: true, status: 'on-time', char: 'Hole Diameter' },
  { time: '08:30', planned: true, actual: true, status: 'on-time', char: 'Hole Diameter' },
  { time: '09:00', planned: true, actual: true, status: 'on-time', char: 'Hole Diameter' },
  { time: '09:30', planned: true, actual: true, status: 'late', delay: 5, char: 'Hole Diameter' },
  { time: '10:00', planned: true, actual: false, status: 'missed', char: 'Hole Diameter' },
  { time: '10:30', planned: true, actual: true, status: 'on-time', char: 'Hole Diameter' },
  { time: '11:00', planned: true, actual: true, status: 'on-time', char: 'Hole Diameter' },
  { time: '11:30', planned: true, actual: true, status: 'on-time', char: 'Hole Diameter' },
  { time: '12:00', planned: true, actual: true, status: 'late', delay: 8, char: 'Hole Diameter' },
  { time: '12:30', planned: true, actual: true, status: 'on-time', char: 'Hole Diameter' },
  { time: '13:00', planned: true, actual: true, status: 'on-time', char: 'Hole Diameter' },
  { time: '13:30', planned: true, actual: true, status: 'on-time', char: 'Hole Diameter' },
];

export default function SamplingFrequency({ context }: SamplingFrequencyProps) {
  const [selectedRule, setSelectedRule] = useState(samplingRules[0]);
  const [filterRule, setFilterRule] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showControlPlan, setShowControlPlan] = useState(false);

  const onTimeCount = complianceData.filter(d => d.status === 'on-time').length;
  const lateCount = complianceData.filter(d => d.status === 'late').length;
  const missedCount = complianceData.filter(d => d.status === 'missed').length;
  const complianceRate = ((onTimeCount + lateCount) / complianceData.length * 100).toFixed(1);

  const handleAddRule = () => {
    toast.info('Opening form to add new sampling rule...');
    setShowAddModal(true);
  };

  const handleViewControlPlan = () => {
    toast.success('Loading control plan ' + selectedRule.controlPlan);
    setShowControlPlan(true);
  };

  const filteredRules = filterRule === 'all'
    ? samplingRules
    : samplingRules.filter(rule => {
        if (filterRule === 'time') return rule.rule === 'Time-based';
        if (filterRule === 'count') return rule.rule === 'Count-based';
        if (filterRule === 'lot') return rule.rule === 'Lot-based';
        if (filterRule === 'piece') return rule.rule === 'Per piece';
        return true;
      });

  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Sampling Strategy List */}
        <div className="col-span-4">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-gray-900">Sampling Strategies</h3>
              <button 
                onClick={handleAddRule}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Add Rule
              </button>
            </div>

            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <select
                  value={filterRule}
                  onChange={(e) => setFilterRule(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Rule Types</option>
                  <option value="time">Time-based</option>
                  <option value="count">Count-based</option>
                  <option value="lot">Lot-based</option>
                  <option value="piece">Per Piece</option>
                </select>
              </div>

              <div className="space-y-2">
                {filteredRules.map(rule => (
                  <button
                    key={rule.id}
                    onClick={() => setSelectedRule(rule)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedRule.id === rule.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-gray-900">{rule.characteristic}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{rule.station}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        rule.criticality === 'High' ? 'bg-red-100 text-red-700' :
                        rule.criticality === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {rule.criticality}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{rule.frequency}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-500">{rule.controlPlan}</span>
                      <span className={`px-2 py-0.5 rounded ${
                        rule.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rule.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Compliance Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
            <h3 className="text-gray-900 mb-4">Today's Compliance</h3>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl text-green-600">{onTimeCount}</p>
                <p className="text-xs text-gray-600 mt-1">On Time</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl text-yellow-600">{lateCount}</p>
                <p className="text-xs text-gray-600 mt-1">Late</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl text-red-600">{missedCount}</p>
                <p className="text-xs text-gray-600 mt-1">Missed</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Compliance Rate</span>
                <span className="text-2xl text-green-600">{complianceRate}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${complianceRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Plan vs Actual Visualization */}
        <div className="col-span-5">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Plan vs Actual - {selectedRule.characteristic}</h3>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600">On-time check</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-gray-600">Late check (within tolerance)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-gray-600">Missed check</span>
              </div>
            </div>

            {/* Timeline visualization */}
            <div className="space-y-3">
              {complianceData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-600">{item.time}</div>
                  <div className="flex-1 flex items-center gap-2">
                    {/* Planned marker */}
                    <div className="w-3 h-3 border-2 border-blue-400 rounded-full bg-white"></div>
                    
                    {/* Connection line */}
                    <div className={`flex-1 h-0.5 ${
                      item.status === 'on-time' ? 'bg-green-400' :
                      item.status === 'late' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}></div>
                    
                    {/* Actual marker */}
                    {item.actual ? (
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'on-time' ? 'bg-green-500' :
                        item.status === 'late' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                    ) : (
                      <div className="w-3 h-3 border-2 border-red-500 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div className="w-32 text-sm">
                    {item.status === 'on-time' && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" /> On time
                      </span>
                    )}
                    {item.status === 'late' && (
                      <span className="flex items-center gap-1 text-yellow-600">
                        <AlertCircle className="w-4 h-4" /> +{item.delay} min
                      </span>
                    )}
                    {item.status === 'missed' && (
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle className="w-4 h-4" /> Missed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <h4 className="text-yellow-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Compliance Issues Detected
            </h4>
            <div className="text-sm text-yellow-800 space-y-2">
              <p>• 1 missed check at 10:00 (Hole Diameter)</p>
              <p>• 2 late checks with delays {'>'} 5 minutes</p>
              <p>• Consider reviewing operator workload during 09:30-10:30 period</p>
            </div>
          </div>
        </div>

        {/* Right: Control Plan & Risk Context */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-gray-900 mb-4">Control Plan Context</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Control Plan ID</p>
                <p className="text-gray-900">{selectedRule.controlPlan}</p>
                <button className="text-sm text-blue-600 hover:underline mt-1" onClick={handleViewControlPlan}>
                  View full control plan →
                </button>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Characteristic</p>
                <p className="text-gray-900">{selectedRule.characteristic}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Station/Operation</p>
                <p className="text-gray-900">{selectedRule.station}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Sampling Rule</p>
                <p className="text-gray-900">{selectedRule.rule}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Frequency</p>
                <p className="text-gray-900">{selectedRule.frequency}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Risk Assessment</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Criticality</p>
                    <span className={`inline-block px-2 py-1 text-sm rounded mt-1 ${
                      selectedRule.criticality === 'High' ? 'bg-red-100 text-red-700' :
                      selectedRule.criticality === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedRule.criticality}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">FMEA RPN</p>
                    <p className="text-gray-900 mt-1">{selectedRule.fmeaRPN}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Risk-Based Rationale</p>
                <p className="text-sm text-gray-600">
                  {selectedRule.criticality === 'High' 
                    ? 'High frequency sampling required due to safety-critical nature and elevated FMEA RPN. Failure could result in functional defect or safety risk.'
                    : selectedRule.criticality === 'Medium'
                    ? 'Moderate sampling frequency appropriate for medium criticality characteristic. Process history shows stable control.'
                    : 'Lower frequency acceptable based on low criticality and stable process capability data.'}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Linked Documents</p>
                <div className="space-y-2 text-sm">
                  <button className="text-blue-600 hover:underline block">
                    → FMEA-2024-A-05
                  </button>
                  <button className="text-blue-600 hover:underline block">
                    → Process Flow Diagram
                  </button>
                  <button className="text-blue-600 hover:underline block">
                    → Measurement System Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Rule Dialog */}
      {showAddModal && (
        <Dialog
          title="In-Process Check - Add Sampling Rule"
          onClose={() => setShowAddModal(false)}
          size="lg"
          actions={[
            {
              label: 'Add Rule',
              onClick: () => {
                toast.success('Sampling rule added successfully');
                setShowAddModal(false);
              },
              color: 'blue'
            },
            {
              label: 'Cancel',
              onClick: () => setShowAddModal(false),
              color: 'gray'
            }
          ]}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Characteristic</label>
                <input
                  type="text"
                  placeholder="e.g., Hole Diameter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Station</label>
                <input
                  type="text"
                  placeholder="e.g., Station #5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Rule Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Time-based</option>
                  <option>Count-based</option>
                  <option>Lot-based</option>
                  <option>Per piece</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Frequency</label>
                <input
                  type="text"
                  placeholder="e.g., Every 30 minutes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Criticality</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">FMEA RPN</label>
                <input
                  type="number"
                  placeholder="e.g., 240"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Control Plan ID</label>
              <input
                type="text"
                placeholder="e.g., CP-2024-A-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </Dialog>
      )}

      {/* Control Plan Dialog */}
      {showControlPlan && (
        <Dialog
          title="In-Process Check - Control Plan Details"
          description={selectedRule.controlPlan}
          onClose={() => setShowControlPlan(false)}
          size="xl"
          actions={[
            {
              label: 'Close',
              onClick: () => setShowControlPlan(false),
              color: 'gray'
            }
          ]}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-gray-900 mb-3">Control Plan Overview</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Control Plan ID</p>
                  <p className="text-gray-900">{selectedRule.controlPlan}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Product</p>
                  <p className="text-gray-900">{context.product}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Process</p>
                  <p className="text-gray-900">{context.operation}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Revision</p>
                  <p className="text-gray-900">Rev. 3</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700">Characteristic</th>
                    <th className="px-4 py-2 text-left text-gray-700">Specification</th>
                    <th className="px-4 py-2 text-left text-gray-700">Method</th>
                    <th className="px-4 py-2 text-left text-gray-700">Frequency</th>
                    <th className="px-4 py-2 text-left text-gray-700">Criticality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3">Hole Diameter</td>
                    <td className="px-4 py-3">10.0 ± 0.05 mm</td>
                    <td className="px-4 py-3">Digital Caliper</td>
                    <td className="px-4 py-3">Every 30 min</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">High</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Torque</td>
                    <td className="px-4 py-3">50 ± 5 Nm</td>
                    <td className="px-4 py-3">Torque Wrench</td>
                    <td className="px-4 py-3">Every 50 parts</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Medium</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Surface Scratch</td>
                    <td className="px-4 py-3">No visible defects</td>
                    <td className="px-4 py-3">Visual Inspection</td>
                    <td className="px-4 py-3">Every part</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">High</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Depth Measurement</td>
                    <td className="px-4 py-3">25.0 ± 0.2 mm</td>
                    <td className="px-4 py-3">Depth Gauge</td>
                    <td className="px-4 py-3">Per lot</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Low</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                💡 This control plan is aligned with IATF 16949 requirements and includes all critical-to-quality characteristics.
              </p>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}