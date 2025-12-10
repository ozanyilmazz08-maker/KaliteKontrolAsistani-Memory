import { Calendar } from 'lucide-react';
import { useState } from 'react';

export function DashboardFilters() {
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>(['OEM-X']);
  const [selectedPlants, setSelectedPlants] = useState<string[]>(['Plant 01 - Seattle']);
  const [productFamily, setProductFamily] = useState('All');
  const [supplier, setSupplier] = useState('All');

  const handleApplyFilters = () => {
    console.log('Filters applied:', {
      timeRange,
      selectedCustomers,
      selectedPlants,
      productFamily,
      supplier
    });
    // Toast notification would go here
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm text-gray-700 mb-3">Filters</h3>
      </div>

      {/* Time Range */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Time Range</label>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
          <option>Custom range</option>
        </select>
      </div>

      {/* Customer */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Customer</label>
        <select 
          value={selectedCustomers}
          onChange={(e) => {
            const options = Array.from(e.target.selectedOptions, option => option.value);
            setSelectedCustomers(options);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
          multiple 
          size={4}
        >
          <option>OEM-X</option>
          <option>Airbus</option>
          <option>Boeing</option>
          <option>Lockheed Martin</option>
        </select>
      </div>

      {/* Plant/Site */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Plant/Site</label>
        <select 
          value={selectedPlants}
          onChange={(e) => {
            const options = Array.from(e.target.selectedOptions, option => option.value);
            setSelectedPlants(options);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
          multiple 
          size={3}
        >
          <option>Plant 01 - Seattle</option>
          <option>Plant 02 - Toulouse</option>
          <option>Plant 03 - Fort Worth</option>
        </select>
      </div>

      {/* Product Family */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Product Family</label>
        <select 
          value={productFamily}
          onChange={(e) => setProductFamily(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>Wing Components</option>
          <option>Fuselage Components</option>
          <option>Avionics Housing</option>
          <option>Landing Gear</option>
        </select>
      </div>

      {/* Supplier */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">Supplier</label>
        <select 
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>Supplier A - Precision Machining</option>
          <option>Supplier B - Composites</option>
          <option>Supplier C - Castings</option>
        </select>
      </div>

      <button 
        onClick={handleApplyFilters}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        Apply Filters
      </button>
    </div>
  );
}