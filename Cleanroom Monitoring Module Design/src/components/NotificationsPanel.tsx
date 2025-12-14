import React from 'react';
import { AlertTriangle, AlertCircle, Clock, CheckCircle, X } from 'lucide-react';

interface NotificationsPanelProps {
  onClose: () => void;
}

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'Particle Count Excursion',
      message: 'Room 201 (Grade B) exceeded action limit for 0.5µm particles',
      time: '5 min ago',
      room: 'Room 201'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Differential Pressure Alert',
      message: 'Room 105 pressure dropped to alert limit',
      time: '12 min ago',
      room: 'Room 105'
    },
    {
      id: 3,
      type: 'info',
      title: 'Sensor Self-Test',
      message: 'Particle counter PC-204 completed self-diagnostic - OK',
      time: '1 hour ago',
      room: 'Room 204'
    },
    {
      id: 4,
      type: 'critical',
      title: 'Microbial Action Limit',
      message: 'Surface sample S-301-02 exceeded action limit (8 CFU)',
      time: '2 hours ago',
      room: 'Room 301'
    },
    {
      id: 5,
      type: 'warning',
      title: 'Filter ΔP Increasing',
      message: 'HEPA filter F-102 differential pressure trend increasing',
      time: '3 hours ago',
      room: 'AHU-1'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[600px] overflow-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h3 className="text-gray-900">Notifications</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900">{notification.title}</p>
                <p className="text-gray-600 mt-1">{notification.message}</p>
                <div className="flex items-center gap-3 mt-2 text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {notification.time}
                  </span>
                  <span>·</span>
                  <span>{notification.room}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 py-3">
        <button className="text-blue-600 hover:text-blue-700 w-full text-center">
          View All Notifications
        </button>
      </div>
    </div>
  );
}
