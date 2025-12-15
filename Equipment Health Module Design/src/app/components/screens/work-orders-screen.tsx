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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
} from '../ui/sheet';
import { mockWorkOrders, type WorkOrderStatus } from '../../data/mockData';
import { Filter, Clock, User } from 'lucide-react';
import { WorkOrderDetailPanel } from '../panels/work-order-detail-panel';

interface WorkOrdersScreenProps {
  filters: AppFilters;
  onNavigate: (page: NavigationPage, assetId?: string) => void;
}

export function WorkOrdersScreen({ filters, onNavigate }: WorkOrdersScreenProps) {
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'all'>('all');
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);

  const filteredWorkOrders = mockWorkOrders.filter((wo) => {
    return statusFilter === 'all' || wo.status === statusFilter;
  });

  const getStatusColor = (status: WorkOrderStatus) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'in-progress':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
      <div>
        <h1 className="text-gray-900 mb-1">Work Orders</h1>
        <p className="text-gray-600">
          Manage maintenance work orders ({filteredWorkOrders.length} of {mockWorkOrders.length})
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            {mockWorkOrders.filter((wo) => wo.status === 'pending').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Approved</div>
          <div className="text-2xl font-semibold text-blue-600 mt-1">
            {mockWorkOrders.filter((wo) => wo.status === 'approved').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">In Progress</div>
          <div className="text-2xl font-semibold text-yellow-600 mt-1">
            {mockWorkOrders.filter((wo) => wo.status === 'in-progress').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-semibold text-green-600 mt-1">
            {mockWorkOrders.filter((wo) => wo.status === 'completed').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Cancelled</div>
          <div className="text-2xl font-semibold text-gray-500 mt-1">
            {mockWorkOrders.filter((wo) => wo.status === 'cancelled').length}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
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
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('in-progress')}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Work Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>WO ID</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkOrders.map((wo) => (
                <TableRow 
                  key={wo.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedWorkOrderId(wo.id)}
                >
                  <TableCell className="font-medium">{wo.id}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onNavigate('asset-detail', wo.assetId)}
                      className="text-blue-600 hover:underline"
                    >
                      {wo.assetName}
                    </button>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div>
                      <div className="font-medium text-gray-900">{wo.title}</div>
                      <div className="text-sm text-gray-500 truncate">{wo.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(wo.priority) as any}>{wo.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(wo.status) as any}>{wo.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(wo.createdDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {wo.dueDate ? new Date(wo.dueDate).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    {wo.assignee ? (
                      <div className="flex items-center gap-1 text-sm">
                        <User className="w-3 h-3" />
                        {wo.assignee}
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {wo.actualDuration
                      ? `${wo.actualDuration}h`
                      : `~${wo.estimatedDuration}h`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredWorkOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No work orders found matching your criteria.</p>
          </div>
        )}
      </Card>

      {/* Work Order Detail Panel */}
      {selectedWorkOrderId && (
        <Sheet open={!!selectedWorkOrderId} onOpenChange={(open) => !open && setSelectedWorkOrderId(null)}>
          <SheetContent className="sm:max-w-2xl overflow-y-auto">
            <WorkOrderDetailPanel
              workOrderId={selectedWorkOrderId}
              onClose={() => setSelectedWorkOrderId(null)}
              onNavigateToAsset={(assetId) => {
                setSelectedWorkOrderId(null);
                onNavigate('asset-detail', assetId);
              }}
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}