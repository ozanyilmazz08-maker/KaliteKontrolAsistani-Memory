import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

const agingBuckets = [
  { range: '0-7 days', count: 8, color: 'bg-green-500' },
  { range: '8-14 days', count: 12, color: 'bg-blue-500' },
  { range: '15-30 days', count: 6, color: 'bg-yellow-500' },
  { range: '>30 days', count: 5, color: 'bg-red-500' }
];

const timelineItems = [
  { id: 'FAI-2024-001', part: 'Wing Spar Section', created: '2024-11-15', due: '2024-12-15', status: 'In Measurement', progress: 65 },
  { id: 'FAI-2024-002', part: 'Landing Gear Mount', created: '2024-11-20', due: '2024-12-20', status: 'Awaiting Customer', progress: 85 },
  { id: 'FAI-2024-003', part: 'Avionics Panel', created: '2024-11-10', due: '2024-12-05', status: 'Overdue', progress: 45 },
  { id: 'FAI-2024-004', part: 'Fuel Tank Bracket', created: '2024-11-25', due: '2024-12-25', status: 'Draft', progress: 20 },
  { id: 'FAI-2024-005', part: 'Hydraulic Fitting', created: '2024-11-18', due: '2024-12-18', status: 'In Measurement', progress: 70 }
];

const handleAgingBucketClick = (range: string) => {
  console.log('Aging bucket clicked:', range);
  toast.info(`${range} yaş aralığına göre FAI siparişleri filtreleniyor...`);
};

const handleTimelineItemClick = (itemId: string) => {
  console.log('Timeline item clicked:', itemId);
  toast.info(`${itemId} FAI siparişi açılıyor...`);
};

export function TimelineAging() {
  return (
    <div className="space-y-6">
      {/* Aging Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">FAI Aging Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          {agingBuckets.map((bucket, index) => (
            <div 
              key={index} 
              onClick={() => handleAgingBucketClick(bucket.range)}
              className="text-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <div className={`${bucket.color} h-2 rounded-full mb-2`}></div>
              <div className="text-2xl text-gray-900">{bucket.count}</div>
              <div className="text-sm text-gray-600">{bucket.range}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">FAI Timeline</h3>
        <div className="space-y-3">
          {timelineItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleTimelineItemClick(item.id)}
              className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm text-gray-900">{item.id}</span>
                  <span className="text-sm text-gray-500 ml-2">{item.part}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  item.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                  item.status === 'Awaiting Customer' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                <span>Created: {item.created}</span>
                <span>Due: {item.due}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    item.status === 'Overdue' ? 'bg-red-500' :
                    item.status === 'Awaiting Customer' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}