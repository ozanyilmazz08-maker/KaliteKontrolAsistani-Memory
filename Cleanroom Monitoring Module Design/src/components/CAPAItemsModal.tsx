import React, { useState } from 'react';
import { X, FileText, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CAPAItemsModalProps {
  onClose: () => void;
}

export default function CAPAItemsModal({ onClose }: CAPAItemsModalProps) {
  const [selectedCAPA, setSelectedCAPA] = useState<any>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const capaItems = [
    {
      id: 'CAPA-2024-0089',
      title: 'Root Cause Analysis - Particle Excursion R-201',
      linkedDeviation: 'DEV-2024-0156',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Sarah Chen',
      dueDate: '2024-12-25',
      progress: 65,
      correctiveAction: 'Review and adjust HVAC filtration system',
      preventiveAction: 'Implement enhanced monitoring protocol'
    },
    {
      id: 'CAPA-2024-0087',
      title: 'Process Improvement - Microbial Monitoring',
      linkedDeviation: 'DEV-2024-0154',
      status: 'Under Review',
      priority: 'Medium',
      assignedTo: 'Mike Johnson',
      dueDate: '2024-12-20',
      progress: 80,
      correctiveAction: 'Enhanced surface disinfection protocol',
      preventiveAction: 'Quarterly training for all personnel'
    },
    {
      id: 'CAPA-2024-0083',
      title: 'Equipment Qualification - Pressure Monitors',
      linkedDeviation: null,
      status: 'Pending Closure',
      priority: 'Medium',
      assignedTo: 'Emily Davis',
      dueDate: '2024-12-15',
      progress: 95,
      correctiveAction: 'Recalibration of pressure sensors',
      preventiveAction: 'Monthly calibration verification'
    }
  ];

  const handleUpdateProgress = () => {
    toast.success('CAPA updated', {
      description: 'Progress and status have been updated'
    });
    setShowUpdateForm(false);
  };

  const handleCloseCAPAComplete = () => {
    toast.success('CAPA closed', {
      description: `${selectedCAPA.id} marked as complete and archived`
    });
    setSelectedCAPA(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div 
          className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">Open CAPA Items</h2>
              <p className="text-gray-600 mt-1">{capaItems.length} active corrective and preventive actions</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              {capaItems.map((capa) => (
                <div 
                  key={capa.id}
                  className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-400 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-gray-900">{capa.id}: {capa.title}</h3>
                      {capa.linkedDeviation && (
                        <p className="text-blue-600 mt-1">Linked to {capa.linkedDeviation}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      capa.priority === 'High' ? 'bg-red-100 text-red-700' :
                      capa.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {capa.priority} Priority
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600">Corrective Action</p>
                      <p className="text-gray-900">{capa.correctiveAction}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Preventive Action</p>
                      <p className="text-gray-900">{capa.preventiveAction}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900">{capa.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${capa.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{capa.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Due: {capa.dueDate}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCAPA(capa)}
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

      {/* CAPA Detail Modal */}
      {selectedCAPA && !showUpdateForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => setSelectedCAPA(null)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-gray-900">{selectedCAPA.id}: CAPA Details</h3>
                <p className="text-gray-600 mt-1">{selectedCAPA.title}</p>
              </div>
              <button onClick={() => setSelectedCAPA(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1">Status</p>
                  <p className="text-gray-900">{selectedCAPA.status}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1">Priority</p>
                  <p className="text-gray-900">{selectedCAPA.priority}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1">Assigned To</p>
                  <p className="text-gray-900">{selectedCAPA.assignedTo}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1">Due Date</p>
                  <p className="text-gray-900">{selectedCAPA.dueDate}</p>
                </div>
              </div>

              {/* Actions Description */}
              <div>
                <h4 className="text-gray-900 mb-3">Action Plan</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-900 mb-1">Corrective Action</p>
                    <p className="text-blue-700">{selectedCAPA.correctiveAction}</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-purple-900 mb-1">Preventive Action</p>
                    <p className="text-purple-700">{selectedCAPA.preventiveAction}</p>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div>
                <h4 className="text-gray-900 mb-3">Activity Timeline</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">CAPA created and assigned</p>
                      <p className="text-gray-600">By: QA Manager · 2024-12-01 10:00</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">Root cause analysis completed</p>
                      <p className="text-gray-600">By: {selectedCAPA.assignedTo} · 2024-12-05 14:30</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">Corrective action in progress</p>
                      <p className="text-gray-600">By: {selectedCAPA.assignedTo} · 2024-12-10 09:15</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowUpdateForm(true)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Progress
                </button>
                <button
                  onClick={() => {
                    toast.info('Adding note to CAPA...');
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add Note
                </button>
                {selectedCAPA.progress >= 95 && (
                  <button
                    onClick={handleCloseCAPAComplete}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Close CAPA
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Progress Form */}
      {showUpdateForm && selectedCAPA && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-gray-900">Update CAPA Progress: {selectedCAPA.id}</h3>
              <button onClick={() => setShowUpdateForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Progress (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue={selectedCAPA.progress}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Status Update</label>
                <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                  <option>In Progress</option>
                  <option>Under Review</option>
                  <option>Pending Closure</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Activity Note</label>
                <textarea
                  rows={4}
                  placeholder="Describe the work completed..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleUpdateProgress}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Update
                </button>
                <button
                  onClick={() => setShowUpdateForm(false)}
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
