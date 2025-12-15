import { AppFilters } from '../../App';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { useState } from 'react';
import { CreateDialog } from '../dialogs/create-dialog';

interface TopBarProps {
  filters: AppFilters;
  onFilterChange: (filters: Partial<AppFilters>) => void;
}

const plants = [
  { value: 'all', label: 'All Plants' },
  { value: 'plant-a', label: 'Plant A' },
  { value: 'plant-b', label: 'Plant B' }
];

const areas = [
  { value: 'all', label: 'All Areas' },
  { value: 'production-1', label: 'Production Area 1' },
  { value: 'production-2', label: 'Production Area 2' },
  { value: 'production-3', label: 'Production Area 3' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'hvac', label: 'HVAC' }
];

const timeRanges = [
  { value: 'live', label: 'Live' },
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: 'custom', label: 'Custom' }
] as const;

export function TopBar({ filters, onFilterChange }: TopBarProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const selectedPlant = plants.find((p) => p.value === filters.plant) || plants[0];
  const selectedArea = areas.find((a) => a.value === filters.area) || areas[0];

  return (
    <>
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        {/* Left side - Filters */}
        <div className="flex items-center gap-4">
          {/* Plant selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {selectedPlant.label}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {plants.map((plant) => (
                <DropdownMenuItem
                  key={plant.value}
                  onClick={() => onFilterChange({ plant: plant.value })}
                >
                  {plant.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Area selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {selectedArea.label}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {areas.map((area) => (
                <DropdownMenuItem
                  key={area.value}
                  onClick={() => onFilterChange({ area: area.value })}
                >
                  {area.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Time range selector */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => onFilterChange({ timeRange: range.value })}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  filters.timeRange === range.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right side - Search and Actions */}
        <div className="flex items-center gap-4">
          {/* Global search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search assets, alerts, work orders..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              className="pl-10 w-80"
            />
          </div>

          {/* Create button */}
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create
          </Button>
        </div>
      </div>

      <CreateDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </>
  );
}
