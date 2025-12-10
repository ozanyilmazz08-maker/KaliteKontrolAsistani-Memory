import { useState } from 'react';

export function FAIOrdersFilters() {
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [criticalityFilter, setCriticalityFilter] = useState('All Levels');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    if (value !== 'All Statuses' && !activeFilters.includes(value)) {
      setActiveFilters([...activeFilters, value]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
    if (filter === statusFilter) setStatusFilter('All Statuses');
    if (filter === typeFilter) setTypeFilter('All Types');
    if (filter === criticalityFilter) setCriticalityFilter('All Levels');
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Status:</label>
        <select 
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All Statuses</option>
          <option>Draft</option>
          <option>In Progress</option>
          <option>Awaiting Customer</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* FAI Type Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Type:</label>
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All Types</option>
          <option>Initial Production</option>
          <option>Revision Change</option>
          <option>Supplier Resubmission</option>
          <option>Process Change</option>
        </select>
      </div>

      {/* Criticality Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Criticality:</label>
        <select 
          value={criticalityFilter}
          onChange={(e) => setCriticalityFilter(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All Levels</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2">
          {activeFilters.map((filter) => (
            <span key={filter} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1">
              {filter}
              <button 
                onClick={() => removeFilter(filter)}
                className="hover:text-blue-900"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}