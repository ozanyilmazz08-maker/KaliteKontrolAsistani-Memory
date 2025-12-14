import React, { useState } from 'react';
import { Toaster } from 'sonner@2.0.3';
import AnalyticsSidebar from './components/analytics/AnalyticsSidebar';
import AnalyticsToolbar from './components/analytics/AnalyticsToolbar';
import AnalyticsMainContent from './components/analytics/AnalyticsMainContent';
import AnalyticsRightPanel from './components/analytics/AnalyticsRightPanel';
import AnalyticsStatusBar from './components/analytics/AnalyticsStatusBar';

export type ViewType = 'overview' | 'datasets' | 'visualizations' | 'reports' | 'settings';

export interface AnalyticsContext {
  activeView: ViewType;
  selectedDataset: string | null;
  dateRange: { start: string; end: string };
  filters: {
    category: string;
    status: string;
  };
}

export default function AnalyticsApp() {
  const [context, setContext] = useState<AnalyticsContext>({
    activeView: 'overview',
    selectedDataset: 'sales_2024',
    dateRange: {
      start: '2024-01-01',
      end: '2024-12-11'
    },
    filters: {
      category: 'All',
      status: 'Active'
    }
  });

  const [showRightPanel, setShowRightPanel] = useState(true);

  const updateContext = (updates: Partial<AnalyticsContext>) => {
    setContext(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toaster position="top-right" richColors />
      
      {/* Organism: Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Organism: Left Sidebar */}
        <AnalyticsSidebar 
          activeView={context.activeView}
          onViewChange={(view) => updateContext({ activeView: view })}
        />

        {/* Organism: Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Organism: Top Toolbar */}
          <AnalyticsToolbar
            context={context}
            updateContext={updateContext}
            onToggleRightPanel={() => setShowRightPanel(!showRightPanel)}
            showRightPanel={showRightPanel}
          />

          {/* Organism: Content + Right Panel Container */}
          <div className="flex-1 flex overflow-hidden">
            {/* Organism: Main Content */}
            <AnalyticsMainContent
              context={context}
              updateContext={updateContext}
            />

            {/* Organism: Right Panel (Details/Settings) */}
            {showRightPanel && (
              <AnalyticsRightPanel
                context={context}
                updateContext={updateContext}
                onClose={() => setShowRightPanel(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Organism: Bottom Status Bar */}
      <AnalyticsStatusBar context={context} />
    </div>
  );
}
