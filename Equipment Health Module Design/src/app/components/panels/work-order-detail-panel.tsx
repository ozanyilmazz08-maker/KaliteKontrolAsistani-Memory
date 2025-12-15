import { useState } from 'react';
import { WorkOrder, mockWorkOrders } from '../../data/mockData';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Separator } from '../ui/separator';
import { Clock, User, AlertCircle, CheckCircle, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface WorkOrderDetailPanelProps {
  workOrderId: string;
  onClose: () => void;
  onNavigateToAsset?: (assetId: string) => void;
  onUpdate?: () => void;
}

export function WorkOrderDetailPanel({ workOrderId, onClose, onNavigateToAsset, onUpdate }: WorkOrderDetailPanelProps) {
  const [workOrder, setWorkOrder] = useState(() => mockWorkOrders.find(wo => wo.id === workOrderId));
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [assigneeName, setAssigneeName] = useState('');
  const [noteText, setNoteText] = useState('');

  if (!workOrder) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Work order not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
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
      default:
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

  const handleUpdateStatus = (newStatus: string) => {
    setWorkOrder(prev => ({ ...prev, status: newStatus as any }));
    toast.success('Status updated', {
      description: `Work order ${workOrder.id} status changed to ${newStatus}.`
    });
    onUpdate?.();
  };

  const handleAssignTechnician = () => {
    setShowAssignDialog(true);
  };

  const handleAddNote = () => {
    setShowNoteDialog(true);
  };

  const handleAssignSubmit = () => {
    if (assigneeName) {
      setWorkOrder(prev => ({ ...prev, assignee: assigneeName }));
      toast.success('Technician assigned', {
        description: `Work order ${workOrder.id} assigned to ${assigneeName}.`
      });
      setShowAssignDialog(false);
    } else {
      toast.error('Assignee name is required');
    }
  };

  const handleNoteSubmit = () => {
    if (noteText) {
      setWorkOrder(prev => ({ ...prev, notes: [...(prev.notes || []), noteText] }));
      toast.success('Note added', {
        description: `Note added to work order ${workOrder.id}.`
      });
      setShowNoteDialog(false);
    } else {
      toast.error('Note text is required');
    }
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>Work Order: {workOrder.id}</SheetTitle>
        <SheetDescription>
          View and manage work order details
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6 py-6">
        {/* Status & Priority */}
        <div className="flex items-center gap-3">
          <Badge variant={getStatusColor(workOrder.status) as any} className="text-sm">
            {workOrder.status}
          </Badge>
          <Badge variant={getPriorityColor(workOrder.priority) as any} className="text-sm">
            {workOrder.priority} priority
          </Badge>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">{workOrder.title}</h3>
          <p className="text-sm text-gray-600">{workOrder.description}</p>
        </div>

        <Separator />

        {/* Asset Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Asset Information</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Asset:</span>
              <button
                onClick={() => onNavigateToAsset && onNavigateToAsset(workOrder.assetId)}
                className="text-blue-600 hover:underline font-medium"
              >
                {workOrder.assetName}
              </button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Dates & Timeline */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Timeline</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Created:
              </span>
              <span className="text-gray-900">
                {new Date(workOrder.createdDate).toLocaleString()}
              </span>
            </div>
            {workOrder.dueDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Due Date:
                </span>
                <span className="text-gray-900">
                  {new Date(workOrder.dueDate).toLocaleString()}
                </span>
              </div>
            )}
            {workOrder.completedDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed:
                </span>
                <span className="text-gray-900">
                  {new Date(workOrder.completedDate).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Assignment */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Assignment</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <User className="w-3 h-3" />
                Assignee:
              </span>
              <span className="text-gray-900">
                {workOrder.assignee || 'Unassigned'}
              </span>
            </div>
            {workOrder.technician && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Technician:</span>
                <span className="text-gray-900">{workOrder.technician}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Duration */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Duration</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Estimated:</span>
              <span className="text-gray-900">{workOrder.estimatedDuration}h</span>
            </div>
            {workOrder.actualDuration && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Actual:</span>
                <span className="text-gray-900">{workOrder.actualDuration}h</span>
              </div>
            )}
          </div>
        </div>

        {/* Root Cause (if completed) */}
        {workOrder.rootCause && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Root Cause</h4>
              <p className="text-sm text-gray-600">{workOrder.rootCause}</p>
            </div>
          </>
        )}

        {/* Alert ID (if linked) */}
        {workOrder.alertId && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Linked Alert</h4>
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-gray-700">Alert ID: {workOrder.alertId}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="border-t pt-4 space-y-2">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Actions</h4>
        
        {workOrder.status === 'pending' && (
          <Button
            className="w-full"
            onClick={() => handleUpdateStatus('approved')}
          >
            Approve Work Order
          </Button>
        )}
        
        {workOrder.status === 'approved' && (
          <Button
            className="w-full"
            onClick={() => handleUpdateStatus('in-progress')}
          >
            Start Work
          </Button>
        )}
        
        {workOrder.status === 'in-progress' && (
          <Button
            className="w-full"
            onClick={() => handleUpdateStatus('completed')}
          >
            Mark as Completed
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleAssignTechnician}
        >
          {workOrder.assignee ? 'Reassign' : 'Assign Technician'}
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleAddNote}
        >
          <FileText className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>

      {/* Assign Technician Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>
              Assign a technician to this work order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="assigneeName">Technician Name</Label>
            <Input
              id="assigneeName"
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
              placeholder="Enter technician name"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAssignDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAssignSubmit}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a note to this work order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="noteText">Note</Label>
            <Textarea
              id="noteText"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter note"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNoteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleNoteSubmit}
            >
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}