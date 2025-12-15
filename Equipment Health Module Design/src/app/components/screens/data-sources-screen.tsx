import { Card } from '../ui/card';
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
import { mockDataSources } from '../../data/mockData';
import { Database, Activity, AlertCircle, CheckCircle, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

export function DataSourcesScreen() {
  const connectedSources = mockDataSources.filter((ds) => ds.status === 'connected').length;
  const totalSensors = mockDataSources.reduce((sum, ds) => sum + ds.sensorsCount, 0);

  const handleRetry = (sourceId: string) => {
    const source = mockDataSources.find((ds) => ds.id === sourceId);
    toast.success('Reconnecting...', {
      description: `Attempting to reconnect to ${source?.name}`
    });
  };

  const handleConfigure = (sourceId: string) => {
    const source = mockDataSources.find((ds) => ds.id === sourceId);
    toast.info('Configure Data Source', {
      description: `Opening configuration dialog for ${source?.name}...`
    });
  };

  const handleAddDataSource = () => {
    toast.info('Add Data Source', {
      description: 'Data source configuration wizard would open here.'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-gray-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="secondary">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline">Disconnected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1">Data Sources & Sensors</h1>
        <p className="text-gray-600">Manage data acquisition and sensor connectivity</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Data Sources</div>
              <div className="text-2xl font-semibold text-gray-900">{mockDataSources.length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Connected</div>
              <div className="text-2xl font-semibold text-green-600">{connectedSources}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-sm text-gray-600">Total Sensors</div>
              <div className="text-2xl font-semibold text-gray-900">{totalSensors}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-sm text-gray-600">Issues</div>
              <div className="text-2xl font-semibold text-red-600">
                {mockDataSources.filter((ds) => ds.status === 'error').length}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Sources Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data Source</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sensors</TableHead>
                <TableHead>Data Rate</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDataSources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(source.status)}
                      <span className="font-medium text-gray-900">{source.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{source.type}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(source.status)}</TableCell>
                  <TableCell className="text-gray-900">{source.sensorsCount}</TableCell>
                  <TableCell className="text-gray-600">{source.dataRate}</TableCell>
                  <TableCell className="text-gray-600">
                    {source.latency ? `${source.latency}ms` : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(source.lastSeen).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    {source.status === 'error' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRetry(source.id)}
                      >
                        Retry
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handleConfigure(source.id)}>
                        Configure
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Data Source */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-2">Add New Data Source</h3>
        <p className="text-sm text-gray-600 mb-4">
          Connect additional data sources to expand your monitoring capabilities.
        </p>
        <Button onClick={handleAddDataSource}>Add Data Source</Button>
      </Card>
    </div>
  );
}