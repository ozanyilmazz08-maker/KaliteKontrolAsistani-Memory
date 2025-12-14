import React, { useState } from 'react';
import { X, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BatchLinkageModalProps {
  onClose: () => void;
}

export default function BatchLinkageModal({ onClose }: BatchLinkageModalProps) {
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const batches = [
    {
      id: 'BATCH-2024-1234',
      product: 'Injectable Solution X - 10mg/mL',
      rooms: ['R-201', 'R-204', 'R-301'],
      startDate: '2024-12-10 08:00',
      endDate: '2024-12-11 16:00',
      status: 'In Progress',
      excursions: [
        {
          room: 'R-201',
          parameter: 'Particle Count 0.5µm',
          timestamp: '2024-12-11 08:35',
          value: '3,520 particles/m³',
          limit: '3,500 particles/m³',
          deviation: 'DEV-2024-0156'
        }
      ],
      disposition: 'Under Investigation'
    },
    {
      id: 'BATCH-2024-1233',
      product: 'Lyophilized Powder Y - 50mg',
      rooms: ['R-301', 'R-105'],
      startDate: '2024-12-09 10:00',
      endDate: '2024-12-10 14:00',
      status: 'Completed',
      excursions: [],
      disposition: 'Released'
    },
    {
      id: 'BATCH-2024-1231',
      product: 'Oral Suspension Z - 25mg/5mL',
      rooms: ['R-204', 'R-102'],
      startDate: '2024-12-08 09:00',
      endDate: '2024-12-09 17:00',
      status: 'Completed',
      excursions: [
        {
          room: 'R-105',
          parameter: 'Differential Pressure',
          timestamp: '2024-12-09 11:15',
          value: '10.8 Pa',
          limit: '10 Pa (Alert)',
          deviation: 'DEV-2024-0151'
        }
      ],
      disposition: 'Released with Justification'
    }
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div 
          className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">Batch Linkage Status</h2>
              <p className="text-gray-600 mt-1">Environmental monitoring impact on production batches</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              {batches.map((batch) => (
                <div 
                  key={batch.id}
                  className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-400 transition-all cursor-pointer"
                  onClick={() => setSelectedBatch(batch)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        batch.excursions.length > 0 ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {batch.excursions.length > 0 ? (
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-gray-900">{batch.id}</h3>
                        <p className="text-gray-600 mt-1">{batch.product}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      batch.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {batch.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-gray-600">Rooms</p>
                      <p className="text-gray-900">{batch.rooms.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="text-gray-900">{batch.startDate.split(' ')[0]} - {batch.endDate.split(' ')[0]}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Excursions</p>
                      <p className={batch.excursions.length > 0 ? 'text-red-700' : 'text-green-700'}>
                        {batch.excursions.length > 0 ? `${batch.excursions.length} Excursion(s)` : 'None'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <span className="text-gray-600">Disposition: </span>
                      <span className={`px-3 py-1 rounded-lg ${
                        batch.disposition === 'Released' ? 'bg-green-100 text-green-700' :
                        batch.disposition === 'Under Investigation' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {batch.disposition}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBatch(batch);
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

      {/* Batch Detail Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => setSelectedBatch(null)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-gray-900">{selectedBatch.id}: Batch Details</h3>
                <p className="text-gray-600 mt-1">{selectedBatch.product}</p>
              </div>
              <button onClick={() => setSelectedBatch(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Batch Info */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1">Batch ID</p>
                  <p className="text-gray-900">{selectedBatch.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1">Status</p>
                  <p className="text-gray-900">{selectedBatch.status}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1">Start Time</p>
                  <p className="text-gray-900">{selectedBatch.startDate}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1">End Time</p>
                  <p className="text-gray-900">{selectedBatch.endDate}</p>
                </div>
              </div>

              {/* Rooms Used */}
              <div>
                <h4 className="text-gray-900 mb-3">Production Rooms</h4>
                <div className="grid grid-cols-3 gap-3">
                  {selectedBatch.rooms.map((room: string) => (
                    <div key={room} className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <p className="text-blue-900">{room}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Excursions */}
              {selectedBatch.excursions.length > 0 ? (
                <div>
                  <h4 className="text-gray-900 mb-3">Environmental Excursions During Batch</h4>
                  <div className="space-y-3">
                    {selectedBatch.excursions.map((exc: any, idx: number) => (
                      <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-red-900">{exc.parameter} - {exc.room}</p>
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">{exc.deviation}</span>
                        </div>
                        <p className="text-red-700">
                          Value: {exc.value} · Limit: {exc.limit}
                        </p>
                        <p className="text-gray-600 mt-1">Timestamp: {exc.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-900">✓ No environmental excursions during this batch</p>
                  <p className="text-green-700">All rooms maintained within specification throughout production</p>
                </div>
              )}

              {/* Disposition */}
              <div>
                <h4 className="text-gray-900 mb-3">Batch Disposition</h4>
                <div className={`p-4 rounded-lg border-2 ${
                  selectedBatch.disposition === 'Released' ? 'bg-green-50 border-green-200' :
                  selectedBatch.disposition === 'Under Investigation' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <p className={
                    selectedBatch.disposition === 'Released' ? 'text-green-900' :
                    selectedBatch.disposition === 'Under Investigation' ? 'text-yellow-900' :
                    'text-blue-900'
                  }>
                    Disposition: {selectedBatch.disposition}
                  </p>
                  {selectedBatch.disposition === 'Released with Justification' && (
                    <p className="text-blue-700 mt-2">
                      Excursion reviewed and justified. Product quality not impacted per risk assessment.
                    </p>
                  )}
                  {selectedBatch.disposition === 'Under Investigation' && (
                    <p className="text-yellow-700 mt-2">
                      Batch hold pending deviation investigation and QA review. Disposition pending.
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    toast.info('Opening batch record...');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Full Batch Record
                </button>
                <button
                  onClick={() => {
                    toast.info('Generating EM linkage report...');
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Generate EM Report
                </button>
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
