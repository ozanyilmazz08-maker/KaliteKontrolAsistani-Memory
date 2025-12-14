import React, { useState } from 'react';
import { HelpCircle, Bell, User, ChevronDown } from 'lucide-react';
import { GlobalContext } from '../App';
import StandardsDialog from './StandardsDialog';
import NotificationsPanel from './NotificationsPanel';

interface TopBarProps {
  globalContext: GlobalContext;
  setGlobalContext: (context: GlobalContext) => void;
}

export default function TopBar({ globalContext, setGlobalContext }: TopBarProps) {
  const [showStandards, setShowStandards] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const sites = ['Plant 1', 'Plant 2', 'Plant 3'];
  const buildings = ['Building A', 'Building B', 'Building C'];
  const areaGroups = ['Grade A Areas', 'Grade B/C/D Areas', 'All Areas'];
  const dateRanges = ['Last 1h', 'Last 4h', 'Last 24h', 'Last 7d', 'Last 30d', 'Custom'];

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div>
            <h1 className="text-gray-900">Cleanroom Monitoring</h1>
            <p className="text-gray-600 mt-1">
              Site: {globalContext.site} · {globalContext.building} · {globalContext.areaGroup}
            </p>
          </div>

          {/* Center - Context Selectors */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={globalContext.site}
                onChange={(e) => setGlobalContext({ ...globalContext, site: e.target.value })}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sites.map(site => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={globalContext.building}
                onChange={(e) => setGlobalContext({ ...globalContext, building: e.target.value })}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {buildings.map(building => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={globalContext.areaGroup}
                onChange={(e) => setGlobalContext({ ...globalContext, areaGroup: e.target.value })}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {areaGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={globalContext.dateRange}
                onChange={(e) => setGlobalContext({ ...globalContext, dateRange: e.target.value })}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {dateRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStandards(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Standards & Help"
            >
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {showNotifications && (
                <NotificationsPanel onClose={() => setShowNotifications(false)} />
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">J. Smith (QA Lead)</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-gray-900">Jane Smith</p>
                    <p className="text-gray-600">QA Lead · Validated User</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700">
                    Electronic Signature
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700">
                    Audit Trail
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showStandards && <StandardsDialog onClose={() => setShowStandards(false)} />}
    </div>
  );
}
