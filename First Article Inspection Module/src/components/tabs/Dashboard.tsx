import { GlobalContext } from '../../App';
import { KPICards } from '../dashboard/KPICards';
import { StatusCharts } from '../dashboard/StatusCharts';
import { TimelineAging } from '../dashboard/TimelineAging';
import { CriticalItemsList } from '../dashboard/CriticalItemsList';
import { DashboardFilters } from '../dashboard/DashboardFilters';

interface DashboardProps {
  globalContext: GlobalContext;
}

export function Dashboard({ globalContext }: DashboardProps) {
  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Left: Filters */}
      <div className="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto">
        <DashboardFilters />
      </div>

      {/* Center: Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <KPICards />
        <div className="mt-6">
          <StatusCharts />
        </div>
        <div className="mt-6">
          <TimelineAging />
        </div>
      </div>

      {/* Right: Critical Items */}
      <div className="w-96 border-l border-gray-200 bg-white p-4 overflow-y-auto">
        <CriticalItemsList />
      </div>
    </div>
  );
}
