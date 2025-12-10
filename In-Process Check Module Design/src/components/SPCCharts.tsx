import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Dot } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, Download, Printer } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import Dialog from './Dialog';

interface SPCChartsProps {
  context: any;
}

// Mock data for X̄-R chart
const xBarData = [
  { sample: 1, xBar: 10.01, r: 0.04, time: '08:00', operator: 'J. Smith', lot: 'L-8840' },
  { sample: 2, xBar: 9.99, r: 0.03, time: '08:30', operator: 'J. Smith', lot: 'L-8840' },
  { sample: 3, xBar: 10.02, r: 0.05, time: '09:00', operator: 'J. Smith', lot: 'L-8840' },
  { sample: 4, xBar: 10.00, r: 0.04, time: '09:30', operator: 'J. Smith', lot: 'L-8841' },
  { sample: 5, xBar: 9.98, r: 0.06, time: '10:00', operator: 'M. Jones', lot: 'L-8841' },
  { sample: 6, xBar: 10.01, r: 0.03, time: '10:30', operator: 'M. Jones', lot: 'L-8841' },
  { sample: 7, xBar: 10.03, r: 0.04, time: '11:00', operator: 'M. Jones', lot: 'L-8842' },
  { sample: 8, xBar: 10.05, r: 0.07, time: '11:30', operator: 'M. Jones', lot: 'L-8842', violation: 'ucl' },
  { sample: 9, xBar: 10.02, r: 0.05, time: '12:00', operator: 'K. Lee', lot: 'L-8842' },
  { sample: 10, xBar: 10.00, r: 0.04, time: '12:30', operator: 'K. Lee', lot: 'L-8842' },
  { sample: 11, xBar: 9.99, r: 0.03, time: '13:00', operator: 'K. Lee', lot: 'L-8843' },
  { sample: 12, xBar: 10.01, r: 0.04, time: '13:30', operator: 'K. Lee', lot: 'L-8843' },
];

const characteristics = [
  { id: 'diameter', name: 'Hole Diameter', unit: 'mm' },
  { id: 'torque', name: 'Torque', unit: 'Nm' },
  { id: 'depth', name: 'Depth Measurement', unit: 'mm' }
];

const chartTypes = [
  { id: 'xbar-r', name: 'X̄-R Chart (Average & Range)' },
  { id: 'xbar-s', name: 'X̄-S Chart (Average & Std Dev)' },
  { id: 'p', name: 'p Chart (Proportion Defective)' },
  { id: 'np', name: 'np Chart (Number Defective)' }
];

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload.violation) {
    return (
      <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />
    );
  }
  return <circle cx={cx} cy={cy} r={4} fill="#3b82f6" />;
};

