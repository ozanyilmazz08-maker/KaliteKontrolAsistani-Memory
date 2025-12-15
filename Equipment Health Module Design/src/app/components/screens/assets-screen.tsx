import { useState } from 'react';
import { AppFilters, NavigationPage } from '../../App';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '../ui/dropdown-menu';
import { mockAssets, type HealthStatus } from '../../data/mockData';
import { Search, Filter, Download, Settings, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AssetsScreenProps {
  filters: AppFilters;
  onNavigate: (page: NavigationPage, assetId?: string) => void;
}

export function AssetsScreen({ filters, onNavigate }: AssetsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<HealthStatus | 'all'>('all');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    tag: true,
    type: true,
    location: true,
    criticality: true,
    health: true,
    dataQuality: true,
    lastUpdate: true,
    actions: true
  });

  // Filter assets
  const filteredAssets = mockAssets.filter((asset) => {
    const matchesSearch =
      searchQuery === '' ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || asset.healthStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map((a) => a.id));
    }
  };

  const handleBulkExport = () => {
    toast.success('Export started', {
      description: `Exporting ${selectedAssets.length} asset(s) to CSV...`
    });
    setTimeout(() => {
      toast.success('Export complete', {
        description: 'Your asset list has been exported successfully.'
      });
    }, 2000);
  };

  const handleBulkEnableMonitoring = () => {
    toast.success('Monitoring enabled', {
      description: `Enabled monitoring for ${selectedAssets.length} asset(s).`
    });
    setSelectedAssets([]);
  };

  const handleAddAsset = () => {
    toast.info('Add Asset', {
      description: 'Asset creation dialog would open here. This feature connects to your EAM system.'
    });
  };

  const handleEditAsset = (assetId: string, assetName: string) => {
    toast.info('Edit Asset', {
      description: `Editing ${assetName}. This would open the asset editor.`
    });
  };

  const handleViewHistory = (assetId: string, assetName: string) => {
    toast.info('Asset History', {
      description: `Loading maintenance history for ${assetName}...`
    });
  };

  const handleExportAssetData = (assetId: string, assetName: string) => {
    toast.success('Export started', {
      description: `Exporting data for ${assetName} to CSV...`
    });
    setTimeout(() => {
      toast.success('Export complete', {
        description: 'Asset data has been exported successfully.'
      });
    }, 1500);
  };

  const getHealthColor = (status: HealthStatus) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50';
      case 'watch':
        return 'text-yellow-600 bg-yellow-50';
      case 'degrading':
        return 'text-orange-600 bg-orange-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'data-missing':
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-1">Assets</h1>
          <p className="text-gray-600">
            Manage and monitor your equipment fleet ({filteredAssets.length} of {mockAssets.length}{' '}
            assets)
          </p>
        </div>
        <Button onClick={handleAddAsset}>Add Asset</Button>
      </div>

      {/* Search and Filters Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, tag, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('healthy')}>
                Healthy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('watch')}>Watch</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('degrading')}>
                Degrading
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('critical')}>
                Critical
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('data-missing')}>
                Data Missing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Column Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={visibleColumns.tag}
                onCheckedChange={(checked) =>
                  setVisibleColumns((prev) => ({ ...prev, tag: checked }))
                }
              >
                Tag
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.type}
                onCheckedChange={(checked) =>
                  setVisibleColumns((prev) => ({ ...prev, type: checked }))
                }
              >
                Type
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.location}
                onCheckedChange={(checked) =>
                  setVisibleColumns((prev) => ({ ...prev, location: checked }))
                }
              >
                Location
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.criticality}
                onCheckedChange={(checked) =>
                  setVisibleColumns((prev) => ({ ...prev, criticality: checked }))
                }
              >
                Criticality
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.health}
                onCheckedChange={(checked) =>
                  setVisibleColumns((prev) => ({ ...prev, health: checked }))
                }
              >
                Health
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.dataQuality}
                onCheckedChange={(checked) =>
                  setVisibleColumns((prev) => ({ ...prev, dataQuality: checked }))
                }
              >
                Data Quality
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleColumns.lastUpdate}
                onCheckedChange={(checked) =>
                  setVisibleColumns((prev) => ({ ...prev, lastUpdate: checked }))
                }
              >
                Last Update
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Bulk Actions Toolbar */}
      {selectedAssets.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedAssets.length} asset(s) selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleBulkExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkEnableMonitoring}>
                Enable Monitoring
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAssets([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Assets Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedAssets.length === filteredAssets.length &&
                      filteredAssets.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </TableHead>
                <TableHead>Asset Name</TableHead>
                {visibleColumns.tag && <TableHead>Tag</TableHead>}
                {visibleColumns.type && <TableHead>Type</TableHead>}
                {visibleColumns.location && <TableHead>Location</TableHead>}
                {visibleColumns.criticality && <TableHead>Criticality</TableHead>}
                {visibleColumns.health && <TableHead>Health Score</TableHead>}
                {visibleColumns.dataQuality && <TableHead>Data Quality</TableHead>}
                {visibleColumns.lastUpdate && <TableHead>Last Update</TableHead>}
                {visibleColumns.actions && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow
                  key={asset.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onNavigate('asset-detail', asset.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset.id)}
                      onChange={() => handleSelectAsset(asset.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{asset.name}</div>
                      <div
                        className={`text-sm inline-flex items-center gap-1 px-2 py-0.5 rounded ${getHealthColor(
                          asset.healthStatus
                        )}`}
                      >
                        {asset.healthStatus === 'healthy' && <CheckCircle className="w-3 h-3" />}
                        {asset.healthStatus === 'critical' && <XCircle className="w-3 h-3" />}
                        {asset.healthStatus}
                      </div>
                    </div>
                  </TableCell>
                  {visibleColumns.tag && (
                    <TableCell className="text-gray-600">{asset.tag}</TableCell>
                  )}
                  {visibleColumns.type && (
                    <TableCell className="text-gray-600">{asset.type}</TableCell>
                  )}
                  {visibleColumns.location && (
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-gray-900">{asset.location.plant}</div>
                        <div className="text-gray-500">{asset.location.area}</div>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.criticality && (
                    <TableCell>
                      <Badge variant={getCriticalityColor(asset.criticality) as any}>
                        {asset.criticality}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.health && (
                    <TableCell>
                      {asset.healthStatus !== 'data-missing' ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{asset.healthScore}</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(asset.confidence * 100)}%
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.dataQuality && (
                    <TableCell>
                      {asset.dataQuality > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600"
                              style={{ width: `${asset.dataQuality}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{asset.dataQuality}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.lastUpdate && (
                    <TableCell className="text-sm text-gray-600">
                      {new Date(asset.lastUpdate).toLocaleString()}
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onNavigate('asset-detail', asset.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditAsset(asset.id, asset.name)}>
                            Edit Asset
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewHistory(asset.id, asset.name)}>
                            View History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleExportAssetData(asset.id, asset.name)}>
                            Export Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No assets found matching your criteria.</p>
            <Button variant="link" onClick={() => setSearchQuery('')}>
              Clear filters
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}