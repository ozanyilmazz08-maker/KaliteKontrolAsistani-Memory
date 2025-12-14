import React from 'react';
import { Activity, Database, Clock, Wifi } from 'lucide-react';
import { AnalyticsContext } from '../../analytics-app';

/**
 * ORGANISM: Status Bar
 * Complete bottom status display with system info
 * - Connection status indicator
 * - Active dataset info
 * - Last sync time
 * - System health
 * ALL POPULATED - no empty sections
 */

interface AnalyticsStatusBarProps {
  context: AnalyticsContext;
}

export default function AnalyticsStatusBar({ context }: AnalyticsStatusBarProps) {
  return (
    <div className="h-10 bg-gray-900 text-gray-300 px-6 flex items-center justify-between border-t border-gray-800">
      {/* Left Section - Connection & Dataset */}
      <div className="flex items-center gap-6">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <Wifi className="w-4 h-4" />
          <span>Connected</span>
        </div>

        {/* Active Dataset */}
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span>Dataset: {context.selectedDataset || 'None'}</span>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Range: {context.dateRange.start} to {context.dateRange.end}</span>
        </div>
      </div>

      {/* Right Section - System Info */}
      <div className="flex items-center gap-6">
        {/* Last Sync */}
        <span className="text-gray-400">Last sync: 2 min ago</span>

        {/* System Health */}
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span>All systems operational</span>
        </div>

        {/* Version */}
        <span className="text-gray-500">v2.4.1</span>
      </div>
    </div>
  );
}
