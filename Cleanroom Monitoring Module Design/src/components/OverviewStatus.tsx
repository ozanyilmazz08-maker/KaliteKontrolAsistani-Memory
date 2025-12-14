import React, { useState } from 'react';
import { GlobalContext } from '../App';
import KPICard from './KPICard';
import RoomStatusCard from './RoomStatusCard';
import ActiveDeviationsModal from './ActiveDeviationsModal';
import CAPAItemsModal from './CAPAItemsModal';
import EMReportModal from './EMReportModal';
import BatchLinkageModal from './BatchLinkageModal';
import RoomTrendModal from './RoomTrendModal';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';

interface OverviewStatusProps {
  globalContext: GlobalContext;
  onNavigateToFloorPlan?: (roomId: string) => void;
}

export default function OverviewStatus({ globalContext, onNavigateToFloorPlan }: OverviewStatusProps) {
  const [filters, setFilters] = useState({
    grade: 'All',
    roomType: 'All',
    parameter: 'All'
  });

  const [showDeviations, setShowDeviations] = useState(false);
  const [showCAPAItems, setShowCAPAItems] = useState(false);
  const [showEMReport, setShowEMReport] = useState(false);
  const [showBatchLinkage, setShowBatchLinkage] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomTrendModal, setShowRoomTrendModal] = useState(false);

  const kpis = [
    {
      label: 'Rooms in Spec',
      value: '42',
      total: '45',
      percentage: '93.3%',
      trend: 'stable',
      timeContext: 'Current Status'
    },
    {
      label: 'Particle Excursions',
      value: '2',
      trend: 'up',
      timeContext: 'Last 24h',
      severity: 'warning'
    },
    {
      label: 'Microbial Excursions',
      value: '1',
      trend: 'down',
      timeContext: 'Last 7 days',
      severity: 'critical'
    },
    {
      label: 'Pressure Excursions',
      value: '1',
      trend: 'stable',
      timeContext: 'Last 24h',
      severity: 'warning'
    },
    {
      label: 'Open EM Deviations',
      value: '3',
      trend: 'down',
      timeContext: 'Active',
      severity: 'info'
    },
    {
      label: 'Data Integrity Alerts',
      value: '0',
      trend: 'stable',
      timeContext: 'Last 24h',
      severity: 'success'
    }
  ];

  const rooms = [
    {
      id: 'R-201',
      name: 'Room 201 - Filling Suite',
      grade: 'Grade B',
      isoClass: 'ISO 7',
      status: 'excursion',
      roomType: 'Filling',
      parameters: {
        particle: 'excursion',
        micro: 'ok',
        temp: 'ok',
        humidity: 'ok',
        pressure: 'ok',
        airflow: 'ok'
      },
      lastSampling: '2 min ago'
    },
    {
      id: 'R-105',
      name: 'Room 105 - Weighing',
      grade: 'Grade C',
      isoClass: 'ISO 8',
      status: 'warning',
      roomType: 'Weighing',
      parameters: {
        particle: 'ok',
        micro: 'ok',
        temp: 'ok',
        humidity: 'ok',
        pressure: 'warning',
        airflow: 'ok'
      },
      lastSampling: '15 min ago'
    },
    {
      id: 'R-301',
      name: 'Room 301 - Aseptic Core',
      grade: 'Grade A',
      isoClass: 'ISO 5',
      status: 'ok',
      roomType: 'Production',
      parameters: {
        particle: 'ok',
        micro: 'ok',
        temp: 'ok',
        humidity: 'ok',
        pressure: 'ok',
        airflow: 'ok'
      },
      lastSampling: '5 min ago'
    },
    {
      id: 'R-204',
      name: 'Room 204 - Compounding',
      grade: 'Grade C',
      isoClass: 'ISO 8',
      status: 'ok',
      roomType: 'Production',
      parameters: {
        particle: 'ok',
        micro: 'ok',
        temp: 'ok',
        humidity: 'ok',
        pressure: 'ok',
        airflow: 'ok'
      },
      lastSampling: '8 min ago'
    },
    {
      id: 'R-102',
      name: 'Room 102 - Material Entry',
      grade: 'Grade D',
      isoClass: 'ISO 8',
      status: 'ok',
      roomType: 'Airlock',
      parameters: {
        particle: 'ok',
        micro: 'ok',
        temp: 'ok',
        humidity: 'ok',
        pressure: 'ok',
        airflow: 'ok'
      },
      lastSampling: '20 min ago'
    }
  ];

  // Filter rooms based on selected filters
  const filteredRooms = rooms.filter(room => {
    if (filters.grade !== 'All' && room.grade !== filters.grade) return false;
    if (filters.roomType !== 'All' && room.roomType !== filters.roomType) return false;
    if (filters.parameter !== 'All') {
      const paramKey = filters.parameter.toLowerCase().replace(' ', '').replace('.', '') as keyof typeof room.parameters;
      if (room.parameters[paramKey] === 'ok') return false;
    }
    return true;
  });

  const resetFilters = () => {
    setFilters({
      grade: 'All',
      roomType: 'All',
      parameter: 'All'
    });
    toast.success('Filters reset', {
      description: 'Showing all rooms and parameters'
    });
  };

  return (
    <div className="flex gap-6">
      {/* Left Sidebar - Filters */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-600" />
            <h3 className="text-gray-900">Filters</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Grade</label>
              <select
                value={filters.grade}
                onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All</option>
                <option>Grade A</option>
                <option>Grade B</option>
                <option>Grade C</option>
                <option>Grade D</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Room Type</label>
              <select
                value={filters.roomType}
                onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All</option>
                <option>Production</option>
                <option>Weighing</option>
                <option>Filling</option>
                <option>Packaging</option>
                <option>Airlock</option>
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
                <option>Diff. Pressure</option>
                <option>Airflow</option>
              </select>
            </div>

            <button 
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
          <h3 className="text-gray-900 mb-3">Quick Links</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setShowDeviations(true)}
              className="w-full text-left text-blue-600 hover:underline"
            >
              View Active Deviations
            </button>
            <button 
              onClick={() => setShowCAPAItems(true)}
              className="w-full text-left text-blue-600 hover:underline"
            >
              Open CAPA Items
            </button>
            <button 
              onClick={() => setShowEMReport(true)}
              className="w-full text-left text-blue-600 hover:underline"
            >
              EM Summary Report
            </button>
            <button 
              onClick={() => setShowBatchLinkage(true)}
              className="w-full text-left text-blue-600 hover:underline"
            >
              Batch Linkage Status
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Room Status Overview */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-gray-900">Zone / Room Status Overview</h2>
            <p className="text-gray-600 mt-1">
              Showing {filteredRooms.length} of {rooms.length} rooms · {globalContext.dateRange}
              {(filters.grade !== 'All' || filters.roomType !== 'All' || filters.parameter !== 'All') && 
                <span className="ml-2 text-blue-600">(Filtered)</span>
              }
            </p>
          </div>

          <div className="p-6 space-y-3">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <RoomStatusCard 
                  key={room.id} 
                  room={room}
                  onClick={() => setSelectedRoom(room)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No rooms match the selected filters</p>
                <button
                  onClick={resetFilters}
                  className="mt-3 text-blue-600 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Alarm & Batch Summary */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Recent Alarms & Events</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-gray-900">Particle Excursion - Room 201</p>
                  <p className="text-gray-600">0.5µm count: 3,520 (Action: 3,500)</p>
                  <p className="text-gray-500">5 min ago · Status: Open</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-gray-900">Pressure Alert - Room 105</p>
                  <p className="text-gray-600">Diff. pressure: 10 Pa (Alert: 10 Pa)</p>
                  <p className="text-gray-500">12 min ago · Status: Acknowledged</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Batch Linkage Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-900">Batch #2024-1234</p>
                  <p className="text-gray-600">Room 201, 204</p>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
                  1 Excursion
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-900">Batch #2024-1233</p>
                  <p className="text-gray-600">Room 301</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  In Spec
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deviations Modal */}
      {showDeviations && (
        <ActiveDeviationsModal onClose={() => setShowDeviations(false)} />
      )}

      {/* CAPA Items Modal */}
      {showCAPAItems && (
        <CAPAItemsModal onClose={() => setShowCAPAItems(false)} />
      )}

      {/* EM Report Modal */}
      {showEMReport && (
        <EMReportModal onClose={() => setShowEMReport(false)} />
      )}

      {/* Batch Linkage Modal */}
      {showBatchLinkage && (
        <BatchLinkageModal onClose={() => setShowBatchLinkage(false)} />
      )}

      {/* Room Detail Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedRoom(null)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-gray-900">{selectedRoom.name}</h3>
                <p className="text-gray-600 mt-1">{selectedRoom.grade} · {selectedRoom.isoClass} · ID: {selectedRoom.id}</p>
              </div>
              <button onClick={() => setSelectedRoom(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Status */}
              <div>
                <h4 className="text-gray-900 mb-3">Current Status</h4>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-4 py-2 rounded-full border-2 ${
                    selectedRoom.status === 'ok' ? 'bg-green-100 text-green-700 border-green-200' :
                    selectedRoom.status === 'warning' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    'bg-red-100 text-red-700 border-red-200'
                  }`}>
                    {selectedRoom.status === 'ok' ? 'In Specification' : 
                     selectedRoom.status === 'warning' ? 'Warning - Alert Limit' : 
                     'Excursion - Action Required'}
                  </span>
                  <span className="text-gray-600">Last sampling: {selectedRoom.lastSampling}</span>
                </div>
              </div>

              {/* Parameter Details */}
              <div>
                <h4 className="text-gray-900 mb-3">Parameter Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border-2 ${
                    selectedRoom.parameters.particle === 'ok' ? 'bg-green-50 border-green-200' :
                    selectedRoom.parameters.particle === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <p className="text-gray-900">Particle Count</p>
                    <p className={selectedRoom.parameters.particle === 'ok' ? 'text-green-600' : 
                                 selectedRoom.parameters.particle === 'warning' ? 'text-yellow-600' : 'text-red-600'}>
                      {selectedRoom.parameters.particle === 'excursion' ? '3,520 particles/m³ (Limit: 3,500)' : 
                       selectedRoom.parameters.particle === 'warning' ? '3,100 particles/m³ (Alert: 3,000)' : 
                       '2,450 particles/m³'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${
                    selectedRoom.parameters.pressure === 'ok' ? 'bg-green-50 border-green-200' :
                    selectedRoom.parameters.pressure === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <p className="text-gray-900">Differential Pressure</p>
                    <p className={selectedRoom.parameters.pressure === 'ok' ? 'text-green-600' : 
                                 selectedRoom.parameters.pressure === 'warning' ? 'text-yellow-600' : 'text-red-600'}>
                      {selectedRoom.parameters.pressure === 'warning' ? '10.8 Pa (Alert: 10 Pa)' : '15 Pa'}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border-2 bg-green-50 border-green-200">
                    <p className="text-gray-900">Temperature</p>
                    <p className="text-green-600">21.2°C (Range: 20-22°C)</p>
                  </div>

                  <div className="p-4 rounded-lg border-2 bg-green-50 border-green-200">
                    <p className="text-gray-900">Humidity</p>
                    <p className="text-green-600">45% RH (Range: 40-50%)</p>
                  </div>

                  <div className="p-4 rounded-lg border-2 bg-green-50 border-green-200">
                    <p className="text-gray-900">Airflow Velocity</p>
                    <p className="text-green-600">0.45 m/s (Target: 0.45 m/s)</p>
                  </div>

                  <div className="p-4 rounded-lg border-2 bg-green-50 border-green-200">
                    <p className="text-gray-900">Microbial Count</p>
                    <p className="text-green-600">{'<1 CFU/m³ (Limit: 10)'}</p>
                  </div>
                </div>
              </div>

              {/* Recent Events */}
              {selectedRoom.status !== 'ok' && (
                <div>
                  <h4 className="text-gray-900 mb-3">Active Events</h4>
                  <div className="space-y-2">
                    {selectedRoom.parameters.particle === 'excursion' && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-900">Particle count exceeded action limit</p>
                        <p className="text-red-700">Started: 5 minutes ago · Status: Open</p>
                      </div>
                    )}
                    {selectedRoom.parameters.pressure === 'warning' && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-900">Differential pressure at alert level</p>
                        <p className="text-yellow-700">Started: 12 minutes ago · Status: Monitoring</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    toast.info('Opening trend analysis', {
                      description: `Loading detailed trends for ${selectedRoom.name}`
                    });
                    setShowRoomTrendModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Detailed Trends
                </button>
                <button
                  onClick={() => {
                    toast.info('Opening floor plan view', {
                      description: 'Showing room location and sensors'
                    });
                    if (onNavigateToFloorPlan) {
                      onNavigateToFloorPlan(selectedRoom.id);
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  View on Floor Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Trend Modal */}
      {showRoomTrendModal && selectedRoom && (
        <RoomTrendModal 
          room={selectedRoom} 
          onClose={() => setShowRoomTrendModal(false)} 
        />
      )}
    </div>
  );
}