import { useState } from 'react';
import { AppFilters } from '../../App';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, Download, Calendar, BarChart3, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReportsScreenProps {
  filters: AppFilters;
}

type ReportState = 'idle' | 'generating' | 'ready';

export function ReportsScreen({ filters }: ReportsScreenProps) {
  const [reportStates, setReportStates] = useState<Record<string, ReportState>>({});

  const reportTemplates = [
    {
      id: 'fleet-health',
      title: 'Fleet Health Summary',
      description: 'Comprehensive overview of all assets health status and risk levels',
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      category: 'Executive'
    },
    {
      id: 'top-risks',
      title: 'Top Risk Assets Report',
      description: 'Detailed analysis of high-risk assets requiring immediate attention',
      icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
      category: 'Operations'
    },
    {
      id: 'reliability',
      title: 'Reliability Metrics (MTBF/MTTR)',
      description: 'Statistical analysis of mean time between failures and repair times',
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      category: 'Engineering'
    },
    {
      id: 'maintenance-effectiveness',
      title: 'Maintenance Effectiveness',
      description: 'Before/after analysis of maintenance interventions on asset health',
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      category: 'Maintenance'
    },
    {
      id: 'quality-correlation',
      title: 'Equipment-Quality Correlation',
      description: 'Analysis of correlation between equipment health and quality metrics',
      icon: <FileText className="w-8 h-8 text-orange-600" />,
      category: 'Quality'
    },
    {
      id: 'cost-analysis',
      title: 'Maintenance Cost Analysis',
      description: 'Financial analysis of maintenance activities and cost trends',
      icon: <FileText className="w-8 h-8 text-indigo-600" />,
      category: 'Finance'
    }
  ];

  const handleGenerateReport = async (reportId: string) => {
    setReportStates((prev) => ({ ...prev, [reportId]: 'generating' }));

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setReportStates((prev) => ({ ...prev, [reportId]: 'ready' }));
    
    const report = reportTemplates.find((r) => r.id === reportId);
    toast.success('Report generated', {
      description: `${report?.title} is ready for download.`
    });

    // Reset after 2 seconds
    setTimeout(() => {
      setReportStates((prev) => ({ ...prev, [reportId]: 'idle' }));
    }, 5000);
  };

  const handleDownloadReport = (reportId: string) => {
    toast.success('Download started', {
      description: 'Your report is being downloaded as PDF.'
    });
  };

  const handlePreviewCustomize = (reportId: string) => {
    const report = reportTemplates.find((r) => r.id === reportId);
    toast.info('Preview & Customize', {
      description: `Opening customization options for ${report?.title}...`
    });
  };

  const handleOpenReportBuilder = () => {
    toast.info('Custom Report Builder', {
      description: 'Opening the custom report builder interface...'
    });
  };

  const handleEditScheduledReport = (reportName: string) => {
    toast.info('Edit Scheduled Report', {
      description: `Editing schedule for "${reportName}"...`
    });
  };

  const handleAddScheduledReport = () => {
    toast.info('Add Scheduled Report', {
      description: 'Opening the scheduled report configuration dialog...'
    });
  };

  const getButtonContent = (reportId: string) => {
    const state = reportStates[reportId] || 'idle';
    
    switch (state) {
      case 'generating':
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        );
      case 'ready':
        return (
          <>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </>
        );
      default:
        return 'Generate Report';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1">Reports</h1>
        <p className="text-gray-600">Generate audit-ready and decision-ready reports</p>
      </div>

      {/* Active Filters Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Report Filters</h3>
            <p className="text-sm text-blue-700">
              Reports will be generated using current filters: Plant:{' '}
              <span className="font-medium">{filters.plant === 'all' ? 'All' : filters.plant}</span>,
              Area: <span className="font-medium">{filters.area === 'all' ? 'All' : filters.area}</span>,
              Time Range: <span className="font-medium">{filters.timeRange}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Report Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTemplates.map((template) => (
          <Card key={template.id} className="p-6">
            <div className="flex items-start gap-4 mb-4">
              {template.icon}
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">{template.category}</div>
                <h3 className="font-medium text-gray-900 mb-2">{template.title}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {reportStates[template.id] === 'ready' ? (
                <Button
                  className="w-full"
                  onClick={() => handleDownloadReport(template.id)}
                >
                  {getButtonContent(template.id)}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleGenerateReport(template.id)}
                  disabled={reportStates[template.id] === 'generating'}
                >
                  {getButtonContent(template.id)}
                </Button>
              )}
              
              {reportStates[template.id] === 'idle' && (
                <Button
                  variant="outline"
                  className="w-full"
                  size="sm"
                  onClick={() => handlePreviewCustomize(template.id)}
                >
                  Preview & Customize
                </Button>
              )}
            </div>

            {reportStates[template.id] === 'ready' && (
              <div className="mt-3 text-xs text-gray-500 text-center">
                Report will expire in 5 seconds
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Custom Report Builder */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-2">Custom Report Builder</h3>
        <p className="text-sm text-gray-600 mb-4">
          Build a custom report with specific metrics, assets, and date ranges.
        </p>
        <Button
          variant="outline"
          onClick={handleOpenReportBuilder}
        >
          Open Report Builder
        </Button>
      </Card>

      {/* Scheduled Reports */}
      <Card className="p-6">
        <h3 className="font-medium text-gray-900 mb-4">Scheduled Reports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Weekly Fleet Health Summary</div>
              <div className="text-sm text-gray-600">Every Monday at 8:00 AM</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditScheduledReport('Weekly Fleet Health Summary')}
            >
              Edit
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Monthly Maintenance Effectiveness</div>
              <div className="text-sm text-gray-600">1st of every month</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditScheduledReport('Monthly Maintenance Effectiveness')}
            >
              Edit
            </Button>
          </div>
        </div>
        <Button
          variant="link"
          className="mt-4"
          onClick={handleAddScheduledReport}
        >
          + Add Scheduled Report
        </Button>
      </Card>
    </div>
  );
}