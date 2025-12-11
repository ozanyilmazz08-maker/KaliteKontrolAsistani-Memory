import { X, AlertTriangle, WifiOff, TrendingUp, Database, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const notifications = [
    {
      id: 1,
      type: 'error',
      icon: <WifiOff className="w-5 h-5" />,
      title: 'Connectivity Issue',
      message: '5 sensors offline in Oven #2 area',
      time: '2 min ago',
      unread: true,
    },
    {
      id: 2,
      type: 'warning',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'High Latency',
      message: 'MQTT broker experiencing delays (>1s)',
      time: '15 min ago',
      unread: true,
    },
    {
      id: 3,
      type: 'error',
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Threshold Breach',
      message: 'Vibration exceeded limit on Motor M-15',
      time: '23 min ago',
      unread: false,
    },
    {
      id: 4,
      type: 'warning',
      icon: <Database className="w-5 h-5" />,
      title: 'Data Quality',
      message: 'Missing data detected: Sensor T-089 (2hr gap)',
      time: '1 hour ago',
      unread: false,
    },
    {
      id: 5,
      type: 'success',
      icon: <CheckCircle className="w-5 h-5" />,
      title: 'System Recovery',
      message: 'Gateway G3 reconnected successfully',
      time: '1 hour ago',
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50" onClick={onClose}>
      <div
        className="w-96 h-full bg-white shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h3 className="text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close notifications"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-sm text-gray-600">
              {notifications.filter(n => n.unread).length} unread
            </span>
            <button 
              className="text-sm text-blue-600 hover:text-blue-700"
              onClick={() => toast.success('All notifications marked as read!')}
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-2">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  notification.unread
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 ${
                    notification.type === 'error' ? 'text-red-600' :
                    notification.type === 'warning' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {notification.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-900">{notification.title}</p>
                      {notification.unread && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm text-gray-900 mb-3">Notification Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <span className="text-sm text-gray-700">Connectivity issues</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <span className="text-sm text-gray-700">Data quality alerts</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <span className="text-sm text-gray-700">Anomaly detection</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">System updates</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}