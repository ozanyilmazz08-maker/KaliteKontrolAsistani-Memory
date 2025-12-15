import { NavigationPage } from '../../App';
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  Database,
  ClipboardList,
  Wrench,
  Brain,
  FileText,
  Activity
} from 'lucide-react';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <LayoutDashboard className="w-5 h-5" />
  },
  {
    id: 'assets',
    label: 'Assets',
    icon: <Package className="w-5 h-5" />
  },
  {
    id: 'alerts',
    label: 'Alerts & Anomalies',
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    id: 'work-orders',
    label: 'Work Orders',
    icon: <ClipboardList className="w-5 h-5" />
  },
  {
    id: 'spares',
    label: 'Spares & Inventory',
    icon: <Wrench className="w-5 h-5" />
  },
  {
    id: 'data-sources',
    label: 'Data Sources & Sensors',
    icon: <Database className="w-5 h-5" />
  },
  {
    id: 'models',
    label: 'Models & Rules',
    icon: <Brain className="w-5 h-5" />
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <FileText className="w-5 h-5" />
  }
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo and branding */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Activity className="w-6 h-6 text-blue-600 mr-2" />
        <span className="font-semibold text-gray-900">Equipment Health</span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={currentPage === item.id ? 'text-blue-600' : 'text-gray-500'}>
                  {item.icon}
                </span>
                <span className="ml-3">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full text-sm text-gray-600 hover:text-gray-900 text-left px-3 py-2">
          Settings
        </button>
      </div>
    </div>
  );
}
