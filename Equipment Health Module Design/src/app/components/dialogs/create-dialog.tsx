import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ClipboardList, FileText, StickyNote, AlertCircle } from 'lucide-react';
import { CreateWorkOrderDialog } from './create-work-order-dialog';

interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDialog({ open, onOpenChange }: CreateDialogProps) {
  const [showWorkOrderDialog, setShowWorkOrderDialog] = useState(false);

  const options = [
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: 'Work Order',
      description: 'Create a maintenance work order',
      action: () => {
        onOpenChange(false);
        setShowWorkOrderDialog(true);
      }
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Inspection',
      description: 'Schedule an equipment inspection',
      action: () => {
        onOpenChange(false);
        // Would open inspection dialog
      }
    },
    {
      icon: <StickyNote className="w-6 h-6" />,
      title: 'Note',
      description: 'Add a note or observation',
      action: () => {
        onOpenChange(false);
        // Would open note dialog
      }
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: 'Manual Alert',
      description: 'Create a manual alert or finding',
      action: () => {
        onOpenChange(false);
        // Would open manual alert dialog
      }
    }
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New</DialogTitle>
            <DialogDescription>
              Select what you'd like to create
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
              >
                <div className="text-blue-600">{option.icon}</div>
                <div className="font-medium text-gray-900">{option.title}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <CreateWorkOrderDialog
        open={showWorkOrderDialog}
        onOpenChange={setShowWorkOrderDialog}
      />
    </>
  );
}
