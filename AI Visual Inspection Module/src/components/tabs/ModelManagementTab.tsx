import { useState } from 'react';
import { Search, ChevronRight, CheckCircle, AlertCircle, Clock, Archive } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const driftData = [
  { week: 'W45', baseline: 95.5, current: 95.3 },
  { week: 'W46', baseline: 95.5, current: 94.8 },
  { week: 'W47', baseline: 95.5, current: 94.2 },
  { week: 'W48', baseline: 95.5, current: 93.7 },
  { week: 'W49', baseline: 95.5, current: 93.1 },
  { week: 'W50', baseline: 95.5, current: 92.8 },
];

export function ModelManagementTab() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const models = [
    {
      id: 'cnn-v2.3.1',
      name: 'CNN-v2.3.1',
      status: 'Active',
      type: 'Classification',
      scope: 'PCB-001',
      trainDate: '2024-11-15',
      dataset: 'DS-PCB001-v3',
      precision: 94.2,
      recall: 93.1,
      latency: 44,
      deployed: 3,
    },
    {
      id: 'seg-v1.8.2',
      name: 'Segmentation-v1.8.2',
      status: 'Validating',
      type: 'Segmentation',
      scope: 'PCB-001, PCB-002',
      trainDate: '2024-12-05',
      dataset: 'DS-PCB001-v4',
      precision: 96.1,
      recall: 95.3,
      latency: 67,
      deployed: 0,
    },
    {
      id: 'anomaly-v3.1.0',
      name: 'Anomaly-v3.1.0',
      status: 'Active',
      type: 'Anomaly Detection',
      scope: 'All products',
      trainDate: '2024-10-20',
      dataset: 'DS-General-v2',
      precision: 88.5,
      recall: 91.2,
      latency: 38,
      deployed: 5,
    },
    {
      id: 'cnn-v2.2.5',
      name: 'CNN-v2.2.5',
      status: 'Deprecated',
      type: 'Classification',
      scope: 'PCB-001',
      trainDate: '2024-09-10',
      dataset: 'DS-PCB001-v2',
      precision: 92.8,
      recall: 91.5,
      latency: 52,
      deployed: 0,
    },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'Active') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'Validating') return <Clock className="w-4 h-4 text-yellow-600" />;
    return <Archive className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search models..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Train New Model
          </button>
        </div>
      </div>

      {!selectedModel ? (
        /* Model List */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-gray-700">Model Name</th>
                <th className="text-left py-3 px-4 text-sm text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm text-gray-700">Type</th>
                <th className="text-left py-3 px-4 text-sm text-gray-700">Scope</th>
                <th className="text-left py-3 px-4 text-sm text-gray-700">Train Date</th>
                <th className="text-right py-3 px-4 text-sm text-gray-700">Precision</th>
                <th className="text-right py-3 px-4 text-sm text-gray-700">Recall</th>
                <th className="text-right py-3 px-4 text-sm text-gray-700">Latency (ms)</th>
                <th className="text-center py-3 px-4 text-sm text-gray-700">Deployed</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr
                  key={model.id}
                  className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedModel(model.id)}
                >
                  <td className="py-4 px-4">
                    <div className="text-gray-900">{model.name}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(model.status)}
                      <span className="text-sm text-gray-700">{model.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{model.type}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{model.scope}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{model.trainDate}</td>
                  <td className="py-4 px-4 text-sm text-right text-gray-900">{model.precision}%</td>
                  <td className="py-4 px-4 text-sm text-right text-gray-900">{model.recall}%</td>
                  <td className="py-4 px-4 text-sm text-right text-gray-900">{model.latency}</td>
                  <td className="py-4 px-4 text-sm text-center text-gray-700">{model.deployed} stations</td>
                  <td className="py-4 px-4">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Model Detail View */
        <div className="space-y-6">
          <button
            onClick={() => setSelectedModel(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Model List
          </button>

          {/* Summary Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-gray-900 mb-2">CNN-v2.3.1</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Active</span>
                  </div>
                  <span>Created: 2024-11-15</span>
                  <span>Owner: ML Team</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Start Validation
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Deploy to Station
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Type</div>
                <div className="text-gray-900">Classification</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Scope</div>
                <div className="text-gray-900">PCB-001</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Training Dataset</div>
                <div className="text-blue-600 cursor-pointer hover:underline">DS-PCB001-v3</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Deployed To</div>
                <div className="text-gray-900">3 stations</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-gray-600 mb-1">Precision</div>
                <div className="text-2xl text-gray-900">94.2%</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-gray-600 mb-1">Recall</div>
                <div className="text-2xl text-gray-900">93.1%</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-gray-600 mb-1">F1-Score</div>
                <div className="text-2xl text-gray-900">93.6%</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-sm text-gray-600 mb-1">Avg Latency</div>
                <div className="text-2xl text-gray-900">44ms</div>
              </div>
            </div>
          </div>

          {/* Drift Monitoring */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Performance Drift Monitoring</h3>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-700">Moderate drift detected</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={driftData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[90, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeDasharray="5 5" name="Baseline F1" />
                <Line type="monotone" dataKey="current" stroke="#ef4444" strokeWidth={2} name="Current F1" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-sm text-gray-700">
                Model performance has degraded by 2.7% over the past 6 weeks. Consider retraining with recent production data.
              </div>
            </div>
          </div>

          {/* Deployment Map */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Deployment Map</h3>
            <div className="space-y-3">
              {[
                { site: 'Plant A', line: 'SMT Line 3', station: 'AOI #2', since: '2024-11-20' },
                { site: 'Plant A', line: 'SMT Line 3', station: 'AOI #3', since: '2024-11-22' },
                { site: 'Plant B', line: 'SMT Line 1', station: 'AOI #1', since: '2024-11-25' },
              ].map((deployment, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-gray-900">
                        {deployment.site} · {deployment.line} · {deployment.station}
                      </div>
                      <div className="text-sm text-gray-600">Deployed since {deployment.since}</div>
                    </div>
                  </div>
                  <button className="text-sm text-red-600 hover:text-red-700">Undeploy</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
