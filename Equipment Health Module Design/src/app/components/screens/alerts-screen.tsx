import { useState } from 'react';
import { AppFilters, NavigationPage } from '../../App';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { mockAlerts, mockAssets, type Alert, type AlertSeverity, type AlertStatus } from '../../data/mockData';
import { Filter, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDetailPanel } from '../panels/alert-detail-panel';

interface AlertsScreenProps {
  filters: AppFilters;
  selectedAlertId: string | null;
  onNavigate: (page: NavigationPage, assetId?: string, alertId?: string) => void;
}

export function AlertsScreen({ filters, selectedAlertId, onNavigate }: AlertsScreenProps) {
  const [detailAlertId, setDetailAlertId] = useState<string | null>(selectedAlertId);
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [detectionTypeFilter, setDetectionTypeFilter] = useState<string>('all');

  // Filter alerts
  const filteredAlerts = mockAlerts.filter((alert) => {
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesDetectionType =
      detectionTypeFilter === 'all' || alert.detectionType === detectionTypeFilter;

    return matchesSeverity && matchesStatus && matchesDetectionType;
  });

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
    }
  };

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case 'new':
        return 'text-red-600 bg-red-50';
      case 'acknowledged':
        return 'text-yellow-600 bg-yellow-50';
      case 'investigating':
        return 'text-blue-600 bg-blue-50';
      case 'converted':
        return 'text-purple-600 bg-purple-50';
      case 'closed':
        return 'text-green-600 bg-green-50';
    }
  };

  const handleAlertClick = (alertId: string) => {
    setDetailAlertId(alertId);
  };

  const handleCloseDetail = () => {
    setDetailAlertId(null);
  };

  // Count by status
  const statusCounts = {
    new: mockAlerts.filter((a) => a.status === 'new').length,
    acknowledged: mockAlerts.filter((a) => a.status === 'acknowledged').length,
    investigating: mockAlerts.filter((a) => a.status === 'investigating').length,
    converted: mockAlerts.filter((a) => a.status === 'converted').length,
    closed: mockAlerts.filter((a) => a.status === 'closed').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Alerts & Anomalies</h1>
        <p className="text-gray-600">
          Manage detection outputs and triage anomalies ({filteredAlerts.length} of{' '}
          {mockAlerts.length} alerts)
        </p>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">New</div>
          <div className="text-2xl font-semibold text-red-600 mt-1">{statusCounts.new}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Acknowledged</div>
          <div className="text-2xl font-semibold text-yellow-600 mt-1">
            {statusCounts.acknowledged}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Investigating</div>
          <div className="text-2xl font-semibold text-blue-600 mt-1">
            {statusCounts.investigating}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Converted</div>
          <div className="text-2xl font-semibold text-purple-600 mt-1">
            {statusCounts.converted}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Closed</div>
          <div className="text-2xl font-semibold text-green-600 mt-1">{statusCounts.closed}</div>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          {/* Severity Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Severity: {severityFilter === 'all' ? 'All' : severityFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSeverityFilter('all')}>
                All Severities
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSeverityFilter('critical')}>
                Critical
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeverityFilter('high')}>High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeverityFilter('medium')}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSeverityFilter('low')}>Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('new')}>New</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('acknowledged')}>
                Acknowledged
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('investigating')}>
                Investigating
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('converted')}>
                Converted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('closed')}>Closed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Detection Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Type: {detectionTypeFilter === 'all' ? 'All' : detectionTypeFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDetectionTypeFilter('all')}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDetectionTypeFilter('rule')}>
                Rule
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDetectionTypeFilter('anomaly')}>
                Anomaly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDetectionTypeFilter('threshold')}>
                Threshold
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDetectionTypeFilter('model')}>
                Model
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Alerts Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Detection Type</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>First Seen</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow
                  key={alert.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleAlertClick(alert.id)}
                >
                  <TableCell>
                    <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{alert.assetName}</div>
                      <div className="text-sm text-gray-500">
                        {mockAssets.find((a) => a.id === alert.assetId)?.tag}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{alert.detectionType}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">{alert.signal}</TableCell>
                  <TableCell className="max-w-md">
                    <span className="text-sm text-gray-600 line-clamp-2">
                      {alert.description}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.firstSeen).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.lastSeen).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {alert.assignee ? (
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <User className="w-3 h-3" />
                        {alert.assignee}
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(alert.confidence * 100)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No alerts found matching your criteria.</p>
            <Button
              variant="link"
              onClick={() => {
                setSeverityFilter('all');
                setStatusFilter('all');
                setDetectionTypeFilter('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </Card>

      {/* Alert Detail Panel */}
      <Sheet open={detailAlertId !== null} onOpenChange={(open) => !open && handleCloseDetail()}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          {detailAlertId && (
            <AlertDetailPanel
              alert={mockAlerts.find((a) => a.id === detailAlertId)!}
              onClose={handleCloseDetail}
              onNavigateToAsset={(assetId) => {
                handleCloseDetail();
                onNavigate('asset-detail', assetId);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
