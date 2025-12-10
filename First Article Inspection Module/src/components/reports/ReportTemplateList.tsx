import { useState } from 'react';
import { FileText, Plus, Download, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const templates = [
  { id: 'as9102', name: 'AS9102 Form 1/2/3', standard: 'Aerospace' },
  { id: 'ppap', name: 'PPAP FAI Report', standard: 'Automotive' },
  { id: 'iso13485', name: 'ISO 13485 FAI', standard: 'Medical' },
  { id: 'custom-a', name: 'Customer A Template', standard: 'Custom' }
];

const instances = [
  { id: 'inst-1', template: 'AS9102 Form 1/2/3', status: 'Draft', date: '2024-12-08', version: '1.0' },
  { id: 'inst-2', template: 'AS9102 Form 1/2/3', status: 'Under Review', date: '2024-12-07', version: '1.1' },
  { id: 'inst-3', template: 'PPAP FAI Report', status: 'Approved', date: '2024-11-28', version: '2.0' }
];

export function ReportTemplateList() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('as9102');
  const [selectedInstance, setSelectedInstance] = useState<string>('inst-1');

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId);
    console.log('Selected template:', templateId);
  };

  const handleInstanceClick = (instanceId: string) => {
    setSelectedInstance(instanceId);
    console.log('Selected instance:', instanceId);
  };

  const handleCreateNewReport = () => {
    console.log('Creating new report instance');
    toast.info('Şablondan yeni rapor oluşturma penceresi açılıyor...');
  };

  return (
    <div className="p-4">
      {/* Templates Section */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-900 mb-3">Report Templates</h3>
        <div className="space-y-2">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateClick(template.id)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedTemplate === template.id
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-900">{template.name}</span>
              </div>
              <span className="text-xs text-gray-600">{template.standard}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instances Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-gray-900">Report Instances</h3>
          <button 
            onClick={handleCreateNewReport}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Create New Report"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="space-y-2">
          {instances.map((instance) => (
            <div
              key={instance.id}
              onClick={() => handleInstanceClick(instance.id)}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedInstance === instance.id
                  ? 'bg-blue-50 border-blue-300'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="text-sm text-gray-900 mb-1">{instance.template}</div>
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded ${
                  instance.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                  instance.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {instance.status}
                </span>
                <span className="text-gray-600">v{instance.version}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{instance.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}