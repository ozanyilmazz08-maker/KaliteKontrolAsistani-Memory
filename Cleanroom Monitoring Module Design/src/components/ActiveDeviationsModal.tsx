import React, { useState } from 'react';
import { X, FileText, AlertCircle, Clock, User, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Active Deviations Modal - Complete CRUD with nested interactions
 * Opens from Quick Links -> "View Active Deviations"
 */

interface ActiveDeviationsModalProps {
  onClose: () => void;
}

export default function ActiveDeviationsModal({ onClose }: ActiveDeviationsModalProps) {
  const [selectedDeviation, setSelectedDeviation] = useState<any>(null);
  const [showCAPAForm, setShowCAPAForm] = useState(false);

  const deviations = [
    {
      id: 'DEV-2024-0156',
      title: 'Particle Excursion - Room 201',
      room: 'Room 201 - Filling Suite',
      parameter: 'Particle Count',
      severity: 'Critical',
      status: 'Under Investigation',
      opened: '2024-12-11 08:30',
      assignedTo: 'Sarah Chen',
      description: '0.5µm particle count exceeded action limit of 3,500 particles/m³',
      currentValue: '3,520 particles/m³',
      limit: '3,500 particles/m³',
      batch: 'Batch #2024-1234'
    },
    {
      id: 'DEV-2024-0154',
      title: 'Microbial Action Limit - Room 301',
      room: 'Room 301 - Aseptic Core',
      parameter: 'Microbial Count',
      severity: 'Major',
      status: 'CAPA Initiated',
      opened: '2024-12-10 14:20',
      assignedTo: 'Mike Johnson',
      description: 'Microbial count at action limit during routine monitoring',
      currentValue: '10 CFU/m³',
      limit: '10 CFU/m³',
      batch: null
    },
    {
      id: 'DEV-2024-0151',
      title: 'Pressure Differential Alert - Room 105',
      room: 'Room 105 - Weighing',
      parameter: 'Differential Pressure',
      severity: 'Minor',
      status: 'Pending Review',
      opened: '2024-12-09 11:15',
      assignedTo: 'Emily Davis',
      description: 'Pressure differential trending towards alert limit',
      currentValue: '10.8 Pa',
      limit: '10 Pa (Alert)',
      batch: null
    }
  ];

  const handleInitiateCAPAFlow = (deviation: typeof deviations[0]) => {
    setShowCAPAForm(true);
  };

  const handleSubmitCAPAClose = () => {
    toast.success('CAPA initiated', {
      description: 'CAPA-2024-0089 created and assigned'
    });
    setShowCAPAForm(false);
    setSelectedDeviation(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div 
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">Active Environmental Monitoring Deviations</h2>
              <p className="text-gray-600 mt-1">{deviations.length} open deviations requiring attention</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              {deviations.map((deviation) => (
                <div 
                  key={deviation.id}
                  className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-400 transition-all cursor-pointer"
                  onClick={() => setSelectedDeviation(deviation)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        deviation.severity === 'Critical' ? 'bg-red-100' :
                        deviation.severity === 'Major' ? 'bg-orange-100' : 'bg-yellow-100'
                      }`}>
                        <AlertCircle className={`w-6 h-6 ${
                          deviation.severity === 'Critical' ? 'text-red-600' :
                          deviation.severity === 'Major' ? 'text-orange-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-gray-900">{deviation.id}: {deviation.title}</h3>
                        <p className="text-gray-600 mt-1">{deviation.room}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      deviation.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      deviation.severity === 'Major' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {deviation.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Opened: {deviation.opened}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span>Assigned: {deviation.assignedTo}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className={`px-3 py-1 rounded-lg text-sm ${
                      deviation.status === 'Under Investigation' ? 'bg-blue-100 text-blue-700' :
                      deviation.status === 'CAPA Initiated' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      Status: {deviation.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDeviation(deviation);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deviation Detail Modal */}
      {selectedDeviation && !showCAPAForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => setSelectedDeviation(null)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-gray-900">{selectedDeviation.id}: Deviation Details</h3>
                <p className="text-gray-600 mt-1">{selectedDeviation.title}</p>
              </div>
              <button onClick={() => setSelectedDeviation(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1">Room</p>
                  <p className="text-gray-900">{selectedDeviation.room}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1">Parameter</p>
                  <p className="text-gray-900">{selectedDeviation.parameter}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1">Current Value</p>
                  <p className="text-red-600">{selectedDeviation.currentValue}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1">Limit</p>
                  <p className="text-gray-900">{selectedDeviation.limit}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {selectedDeviation.description}
                </p>
              </div>

              {/* Batch Linkage */}
              {selectedDeviation.batch && (
                <div>
                  <h4 className="text-gray-900 mb-2">Batch Linkage</h4>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-900">⚠️ This deviation is linked to {selectedDeviation.batch}</p>
                    <p className="text-yellow-700 mt-1">Batch disposition review may be required</p>
                  </div>
                </div>
              )}

              {/* Investigation Log */}
              <div>
                <h4 className="text-gray-900 mb-3">Investigation Log</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">Deviation opened and assigned</p>
                      <p className="text-gray-600">By: System · {selectedDeviation.opened}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">Initial investigation started</p>
                      <p className="text-gray-600">By: {selectedDeviation.assignedTo} · 10 min ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleInitiateCAPAFlow(selectedDeviation)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Initiate CAPA
                </button>
                <button
                  onClick={() => {
                    toast.info('Adding investigation note...');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Investigation Note
                </button>
                <button
                  onClick={() => {
                    toast.success('Deviation acknowledged');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAPA Initiation Form */}
      {showCAPAForm && selectedDeviation && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-gray-900">Initiate CAPA for {selectedDeviation.id}</h3>
              <button onClick={() => setShowCAPAForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">CAPA Title</label>
                <input
                  type="text"
                  defaultValue={`CAPA for ${selectedDeviation.title}`}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Root Cause (Preliminary)</label>
                <textarea
                  rows={3}
                  placeholder="Enter preliminary root cause analysis..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Corrective Action</label>
                <textarea
                  rows={3}
                  placeholder="Describe immediate corrective actions..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Assign To</label>
                <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                  <option>Sarah Chen</option>
                  <option>Mike Johnson</option>
                  <option>Emily Davis</option>
                  <option>QA Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Target Closure Date</label>
                <input
                  type="date"
                  defaultValue="2024-12-25"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmitCAPAClose}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create CAPA & Link to Deviation
                </button>
                <button
                  onClick={() => setShowCAPAForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
