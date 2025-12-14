import React, { useState } from 'react';
import { GlobalContext } from '../App';
import { Filter, FileText, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';
import EventDetailPanel from './EventDetailPanel';
import { toast } from 'sonner@2.0.3';

interface EventsDeviationsProps {
  globalContext: GlobalContext;
}

interface Event {
  id: string;
  room: string;
  parameter: string;
  severity: 'alert' | 'action' | 'critical';
  startTime: string;
  endTime: string | null;
  duration: string;
  batches: string[];
  status: 'Open' | 'Under Investigation' | 'Closed';
  capaIds: string[];
  value: string;
  limit: string;
}

export default function EventsDeviations({ globalContext }: EventsDeviationsProps) {
  const [filters, setFilters] = useState({
    dateRange: 'Last 7 days',
    parameter: 'All',
    severity: 'All',
    batch: 'All',
    status: 'All'
  });

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sortBy, setSortBy] = useState<'time' | 'severity' | 'room'>('time');

  const events: Event[] = [
    {
      id: 'DEV-2024-0156',
      room: 'Room 201',
      parameter: 'Particle 0.5µm',
      severity: 'action',
      startTime: '2024-12-11 16:00',
      endTime: null,
      duration: '5 min (ongoing)',
      batches: ['2024-1234'],
      status: 'Under Investigation',
      capaIds: ['CAPA-2024-089'],
      value: '3,520 particles/m³',
      limit: '3,500 particles/m³ (Action)'
    },
    {
      id: 'DEV-2024-0155',
      room: 'Room 105',
      parameter: 'Differential Pressure',
      severity: 'alert',
      startTime: '2024-12-11 12:15',
      endTime: '2024-12-11 14:30',
      duration: '2h 15min',
      batches: [],
      status: 'Closed',
      capaIds: [],
      value: '9.8 Pa',
      limit: '10 Pa (Alert)'
    },
    {
      id: 'DEV-2024-0154',
      room: 'Room 301',
      parameter: 'Microbial (Surface)',
      severity: 'action',
      startTime: '2024-12-10 09:30',
      endTime: '2024-12-10 09:30',
      duration: 'Single sample',
      batches: ['2024-1230', '2024-1231'],
      status: 'Under Investigation',
      capaIds: ['CAPA-2024-088'],
      value: '8 CFU',
      limit: '5 CFU (Action)'
    },
    {
      id: 'DEV-2024-0153',
      room: 'Room 204',
      parameter: 'Temperature',
      severity: 'alert',
      startTime: '2024-12-09 14:00',
      endTime: '2024-12-09 15:45',
      duration: '1h 45min',
      batches: ['2024-1228'],
      status: 'Closed',
      capaIds: ['CAPA-2024-087'],
      value: '22.3°C',
      limit: '22°C (Alert)'
    },
    {
      id: 'DEV-2024-0152',
      room: 'Room 201',
      parameter: 'Particle 5.0µm',
      severity: 'alert',
      startTime: '2024-12-08 10:20',
      endTime: '2024-12-08 11:00',
      duration: '40 min',
      batches: ['2024-1225'],
      status: 'Closed',
      capaIds: [],
      value: '32 particles/m³',
      limit: '29 particles/m³ (Alert)'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'action':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'alert':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-700';
      case 'Under Investigation':
        return 'bg-yellow-100 text-yellow-700';
      case 'Closed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const acknowledgeEvent = (eventId: string) => {
    toast.success('Event acknowledged', {
      description: `Event ${eventId} has been acknowledged by J. Smith (QA Lead)`
    });
  };

  // Sort events based on selected sort option
  const sortedEvents = [...events].sort((a, b) => {
    switch (sortBy) {
      case 'time':
        // Newest first
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      case 'severity':
        // Critical > Action > Alert
        const severityOrder = { critical: 3, action: 2, alert: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      case 'room':
        // Alphabetical by room
        return a.room.localeCompare(b.room);
      default:
        return 0;
    }
  });

  return (
    <div className="flex gap-6">
      {/* Left - Filters */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-600" />
            <h3 className="text-gray-900">Filters</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This Year</option>
                <option>Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Parameter</label>
              <select
                value={filters.parameter}
                onChange={(e) => setFilters({ ...filters, parameter: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All</option>
                <option>Particle</option>
                <option>Microbial</option>
                <option>Temperature</option>
                <option>Humidity</option>
                <option>Pressure</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All</option>
                <option>Critical</option>
                <option>Action</option>
                <option>Alert</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Batch/Lot</label>
              <select
                value={filters.batch}
                onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All</option>
                <option>2024-1234</option>
                <option>2024-1233</option>
                <option>2024-1230</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All</option>
                <option>Open</option>
                <option>Under Investigation</option>
                <option>Closed</option>
              </select>
            </div>

            <button
              onClick={() => setFilters({
                dateRange: 'Last 7 days',
                parameter: 'All',
                severity: 'All',
                batch: 'All',
                status: 'All'
              })}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
          <h3 className="text-gray-900 mb-3">Sort By</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                value="time"
                checked={sortBy === 'time'}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">Time (Newest First)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                value="severity"
                checked={sortBy === 'severity'}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">Severity</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                value="room"
                checked={sortBy === 'room'}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">Room</span>
            </label>
          </div>
        </div>
      </div>

      {/* Center - Events Table */}
      <div className="flex-1">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-gray-900">Environmental Events & Deviations</h2>
            <p className="text-gray-600 mt-1">
              Showing {events.length} events · {filters.dateRange}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Event ID</th>
                  <th className="px-6 py-3 text-left text-gray-700">Room/Zone</th>
                  <th className="px-6 py-3 text-left text-gray-700">Parameter</th>
                  <th className="px-6 py-3 text-left text-gray-700">Severity</th>
                  <th className="px-6 py-3 text-left text-gray-700">Start Time</th>
                  <th className="px-6 py-3 text-left text-gray-700">Duration</th>
                  <th className="px-6 py-3 text-left text-gray-700">Batches</th>
                  <th className="px-6 py-3 text-left text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-gray-700">CAPA</th>
                  <th className="px-6 py-3 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-blue-600">{event.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{event.room}</td>
                    <td className="px-6 py-4 text-gray-900">{event.parameter}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded border ${getSeverityColor(event.severity)}`}>
                        {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{event.startTime}</td>
                    <td className="px-6 py-4 text-gray-700">{event.duration}</td>
                    <td className="px-6 py-4">
                      {event.batches.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {event.batches.map(batch => (
                            <span key={batch} className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                              {batch}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {event.capaIds.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {event.capaIds.map(capa => (
                            <span key={capa} className="text-purple-600">{capa}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {event.status === 'Open' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            acknowledgeEvent(event.id);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Events</p>
                <p className="text-gray-900 mt-1">{events.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Open / Investigating</p>
                <p className="text-yellow-600 mt-1">
                  {events.filter(e => e.status === 'Open' || e.status === 'Under Investigation').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">With CAPA</p>
                <p className="text-purple-600 mt-1">
                  {events.filter(e => e.capaIds.length > 0).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Closed</p>
                <p className="text-green-600 mt-1">
                  {events.filter(e => e.status === 'Closed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Right - Event Detail Panel */}
      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}