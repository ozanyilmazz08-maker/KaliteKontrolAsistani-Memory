import React, { useState } from 'react';
import { Toaster } from 'sonner@2.0.3';
import TopBar from './components/TopBar';
import OverviewStatus from './components/OverviewStatus';
import FloorPlan from './components/FloorPlan';
import TrendAnalysis from './components/TrendAnalysis';
import EventsDeviations from './components/EventsDeviations';
import Reports from './components/Reports';
import Configuration from './components/Configuration';

export type TabType = 'overview' | 'floorplan' | 'trend' | 'events' | 'reports' | 'config';

export interface GlobalContext {
  site: string;
  building: string;
  areaGroup: string;
  dateRange: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedRoomForFloorPlan, setSelectedRoomForFloorPlan] = useState<string | null>(null);
  const [globalContext, setGlobalContext] = useState<GlobalContext>({
    site: 'Plant 1',
    building: 'Building A',
    areaGroup: 'Grade B/C/D Areas',
    dateRange: 'Last 24h'
  });

  const handleNavigateToFloorPlan = (roomId: string) => {
    setSelectedRoomForFloorPlan(roomId);
    setActiveTab('floorplan');
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview & Status' },
    { id: 'floorplan' as const, label: 'Floor Plan & Zones' },
    { id: 'trend' as const, label: 'Trend & Analysis' },
    { id: 'events' as const, label: 'Events, Deviations & CAPA' },
    { id: 'reports' as const, label: 'Reports & Regulatory Evidence' },
    { id: 'config' as const, label: 'Configuration, Validation & Integration' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      <TopBar 
        globalContext={globalContext}
        setGlobalContext={setGlobalContext}
      />

      {/* Tab Navigation */}
      <div className="sticky top-[72px] z-40 bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-6">
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 relative transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-[1920px] mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <OverviewStatus 
            globalContext={globalContext} 
            onNavigateToFloorPlan={handleNavigateToFloorPlan}
          />
        )}
        {activeTab === 'floorplan' && (
          <FloorPlan 
            globalContext={globalContext} 
            preselectedRoomId={selectedRoomForFloorPlan}
          />
        )}
        {activeTab === 'trend' && <TrendAnalysis globalContext={globalContext} />}
        {activeTab === 'events' && <EventsDeviations globalContext={globalContext} />}
        {activeTab === 'reports' && <Reports globalContext={globalContext} />}
        {activeTab === 'config' && <Configuration globalContext={globalContext} />}
      </div>
    </div>
  );
}