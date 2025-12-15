import { useState } from 'react';
import { NavigationPage } from '../../App';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  getAssetById,
  getAlertsByAssetId,
  getWorkOrdersByAssetId,
  getSparePartsByAssetId,
  generateMockTimeSeriesData,
  generateMockFFTData,
  generateMockRULData,
  generateMockQualityData
} from '../../data/mockData';
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  Wrench,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Legend
} from 'recharts';
import { AssetRecommendations } from '../panels/asset-recommendations';

interface AssetDetailScreenProps {
  assetId: string;
  onNavigate: (page: NavigationPage, assetId?: string) => void;
}

export function AssetDetailScreen({ assetId, onNavigate }: AssetDetailScreenProps) {
  const [activeTab, setActiveTab] = useState('health');
  const [selectedSignals, setSelectedSignals] = useState({
    vibration: true,
    temperature: true,
    current: false
  });

  const asset = getAssetById(assetId);
  const alerts = getAlertsByAssetId(assetId);
  const workOrders = getWorkOrdersByAssetId(assetId);
  const spareParts = getSparePartsByAssetId(assetId);
  
  const timeSeriesData = generateMockTimeSeriesData(30);
  const fftData = generateMockFFTData();
  const rulData = generateMockRULData();
  const qualityData = generateMockQualityData(30);

  if (!asset) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Asset not found</p>
        <Button onClick={() => onNavigate('assets')} className="mt-4">
          Back to Assets
        </Button>
      </div>
    );
  }

  const getHealthStatusColor = () => {
    switch (asset.healthStatus) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'watch':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'degrading':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Button variant="ghost" onClick={() => onNavigate('overview')} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Asset Identity & Status (Sticky) */}
        <div className="lg:col-span-1">
          <Card className="p-6 lg:sticky lg:top-6">
            <div className="space-y-4">
              {/* Asset Name */}
              <div>
                <h2 className="text-gray-900 mb-1">{asset.name}</h2>
                <p className="text-sm text-gray-600">{asset.tag}</p>
                <p className="text-sm text-gray-500">{asset.type}</p>
              </div>

              {/* Health Score */}
              <div className={`p-4 border rounded-lg ${getHealthStatusColor()}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Health Score</span>
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{asset.healthScore}</span>
                  <span className="text-sm">/ 100</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {Math.round(asset.confidence * 100)}% confidence
                  </Badge>
                </div>
                <div className="mt-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getHealthStatusColor()}`}>
                    {asset.healthStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Location</h3>
                <div className="text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Plant:</span>
                    <span className="text-gray-900">{asset.location.plant}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Area:</span>
                    <span className="text-gray-900">{asset.location.area}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Line:</span>
                    <span className="text-gray-900">{asset.location.line}</span>
                  </div>
                </div>
              </div>

              {/* Criticality */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Criticality</h3>
                <Badge
                  variant={
                    asset.criticality === 'critical'
                      ? 'destructive'
                      : asset.criticality === 'high'
                      ? 'default'
                      : 'secondary'
                  }
                  className="w-full justify-center"
                >
                  {asset.criticality.toUpperCase()}
                </Badge>
              </div>

              {/* Data Quality */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Data Quality</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="text-gray-900 font-medium">{asset.dataQuality}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${asset.dataQuality}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last update:</span>
                    <span className="text-gray-900">
                      {new Date(asset.lastUpdate).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Operating Context */}
              {asset.operatingContext && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Operating Context</h3>
                  <div className="space-y-1 text-sm">
                    {asset.operatingContext.speed && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Speed:</span>
                        <span className="text-gray-900">{asset.operatingContext.speed} RPM</span>
                      </div>
                    )}
                    {asset.operatingContext.load && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Load:</span>
                        <span className="text-gray-900">{asset.operatingContext.load}%</span>
                      </div>
                    )}
                    {asset.operatingContext.temperature && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Temp:</span>
                        <span className="text-gray-900">{asset.operatingContext.temperature}°C</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Active Alerts
                  </span>
                  <span className="font-medium text-red-600">{alerts.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Wrench className="w-4 h-4" />
                    Work Orders
                  </span>
                  <span className="font-medium text-gray-900">{workOrders.length}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Center: Tabs Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-6">
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="spectral">Spectral</TabsTrigger>
              <TabsTrigger value="thermal">Thermal</TabsTrigger>
              <TabsTrigger value="rul">RUL</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="quality">Quality</TabsTrigger>
            </TabsList>

            {/* Tab A: Health & Trends */}
            <TabsContent value="health" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900">Signal Trends (30 days)</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedSignals.vibration ? 'default' : 'outline'}
                      onClick={() =>
                        setSelectedSignals((prev) => ({ ...prev, vibration: !prev.vibration }))
                      }
                    >
                      Vibration
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedSignals.temperature ? 'default' : 'outline'}
                      onClick={() =>
                        setSelectedSignals((prev) => ({ ...prev, temperature: !prev.temperature }))
                      }
                    >
                      Temperature
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedSignals.current ? 'default' : 'outline'}
                      onClick={() =>
                        setSelectedSignals((prev) => ({ ...prev, current: !prev.current }))
                      }
                    >
                      Current
                    </Button>
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%" minHeight={320}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })
                        }
                      />
                      <YAxis />
                      <RechartsTooltip
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                      />
                      <Legend />
                      {selectedSignals.vibration && (
                        <Line
                          type="monotone"
                          dataKey="vibrationRMS"
                          stroke="#ef4444"
                          strokeWidth={2}
                          name="Vibration RMS"
                          dot={false}
                        />
                      )}
                      {selectedSignals.temperature && (
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          name="Temperature"
                          dot={false}
                        />
                      )}
                      {selectedSignals.current && (
                        <Line
                          type="monotone"
                          dataKey="current"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Current"
                          dot={false}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Key Indicators */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">RMS Velocity</div>
                  <div className="text-2xl font-semibold text-gray-900">3.8 mm/s</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">+15%</span>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Kurtosis</div>
                  <div className="text-2xl font-semibold text-gray-900">4.2</div>
                  <Badge variant="secondary" className="mt-1">
                    Normal
                  </Badge>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Crest Factor</div>
                  <div className="text-2xl font-semibold text-gray-900">3.5</div>
                  <Badge variant="secondary" className="mt-1">
                    Normal
                  </Badge>
                </Card>
              </div>
            </TabsContent>

            {/* Tab B: Spectral Analysis */}
            <TabsContent value="spectral">
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">FFT Spectrum Analysis</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fftData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="frequency" label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="amplitude" stroke="#3b82f6" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Diagnostic Hints</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Peak at 120 Hz: Possible BPFO (Ball Pass Frequency Outer race)</li>
                    <li>• Peak at 180 Hz: Possible BPFI (Ball Pass Frequency Inner race)</li>
                    <li>• Elevated harmonics suggest bearing outer race defect</li>
                  </ul>
                </div>
              </Card>
            </TabsContent>

            {/* Tab C: Thermal Evidence */}
            <TabsContent value="thermal">
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">Thermal Imaging Evidence</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 h-48 rounded-lg flex items-center justify-center">
                    <span className="text-white font-medium">Thermal Image Placeholder</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Timestamp:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(asset.lastUpdate).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Emissivity:</span>
                      <span className="ml-2 text-gray-900">0.95</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Min Temp:</span>
                      <span className="ml-2 text-gray-900">52°C</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Max Temp:</span>
                      <span className="ml-2 text-red-600 font-medium">82°C</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Hot spot detected at bearing housing. Temperature 12°C above normal operating range.
                  </p>
                </div>
              </Card>
            </TabsContent>

            {/* Tab D: Prognostics (RUL) */}
            <TabsContent value="rul">
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">Remaining Useful Life (RUL) Prediction</h3>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rulData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="days" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="probability" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Predicted RUL Range</span>
                      <Badge variant="outline">{Math.round(asset.confidence * 100)}% confidence</Badge>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {asset.rul.min} - {asset.rul.max} {asset.rul.unit}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Next Inspection Recommended</h4>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{asset.dueBy || 'To be scheduled'}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Tab E: Maintenance History */}
            <TabsContent value="maintenance">
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">Maintenance & Work Orders</h3>
                <div className="space-y-4">
                  {workOrders.map((wo) => (
                    <div key={wo.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{wo.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{wo.description}</p>
                        </div>
                        <Badge
                          variant={
                            wo.status === 'completed'
                              ? 'secondary'
                              : wo.status === 'in-progress'
                              ? 'default'
                              : 'outline'
                          }
                        >
                          {wo.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                        <div>
                          <span className="text-gray-600">Priority:</span>
                          <span className="ml-2 text-gray-900">{wo.priority}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Created:</span>
                          <span className="ml-2 text-gray-900">
                            {new Date(wo.createdDate).toLocaleDateString()}
                          </span>
                        </div>
                        {wo.technician && (
                          <div>
                            <span className="text-gray-600">Technician:</span>
                            <span className="ml-2 text-gray-900">{wo.technician}</span>
                          </div>
                        )}
                        {wo.completedDate && (
                          <div>
                            <span className="text-gray-600">Completed:</span>
                            <span className="ml-2 text-gray-900">
                              {new Date(wo.completedDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      {wo.rootCause && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Root Cause:</span>
                          <span className="ml-2 text-gray-900">{wo.rootCause}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {workOrders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No work orders found for this asset.</p>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Tab F: Quality Impact */}
            <TabsContent value="quality">
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">Quality Impact Correlation</h3>
                <div className="h-80 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={qualityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="defects" stroke="#ef4444" name="Defects" />
                      <Line yAxisId="left" type="monotone" dataKey="scrap" stroke="#f97316" name="Scrap" />
                      <Line yAxisId="left" type="monotone" dataKey="rework" stroke="#f59e0b" name="Rework" />
                      <Line yAxisId="right" type="monotone" dataKey="healthScore" stroke="#3b82f6" name="Health Score" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Quality Risk Alert</h4>
                      <p className="text-sm text-gray-700">
                        Correlation detected: Defect rate increased by 35% as equipment health declined below 60.
                        Consider scheduling maintenance to prevent further quality impact.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Actions & Recommendations (Sticky) */}
        <div className="lg:col-span-1">
          <AssetRecommendations asset={asset} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}