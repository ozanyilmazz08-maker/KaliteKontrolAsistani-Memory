import React from 'react';
import { BarChart3, Database, PieChart, FileText, Settings, User, LogOut } from 'lucide-react';
import { ViewType } from '../../analytics-app';
import Button from './atoms/Button';

/**
 * ORGANISM: Sidebar
 * Complete navigation panel with all required children
 * - Logo/branding section
 * - Navigation links (molecules)
 * - User profile section (molecule)
 * - Logout action
 * NO EMPTY SPACES - every section populated
 */

interface AnalyticsSidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function AnalyticsSidebar({ activeView, onViewChange }: AnalyticsSidebarProps) {
  const navItems: Array<{ id: ViewType; label: string; icon: typeof BarChart3 }> = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'visualizations', label: 'Visualizations', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo Section - Molecule */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white">DataLens Pro</h1>
            <p className="text-gray-400">Analytics Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Links - Molecules */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile Section - Molecule */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3 p-3 bg-gray-800 rounded-lg">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white truncate">Sarah Chen</p>
            <p className="text-gray-400">Data Analyst</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          icon={LogOut}
          fullWidth
          onClick={() => console.log('Logout')}
        >
          <span className="text-gray-300">Logout</span>
        </Button>
      </div>
    </div>
  );
}
