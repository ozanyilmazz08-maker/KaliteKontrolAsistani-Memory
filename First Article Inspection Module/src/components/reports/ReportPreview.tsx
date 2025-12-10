import { useState } from 'react';
import { RotateCw, Download, Printer, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ReportPreview() {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerateReport = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      toast.success('Rapor, en güncel ölçüm verileriyle başarıyla yenilendi!');
    }, 2000);
  };

  const handleExportPDF = () => {
    console.log('Exporting report to PDF...');
    toast.info('AS9102 raporu PDF formatında oluşturuluyor ve indirilecek...');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">AS9102 First Article Inspection Report</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRegenerateReport}
              disabled={isRegenerating}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Regenerating...' : 'Regenerate from Latest Data'}
            </button>
            <button 
              onClick={handleExportPDF}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export to PDF
            </button>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm text-yellow-900">Incomplete Fields Detected</div>
            <div className="text-xs text-yellow-700 mt-1">3 required fields are missing data. Complete all measurements before final submission.</div>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Form Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-sm text-gray-900 mb-1">AS9102 FIRST ARTICLE INSPECTION REPORT</h4>
              <div className="text-xs text-gray-600">Form 1, 2, and 3</div>
            </div>
            <div className="text-right text-xs text-gray-600">
              <div>FAI ID: FAI-2024-001</div>
              <div>Version: 1.0</div>
              <div>Date: 2024-12-08</div>
            </div>
          </div>
        </div>

        {/* Form 1: Part Information */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-sm text-gray-900 mb-4">FORM 1 - PART INFORMATION</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Part Number:</span>
              <div className="text-gray-900 mt-1">WS-2401-A</div>
            </div>
            <div>
              <span className="text-gray-600">Part Name:</span>
              <div className="text-gray-900 mt-1">Wing Spar Section</div>
            </div>
            <div>
              <span className="text-gray-600">Drawing Number:</span>
              <div className="text-gray-900 mt-1">DWG-2401-001</div>
            </div>
            <div>
              <span className="text-gray-600">Revision:</span>
              <div className="text-gray-900 mt-1">C</div>
            </div>
            <div>
              <span className="text-gray-600">Manufacturer:</span>
              <div className="text-gray-900 mt-1">Acme Aerospace Manufacturing</div>
            </div>
            <div>
              <span className="text-gray-600">Manufacturing Process:</span>
              <div className="text-gray-900 mt-1">CNC Machining, Anodize</div>
            </div>
            <div>
              <span className="text-gray-600">Purchase Order:</span>
              <div className="text-gray-900 mt-1">PO-2024-8845</div>
            </div>
            <div>
              <span className="text-gray-600">Serial Number:</span>
              <div className="text-gray-900 mt-1">WS2401A-001-FAI</div>
            </div>
          </div>
        </div>

        {/* Form 2: Product Accountability */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-sm text-gray-900 mb-4">FORM 2 - PRODUCT ACCOUNTABILITY</h4>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Organization Name:</span>
              <span className="text-gray-900">Acme Aerospace Manufacturing Inc.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quality Representative:</span>
              <span className="text-gray-900">J. Chen - Quality Manager</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">FAI Report Date:</span>
              <span className="text-gray-900">2024-12-08</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="text-gray-900">OEM-X</span>
            </div>
          </div>
        </div>

        {/* Form 3: Characteristics Summary */}
        <div className="p-6">
          <h4 className="text-sm text-gray-900 mb-4">FORM 3 - CHARACTERISTIC ACCOUNTABILITY & VERIFICATION</h4>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-2 py-2 text-left">Char No.</th>
                  <th className="border border-gray-300 px-2 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-2 py-2 text-left">Requirement</th>
                  <th className="border border-gray-300 px-2 py-2 text-left">Tolerance</th>
                  <th className="border border-gray-300 px-2 py-2 text-left">Actual</th>
                  <th className="border border-gray-300 px-2 py-2 text-left">Result</th>
                  <th className="border border-gray-300 px-2 py-2 text-left">Method</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-2 py-2">1</td>
                  <td className="border border-gray-300 px-2 py-2">Overall Length</td>
                  <td className="border border-gray-300 px-2 py-2">400.00 mm</td>
                  <td className="border border-gray-300 px-2 py-2">±0.05 mm</td>
                  <td className="border border-gray-300 px-2 py-2">400.02 mm</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600">Pass</td>
                  <td className="border border-gray-300 px-2 py-2">CMM</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-2">2</td>
                  <td className="border border-gray-300 px-2 py-2">Hole Diameter Ø30</td>
                  <td className="border border-gray-300 px-2 py-2">Ø30.00 mm</td>
                  <td className="border border-gray-300 px-2 py-2">+0.05/-0.02</td>
                  <td className="border border-gray-300 px-2 py-2">Ø30.01 mm</td>
                  <td className="border border-gray-300 px-2 py-2 text-green-600">Pass</td>
                  <td className="border border-gray-300 px-2 py-2">CMM</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-2">3</td>
                  <td className="border border-gray-300 px-2 py-2">Position Tolerance</td>
                  <td className="border border-gray-300 px-2 py-2">Position Ø0.1</td>
                  <td className="border border-gray-300 px-2 py-2">MMC</td>
                  <td className="border border-gray-300 px-2 py-2 bg-yellow-50">Pending</td>
                  <td className="border border-gray-300 px-2 py-2">—</td>
                  <td className="border border-gray-300 px-2 py-2">CMM</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-2 py-2">8</td>
                  <td className="border border-gray-300 px-2 py-2">Visual Inspection</td>
                  <td className="border border-gray-300 px-2 py-2">No defects</td>
                  <td className="border border-gray-300 px-2 py-2">—</td>
                  <td className="border border-gray-300 px-2 py-2">Surface scratch</td>
                  <td className="border border-gray-300 px-2 py-2 text-red-600">Fail</td>
                  <td className="border border-gray-300 px-2 py-2">Visual</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-gray-600">Total Characteristics:</span>
                <span className="text-gray-900 ml-2">45</span>
              </div>
              <div>
                <span className="text-gray-600">Passed:</span>
                <span className="text-green-600 ml-2">32</span>
              </div>
              <div>
                <span className="text-gray-600">Failed:</span>
                <span className="text-red-600 ml-2">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}