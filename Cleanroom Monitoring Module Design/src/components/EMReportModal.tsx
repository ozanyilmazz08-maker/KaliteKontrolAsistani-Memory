import React, { useState } from 'react';
import { X, Download, Send, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface EMReportModalProps {
  onClose: () => void;
}

export default function EMReportModal({ onClose }: EMReportModalProps) {
  const [reportPeriod, setReportPeriod] = useState('last7days');
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateReport = () => {
    setShowPreview(true);
    toast.success('Report generated', {
      description: 'EM Summary Report is ready for review'
    });
  };

  const handleDownloadReport = () => {
    toast.success('Downloading report', {
      description: 'EM_Summary_Report_2024-12-11.pdf'
    });
  };

  const handleEmailReport = () => {
    toast.success('Report sent', {
      description: 'Report emailed to QA team distribution list'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Environmental Monitoring Summary Report</h2>
            <p className="text-gray-600 mt-1">Generate comprehensive EM compliance report</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!showPreview ? (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Report Period</label>
                <select
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="last24h">Last 24 Hours</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="custom">Custom Date Range</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Include Sections</label>
                <div className="space-y-2">
                  {[
                    'Executive Summary',
                    'Compliance Status Overview',
                    'Excursion Analysis',
                    'Room Status by Grade',
                    'Trending Analysis',
                    'Open Deviations & CAPA',
                    'Batch Impact Assessment'
                  ].map((section) => (
                    <label key={section} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{section}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateReport}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Report
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Report Preview */}
              <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
                <h3 className="text-gray-900 mb-4">Environmental Monitoring Summary Report</h3>
                
                <div className="space-y-4 text-gray-700">
                  <div>
                    <p className="font-semibold">Report Period: December 4-11, 2024</p>
                    <p>Generated: {new Date().toLocaleString()}</p>
                  </div>

                  <div className="border-t border-gray-300 pt-4">
                    <h4 className="font-semibold mb-2">Executive Summary</h4>
                    <p>Overall compliance rate: 93.3% (42 of 45 rooms in specification)</p>
                    <p>Total excursions: 3 (2 particle, 1 microbial)</p>
                    <p>Open deviations: 3</p>
                    <p>Active CAPA items: 3</p>
                  </div>

                  <div className="border-t border-gray-300 pt-4">
                    <h4 className="font-semibold mb-2">Grade A Rooms (ISO 5)</h4>
                    <p>✓ 8 of 8 rooms in specification</p>
                    <p>✓ 0 excursions in period</p>
                  </div>

                  <div className="border-t border-gray-300 pt-4">
                    <h4 className="font-semibold mb-2">Grade B Rooms (ISO 7)</h4>
                    <p>⚠️ 12 of 13 rooms in specification</p>
                    <p>⚠️ 1 particle excursion (Room 201)</p>
                  </div>

                  <div className="border-t border-gray-300 pt-4">
                    <h4 className="font-semibold mb-2">Grade C/D Rooms</h4>
                    <p>✓ 22 of 24 rooms in specification</p>
                    <p>⚠️ 1 pressure alert, 1 microbial alert</p>
                  </div>

                  <div className="border-t border-gray-300 pt-4">
                    <p className="text-gray-600">...Full report contains 12 pages with detailed charts and analysis...</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadReport}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={handleEmailReport}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Email Report
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
