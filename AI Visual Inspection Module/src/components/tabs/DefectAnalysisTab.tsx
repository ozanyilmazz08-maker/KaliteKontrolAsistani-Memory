import { FilterPanel } from '../shared/FilterPanel';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const paretoData = [
  { defect: 'Solder Bridge', count: 142, cumulative: 35 },
  { defect: 'Insufficient Solder', count: 98, cumulative: 59 },
  { defect: 'Missing Component', count: 67, cumulative: 76 },
  { defect: 'Tombstone', count: 45, cumulative: 87 },
  { defect: 'Polarity Error', count: 28, cumulative: 94 },
  { defect: 'Component Shift', count: 24, cumulative: 100 },
];

const timeSeriesData = [
  { time: '00:00', defectRate: 2.1, temperature: 242, lineSpeed: 1.2 },
  { time: '04:00', defectRate: 2.3, temperature: 245, lineSpeed: 1.3 },
  { time: '08:00', defectRate: 2.8, temperature: 248, lineSpeed: 1.4 },
  { time: '12:00', defectRate: 2.5, temperature: 244, lineSpeed: 1.2 },
  { time: '16:00', defectRate: 2.2, temperature: 243, lineSpeed: 1.1 },
  { time: '20:00', defectRate: 2.4, temperature: 246, lineSpeed: 1.3 },
];

export function DefectAnalysisTab() {
  return (
    <div className="flex gap-6">
      <FilterPanel />

      <div className="flex-1 space-y-6">
        {/* Spatial Heatmap */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Spatial Defect Heatmap</h3>
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-green-900 to-green-950 rounded-lg overflow-hidden">
                {/* Heatmap overlay */}
                <div className="absolute inset-0">
                  {/* Hot spots */}
                  <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-red-500/60 rounded-full blur-xl"></div>
                  <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-orange-500/40 rounded-full blur-xl"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-20 h-20 bg-yellow-500/30 rounded-full blur-xl"></div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Low frequency</span>
                <div className="flex gap-1">
                  {['bg-blue-200', 'bg-green-300', 'bg-yellow-400', 'bg-orange-500', 'bg-red-600'].map((color, idx) => (
                    <div key={idx} className={`w-8 h-4 ${color}`}></div>
                  ))}
                </div>
                <span className="text-gray-600">High frequency</span>
              </div>
            </div>
            <div className="w-64">
              <h4 className="text-sm text-gray-700 mb-3">Hot Zones</h4>
              <div className="space-y-2">
                {[
                  { zone: 'Zone A (U12 area)', count: 142, severity: 'High' },
                  { zone: 'Zone C (R45 area)', count: 98, severity: 'Medium' },
                  { zone: 'Zone F (connector)', count: 67, severity: 'Medium' },
                ].map((zone, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900">{zone.zone}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          zone.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {zone.severity}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{zone.count} defects</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pareto Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Defect Type Distribution (Pareto)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={paretoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="defect" angle={-45} textAnchor="end" height={100} />
              <YAxis yAxisId="left" label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Cumulative %', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Defect Count" />
              <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#ef4444" strokeWidth={2} name="Cumulative %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Series & Correlations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Defect Rate vs Process Parameters</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" label={{ value: 'Defect Rate (%)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Temperature (°C)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="defectRate" stroke="#ef4444" strokeWidth={2} name="Defect Rate" />
              <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} name="Reflow Temp" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Correlation Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Correlation Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                defect: 'Solder Bridge',
                param: 'Line Speed',
                correlation: 0.72,
                level: 'High',
                color: 'red',
              },
              {
                defect: 'Insufficient Solder',
                param: 'Reflow Zone 3 Temperature',
                correlation: 0.65,
                level: 'High',
                color: 'red',
              },
              {
                defect: 'Tombstone',
                param: 'Pick & Place Pressure',
                correlation: 0.48,
                level: 'Medium',
                color: 'yellow',
              },
              {
                defect: 'Component Shift',
                param: 'Conveyor Vibration',
                correlation: 0.38,
                level: 'Medium',
                color: 'yellow',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-gray-900">{item.defect}</div>
                    <div className="text-sm text-gray-600">vs {item.param}</div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.color === 'red' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {item.level}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl text-gray-900">{item.correlation}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`}
                        style={{ width: `${item.correlation * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Performance Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Model Performance by Defect Type</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Defect Type</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-700">Precision</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-700">Recall</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-700">F1-Score</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-700">Count</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: 'Solder Bridge', precision: 96.2, recall: 94.8, f1: 95.5, count: 142 },
                  { type: 'Insufficient Solder', precision: 93.5, recall: 91.2, f1: 92.3, count: 98 },
                  { type: 'Missing Component', precision: 98.1, recall: 97.5, f1: 97.8, count: 67 },
                  { type: 'Tombstone', precision: 89.3, recall: 86.7, f1: 88.0, count: 45 },
                  { type: 'Polarity Error', precision: 95.8, recall: 93.4, f1: 94.6, count: 28 },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{row.type}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900">{row.precision}%</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900">{row.recall}%</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-900">{row.f1}%</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
