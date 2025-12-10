import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import OperatorView from './components/OperatorView';
import SPCCharts from './components/SPCCharts';
import SamplingFrequency from './components/SamplingFrequency';
import AnalysisRootCause from './components/AnalysisRootCause';
import Configuration from './components/Configuration';
import { Toaster } from 'sonner@2.0.3';

export default function App() {
  const [activeTab, setActiveTab] = useState('operator');
  const [context, setContext] = useState({
    site: 'Plant B',
    line: 'Line 2',
    station: 'Station #5',
    operation: 'Drilling',
    product: 'Part A-2301'
  });

  // Set document title
  useEffect(() => {
    document.title = 'In-Process Check - Quality Control System';
  }, []);

  const tabs = [
    { id: 'operator', label: 'Operator View' },
    { id: 'spc', label: 'SPC Charts' },
    { id: 'sampling', label: 'Sampling & Frequency' },
    { id: 'analysis', label: 'Analysis & Root Cause' },
    { id: 'config', label: 'Configuration' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <TopBar context={context} onContextChange={setContext} />
      
      {/* Sticky Tabs Bar */}
      <div className="sticky top-16 bg-white border-b border-gray-200 z-40">
        <div className="max-w-[1920px] mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 border-b-2 transition-colors ${
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

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto">
        {activeTab === 'operator' && <OperatorView context={context} />}
        {activeTab === 'spc' && <SPCCharts context={context} />}
        {activeTab === 'sampling' && <SamplingFrequency context={context} />}
        {activeTab === 'analysis' && <AnalysisRootCause context={context} />}
        {activeTab === 'config' && <Configuration context={context} />}
      </div>
    </div>
  );
}