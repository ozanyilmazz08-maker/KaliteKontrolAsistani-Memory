import React, { useState } from 'react';
import { GlobalContext } from '../App';
import { Settings, MapPin, Sliders, Cpu, Database, Shield, Save, History } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ConfigurationProps {
  globalContext: GlobalContext;
}

export default function Configuration({ globalContext }: ConfigurationProps) {
  const [activeSection, setActiveSection] = useState<'rooms' | 'parameters' | 'sensors' | 'retention' | 'validation'>('rooms');
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [showConnectionTest, setShowConnectionTest] = useState(false);

  const sections = [
    { id: 'rooms' as const, label: 'Rooms & Zones', icon: MapPin },
    { id: 'parameters' as const, label: 'Parameters & Limits', icon: Sliders },
    { id: 'sensors' as const, label: 'Sensors & Integration', icon: Cpu },
    { id: 'retention' as const, label: 'Data Retention & Archival', icon: Database },
    { id: 'validation' as const, label: 'Validation & Audit Trails', icon: Shield }
  ];

  const saveConfiguration = (section: string) => {
    toast.success('Configuration saved', {
      description: `${section} configuration updated and logged in change control system`
    });
  };

  const testConnections = () => {
    setShowConnectionTest(true);
  };

  return (
    <div className="flex gap-6">
      {/* Left - Section Navigation */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-gray-600" />
            <h3 className="text-gray-900">Configuration</h3>
          </div>
          <div className="space-y-1">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <h4 className="text-blue-900">Validation Status</h4>
          </div>
          <p className="text-blue-700">System: Validated</p>
          <p className="text-blue-700">GAMP 5 Category: 4</p>
          <p className="text-blue-700">Last Validation: 2024-01-15</p>
          <p className="text-blue-700">Next Review: 2025-01-15</p>
        </div>
      </div>

      {/* Center - Configuration Content */}
      <div className="flex-1">
        {/* Rooms & Zones */}
        {activeSection === 'rooms' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-gray-900">Rooms & Zones Configuration</h2>
              <p className="text-gray-600 mt-1">
                Define cleanroom classifications and sampling points
              </p>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <button 
                  onClick={() => setShowAddRoomForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add New Room
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'R-301', name: 'Room 301 - Aseptic Core', grade: 'Grade A', iso: 'ISO 5', sampling: 3 },
                  { id: 'R-201', name: 'Room 201 - Filling Suite', grade: 'Grade B', iso: 'ISO 7', sampling: 2 },
                  { id: 'R-105', name: 'Room 105 - Weighing', grade: 'Grade C', iso: 'ISO 8', sampling: 2 },
                  { id: 'R-204', name: 'Room 204 - Compounding', grade: 'Grade C', iso: 'ISO 8', sampling: 2 }
                ].map(room => (
                  <div key={room.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-gray-900">{room.name}</h4>
                        <p className="text-gray-600 mt-1">ID: {room.id}</p>
                      </div>
                      <button className="text-blue-600 hover:underline">Edit</button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">GMP Grade</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>{room.grade}</option>
                          <option>Grade A</option>
                          <option>Grade B</option>
                          <option>Grade C</option>
                          <option>Grade D</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">ISO Classification</label>
                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>{room.iso}</option>
                          <option>ISO 5</option>
                          <option>ISO 7</option>
                          <option>ISO 8</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Sampling Points</label>
                        <input
                          type="number"
                          defaultValue={room.sampling}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <button className="text-blue-600 hover:underline">View Floor Plan Mapping</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => saveConfiguration('Rooms & Zones')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Parameters & Limits */}
        {activeSection === 'parameters' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-gray-900">Parameters & Limits Configuration</h2>
              <p className="text-gray-600 mt-1">
                Define alert/action limits and sampling frequencies
              </p>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Select Room</label>
                <select className="w-80 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Room 201 - Filling Suite (Grade B, ISO 7)</option>
                  <option>Room 301 - Aseptic Core (Grade A, ISO 5)</option>
                  <option>Room 105 - Weighing (Grade C, ISO 8)</option>
                </select>
              </div>

              <div className="space-y-6">
                {/* Particle Count Parameters */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-gray-900 mb-4">Particle Count ≥0.5µm</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">ISO Limit (particles/m³)</label>
                      <input
                        type="number"
                        defaultValue="3520"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Alert Limit (particles/m³)</label>
                      <input
                        type="number"
                        defaultValue="3000"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Action Limit (particles/m³)</label>
                      <input
                        type="number"
                        defaultValue="3500"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-gray-700 mb-2">Sampling Frequency</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Continuous (real-time)</option>
                      <option>Every 5 minutes</option>
                      <option>Every 15 minutes</option>
                      <option>Hourly</option>
                    </select>
                  </div>
                </div>

                {/* Temperature */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-gray-900 mb-4">Temperature</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Lower Limit (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="20.0"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Upper Limit (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="22.0"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Target (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="21.0"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Microbial */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-gray-900 mb-4">Microbial Monitoring</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Air Alert (CFU/m³)</label>
                      <input
                        type="number"
                        defaultValue="5"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Air Action (CFU/m³)</label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Sampling Schedule</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Per Batch</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => saveConfiguration('Parameters & Limits')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save & Version Control
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2">
                  <History className="w-4 h-4" />
                  View Change History
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sensors & Integration */}
        {activeSection === 'sensors' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-gray-900">Sensors & Integration Configuration</h2>
              <p className="text-gray-600 mt-1">
                Configure EMS/BMS integration, particle counters, and LIMS connectivity
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* EMS/BMS Integration */}
              <div>
                <h4 className="text-gray-900 mb-4">EMS/BMS Integration</h4>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-2">BMS System</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Siemens Desigo CC</option>
                        <option>Johnson Controls Metasys</option>
                        <option>Honeywell EBI</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Connection Protocol</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>BACnet/IP</option>
                        <option>OPC UA</option>
                        <option>Modbus TCP</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-gray-700">Status: Connected · Last sync: 2 min ago</span>
                  </div>
                </div>
              </div>

              {/* Particle Counters */}
              <div>
                <h4 className="text-gray-900 mb-4">Particle Counter Systems</h4>
                <div className="space-y-3">
                  {[
                    { id: 'PC-201-1', model: 'TSI AeroTrak 9110', room: 'Room 201', status: 'Online', battery: '95%' },
                    { id: 'PC-201-2', model: 'TSI AeroTrak 9110', room: 'Room 201', status: 'Online', battery: '88%' },
                    { id: 'PC-301', model: 'Lighthouse Solair 5100', room: 'Room 301', status: 'Online', battery: '100%' },
                    { id: 'PC-105', model: 'TSI AeroTrak 9110', room: 'Room 105', status: 'Offline', battery: '15%' }
                  ].map(sensor => (
                    <div key={sensor.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900">{sensor.id} - {sensor.model}</p>
                          <p className="text-gray-600 mt-1">{sensor.room}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${sensor.status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={sensor.status === 'Online' ? 'text-green-600' : 'text-red-600'}>{sensor.status}</span>
                          </div>
                          <p className="text-gray-600 mt-1">Battery: {sensor.battery}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="text-blue-600 hover:underline">Configure</button>
                        <button className="text-blue-600 hover:underline">Self-Test</button>
                        <button className="text-blue-600 hover:underline">Calibration History</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIMS Integration */}
              <div>
                <h4 className="text-gray-900 mb-4">LIMS Integration</h4>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-2">LIMS System</label>
                      <input
                        type="text"
                        defaultValue="LabWare LIMS v7.2"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">API Endpoint</label>
                      <input
                        type="text"
                        defaultValue="https://lims.company.com/api/v2"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-gray-700">Status: Connected · Last import: 15 min ago</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => saveConfiguration('Sensors & Integration')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Configuration
                </button>
                <button 
                  onClick={testConnections}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test Connections
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Retention */}
        {activeSection === 'retention' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-gray-900">Data Retention & Archival Configuration</h2>
              <p className="text-gray-600 mt-1">
                Configure retention policies and backup procedures
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-gray-900 mb-4">Retention Periods</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Online Data (Active System)</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>2 Years</option>
                        <option>1 Year</option>
                        <option>6 Months</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Archived Data (Long-term Storage)</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>10 Years (Regulatory Requirement)</option>
                        <option>7 Years</option>
                        <option>5 Years</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-gray-900 mb-4">Backup Configuration</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Backup Frequency</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Continuous (Real-time)</option>
                        <option>Hourly</option>
                        <option>Daily</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Backup Location</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>On-premise + Cloud (Redundant)</option>
                        <option>On-premise Only</option>
                        <option>Cloud Only</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="encryption"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="encryption" className="text-gray-700">Enable AES-256 encryption for archived data</label>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-gray-900 mb-4">Backup Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Last Successful Backup</span>
                    <span className="text-green-600">2024-12-11 03:00 UTC</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Total Archived Data</span>
                    <span className="text-gray-900">2.4 TB</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Backup Verification</span>
                    <span className="text-green-600">Passed (2024-12-11)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => saveConfiguration('Data Retention')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Configuration
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Trigger Manual Backup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Validation & Audit */}
        {activeSection === 'validation' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-gray-900">Validation & Audit Trails</h2>
              <p className="text-gray-600 mt-1">
                System validation status and change control logs
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h4 className="text-blue-900 mb-4">Validation Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-blue-700">GAMP Category</p>
                    <p className="text-blue-900 mt-1">Category 4 (Configurable Software)</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Validation Status</p>
                    <p className="text-green-600 mt-1">Validated</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Last Validation Date</p>
                    <p className="text-blue-900 mt-1">2024-01-15</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Next Periodic Review</p>
                    <p className="text-blue-900 mt-1">2025-01-15</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Validation Protocol</p>
                    <p className="text-blue-900 mt-1">VP-EM-2024-001</p>
                  </div>
                  <div>
                    <p className="text-blue-700">Risk Assessment</p>
                    <p className="text-blue-900 mt-1">RA-EM-2024-001</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-900 mb-4">System Change Log</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700">Change ID</th>
                        <th className="px-4 py-3 text-left text-gray-700">Date/Time</th>
                        <th className="px-4 py-3 text-left text-gray-700">User</th>
                        <th className="px-4 py-3 text-left text-gray-700">Change Type</th>
                        <th className="px-4 py-3 text-left text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-blue-600">CHG-2024-089</td>
                        <td className="px-4 py-3 text-gray-700">2024-12-10 14:30</td>
                        <td className="px-4 py-3 text-gray-700">J. Smith (QA Lead)</td>
                        <td className="px-4 py-3 text-gray-700">Configuration</td>
                        <td className="px-4 py-3 text-gray-700">Updated particle alert limit for Room 201</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-blue-600">CHG-2024-088</td>
                        <td className="px-4 py-3 text-gray-700">2024-12-08 09:15</td>
                        <td className="px-4 py-3 text-gray-700">M. Johnson (QA Mgr)</td>
                        <td className="px-4 py-3 text-gray-700">User Access</td>
                        <td className="px-4 py-3 text-gray-700">Added new user: K. Williams (QA)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-blue-600">CHG-2024-087</td>
                        <td className="px-4 py-3 text-gray-700">2024-12-05 16:45</td>
                        <td className="px-4 py-3 text-gray-700">System Admin</td>
                        <td className="px-4 py-3 text-gray-700">Integration</td>
                        <td className="px-4 py-3 text-gray-700">Updated LIMS API endpoint configuration</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-gray-900 mb-4">Audit Trail Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="audit-all"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                    <label htmlFor="audit-all" className="text-gray-700">Log all user actions (Required for Part 11/Annex 11)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="audit-config"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                    <label htmlFor="audit-config" className="text-gray-700">Log configuration changes</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="audit-data"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                    <label htmlFor="audit-data" className="text-gray-700">Log data modifications</label>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Note: Audit trail settings cannot be disabled in validated systems to ensure regulatory compliance.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Export Audit Trail
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  View Full Change History
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Room Form Modal */}
      {showAddRoomForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddRoomForm(false)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-gray-900">Add New Room / Zone</h3>
              <button onClick={() => setShowAddRoomForm(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Room ID</label>
                  <input
                    type="text"
                    placeholder="e.g., R-401"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Room Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Room 401 - Packaging"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">GMP Grade</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select grade...</option>
                    <option>Grade A</option>
                    <option>Grade B</option>
                    <option>Grade C</option>
                    <option>Grade D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">ISO Classification</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select ISO class...</option>
                    <option>ISO 5</option>
                    <option>ISO 7</option>
                    <option>ISO 8</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Room Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select type...</option>
                    <option>Production</option>
                    <option>Weighing</option>
                    <option>Filling</option>
                    <option>Packaging</option>
                    <option>Airlock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Sampling Points</label>
                  <input
                    type="number"
                    placeholder="Number of sampling points"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Floor/Building Location</label>
                <input
                  type="text"
                  placeholder="e.g., Building A, Floor 2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    toast.success('Room added successfully', {
                      description: 'New room configuration saved with change control'
                    });
                    setShowAddRoomForm(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Room (E-Sign)
                </button>
                <button
                  onClick={() => setShowAddRoomForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Test Modal */}
      {showConnectionTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowConnectionTest(false)}>
          <div 
            className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-gray-900">Connection Test Results</h3>
              <button onClick={() => setShowConnectionTest(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-900">BMS Integration</span>
                </div>
                <span className="text-green-600">Connected</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-900">Particle Counters (4/4)</span>
                </div>
                <span className="text-green-600">Online</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-900">LIMS Connection</span>
                </div>
                <span className="text-green-600">Connected</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-900">Database</span>
                </div>
                <span className="text-green-600">Healthy</span>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowConnectionTest(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}