import { Bell, HelpCircle, ChevronDown, User } from 'lucide-react';
import { useState } from 'react';
import { GlobalContext } from '../App';

interface TopBarProps {
  globalContext: GlobalContext;
  onContextChange: (context: GlobalContext) => void;
}

export function TopBar({ globalContext, onContextChange }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleHelpClick = () => {
    window.open('https://help.example.com/fai-module', '_blank');
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex flex-col">
            <h1 className="text-gray-900">First Article Inspection (FAI)</h1>
            <p className="text-sm text-gray-500 mt-1">
              Program: {globalContext.program} · Customer: {globalContext.customer}
            </p>
          </div>

          {/* Center Section - Context Selectors */}
          <div className="flex items-center gap-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={globalContext.program}
              onChange={(e) => onContextChange({ ...globalContext, program: e.target.value })}
            >
              <option value="A320 Wing">A320 Wing</option>
              <option value="787 Fuselage">787 Fuselage</option>
              <option value="F-35 Components">F-35 Components</option>
              <option value="Medical Device Alpha">Medical Device Alpha</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={globalContext.customer}
              onChange={(e) => onContextChange({ ...globalContext, customer: e.target.value })}
            >
              <option value="OEM-X">OEM-X</option>
              <option value="Airbus">Airbus</option>
              <option value="Boeing">Boeing</option>
              <option value="Lockheed Martin">Lockheed Martin</option>
              <option value="Medtronic">Medtronic</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={globalContext.plant}
              onChange={(e) => onContextChange({ ...globalContext, plant: e.target.value })}
            >
              <option value="Plant 01 - Seattle">Plant 01 - Seattle</option>
              <option value="Plant 02 - Toulouse">Plant 02 - Toulouse</option>
              <option value="Plant 03 - Fort Worth">Plant 03 - Fort Worth</option>
              <option value="Plant 04 - Minneapolis">Plant 04 - Minneapolis</option>
            </select>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleHelpClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Help & Documentation"
            >
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>
            
            <button 
              onClick={handleNotificationClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">J. Smith</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}