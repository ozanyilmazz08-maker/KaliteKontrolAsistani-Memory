import { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { TabsBar } from './components/TabsBar';
import { Dashboard } from './components/tabs/Dashboard';
import { FAIOrders } from './components/tabs/FAIOrders';
import { CharacteristicsBallooning } from './components/tabs/CharacteristicsBallooning';
import { MeasurementDataCapture } from './components/tabs/MeasurementDataCapture';
import { ReportsApproval } from './components/tabs/ReportsApproval';
import { ConfigurationTemplates } from './components/tabs/ConfigurationTemplates';
import { Toaster } from 'sonner@2.0.3';

export type TabType = 'dashboard' | 'orders' | 'characteristics' | 'measurement' | 'reports' | 'config';

export interface GlobalContext {
  program: string;
  customer: string;
  plant: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [globalContext, setGlobalContext] = useState<GlobalContext>({
    program: 'A320 Wing',
    customer: 'OEM-X',
    plant: 'Plant 01 - Seattle'
  });

  // Set document title - force it multiple times to override Figma
  useEffect(() => {
    const setTitle = () => {
      document.title = 'Kalite Kontrol Asistanı';
    };
    
    setTitle();
    
    // Override after a slight delay in case Figma sets it later
    const timer = setTimeout(setTitle, 100);
    
    // Also set on visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTitle();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard globalContext={globalContext} />;
      case 'orders':
        return <FAIOrders globalContext={globalContext} />;
      case 'characteristics':
        return <CharacteristicsBallooning globalContext={globalContext} />;
      case 'measurement':
        return <MeasurementDataCapture globalContext={globalContext} />;
      case 'reports':
        return <ReportsApproval globalContext={globalContext} />;
      case 'config':
        return <ConfigurationTemplates globalContext={globalContext} />;
      default:
        return <Dashboard globalContext={globalContext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        globalContext={globalContext}
        onContextChange={setGlobalContext}
      />
      <TabsBar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="pt-[120px]">
        {renderTabContent()}
      </main>
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
        duration={4000}
      />
    </div>
  );
}