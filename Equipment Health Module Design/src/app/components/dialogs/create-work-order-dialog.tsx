import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { mockAssets } from '../../data/mockData';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreateWorkOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedAssetId?: string;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function CreateWorkOrderDialog({
  open,
  onOpenChange,
  preSelectedAssetId
}: CreateWorkOrderDialogProps) {
  const [formData, setFormData] = useState({
    assetId: preSelectedAssetId || '',
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.assetId) {
      newErrors.assetId = 'Please select an asset';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitState('loading');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate 90% success rate
    if (Math.random() > 0.1) {
      setSubmitState('success');
      toast.success('Work order created successfully', {
        description: `Work order for ${
          mockAssets.find((a) => a.id === formData.assetId)?.name
        } has been created.`
      });

      // Reset form after short delay
      setTimeout(() => {
        setFormData({
          assetId: preSelectedAssetId || '',
          title: '',
          description: '',
          priority: 'medium',
          dueDate: ''
        });
        setErrors({});
        setSubmitState('idle');
        onOpenChange(false);
      }, 1000);
    } else {
      setSubmitState('error');
      toast.error('Failed to create work order', {
        description: 'Unable to connect to CMMS. Please try again.',
        action: {
          label: 'Retry',
          onClick: () => handleSubmit(e)
        }
      });

      // Reset to idle after showing error
      setTimeout(() => {
        setSubmitState('idle');
      }, 2000);
    }
  };

  const handleCancel = () => {
    setFormData({
      assetId: preSelectedAssetId || '',
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
    setErrors({});
    setSubmitState('idle');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Work Order</DialogTitle>
          <DialogDescription>
            Create a new maintenance work order. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Asset Selection */}
            <div className="space-y-2">
              <Label htmlFor="asset">
                Asset <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.assetId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, assetId: value }))
                }
                disabled={submitState === 'loading'}
              >
                <SelectTrigger id="asset" className={errors.assetId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {mockAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name} ({asset.tag})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assetId && (
                <p className="text-sm text-red-500">{errors.assetId}</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., Replace bearing assembly"
                disabled={submitState === 'loading'}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Detailed description of the work to be performed..."
                rows={3}
                disabled={submitState === 'loading'}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
                disabled={submitState === 'loading'}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Due Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                disabled={submitState === 'loading'}
                className={errors.dueDate ? 'border-red-500' : ''}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-500">{errors.dueDate}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={submitState === 'loading'}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitState === 'loading'}>
              {submitState === 'loading' && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {submitState === 'loading' ? 'Creating...' : 'Create Work Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
