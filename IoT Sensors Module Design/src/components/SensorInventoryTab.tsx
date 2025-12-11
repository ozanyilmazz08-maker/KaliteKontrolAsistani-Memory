import { useState } from 'react';
import { Search, Filter, Download, Wifi, WifiOff, AlertCircle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { downloadCSV } from '../utils/exportHelpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LiveDataModal, ConfigModal, ViewHistoryModal } from './SensorModals';

interface Sensor {
  id: string;
  name: string;
  type: string;
  variable: string;
  location: string;
  protocol: string;
  samplingMode: string;
  status: 'online' | 'offline' | 'warning';
  dataQuality: number;
  qualityLink: string;
  lastReading: string;
  lastTimestamp: string;
}

const mockSensors: Sensor[] = [
  {
    id: 'T-042',
    name: 'Oven Zone 1 Temp',
    type: 'Temperature',
    variable: '°C',
    location: 'Plant A / Assembly / Line 4 / Oven #2',
    protocol: 'OPC UA (ns=2;s=Oven2.Zone1.Temp)',
    samplingMode: 'Fixed 1 Hz',
    status: 'online',
    dataQuality: 98,
    qualityLink: 'SPC-042, CP-15',
    lastReading: '245.3 °C',
    lastTimestamp: '2s ago'
  },
  {
    id: 'V-128',
    name: 'Motor M-15 Vibration',
    type: 'Vibration',
    variable: 'g',
    location: 'Plant A / Assembly / Line 4 / Motor M-15',
    protocol: 'MQTT (sensors/line4/motor15/vib)',
    samplingMode: 'Event (&gt;0.5g)',
    status: 'warning',
    dataQuality: 85,
    qualityLink: 'FMEA-089',
    lastReading: '0.72 g',
    lastTimestamp: '5s ago'
  },
  {
    id: 'P-203',
    name: 'Hydraulic Pressure 1',
    type: 'Pressure',
    variable: 'bar',
    location: 'Plant A / Assembly / Line 4 / Press #1',
    protocol: 'Modbus (40001)',
    samplingMode: 'Fixed 0.5 Hz',
    status: 'online',
    dataQuality: 96,
    qualityLink: 'CP-22, SPC-098',
    lastReading: '185.2 bar',
    lastTimestamp: '1s ago'
  },
  {
    id: 'H-067',
    name: 'Cleanroom Humidity',
    type: 'Humidity',
    variable: '%RH',
    location: 'Plant A / Quality Lab / Cleanroom ISO-7',
    protocol: 'OPC UA (ns=2;s=CR.Humidity)',
    samplingMode: 'Fixed 0.1 Hz',
    status: 'online',
    dataQuality: 99,
    qualityLink: 'ENV-012, CP-05',
    lastReading: '42.8 %RH',
    lastTimestamp: '3s ago'
  },
  {
    id: 'C-091',
    name: 'Motor M-12 Current',
    type: 'Current',
    variable: 'A',
    location: 'Plant A / Assembly / Line 3 / Motor M-12',
    protocol: 'Profinet',
    samplingMode: 'Fixed 2 Hz',
    status: 'online',
    dataQuality: 97,
    qualityLink: 'Energy-045',
    lastReading: '12.3 A',
    lastTimestamp: '1s ago'
  },
  {
    id: 'T-089',
    name: 'Ambient Temperature',
    type: 'Temperature',
    variable: '°C',
    location: 'Plant A / Assembly / Line 4',
    protocol: 'MQTT (sensors/line4/ambient/temp)',
    samplingMode: 'On-change (±0.5°C)',
    status: 'offline',
    dataQuality: 0,
    qualityLink: 'ENV-008',
    lastReading: 'N/A',
    lastTimestamp: '2 hours ago'
  },
  {
    id: 'O-034',
    name: 'Optical Position Sensor',
    type: 'Optical',
    variable: 'mm',
    location: 'Plant A / Assembly / Line 4 / Robot #3',
    protocol: 'EtherNet/IP',
    samplingMode: 'Event (on trigger)',
    status: 'online',
    dataQuality: 94,
    qualityLink: 'CP-18',
    lastReading: '125.42 mm',
    lastTimestamp: '12s ago'
  },
  {
    id: 'PC-015',
    name: 'Particle Counter',
    type: 'Particle',
    variable: 'count/m³',
    location: 'Plant A / Quality Lab / Cleanroom ISO-7',
    protocol: 'OPC UA (ns=2;s=CR.Particles)',
    samplingMode: 'Fixed 0.016 Hz',
    status: 'online',
    dataQuality: 100,
    qualityLink: 'ENV-012',
    lastReading: '8420 /m³',
    lastTimestamp: '8s ago'
  }
];

export function SensorInventoryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(mockSensors[0]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showLiveDataModal, setShowLiveDataModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const itemsPerPage = 8;

  const filteredSensors = mockSensors.filter(sensor => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sensor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sensor.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(sensor.status);
    const matchesType = typeFilter.length === 0 || typeFilter.includes(sensor.type);
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSensors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSensors = filteredSensors.slice(startIndex, startIndex + itemsPerPage);

  // Quick filter actions
  const applyStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter([]);
    } else {
      setStatusFilter([status]);
    }
    setCurrentPage(1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-green-600" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-gray-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      online: 'bg-green-100 text-green-700',
      offline: 'bg-gray-100 text-gray-700',
      warning: 'bg-yellow-100 text-yellow-700'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getQualityBadge = (quality: number) => {
    if (quality >= 95) return <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">A</span>;
    if (quality >= 85) return <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">B</span>;
    if (quality > 0) return <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">C</span>;
    return <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">-</span>;
  };

  const handleExport = () => {
    toast.success('Exporting sensor inventory to CSV...');
    downloadCSV(mockSensors, 'sensor_inventory');
  };

  const handleViewLiveData = () => {
    toast('Opening live data dashboard for this sensor...');
    setShowLiveDataModal(true);
  };

  const handleEditConfiguration = () => {
    toast('Opening configuration editor...');
    setShowConfigModal(true);
  };

  const handleViewHistory = () => {
    toast('Loading historical data...');
    setShowHistoryModal(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by sensor ID, tag, location, type, protocol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filters</span>
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleExport}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-600">Quick filters:</span>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors" onClick={() => { setStatusFilter([]); setCurrentPage(1); }}>
              All ({mockSensors.length})
            </button>
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              onClick={() => applyStatusFilter('online')}
            >
              Online ({mockSensors.filter(s => s.status === 'online').length})
            </button>
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              onClick={() => applyStatusFilter('warning')}
            >
              Warning ({mockSensors.filter(s => s.status === 'warning').length})
            </button>
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              onClick={() => applyStatusFilter('offline')}
            >
              Offline ({mockSensors.filter(s => s.status === 'offline').length})
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm text-gray-900">Advanced Filters</h4>
                <button 
                  className="text-sm text-blue-600 hover:text-blue-700"
                  onClick={() => {
                    setStatusFilter([]);
                    setTypeFilter([]);
                    toast.success('Filters cleared');
                  }}
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Sensor Type Filter */}
                <div>
                  <label className="text-xs text-gray-600 mb-2 block">Sensor Type</label>
                  <div className="space-y-2">
                    {['Temperature', 'Vibration', 'Pressure', 'Humidity', 'Current', 'Optical', 'Particle'].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={typeFilter.includes(type)}
                          onChange={() => {
                            if (typeFilter.includes(type)) {
                              setTypeFilter(typeFilter.filter(t => t !== type));
                            } else {
                              setTypeFilter([...typeFilter, type]);
                            }
                            setCurrentPage(1);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-xs text-gray-600 mb-2 block">Status</label>
                  <div className="space-y-2">
                    {['online', 'warning', 'offline'].map(status => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={statusFilter.includes(status)}
                          onChange={() => {
                            if (statusFilter.includes(status)) {
                              setStatusFilter(statusFilter.filter(s => s !== status));
                            } else {
                              setStatusFilter([...statusFilter, status]);
                            }
                            setCurrentPage(1);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Data Quality Filter */}
                <div>
                  <label className="text-xs text-gray-600 mb-2 block">Data Quality</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            toast.info('Quality Grade A filter applied');
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">Grade A (≥95%)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            toast.info('Quality Grade B filter applied');
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">Grade B (85-94%)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            toast.info('Quality Grade C filter applied');
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">Grade C (&lt;85%)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {filteredSensors.length} results
                </p>
              </div>
            </div>
          )}

          {/* Sensor Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Sensor ID</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Type</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Location</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Protocol</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Sampling</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Quality</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Last Reading</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedSensors.map(sensor => (
                    <tr
                      key={sensor.id}
                      onClick={() => setSelectedSensor(sensor)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedSensor?.id === sensor.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(sensor.status)}
                          <span className="text-sm text-gray-900">{sensor.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{sensor.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{sensor.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{sensor.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{sensor.protocol}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{sensor.samplingMode}</td>
                      <td className="px-4 py-3">{getStatusBadge(sensor.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getQualityBadge(sensor.dataQuality)}
                          <span className="text-xs text-gray-500">{sensor.dataQuality}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm text-gray-900">{sensor.lastReading}</div>
                          <div className="text-xs text-gray-500">{sensor.lastTimestamp}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSensors.length)} of {filteredSensors.length} sensors</span>
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-1 border border-gray-300 rounded transition-colors ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    toast.success(`Page ${currentPage - 1}`);
                  }
                }}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === index + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => {
                    setCurrentPage(index + 1);
                    toast.success(`Page ${index + 1}`);
                  }}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className={`px-3 py-1 border border-gray-300 rounded transition-colors ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                    toast.success(`Page ${currentPage + 1}`);
                  }
                }}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Sensor Detail Panel */}
      {selectedSensor && (
        <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-sm text-gray-900 mb-1">{selectedSensor.name}</h3>
              <p className="text-xs text-gray-600">{selectedSensor.id}</p>
            </div>
            {getStatusBadge(selectedSensor.status)}
          </div>

          {/* Identity & Physical Info */}
          <div className="mb-6">
            <h4 className="text-xs text-gray-500 mb-3">Identity & Physical Info</h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="text-sm text-gray-900">{selectedSensor.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Measured Variable</p>
                <p className="text-sm text-gray-900">{selectedSensor.variable}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm text-gray-900">{selectedSensor.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Manufacturer</p>
                <p className="text-sm text-gray-900">Siemens AG</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Model</p>
                <p className="text-sm text-gray-900">SITRANS TH420</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Serial Number</p>
                <p className="text-sm text-gray-900">SN-2024-08421</p>
              </div>
            </div>
          </div>

          {/* Connectivity & Protocol */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="text-xs text-gray-500 mb-3">Connectivity & Protocol</h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Protocol</p>
                <p className="text-sm text-gray-900">{selectedSensor.protocol.split(' ')[0]}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Address/Node/Topic</p>
                <p className="text-sm text-gray-900 break-all">{selectedSensor.protocol.split('(')[1]?.replace(')', '') || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Gateway/Edge Device</p>
                <p className="text-sm text-gray-900">Gateway-04 (192.168.1.104)</p>
              </div>
            </div>
          </div>

          {/* Sampling Configuration */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="text-xs text-gray-500 mb-3">Sampling Configuration</h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Sampling Mode</p>
                <p className="text-sm text-gray-900">{selectedSensor.samplingMode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Aggregation</p>
                <p className="text-sm text-gray-900">Mean (10s window)</p>
              </div>
            </div>
          </div>

          {/* Data Quality Stats */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="text-xs text-gray-500 mb-3">Data Quality Stats</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-500">Uptime (7 days)</p>
                  <p className="text-sm text-gray-900">{selectedSensor.status === 'offline' ? '87.2%' : '99.8%'}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: selectedSensor.status === 'offline' ? '87.2%' : '99.8%' }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Data Latency</p>
                <p className="text-sm text-gray-900">182 ms</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Missing Data Rate</p>
                <p className="text-sm text-gray-900">{selectedSensor.status === 'offline' ? '12.8%' : '0.2%'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Gap Events (30 days)</p>
                <p className="text-sm text-gray-900">{selectedSensor.status === 'offline' ? '14' : '2'}</p>
              </div>
            </div>
          </div>

          {/* Security Attributes */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="text-xs text-gray-500 mb-3">Security Attributes</h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Network Zone</p>
                <p className="text-sm text-gray-900">Production (VLAN 20)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Authentication</p>
                <p className="text-sm text-gray-900">Certificate-based</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Encryption</p>
                <p className="text-sm text-gray-900">TLS 1.3</p>
              </div>
            </div>
          </div>

          {/* Quality Linkage */}
          <div className="mb-6">
            <h4 className="text-xs text-gray-500 mb-3">Quality Linkage</h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Linked Quality Artifacts</p>
                <p className="text-sm text-gray-900">{selectedSensor.qualityLink}</p>
              </div>
              <div className="mt-3 space-y-2">
                {selectedSensor.qualityLink.split(', ').map(link => (
                  <div key={link} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm text-gray-900">{link}</span>
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleViewLiveData}
            >
              View Live Data
            </button>
            <button
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handleEditConfiguration}
            >
              Edit Configuration
            </button>
            <button
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handleViewHistory}
            >
              View History
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedSensor && showLiveDataModal && (
        <LiveDataModal sensor={selectedSensor} onClose={() => setShowLiveDataModal(false)} />
      )}
      {selectedSensor && showConfigModal && (
        <ConfigModal sensor={selectedSensor} onClose={() => setShowConfigModal(false)} />
      )}
      {selectedSensor && showHistoryModal && (
        <ViewHistoryModal sensor={selectedSensor} onClose={() => setShowHistoryModal(false)} />
      )}
    </div>
  );
}