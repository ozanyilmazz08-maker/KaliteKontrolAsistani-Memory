import { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { Clock, Database, TrendingUp, AlertTriangle, Network } from 'lucide-react';

export function DataQualityTab() {
  const [selectedSensor, setSelectedSensor] = useState('T-042');
  const [selectedStream, setSelectedStream] = useState('All Streams');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 24 hours');
  const [gapHandling, setGapHandling] = useState('interpolation');
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showRemediationModal, setShowRemediationModal] = useState(false);

  const sensors = ['T-042', 'V-128', 'P-203', 'H-067', 'C-091'];
  const streams = ['All Streams', 'OPC UA Streams', 'MQTT Streams', 'Modbus Streams'];

  // Update metrics based on selected sensor
  const getMetricsForSensor = () => {
    const metrics = {
      'T-042': { uptime: 99.8, latency: 182, missing: 0.2, gaps: 2 },
      'V-128': { uptime: 97.5, latency: 245, missing: 2.5, gaps: 8 },
      'P-203': { uptime: 99.5, latency: 165, missing: 0.5, gaps: 3 },
      'H-067': { uptime: 100, latency: 142, missing: 0, gaps: 0 },
      'C-091': { uptime: 98.2, latency: 198, missing: 1.8, gaps: 5 },
    };
    return metrics[selectedSensor as keyof typeof metrics] || metrics['T-042'];
  };

  const currentMetrics = getMetricsForSensor();

  // Generate dynamic latency data based on selected sensor and time range
  const latencyData = useMemo(() => {
    const baseLatency = currentMetrics.latency;
    const variance = selectedSensor === 'V-128' ? 80 : selectedSensor === 'H-067' ? 30 : 50;
    const dataPoints = selectedTimeRange === 'Last 1 hour' ? 12 : 
                       selectedTimeRange === 'Last 6 hours' ? 18 : 
                       selectedTimeRange === 'Last 7 days' ? 28 : 20;
    
    return Array.from({ length: dataPoints }, (_, i) => ({
      time: selectedTimeRange === 'Last 7 days' 
        ? `Day ${i + 1}` 
        : `${String(Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`,
      latency: baseLatency + (Math.random() - 0.5) * variance,
      sla: 250,
    }));
  }, [selectedSensor, selectedTimeRange, currentMetrics.latency]);

  // Generate dynamic sampling interval data based on selected sensor
  const samplingData = useMemo(() => {
    const quality = currentMetrics.uptime;
    const goodCount = Math.floor(quality * 10);
    const moderateCount = Math.floor((100 - quality) * 5);
    const poorCount = Math.floor((100 - quality) * 2);
    
    return [
      { interval: '0.9-1.0s', count: 800 + goodCount },
      { interval: '1.0-1.1s', count: 100 + moderateCount },
      { interval: '1.1-1.2s', count: 10 + poorCount },
      { interval: '>1.2s', count: currentMetrics.gaps },
    ];
  }, [selectedSensor, currentMetrics.uptime, currentMetrics.gaps]);

  // Generate dynamic gap heatmap data based on selected sensor
  const gapHeatmapData = useMemo(() => {
    const sensorCount = selectedStream === 'All Streams' ? 8 : 5;
    const gapProbability = currentMetrics.missing / 100;
    
    return Array.from({ length: sensorCount }, (_, sensorIdx) => ({
      sensor: `${selectedSensor}-${sensorIdx + 1}`,
      hours: Array.from({ length: 24 }, (_, hourIdx) => ({
        hour: hourIdx,
        presence: Math.random() > gapProbability ? 100 : Math.random() > 0.5 ? 50 : 0,
      })),
    }));
  }, [selectedSensor, selectedStream, currentMetrics.missing]);

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Left: Selection Panel */}
      <div className="w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-sm text-gray-900 mb-4">Data Stream Selection</h3>

        <div className="mb-6">
          <label className="text-sm text-gray-700 mb-2 block">Sensor / Device</label>
          <select
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {sensors.map(sensor => (
              <option key={sensor} value={sensor}>{sensor}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-700 mb-2 block">Data Stream</label>
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {streams.map(stream => (
              <option key={stream} value={stream}>{stream}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-700 mb-2 block">Time Range</label>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option>Last 1 hour</option>
            <option>Last 6 hours</option>
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Custom range</option>
          </select>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-sm text-gray-900 mb-3">Quality Metrics</h4>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Uptime</p>
              <p className="text-lg text-green-700">{currentMetrics.uptime}%</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Avg Latency</p>
              <p className="text-lg text-blue-700">{currentMetrics.latency} ms</p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Missing Rate</p>
              <p className="text-lg text-yellow-700">{currentMetrics.missing}%</p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Gap Events</p>
              <p className="text-lg text-purple-700">{currentMetrics.gaps}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 mt-6">
          <h4 className="text-sm text-gray-900 mb-3">Gap Handling</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gap-handling"
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked={gapHandling === 'interpolation'}
                onChange={() => setGapHandling('interpolation')}
              />
              <span className="text-sm text-gray-700">Interpolation</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gap-handling"
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked={gapHandling === 'forward-fill'}
                onChange={() => setGapHandling('forward-fill')}
              />
              <span className="text-sm text-gray-700">Forward-fill</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gap-handling"
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked={gapHandling === 'mark-as-null'}
                onChange={() => setGapHandling('mark-as-null')}
              />
              <span className="text-sm text-gray-700">Mark as null</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gap-handling"
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked={gapHandling === 'alert-only'}
                onChange={() => setGapHandling('alert-only')}
              />
              <span className="text-sm text-gray-700">Alert only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Center: Visualizations */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <h2 className="text-lg text-gray-900 mb-6">Data Quality & Streaming Metrics</h2>

          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-gray-600">SLA Compliance</p>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">94.2%</p>
              <p className="text-xs text-green-600">+2.1% vs last week</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-gray-600">Data Completeness</p>
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">99.8%</p>
              <p className="text-xs text-green-600">+0.3% vs last week</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-gray-600">Avg Throughput</p>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">8.2k</p>
              <p className="text-xs text-gray-600">msg/sec</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-gray-600">Quality Incidents</p>
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">8</p>
              <p className="text-xs text-red-600">-12.5% vs last week</p>
            </div>
          </div>

          {/* Sampling & Frequency */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm text-gray-900 mb-4">Sampling Interval Distribution</h3>
              <p className="text-xs text-gray-600 mb-4">Expected: 1.0s ± 0.05s</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={samplingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="interval" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {samplingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-500 rounded"></span>
                  Within spec
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-500 rounded"></span>
                  Acceptable
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-yellow-500 rounded"></span>
                  Out of spec
                </span>
              </div>
            </div>

            {/* Latency Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm text-gray-900 mb-4">Data Ingestion Latency</h3>
              <p className="text-xs text-gray-600 mb-4">SLA: &lt;250ms</p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sla" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-blue-500"></span>
                  Actual latency
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-red-500" style={{ borderTop: '1px dashed' }}></span>
                  SLA threshold
                </span>
              </div>
            </div>
          </div>

          {/* Gap Heatmap */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-sm text-gray-900 mb-4">Data Presence Heatmap (Last 24 Hours)</h3>
            <p className="text-xs text-gray-600 mb-4">Green = data present, Yellow = partial, Red = gap</p>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {gapHeatmapData.map((sensor, idx) => (
                  <div key={sensor.sensor} className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-700 w-20 flex-shrink-0">{sensor.sensor}</span>
                    <div className="flex gap-1">
                      {sensor.hours.map((hour, hourIdx) => (
                        <div
                          key={hourIdx}
                          className="w-6 h-6 rounded"
                          style={{
                            backgroundColor:
                              hour.presence === 100 ? '#10b981' :
                              hour.presence === 50 ? '#fbbf24' :
                              '#ef4444'
                          }}
                          title={`${hourIdx}:00 - ${hour.presence}%`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-xs text-gray-700 w-20 flex-shrink-0">Time</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 24 }, (_, i) => (
                      <span key={i} className="w-6 text-xs text-gray-500 text-center">
                        {i % 4 === 0 ? i : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm text-gray-900 mb-2">Gap Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total gap events:</span>
                  <span className="text-gray-900">14</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longest gap:</span>
                  <span className="text-gray-900">12 minutes (Sensor-3, 14:20-14:32)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gap rate:</span>
                  <span className="text-gray-900">0.8%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Log */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm text-gray-900 mb-4">Quality Events Log</h3>
            <div className="space-y-2">
              {[
                { time: '14:32', type: 'Gap Closed', sensor: 'Sensor-3', message: 'Connection restored after 12-minute gap' },
                { time: '14:20', type: 'Gap Started', sensor: 'Sensor-3', message: 'Lost connection to sensor' },
                { time: '13:45', type: 'High Latency', sensor: 'V-128', message: 'Latency exceeded SLA for 3 minutes' },
                { time: '12:18', type: 'Sampling Drift', sensor: 'T-042', message: 'Sampling interval drifted to 1.15s' },
                { time: '11:30', type: 'Recovery', sensor: 'P-203', message: 'Sampling returned to spec' },
              ].map((event, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-500 w-12">{event.time}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.type === 'Gap Closed' || event.type === 'Recovery' ? 'bg-green-100 text-green-700' :
                    event.type === 'Gap Started' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{event.type}</span>
                  <span className="text-xs text-gray-900 flex-1">{event.sensor}: {event.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Architecture Diagram */}
      <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-sm text-gray-900 mb-4">Data Flow Architecture</h3>

        <div className="space-y-4">
          {/* Sensor Layer */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Network className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm text-blue-900">Sensor Layer</h4>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-700">• 177 field sensors</p>
              <p className="text-xs text-gray-700">• Temperature, vibration, pressure, etc.</p>
              <p className="text-xs text-green-600">✓ 142 online</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          {/* Edge Layer */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-green-600" />
              <h4 className="text-sm text-green-900">Edge Nodes</h4>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-700">• 8 edge gateways</p>
              <p className="text-xs text-gray-700">• Protocol translation</p>
              <p className="text-xs text-gray-700">• Edge aggregation (10s)</p>
              <p className="text-xs text-green-600">✓ All nodes healthy</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          {/* Protocol Layer */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Network className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm text-purple-900">Protocol Layer</h4>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-700">• OPC UA: 78 nodes</p>
              <p className="text-xs text-gray-700">• MQTT: 62 topics</p>
              <p className="text-xs text-gray-700">• Modbus: 28 devices</p>
              <p className="text-xs text-gray-700">• Profinet: 9 devices</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          {/* Broker Layer */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
              <h4 className="text-sm text-yellow-900">Message Broker</h4>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-700">• MQTT Broker cluster</p>
              <p className="text-xs text-gray-700">• 8.2k msg/sec throughput</p>
              <p className="text-xs text-gray-700">• QoS 1 guaranteed</p>
              <p className="text-xs text-yellow-600">⚠ 182ms avg latency</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-px h-8 bg-gray-300"></div>
          </div>

          {/* Cloud Storage */}
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm text-indigo-900">Cloud Storage & Analytics</h4>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-700">• Time-series DB</p>
              <p className="text-xs text-gray-700">• Analytics engine</p>
              <p className="text-xs text-gray-700">• QMS integration</p>
              <p className="text-xs text-green-600">✓ All services operational</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm text-gray-900 mb-3">Resource Utilization</h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">CPU (Edge)</span>
                <span className="text-xs text-gray-900">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Memory (Broker)</span>
                <span className="text-xs text-gray-900">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Network Bandwidth</span>
                <span className="text-xs text-gray-900">55%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}