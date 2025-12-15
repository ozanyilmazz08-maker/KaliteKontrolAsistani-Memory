import { useState, useEffect } from 'react';
import { Alert, mockAssets, generateMockTimeSeriesData } from '../../data/mockData';
import { SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import {
  AlertTriangle,
  CheckCircle,
  User,
  Clock,
  MessageSquare,
  ExternalLink,
  Loader2,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { CreateWorkOrderDialog } from '../dialogs/create-work-order-dialog';

interface AlertDetailPanelProps {
  alert: Alert;
  onClose: () => void;
  onNavigateToAsset: (assetId: string) => void;
}

type ActionState = 'idle' | 'loading' | 'success';

export function AlertDetailPanel({ alert, onClose, onNavigateToAsset }: AlertDetailPanelProps) {
  const [comment, setComment] = useState('');
  const [selectedFailureModes, setSelectedFailureModes] = useState<string[]>(
    alert.suspectedFailureModes || []
  );
  const [acknowledgeState, setAcknowledgeState] = useState<ActionState>('idle');
  const [assignState, setAssignState] = useState<ActionState>('idle');
  const [closeState, setCloseState] = useState<ActionState>('idle');
  const [showWorkOrderDialog, setShowWorkOrderDialog] = useState(false);
  const [assignee, setAssignee] = useState(alert.assignee || '');
  const [closeCode, setCloseCode] = useState('');

  const asset = mockAssets.find((a) => a.id === alert.assetId);
  const timeSeriesData = generateMockTimeSeriesData(7);

  const handleAcknowledge = async () => {
    if (!comment.trim()) {
      toast.error('Comment required', {
        description: 'Please add a comment when acknowledging an alert.'
      });
      return;
    }

    setAcknowledgeState('loading');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAcknowledgeState('success');
    toast.success('Alert acknowledged', {
      description: 'The alert has been acknowledged and assigned to you.'
    });
    setTimeout(() => {
      setAcknowledgeState('idle');
    }, 1500);
  };

  const handleAssign = async () => {
    if (!assignee) {
      toast.error('Assignee required', {
        description: 'Please select an assignee.'
      });
      return;
    }

    setAssignState('loading');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAssignState('success');
    toast.success('Alert assigned', {
      description: `Alert assigned to ${assignee}.`
    });
    setTimeout(() => {
      setAssignState('idle');
    }, 1500);
  };

  const handleClose = async () => {
    if (!closeCode) {
      toast.error('Closure code required', {
        description: 'Please select a closure code and provide a reason.'
      });
      return;
    }

    if (!comment.trim()) {
      toast.error('Reason required', {
        description: 'Please provide a reason for closing this alert.'
      });
      return;
    }

    setCloseState('loading');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCloseState('success');
    toast.success('Alert closed', {
      description: 'The alert has been closed successfully.'
    });
    setTimeout(() => {
      setCloseState('idle');
      onClose();
    }, 1500);
  };

  const handleSnooze = () => {
    toast.success('Alert snoozed', {
      description: 'Alert has been snoozed for 24 hours.'
    });
  };

  const handleMarkFalsePositive = () => {
    toast.success('Feedback submitted', {
      description: 'This alert has been marked as a false positive. Feedback sent to model for retraining.'
    });
  };

  const toggleFailureMode = (mode: string) => {
    setSelectedFailureModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <AlertTriangle
            className={`w-5 h-5 ${
              alert.severity === 'critical'
                ? 'text-red-600'
                : alert.severity === 'high'
                ? 'text-orange-600'
                : 'text-yellow-600'
            }`}
          />
          Alert Detail
        </SheetTitle>
        <SheetDescription>Alert ID: {alert.id}</SheetDescription>
      </SheetHeader>

      <div className="space-y-6 mt-6">
        {/* Summary Section */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Summary</h3>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Severity</span>
              <Badge
                variant={
                  alert.severity === 'critical'
                    ? 'destructive'
                    : alert.severity === 'high'
                    ? 'default'
                    : 'secondary'
                }
              >
                {alert.severity}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Asset</span>
              <Button
                variant="link"
                className="h-auto p-0"
                onClick={() => onNavigateToAsset(alert.assetId)}
              >
                {alert.assetName} <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Detection Type</span>
              <Badge variant="outline">{alert.detectionType}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Signal</span>
              <span className="text-sm font-medium text-gray-900">{alert.signal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Confidence</span>
              <Badge variant="outline">{Math.round(alert.confidence * 100)}%</Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{alert.description}</p>
        </div>

        {/* Timing */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Timing</h3>
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">First Seen:</span>
              <span className="text-gray-900 font-medium">
                {new Date(alert.firstSeen).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Last Seen:</span>
              <span className="text-gray-900 font-medium">
                {new Date(alert.lastSeen).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Evidence - Signal Trend */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Evidence - Signal Trend (7 days)</h3>
          <div className="bg-gray-50 p-4 rounded-lg" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <RechartsTooltip
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: any) => [value.toFixed(2), alert.signal]}
                />
                <Line
                  type="monotone"
                  dataKey="vibrationRMS"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Showing {alert.signal} trend over the last 7 days. Red line indicates threshold exceeded.
          </p>
        </div>

        {/* Suspected Failure Modes */}
        {alert.suspectedFailureModes && alert.suspectedFailureModes.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">
              Suspected Failure Modes
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Select all that apply)
              </span>
            </h3>
            <div className="space-y-2">
              {alert.suspectedFailureModes.map((mode) => (
                <div key={mode} className="flex items-center gap-2">
                  <Checkbox
                    id={mode}
                    checked={selectedFailureModes.includes(mode)}
                    onCheckedChange={() => toggleFailureMode(mode)}
                  />
                  <Label htmlFor={mode} className="text-sm cursor-pointer">
                    {mode}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Recommended Actions</h3>
          <div className="space-y-2">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Inspect bearing assembly</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Priority: High | Est. Duration: 1 hour | Required skills: Vibration analysis
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Schedule bearing replacement if wear confirmed
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Priority: Critical | Est. Duration: 4 hours | Required parts: BRG-6308-2RS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions Section */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Actions</h3>

          {/* Acknowledge */}
          {alert.status === 'new' && (
            <div className="space-y-3 mb-4">
              <Label>Acknowledge Alert</Label>
              <Textarea
                placeholder="Add a comment (required)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
              />
              <Button
                onClick={handleAcknowledge}
                disabled={acknowledgeState === 'loading'}
                className="w-full"
              >
                {acknowledgeState === 'loading' && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {acknowledgeState === 'loading' ? 'Acknowledging...' : 'Acknowledge'}
              </Button>
            </div>
          )}

          {/* Assign */}
          <div className="space-y-3 mb-4">
            <Label>Assign Alert</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="John Smith">John Smith</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                <SelectItem value="Tom Brown">Tom Brown</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleAssign}
              disabled={assignState === 'loading'}
              variant="outline"
              className="w-full"
            >
              {assignState === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {assignState === 'loading' ? 'Assigning...' : 'Assign'}
            </Button>
          </div>

          {/* Convert to Work Order */}
          <Button
            onClick={() => setShowWorkOrderDialog(true)}
            variant="default"
            className="w-full mb-3"
          >
            Convert to Work Order
          </Button>

          {/* Close */}
          <div className="space-y-3 mb-4">
            <Label>Close Alert</Label>
            <Select value={closeCode} onValueChange={setCloseCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select closure code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="unfounded">Unfounded</SelectItem>
                <SelectItem value="duplicate">Duplicate</SelectItem>
                <SelectItem value="false-positive">False Positive</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Reason for closing (required)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
            />
            <Button
              onClick={handleClose}
              disabled={closeState === 'loading'}
              variant="outline"
              className="w-full"
            >
              {closeState === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {closeState === 'loading' ? 'Closing...' : 'Close Alert'}
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={handleSnooze}>
              Snooze 24h
            </Button>
            <Button variant="outline" size="sm" onClick={handleMarkFalsePositive}>
              False Positive
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Comments & Collaboration</h3>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">System</span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.firstSeen).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">Alert created by anomaly detection model.</p>
                </div>
              </div>
            </div>
            <Textarea placeholder="Add a comment or @mention a colleague..." rows={2} />
            <Button size="sm" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </div>
      </div>

      <CreateWorkOrderDialog
        open={showWorkOrderDialog}
        onOpenChange={setShowWorkOrderDialog}
        preSelectedAssetId={alert.assetId}
      />
    </>
  );
}