export default function SPCCharts({ context }: SPCChartsProps) {
  const [selectedChar, setSelectedChar] = useState(characteristics[0]);
  const [selectedChart, setSelectedChart] = useState(chartTypes[0]);
  const [dateRange, setDateRange] = useState('today');
  const [selectedShift, setSelectedShift] = useState('all');
  const [selectedLot, setSelectedLot] = useState('all');

  const violations = [
    {
      id: 1,
      sample: 8,
      time: '11:30',
      rule: 'One point beyond UCL',
      severity: 'high',
      value: 10.05,
      operator: 'M. Jones',
      lot: 'L-8842'
    }
  ];

  const stats = {
    mean: 10.01,
    stdDev: 0.019,
    cp: 1.42,
    cpk: 1.35,
    oocCount: 1
  };

  const ucl = 10.04;
  const lcl = 9.96;
  const cl = 10.0;
  const uclR = 0.08;
  const clR = 0.045;

  const handleExportData = () => {
    alert('Exporting chart data to CSV...');
    // In real app, would generate and download CSV
  };

  const handlePrintChart = () => {
    window.print();
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Selection & Filters */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-gray-900 mb-4">Chart Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Characteristic</label>
                <select
                  value={selectedChar.id}
                  onChange={(e) => setSelectedChar(characteristics.find(c => c.id === e.target.value)!)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {characteristics.map(char => (
                    <option key={char.id} value={char.id}>{char.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Chart Type</label>
                <select
                  value={selectedChart.id}
                  onChange={(e) => setSelectedChart(chartTypes.find(t => t.id === e.target.value)!)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {chartTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

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
                <label className="block text-sm text-gray-700 mb-2">Shift</label>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Shifts</option>
                  <option value="shiftA">Shift A (06:00-14:00)</option>
                  <option value="shiftB">Shift B (14:00-22:00)</option>
                  <option value="shiftC">Shift C (22:00-06:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Batch/Lot</label>
                <select
                  value={selectedLot}
                  onChange={(e) => setSelectedLot(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Lots</option>
                  <option value="L-8840">L-8840</option>
                  <option value="L-8841">L-8841</option>
                  <option value="L-8842">L-8842</option>
                  <option value="L-8843">L-8843</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Charts */}
        <div className="col-span-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-gray-900 mb-4">
              {selectedChar.name} - {selectedChart.name}
            </h3>

            {/* X̄ Chart */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-3">Average (X̄) Chart</p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={xBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="sample"
                    label={{ value: 'Sample Number', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    domain={[9.94, 10.08]}
                    label={{ value: `${selectedChar.unit}`, angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
                            <p className="text-gray-900">Sample {data.sample}</p>
                            <p className="text-gray-600">X̄: {data.xBar} {selectedChar.unit}</p>
                            <p className="text-gray-600">Time: {data.time}</p>
                            <p className="text-gray-600">Operator: {data.operator}</p>
                            <p className="text-gray-600">Lot: {data.lot}</p>
                            {data.violation && (
                              <p className="text-red-600 mt-1">⚠ Point beyond UCL</p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={ucl} stroke="#ef4444" strokeDasharray="5 5" label="UCL" />
                  <ReferenceLine y={cl} stroke="#3b82f6" strokeDasharray="3 3" label="CL" />
                  <ReferenceLine y={lcl} stroke="#ef4444" strokeDasharray="5 5" label="LCL" />
                  <Line
                    type="monotone"
                    dataKey="xBar"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={<CustomDot />}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* R Chart */}
            <div>
              <p className="text-sm text-gray-600 mb-3">Range (R) Chart</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={xBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="sample"
                    label={{ value: 'Sample Number', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    domain={[0, 0.10]}
                    label={{ value: selectedChar.unit, angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <ReferenceLine y={uclR} stroke="#ef4444" strokeDasharray="5 5" label="UCL" />
                  <ReferenceLine y={clR} stroke="#3b82f6" strokeDasharray="3 3" label="CL" />
                  <Line
                    type="monotone"
                    dataKey="r"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-900 mb-2">SPC Interpretation Guide</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Points beyond control limits indicate assignable (special) cause variation</p>
              <p>• 7+ consecutive points on one side of centerline suggests a shift in process</p>
              <p>• Trends of 7+ points indicate gradual process drift</p>
              <p>• Control limits (UCL/LCL) are calculated from process data, not specifications</p>
            </div>
          </div>
        </div>

        {/* Right: Violations & Statistics */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h3 className="text-gray-900 mb-4">Rule Violations</h3>
            
            {violations.length > 0 ? (
              <div className="space-y-3">
                {violations.map(violation => (
                  <div key={violation.id} className="border-l-4 border-red-500 bg-red-50 p-3 rounded">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-red-900">Sample {violation.sample}</p>
                        <p className="text-xs text-red-700 mt-1">{violation.rule}</p>
                        <div className="mt-2 text-xs text-red-600 space-y-0.5">
                          <p>Time: {violation.time}</p>
                          <p>Value: {violation.value} {selectedChar.unit}</p>
                          <p>Operator: {violation.operator}</p>
                          <p>Lot: {violation.lot}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No violations detected</p>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-gray-900 mb-4">Process Statistics</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Process Mean (X̿)</p>
                <p className="text-gray-900">{stats.mean.toFixed(3)} {selectedChar.unit}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Standard Deviation (σ)</p>
                <p className="text-gray-900">{stats.stdDev.toFixed(4)} {selectedChar.unit}</p>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Process Capability</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Cp</p>
                    <p className="text-lg text-green-600">{stats.cp.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cpk</p>
                    <p className="text-lg text-green-600">{stats.cpk.toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Process is capable (Cpk {'>'} 1.33)
                </p>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">OOC Events</p>
                <p className="text-2xl text-red-600">{stats.oocCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h4 className="text-sm text-gray-700 mb-2">Next Steps</h4>
            <div className="text-xs text-gray-600 space-y-2">
              <p>→ Investigate root cause of sample #8 OOC event</p>
              <p>→ Verify measurement system is calibrated</p>
              <p>→ Review operator technique during 11:00-12:00 period</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}