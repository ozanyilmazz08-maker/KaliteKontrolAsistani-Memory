import { GlobalContext } from '../../App';
import { ReportTemplateList } from '../reports/ReportTemplateList';
import { ReportPreview } from '../reports/ReportPreview';
import { ApprovalWorkflow } from '../reports/ApprovalWorkflow';

interface ReportsApprovalProps {
  globalContext: GlobalContext;
}

export function ReportsApproval({ globalContext }: ReportsApprovalProps) {
  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Left: Templates & Instances */}
      <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
        <ReportTemplateList />
      </div>

      {/* Center: Report Preview */}
      <div className="flex-1 overflow-y-auto p-6">
        <ReportPreview />
      </div>

      {/* Right: Approval Workflow */}
      <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
        <ApprovalWorkflow />
      </div>
    </div>
  );
}
