import { useState } from 'react';
import { Send, CheckCircle, XCircle, AlertCircle, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ApprovalStep {
  id: number;
  role: string;
  assignee: string;
  status: string;
  timestamp: string | null;
  comments: string | null;
  signature: boolean;
}

const approvalSteps: ApprovalStep[] = [
  {
    id: 1,
    role: 'Internal Quality Approval',
    assignee: 'J. Chen - Quality Manager',
    status: 'Approved',
    timestamp: '2024-12-08 10:30 AM',
    comments: 'All critical characteristics verified. Measurement records complete.',
    signature: true
  },
  {
    id: 2,
    role: 'Manufacturing Engineering Approval',
    assignee: 'T. Patel - Manufacturing Engineer',
    status: 'Approved',
    timestamp: '2024-12-08 11:45 AM',
    comments: 'Process validated. Control plan updated.',
    signature: true
  },
  {
    id: 3,
    role: 'Supplier Quality (if applicable)',
    assignee: '—',
    status: 'N/A',
    timestamp: null,
    comments: 'Not applicable for internal production',
    signature: false
  },
  {
    id: 4,
    role: 'Customer Representative Approval',
    assignee: 'R. Williams - OEM-X Quality',
    status: 'Pending',
    timestamp: null,
    comments: null,
    signature: false
  }
];

export function ApprovalWorkflow() {
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Pending': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'N/A': return <div className="w-5 h-5 text-gray-400">—</div>;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleInternalReview = () => {
    console.log('Sending for internal review');
    toast.success('FAI paketi iç inceleme için gönderildi!');
  };

  const handleCustomerSubmit = () => {
    console.log('Submitting to customer');
    toast.success('FAI paketi müşteri onayı için gönderildi!');
  };

  const handleApprove = () => {
    setShowSignatureModal(true);
    setTimeout(() => {
      setShowSignatureModal(false);
      toast.success('FAI başarıyla onaylandı!');
    }, 1500);
  };

  const handleReject = () => {
    const reason = prompt('Lütfen red nedeni girin:');
    if (reason) {
      console.log('Rejected with reason:', reason);
      toast.error('FAI reddedildi. Kalite ekibine bildirim gönderildi.');
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-gray-900 mb-6">Approval Workflow</h3>

      {/* Approval Steps */}
      <div className="space-y-4 mb-6">
        {approvalSteps.map((step, index) => (
          <div key={step.id} className="relative">
            <div className={`border rounded-lg p-4 ${
              step.status === 'Approved' ? 'bg-green-50 border-green-200' :
              step.status === 'Rejected' ? 'bg-red-50 border-red-200' :
              step.status === 'Pending' ? 'bg-yellow-50 border-yellow-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(step.status)}
                  <div>
                    <div className="text-sm text-gray-900">{step.role}</div>
                    <div className="text-xs text-gray-600">{step.assignee}</div>
                  </div>
                </div>
                {step.signature && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <User className="w-3 h-3" />
                    Signed
                  </div>
                )}
              </div>

              {/* Timestamp */}
              {step.timestamp && (
                <div className="text-xs text-gray-600 mb-2">{step.timestamp}</div>
              )}

              {/* Comments */}
              {step.comments && (
                <div className="text-xs text-gray-700 bg-white rounded p-2 border border-gray-200">
                  {step.comments}
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < approvalSteps.length - 1 && (
              <div className="ml-2.5 h-4 w-0.5 bg-gray-300 my-1"></div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button 
          onClick={handleInternalReview}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send for Internal Review
        </button>
        <button 
          onClick={handleCustomerSubmit}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Submit to Customer
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handleApprove}
            className="flex-1 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 text-sm"
          >
            Approve
          </button>
          <button 
            onClick={handleReject}
            className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 text-sm"
          >
            Reject
          </button>
        </div>
      </div>

      {/* Digital Signature Notice */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <User className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-900">
            <div className="mb-1">Digital Signature Required</div>
            <div className="text-blue-700">
              Approvals require digital signature for 21 CFR Part 11 compliance. Your credentials will be recorded.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}