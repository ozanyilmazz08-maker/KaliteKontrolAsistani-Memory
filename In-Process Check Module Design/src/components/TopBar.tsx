import { Bell, HelpCircle, ChevronDown, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner@2.0.3';

interface TopBarProps {
  context: {
    site: string;
    line: string;
    station: string;
    operation: string;
    product: string;
  };
  onContextChange: (context: any) => void;
}

export default function TopBar({ context, onContextChange }: TopBarProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const sites = ['Plant A', 'Plant B', 'Plant C'];
  const lines = ['Line 1', 'Line 2', 'Line 3', 'Line 4'];
  const stations = ['Station #3', 'Station #4', 'Station #5', 'Station #6'];
  const operations = ['Drilling', 'Milling', 'Assembly', 'Inspection'];
  const products = ['Part A-2301', 'Part B-1550', 'Part C-8802'];

  // Close panels when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setShowHelp(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setShowAlerts(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title & Context */}
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-gray-900">In-Process Check</h1>
              <p className="text-gray-500 text-sm">
                {context.site} · {context.line} · {context.operation} · {context.station}
              </p>
            </div>
          </div>

          {/* Center: Context Selectors */}
          <div className="flex items-center gap-3">
            <select
              value={context.site}
              onChange={(e) => onContextChange({ ...context, site: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sites.map(site => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>

            <select
              value={context.line}
              onChange={(e) => onContextChange({ ...context, line: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {lines.map(line => (
                <option key={line} value={line}>{line}</option>
              ))}
            </select>

            <select
              value={context.station}
              onChange={(e) => onContextChange({ ...context, station: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {stations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </select>

            <select
              value={context.operation}
              onChange={(e) => onContextChange({ ...context, operation: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {operations.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>

            <select
              value={context.product}
              onChange={(e) => onContextChange({ ...context, product: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {products.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-sm">J. Smith</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Help Panel */}
      {showHelp && (
        <div ref={helpRef} className="absolute top-full right-6 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-6 z-50">
          <h3 className="text-gray-900 mb-3">Help & Standards</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-900 mb-1">Statistical Process Control (SPC)</p>
              <p>SPC uses control charts to monitor process stability and detect assignable causes of variation.</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Standards Compliance</p>
              <p>This module aligns with IATF 16949, AS9100, ISO 13485, and related quality management standards.</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Control Plans</p>
              <p>In-process checks are defined in control plans with specified frequencies, limits, and reaction plans.</p>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Panel */}
      {showAlerts && (
        <div ref={alertsRef} className="absolute top-full right-6 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-gray-900">Active Alerts</h3>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">OOC Event - Hole Diameter</p>
                  <p className="text-xs text-gray-500 mt-1">Line 2, Station #5 - 8 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Missed Check - Torque Measurement</p>
                  <p className="text-xs text-gray-500 mt-1">Line 3, Station #2 - 15 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Menu */}
      {showUserMenu && (
        <div ref={userMenuRef} className="absolute top-full right-6 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-gray-900">User Menu</h3>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="p-4 hover:bg-gray-50">
              <p className="text-sm text-gray-900">Profile</p>
            </div>
            <div className="p-4 hover:bg-gray-50">
              <p className="text-sm text-gray-900">Settings</p>
            </div>
            <div className="p-4 hover:bg-gray-50">
              <p className="text-sm text-gray-900">Logout</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}