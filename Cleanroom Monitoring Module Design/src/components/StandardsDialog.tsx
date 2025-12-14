import React from 'react';
import { X, BookOpen, FileText, Shield } from 'lucide-react';

interface StandardsDialogProps {
  onClose: () => void;
}

export default function StandardsDialog({ onClose }: StandardsDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">Standards & Regulatory Guidance</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-900">ISO 14644 Series</h3>
            </div>
            <ul className="space-y-2 ml-7 text-gray-700">
              <li><strong>ISO 14644-1:</strong> Classification of air cleanliness by particle concentration</li>
              <li><strong>ISO 14644-2:</strong> Monitoring to provide evidence of cleanroom performance</li>
              <li><strong>ISO 14644-3:</strong> Test methods for cleanroom performance</li>
              <li>Classification ranges: ISO Class 1 through 9, based on particle counts per cubic meter</li>
              <li>Continuous and periodic monitoring requirements</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="text-gray-900">GMP & Regulatory Expectations</h3>
            </div>
            <ul className="space-y-2 ml-7 text-gray-700">
              <li><strong>EU GMP Annex 1 (2022):</strong> Manufacture of Sterile Medicinal Products</li>
              <li><strong>FDA:</strong> Aseptic Processing Guidance, 21 CFR Part 211</li>
              <li>Environmental monitoring programs must be comprehensive, risk-based, and documented</li>
              <li>Grade A/B/C/D classifications with specific particle and microbial limits</li>
              <li>Alert and action limits for environmental parameters</li>
              <li>Linkage of EM data to batch records and product quality decisions</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-purple-600" />
              <h3 className="text-gray-900">Data Integrity (ALCOA+)</h3>
            </div>
            <ul className="space-y-2 ml-7 text-gray-700">
              <li><strong>A</strong>ttributable: Data attributed to the person who generated it</li>
              <li><strong>L</strong>egible: Data must be readable and permanent</li>
              <li><strong>C</strong>ontemporaneous: Recorded at the time of the activity</li>
              <li><strong>O</strong>riginal: First capture or certified copy</li>
              <li><strong>A</strong>ccurate: Data is correct and complete</li>
              <li><strong>+</strong> Complete, Consistent, Enduring, Available</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-orange-600" />
              <h3 className="text-gray-900">21 CFR Part 11 & EU Annex 11</h3>
            </div>
            <ul className="space-y-2 ml-7 text-gray-700">
              <li>Electronic records and electronic signatures requirements</li>
              <li>Audit trails for all data changes</li>
              <li>System validation and controlled access</li>
              <li>Data backup, archival, and retrieval procedures</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-900 mb-2">Internal SOPs</h4>
            <div className="space-y-1">
              <a href="#" className="block text-blue-600 hover:underline">SOP-EM-001: Environmental Monitoring Program</a>
              <a href="#" className="block text-blue-600 hover:underline">SOP-EM-002: Cleanroom Classification & Qualification</a>
              <a href="#" className="block text-blue-600 hover:underline">SOP-EM-003: Investigation of Environmental Excursions</a>
              <a href="#" className="block text-blue-600 hover:underline">SOP-IT-001: Computerized System Validation (GAMP 5)</a>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
