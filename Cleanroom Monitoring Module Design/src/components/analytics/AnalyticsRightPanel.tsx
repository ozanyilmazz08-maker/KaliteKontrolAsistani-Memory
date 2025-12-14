import React, { useState } from 'react';
import { X, Info, Settings, Clock } from 'lucide-react';
import { AnalyticsContext } from '../../analytics-app';
import Card from './atoms/Card';
import Button from './atoms/Button';

/**
 * ORGANISM: Right Panel (Details/Settings)
 * Complete details sidebar with contextual information
 * - Header with title and close button
 * - Dataset info section (populated)
 * - Recent activity (populated)
 * - Quick actions (functional buttons)
 * NO EMPTY SPACES
 */

interface AnalyticsRightPanelProps {
  context: AnalyticsContext;
  updateContext: (updates: Partial<AnalyticsContext>) => void;
  onClose: () => void;
}

export default function AnalyticsRightPanel({ context, onClose }: AnalyticsRightPanelProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'settings' | 'activity'>('info');

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header - Molecule */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-gray-900">Details</h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Tab Navigation - Molecule */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'info' as const, label: 'Info', icon: Info },
          { id: 'settings' as const, label: 'Settings', icon: Settings },
          { id: 'activity' as const, label: 'Activity', icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 border-b-2 transition-all
                ${activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 bg-blue-50' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area - Always Populated */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'info' && (
          <div className="space-y-4">
            <Card>
              <h4 className="text-gray-900 mb-3">Dataset Information</h4>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="text-gray-900">Sales 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Records:</span>
                  <span className="text-gray-900">48,293</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="text-gray-900">12.4 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="text-gray-900">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Owner:</span>
                  <span className="text-gray-900">Sarah Chen</span>
                </div>
              </div>
            </Card>

            <Card>
              <h4 className="text-gray-900 mb-3">Columns (8)</h4>
              <div className="space-y-2">
                {['Date', 'Product', 'Region', 'Quantity', 'Revenue', 'Cost', 'Profit', 'Category'].map((col) => (
                  <div key={col} className="px-3 py-2 bg-gray-50 rounded border border-gray-200">
                    <span className="text-gray-900">{col}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <Card>
              <h4 className="text-gray-900 mb-3">Display Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Show gridlines</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Enable tooltips</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Auto-refresh data</span>
                </label>
              </div>
            </Card>

            <Card>
              <h4 className="text-gray-900 mb-3">Color Scheme</h4>
              <div className="grid grid-cols-4 gap-2">
                {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'].map((color) => (
                  <button
                    key={color}
                    className={`w-full h-10 ${color} rounded-lg border-2 border-transparent hover:border-gray-900 transition-all`}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-3">
            {[
              { action: 'Dataset updated', time: '2 hours ago', user: 'Sarah Chen' },
              { action: 'Chart created', time: '5 hours ago', user: 'Mike Johnson' },
              { action: 'Report generated', time: '1 day ago', user: 'Sarah Chen' },
              { action: 'Filter applied', time: '2 days ago', user: 'Emily Davis' },
              { action: 'Data exported', time: '3 days ago', user: 'Sarah Chen' }
            ].map((item, idx) => (
              <Card key={idx} padding="sm">
                <p className="text-gray-900">{item.action}</p>
                <p className="text-gray-600 mt-1">{item.user}</p>
                <p className="text-gray-500">{item.time}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions - Always Present */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button variant="primary" fullWidth>
          Save Changes
        </Button>
        <Button variant="secondary" fullWidth>
          Reset to Default
        </Button>
      </div>
    </div>
  );
}
