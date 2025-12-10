import { useState } from 'react';
import { TopBar } from './components/TopBar';
import { OverviewTab } from './components/tabs/OverviewTab';
import { LiveInspectionTab } from './components/tabs/LiveInspectionTab';
import { DefectAnalysisTab } from './components/tabs/DefectAnalysisTab';
import { ModelManagementTab } from './components/tabs/ModelManagementTab';
import { DatasetLabelingTab } from './components/tabs/DatasetLabelingTab';
import { ConfigurationTab } from './components/tabs/ConfigurationTab';

type Tab = 'overview' | 'live' | 'defects' | 'models' | 'dataset' | 'config';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedSite, setSelectedSite] = useState('plant-a');
  const [selectedLine, setSelectedLine] = useState('smt-line-3');
  const [selectedStation, setSelectedStation] = useState('aoi-2');

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview' },
    { id: 'live' as Tab, label: 'Live Inspection' },
    { id: 'defects' as Tab, label: 'Defect Analysis' },
    { id: 'models' as Tab, label: 'Model Management' },
    { id: 'dataset' as Tab, label: 'Dataset & Labeling' },
    { id: 'config' as Tab, label: 'Configuration' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        selectedSite={selectedSite}
        selectedLine={selectedLine}
        selectedStation={selectedStation}
        onSiteChange={setSelectedSite}
        onLineChange={setSelectedLine}
        onStationChange={setSelectedStation}
      />

      {/* Tabs Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto p-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'live' && <LiveInspectionTab />}
        {activeTab === 'defects' && <DefectAnalysisTab />}
        {activeTab === 'models' && <ModelManagementTab />}
        {activeTab === 'dataset' && <DatasetLabelingTab />}
        {activeTab === 'config' && <ConfigurationTab />}
      </main>

      {/* Bottom Status Bar */}
      <div className="sticky bottom-0 bg-gray-800 text-white px-6 py-2 text-sm">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Line Status: Running</span>
            </div>
            <div>Camera: Connected</div>
            <div>MES Integration: OK</div>
          </div>
          <div>Last inspection: 2 seconds ago</div>
        </div>
      </div>
    </div>
  );
}
