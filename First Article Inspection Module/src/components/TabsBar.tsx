import { LayoutDashboard, FileText, Target, Ruler, FileCheck, Settings } from 'lucide-react';
import { TabType } from '../App';

interface TabsBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders' as TabType, label: 'FAI Orders', icon: FileText },
  { id: 'characteristics' as TabType, label: 'Characteristics & Ballooning', icon: Target },
  { id: 'measurement' as TabType, label: 'Measurement & Data Capture', icon: Ruler },
  { id: 'reports' as TabType, label: 'Reports & Approval', icon: FileCheck },
  { id: 'config' as TabType, label: 'Configuration & Templates', icon: Settings },
];

export function TabsBar({ activeTab, onTabChange }: TabsBarProps) {
  return (
    <div className="fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 z-40">
      <div className="px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-colors
                  ${isActive 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
