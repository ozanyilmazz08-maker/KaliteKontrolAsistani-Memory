import { Bell, HelpCircle, User, ChevronDown } from 'lucide-react';

interface TopBarProps {
  selectedSite: string;
  selectedLine: string;
  selectedStation: string;
  onSiteChange: (site: string) => void;
  onLineChange: (line: string) => void;
  onStationChange: (station: string) => void;
}

export function TopBar({
  selectedSite,
  selectedLine,
  selectedStation,
  onSiteChange,
  onLineChange,
  onStationChange,
}: TopBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div>
            <h1 className="text-gray-900">AI Visual Inspection</h1>
            <p className="text-sm text-gray-500 mt-1">
              Plant A · SMT Line 3 · AOI #2
            </p>
          </div>

          {/* Center Section - Global Selectors */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedSite}
                onChange={(e) => onSiteChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="plant-a">Plant A</option>
                <option value="plant-b">Plant B</option>
                <option value="plant-c">Plant C</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedLine}
                onChange={(e) => onLineChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="smt-line-1">SMT Line 1</option>
                <option value="smt-line-2">SMT Line 2</option>
                <option value="smt-line-3">SMT Line 3</option>
                <option value="final-assembly">Final Assembly</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedStation}
                onChange={(e) => onStationChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="aoi-1">AOI #1</option>
                <option value="aoi-2">AOI #2</option>
                <option value="aoi-3">AOI #3</option>
                <option value="spi-1">SPI #1</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
