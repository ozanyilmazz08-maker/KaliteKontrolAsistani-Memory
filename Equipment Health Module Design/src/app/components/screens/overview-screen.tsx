import { AppFilters, NavigationPage } from '../../App';
import { Card } from '../ui/card';
import { mockAssets, mockAlerts, mockWorkOrders } from '../../data/mockData';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Activity,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle as AlertCircleIcon
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { useState } from 'react';
import { CreateWorkOrderDialog } from '../dialogs/create-work-order-dialog';
import { toast } from 'sonner';

interface OverviewScreenProps {
  filters: AppFilters;
  onNavigate: (page: NavigationPage, assetId?: string) => void;
}

export function OverviewScreen({ filters, onNavigate }: OverviewScreenProps) {
  const [sortBy, setSortBy] = useState<'risk' | 'rul' | 'cost'>('risk');
  const [createWorkOrderAssetId, setCreateWorkOrderAssetId] = useState<string | null>(null);

  // Calculate KPIs
  const fleetHealthScore = Math.round(
    mockAssets.reduce((sum, asset) => sum + asset.healthScore, 0) / mockAssets.length
  );
  const criticalAlerts = mockAlerts.filter((a) => a.severity === 'critical').length;
  const highRiskAssets = mockAssets.filter(
    (a) => a.healthStatus === 'critical' || a.healthStatus === 'degrading'
  ).length;

  // Fleet distribution data
  const healthDistribution = [
    {
      name: 'Healthy',
      value: mockAssets.filter((a) => a.healthStatus === 'healthy').length,
      color: '#10b981'
    },
    {
      name: 'Watch',
      value: mockAssets.filter((a) => a.healthStatus === 'watch').length,
      color: '#f59e0b'
    },
    {
      name: 'Degrading',
      value: mockAssets.filter((a) => a.healthStatus === 'degrading').length,
      color: '#f97316'
    },
    {
      name: 'Critical',
      value: mockAssets.filter((a) => a.healthStatus === 'critical').length,
      color: '#ef4444'
    },
    {
      name: 'Data Missing',
      value: mockAssets.filter((a) => a.healthStatus === 'data-missing').length,
      color: '#6b7280'
    }
  ];

  // MTBF trend (mock data)
  const mtbfData = [
    { day: 'Mon', mtbf: 168 },
    { day: 'Tue', mtbf: 172 },
    { day: 'Wed', mtbf: 165 },
    { day: 'Thu', mtbf: 170 },
    { day: 'Fri', mtbf: 168 },
    { day: 'Sat', mtbf: 175 },
    { day: 'Sun', mtbf: 173 }
  ];

  // Sort assets by risk
  const sortedAssets = [...mockAssets]
    .filter((a) => a.healthStatus !== 'data-missing')
    .sort((a, b) => {
      if (sortBy === 'risk') {
        return a.healthScore - b.healthScore;
      } else if (sortBy === 'rul') {
        return (a.rul.min + a.rul.max) / 2 - (b.rul.min + b.rul.max) / 2;
      }
      return 0;
    })
    .slice(0, 10);

  const handleAcknowledge = (assetId: string) => {
    toast.success('Asset acknowledged', {
      description: `${mockAssets.find(a => a.id === assetId)?.name} has been acknowledged for review.`
    });
  };

  const handleAssign = (assetId: string) => {
    toast.success('Asset assigned', {
      description: `${mockAssets.find(a => a.id === assetId)?.name} has been assigned to the maintenance team.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Equipment Health Overview</h1>
        <p className="text-gray-600">
          Real-time fleet health monitoring and risk assessment
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Fleet Health Score */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Fleet Health Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-gray-900">{fleetHealthScore}</span>
                <span className="text-sm text-gray-500">/ 100</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">-3.2%</span>
                <Badge variant="outline" className="ml-2 text-xs">92% conf.</Badge>
              </div>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        {/* Critical Alerts */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Active Critical Alerts</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-red-600">{criticalAlerts}</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">+2 today</span>
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        {/* High Risk Assets */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">High Risk Next 7 Days</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-orange-600">{highRiskAssets}</span>
                <span className="text-sm text-gray-500">assets</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-sm text-gray-600">Next 30d: {highRiskAssets + 1}</span>
              </div>
            </div>
            <AlertCircleIcon className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        {/* Predicted Downtime */}
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Predicted Downtime</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-gray-900">12.5</span>
                <span className="text-sm text-gray-500">hrs</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline" className="text-xs">85% conf.</Badge>
              </div>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        {/* MTBF / MTTR */}
        <Card className="p-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">MTBF / MTTR</p>
            <div className="space-y-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-gray-900">170</span>
                  <span className="text-xs text-gray-500">hrs</span>
                </div>
                <p className="text-xs text-gray-500">Mean Time Between Failures</p>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-gray-900">4.2</span>
                  <span className="text-xs text-gray-500">hrs</span>
                </div>
                <p className="text-xs text-gray-500">Mean Time To Repair</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Risks Table - Takes 2 columns */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-900 mb-1">Top Risk Assets</h2>
              <p className="text-sm text-gray-600">Assets requiring immediate attention</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'risk' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('risk')}
              >
                By Risk
              </Button>
              <Button
                variant={sortBy === 'rul' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('rul')}
              >
                By RUL
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Failure Mode</TableHead>
                  <TableHead>RUL</TableHead>
                  <TableHead>Next Action</TableHead>
                  <TableHead>Due By</TableHead>
                  <TableHead>Parts</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAssets.map((asset) => (
                  <TableRow key={asset.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <button
                        onClick={() => onNavigate('asset-detail', asset.id)}
                        className="text-left hover:underline"
                      >
                        <div className="font-medium text-gray-900">{asset.name}</div>
                        <div className="text-sm text-gray-500">{asset.tag}</div>
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{asset.healthScore}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(asset.confidence * 100)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          asset.healthStatus === 'critical'
                            ? 'destructive'
                            : asset.healthStatus === 'degrading'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {asset.healthStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[150px]">
                      <span className="text-sm text-gray-700 truncate block">
                        {asset.predictedFailureMode || '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-700">
                        {asset.rul.min}-{asset.rul.max} {asset.rul.unit}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[150px]">
                      <span className="text-sm text-gray-700 truncate block">
                        {asset.nextAction}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-700">{asset.dueBy || '—'}</span>
                    </TableCell>
                    <TableCell>
                      {asset.partsReady ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCreateWorkOrderAssetId(asset.id);
                          }}
                        >
                          WO
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcknowledge(asset.id);
                          }}
                        >
                          Ack
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssign(asset.id);
                          }}
                        >
                          Assign
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {sortedAssets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No assets require attention at this time.</p>
            </div>
          )}
        </Card>

        {/* Fleet Distribution and MTBF Trend - Takes 1 column */}
        <div className="space-y-6">
          {/* Fleet Distribution */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Fleet Health Distribution</h3>
            <div className="h-48" style={{ minHeight: '12rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {healthDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* MTBF Trend */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">MTBF Trend (7 days)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mtbfData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="mtbf"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => onNavigate('alerts')}
              >
                <span>View All Alerts</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => onNavigate('work-orders')}
              >
                <span>View Work Orders</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => onNavigate('reports')}
              >
                <span>Generate Report</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <CreateWorkOrderDialog
        open={createWorkOrderAssetId !== null}
        onOpenChange={(open) => !open && setCreateWorkOrderAssetId(null)}
        preSelectedAssetId={createWorkOrderAssetId || undefined}
      />
    </div>
  );
}