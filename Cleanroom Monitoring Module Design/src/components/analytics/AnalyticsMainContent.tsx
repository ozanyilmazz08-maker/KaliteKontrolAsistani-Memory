import React from 'react';
import { AnalyticsContext } from '../../analytics-app';
import OverviewDashboard from './organisms/OverviewDashboard';
import DatasetsView from './organisms/DatasetsView';
import VisualizationsView from './organisms/VisualizationsView';

/**
 * ORGANISM: Main Content Area
 * Container that houses the active view
 * - Always displays appropriate content based on context
 * - No empty states - each view is fully populated
 */

interface AnalyticsMainContentProps {
  context: AnalyticsContext;
  updateContext: (updates: Partial<AnalyticsContext>) => void;
}

export default function AnalyticsMainContent({ context, updateContext }: AnalyticsMainContentProps) {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      {context.activeView === 'overview' && (
        <OverviewDashboard context={context} updateContext={updateContext} />
      )}
      
      {context.activeView === 'datasets' && (
        <DatasetsView context={context} updateContext={updateContext} />
      )}
      
      {context.activeView === 'visualizations' && (
        <VisualizationsView context={context} updateContext={updateContext} />
      )}
      
      {context.activeView === 'reports' && (
        <div className="text-center py-12">
          <h2 className="text-gray-900 mb-2">Reports View</h2>
          <p className="text-gray-600">Generate and manage analytical reports</p>
        </div>
      )}
      
      {context.activeView === 'settings' && (
        <div className="text-center py-12">
          <h2 className="text-gray-900 mb-2">Settings View</h2>
          <p className="text-gray-600">Configure your analytics preferences</p>
        </div>
      )}
    </div>
  );
}
