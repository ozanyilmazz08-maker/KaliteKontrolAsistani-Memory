import { useState } from 'react';
import { Bell, HelpCircle, User, ChevronDown } from 'lucide-react';
import { Toaster } from 'sonner@2.0.3';
import { OverviewTab } from './components/OverviewTab';
import { SensorInventoryTab } from './components/SensorInventoryTab';
import { LiveDataTab } from './components/LiveDataTab';
import { DataQualityTab } from './components/DataQualityTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { ConfigurationTab } from './components/ConfigurationTab';
import { NotificationPanel } from './components/NotificationPanel';
import { HelpPanel } from './components/HelpPanel';

type TabType = 'overview' | 'inventory' | 'live' | 'quality' | 'analytics' | 'config';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedSite, setSelectedSite] = useState('Plant A');
  const [selectedArea, setSelectedArea] = useState('Assembly Area');
  const [selectedLine, setSelectedLine] = useState('Line 4');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'inventory', label: 'Sensor Inventory' },
    { id: 'live', label: 'Live Data & Dashboards' },
    { id: 'quality', label: 'Data Quality & Streaming' },
    { id: 'analytics', label: 'Analytics & Anomalies' },
    { id: 'config', label: 'Configuration & Integration' },
  ];

  const sites = ['Plant A', 'Plant B', 'Plant C'];
  const areas = ['Assembly Area', 'Manufacturing Area', 'Quality Lab', 'Warehouse'];
  const lines = ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Title and Context */}
            <div>
              <h1 className="text-gray-900">IoT Sensors</h1>
              <p className="text-sm text-gray-600">
                {selectedSite} · {selectedArea} · {selectedLine}
              </p>
            </div>

            {/* Center: Context Selectors */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {sites.map(site => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={selectedLine}
                  onChange={(e) => setSelectedLine(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {lines.map(line => (
                    <option key={line} value={line}>{line}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                aria-label="Help"
              >
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="User menu">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Tabs Bar */}
        <div className="border-t border-gray-200 bg-white">
          <div className="px-6">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {activeTab === 'overview' && <OverviewTab context={{ site: selectedSite, area: selectedArea, line: selectedLine }} />}
        {activeTab === 'inventory' && <SensorInventoryTab />}
        {activeTab === 'live' && <LiveDataTab />}
        {activeTab === 'quality' && <DataQualityTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'config' && <ConfigurationTab />}
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}

      {/* Help Panel */}
      {showHelp && (
        <HelpPanel onClose={() => setShowHelp(false)} />
      )}

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}