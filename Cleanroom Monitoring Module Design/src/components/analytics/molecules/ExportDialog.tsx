import React, { useState } from 'react';
import { X, Download, Check } from 'lucide-react';
import Button from '../atoms/Button';
import { toast } from 'sonner@2.0.3';

/**
 * INTERACTION CHAIN: Export Button → Export Dialog → Export Progress → Success
 * Complete export workflow with format selection and progress
 */

interface ExportDialogProps {
  onClose: () => void;
}

export default function ExportDialog({ onClose }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = () => {
    setIsExporting(true);
    setProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setExportComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownload = () => {
    toast.success('Download started', {
      description: 'Your file is being downloaded'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-gray-900">Export Data</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {!exportComplete ? (
            <>
              {!isExporting ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Export Format</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'csv', label: 'CSV', desc: 'Comma-separated' },
                        { value: 'excel', label: 'Excel', desc: 'Microsoft Excel' },
                        { value: 'json', label: 'JSON', desc: 'JavaScript Object' }
                      ].map((format) => (
                        <button
                          key={format.value}
                          onClick={() => setSelectedFormat(format.value)}
                          className={`p-4 border-2 rounded-lg transition-all text-left ${
                            selectedFormat === format.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <p className="text-gray-900">{format.label}</p>
                          <p className="text-gray-600 text-xs mt-1">{format.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-3">Export Options</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeCharts}
                          onChange={(e) => setIncludeCharts(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Include charts and visualizations</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeMetadata}
                          onChange={(e) => setIncludeMetadata(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Include metadata and timestamps</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-900 mb-1">Export Summary</p>
                    <div className="text-gray-600 space-y-1">
                      <p>• Format: {selectedFormat.toUpperCase()}</p>
                      <p>• Estimated size: 12.4 MB</p>
                      <p>• Records: 48,293</p>
                      {includeCharts && <p>• Charts: 4 visualizations</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-blue-600 animate-bounce" />
                  </div>
                  <h4 className="text-gray-900 mb-2">Exporting your data...</h4>
                  <p className="text-gray-600 mb-4">Please wait while we prepare your file</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-gray-600 mt-2">{progress}%</p>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-gray-900 mb-2">Export Complete!</h4>
              <p className="text-gray-600 mb-6">Your file is ready to download</p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-gray-900">analytics_export_{new Date().getTime()}.{selectedFormat}</p>
                <p className="text-gray-600 mt-1">12.4 MB</p>
              </div>

              <Button variant="primary" icon={Download} fullWidth onClick={handleDownload}>
                Download File
              </Button>
            </div>
          )}
        </div>

        {!isExporting && !exportComplete && (
          <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
            <Button variant="primary" fullWidth onClick={handleExport}>
              Start Export
            </Button>
            <Button variant="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
