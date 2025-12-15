import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { Sidebar } from './components/layout/sidebar';
import { TopBar } from './components/layout/top-bar';
import { OverviewScreen } from './components/screens/overview-screen';
import { AssetsScreen } from './components/screens/assets-screen';
import { AlertsScreen } from './components/screens/alerts-screen';
import { AssetDetailScreen } from './components/screens/asset-detail-screen';
import { DataSourcesScreen } from './components/screens/data-sources-screen';
import { WorkOrdersScreen } from './components/screens/work-orders-screen';
import { SparesScreen } from './components/screens/spares-screen';
import { ModelsScreen } from './components/screens/models-screen';
import { ReportsScreen } from './components/screens/reports-screen';

export type NavigationPage =
  | 'overview'
  | 'assets'
  | 'alerts'
  | 'asset-detail'
  | 'data-sources'
  | 'work-orders'
  | 'spares'
  | 'models'
  | 'reports';

export interface AppFilters {
  plant: string;
  area: string;
  timeRange: 'live' | '24h' | '7d' | '30d' | 'custom';
  searchQuery: string;
}

export interface AppState {
  currentPage: NavigationPage;
  selectedAssetId: string | null;
  selectedAlertId: string | null;
  filters: AppFilters;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'overview',
    selectedAssetId: null,
    selectedAlertId: null,
    filters: {
      plant: 'all',
      area: 'all',
      timeRange: '7d',
      searchQuery: ''
    }
  });

  const handleNavigate = (page: NavigationPage, assetId?: string, alertId?: string) => {
    setAppState(prev => ({
      ...prev,
      currentPage: page,
      selectedAssetId: assetId || null,
      selectedAlertId: alertId || null
    }));
  };

  const handleFilterChange = (filters: Partial<AppFilters>) => {
    setAppState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...filters
      }
    }));
  };

  const renderScreen = () => {
    switch (appState.currentPage) {
      case 'overview':
        return <OverviewScreen filters={appState.filters} onNavigate={handleNavigate} />;
      case 'assets':
        return <AssetsScreen filters={appState.filters} onNavigate={handleNavigate} />;
      case 'alerts':
        return (
          <AlertsScreen
            filters={appState.filters}
            selectedAlertId={appState.selectedAlertId}
            onNavigate={handleNavigate}
          />
        );
      case 'asset-detail':
        return (
          <AssetDetailScreen
            assetId={appState.selectedAssetId || 'A001'}
            onNavigate={handleNavigate}
          />
        );
      case 'data-sources':
        return <DataSourcesScreen />;
      case 'work-orders':
        return <WorkOrdersScreen filters={appState.filters} onNavigate={handleNavigate} />;
      case 'spares':
        return <SparesScreen />;
      case 'models':
        return <ModelsScreen />;
      case 'reports':
        return <ReportsScreen filters={appState.filters} />;
      default:
        return <OverviewScreen filters={appState.filters} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPage={appState.currentPage} onNavigate={handleNavigate} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar filters={appState.filters} onFilterChange={handleFilterChange} />
        
        <main className="flex-1 overflow-auto p-6">
          {renderScreen()}
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
