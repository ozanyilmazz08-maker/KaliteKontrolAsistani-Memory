import { useState } from 'react';
import { Settings, Gauge, Bell, Wifi, Video } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import Dialog from './Dialog';

interface ConfigurationProps {
  context: any;
}

const configCategories = [
  { id: 'control-items', label: 'Control Items & Limits', icon: Settings },
  { id: 'devices', label: 'Measurement Devices', icon: Gauge },
  { id: 'alarms', label: 'Alarms & Workflows', icon: Bell },
  { id: 'integration', label: 'Auto Data Capture', icon: Wifi },
  { id: 'ar-vr', label: 'AR/VR Guidance', icon: Video }
];

const controlItems = [
  {
    id: 1,
    characteristic: 'Hole Diameter',
    station: 'Station #5',
    lsl: 9.95,
    usl: 10.05,
    target: 10.0,
    lcl: 9.96,
    ucl: 10.04,
    cl: 10.0,
    chartType: 'X̄-R',
    samplingRule: 'Every 30 minutes',
    device: 'Digital Caliper #DC-012',
    controlPlan: 'CP-2024-A-001'
  },
  {
    id: 2,
    characteristic: 'Torque',
    station: 'Station #5',
    lsl: 45,
    usl: 55,
    target: 50,
    lcl: 46,
    ucl: 54,
    cl: 50,
    chartType: 'X̄-R',
    samplingRule: 'Every 50 parts',
    device: 'Torque Sensor #TS-045',
    controlPlan: 'CP-2024-A-001'
  }
];

const devices = [
  {
    id: 1,
    deviceId: 'DC-012',
    name: 'Digital Caliper #DC-012',
    type: 'Caliper',
    station: 'Station #5',
    status: 'connected',
    lastCalibration: '2024-11-15',
    nextCalibration: '2025-02-15',
    mode: 'Manual entry'
  },
  {
    id: 2,
    deviceId: 'TS-045',
    name: 'Torque Sensor #TS-045',
    type: 'Sensor',
    station: 'Station #5',
    status: 'connected',
    lastCalibration: '2024-10-20',
    nextCalibration: '2025-01-20',
    mode: 'Auto capture (PLC)'
  },
  {
    id: 3,
    deviceId: 'CMM-08',
    name: 'CMM Station #08',
    type: 'CMM',
    station: 'Inspection Bay',
    status: 'offline',
    lastCalibration: '2024-09-10',
    nextCalibration: '2024-12-10',
    mode: 'Auto capture (direct)'
  }
];

const alarmRules = [
  {
    id: 1,
    condition: 'Point beyond UCL/LCL',
    severity: 'Critical',
    action: 'Stop machine, notify supervisor, open NC form',
    roles: 'Operator, Supervisor, Quality',
    active: true
  },
  {
    id: 2,
    condition: '7 points on one side of CL',
    severity: 'High',
    action: 'Notify supervisor, investigate trend',
    roles: 'Supervisor, Process Engineer',
    active: true
  },
  {
    id: 3,
    condition: 'Point out of specification',
    severity: 'Critical',
    action: 'Stop machine immediately, start containment, create NC',
    roles: 'Operator, Supervisor, Quality',
    active: true
  },
  {
    id: 4,
    condition: 'Missed check (overdue)',
    severity: 'Medium',
    action: 'Notify operator and line leader',
    roles: 'Operator, Line Leader',
    active: true
  }
];

export default function Configuration({ context }: ConfigurationProps) {
  const [selectedCategory, setSelectedCategory] = useState('control-items');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [plcAddress, setPlcAddress] = useState('192.168.1.50');
  const [mqttBroker, setMqttBroker] = useState('mqtt://broker.local:1883');
  const [mqttTopic, setMqttTopic] = useState('factory/line2/station5/');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleAddControlItem = () => {
    setShowAddModal(true);
    toast('Opening form to add new control item...');
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowEditModal(true);
    toast(`Editing ${item.characteristic}...`);
  };

  const handleAddDevice = () => {
    toast('Opening form to add new measurement device...');
  };

  const handleConfigureDevice = (deviceId: string) => {
    toast(`Configuring device ${deviceId}...`);
  };

  const handleAddAlarmRule = () => {
    toast('Opening form to add new alarm rule...');
  };

  const handleEditAlarmRule = (ruleId: number) => {
    toast(`Editing alarm rule #${ruleId}...`);
  };

  const handleViewControlPlan = () => {
    toast('Opening control plan CP-2024-A-001...');
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Category Navigation */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-gray-900 mb-4">Configuration</h3>
            
            <div className="space-y-2">
              {configCategories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Configuration Content */}
        <div className="col-span-9">
          {/* Control Items & Limits */}
          {selectedCategory === 'control-items' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900">Control Items & Limits</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Define SPC characteristics, specification limits, and control limits
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleAddControlItem}>
                  + Add Control Item
                </button>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Characteristic</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Station</th>
                        <th className="text-center py-3 px-4 text-sm text-gray-600">LSL</th>
                        <th className="text-center py-3 px-4 text-sm text-gray-600">Target</th>
                        <th className="text-center py-3 px-4 text-sm text-gray-600">USL</th>
                        <th className="text-center py-3 px-4 text-sm text-gray-600">LCL</th>
                        <th className="text-center py-3 px-4 text-sm text-gray-600">UCL</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Chart</th>
                        <th className="text-right py-3 px-4 text-sm text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {controlItems.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{item.characteristic}</td>
                          <td className="py-3 px-4 text-gray-600">{item.station}</td>
                          <td className="py-3 px-4 text-center text-gray-900 tabular-nums">{item.lsl}</td>
                          <td className="py-3 px-4 text-center text-gray-900 tabular-nums">{item.target}</td>
                          <td className="py-3 px-4 text-center text-gray-900 tabular-nums">{item.usl}</td>
                          <td className="py-3 px-4 text-center text-blue-600 tabular-nums">{item.lcl}</td>
                          <td className="py-3 px-4 text-center text-blue-600 tabular-nums">{item.ucl}</td>
                          <td className="py-3 px-4 text-gray-600">{item.chartType}</td>
                          <td className="py-3 px-4 text-right">
                            <button className="text-blue-600 hover:underline text-sm" onClick={() => handleEditItem(item)}>Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-blue-900 mb-2">Linked to Control Plan</h4>
                  <p className="text-sm text-blue-800">
                    These control items are defined in control plan CP-2024-A-001. 
                    Changes here will be reflected in the master control plan.
                  </p>
                  <button className="mt-2 text-sm text-blue-600 hover:underline" onClick={handleViewControlPlan}>
                    View full control plan →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Measurement Devices */}
          {selectedCategory === 'devices' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900">Measurement Devices & Auto Capture</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure devices, calibration, and automatic data capture
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleAddDevice}>
                  + Add Device
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {devices.map(device => (
                    <div key={device.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-gray-900">{device.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded ${
                              device.status === 'connected' ? 'bg-green-100 text-green-700' :
                              device.status === 'offline' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {device.status === 'connected' ? '● Connected' :
                               device.status === 'offline' ? '○ Offline' : '◐ Warning'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">ID: {device.deviceId} · Type: {device.type} · {device.station}</p>
                        </div>
                        <button className="text-blue-600 hover:underline text-sm" onClick={() => handleConfigureDevice(device.deviceId)}>Configure</button>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Data Capture Mode</p>
                          <p className="text-sm text-gray-900">{device.mode}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Last Calibration</p>
                          <p className="text-sm text-gray-900">{device.lastCalibration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Next Calibration</p>
                          <p className={`text-sm ${
                            new Date(device.nextCalibration) < new Date() ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {device.nextCalibration}
                            {new Date(device.nextCalibration) < new Date() && ' (Overdue)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-yellow-900 mb-2">Calibration Alert</h4>
                  <p className="text-sm text-yellow-800">
                    CMM Station #08 calibration is overdue. Please calibrate device before use.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Alarms & Workflows */}
          {selectedCategory === 'alarms' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900">Alarms & Reaction Workflows</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Define alarm conditions, severity, and required actions
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleAddAlarmRule}>
                  + Add Alarm Rule
                </button>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Condition</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Severity</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Action</th>
                        <th className="text-left py-3 px-4 text-sm text-gray-600">Notified Roles</th>
                        <th className="text-center py-3 px-4 text-sm text-gray-600">Status</th>
                        <th className="text-right py-3 px-4 text-sm text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {alarmRules.map(rule => (
                        <tr key={rule.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{rule.condition}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded ${
                              rule.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                              rule.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {rule.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{rule.action}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{rule.roles}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 text-xs rounded ${
                              rule.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {rule.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button className="text-blue-600 hover:underline text-sm" onClick={() => handleEditAlarmRule(rule.id)}>Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-blue-900 mb-2">IATF 16949 Compliance</h4>
                  <p className="text-sm text-blue-800">
                    Alarm workflows and reaction plans are aligned with IATF 16949 requirements for 
                    defined and documented responses to out-of-control conditions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Auto Data Capture */}
          {selectedCategory === 'integration' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-gray-900">Auto Data Capture Integration</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Configure connections to IoT sensors, PLCs, and HMI systems
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-gray-900 mb-4">PLC Integration</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">PLC Address</label>
                        <input
                          type="text"
                          value={plcAddress}
                          onChange={(e) => setPlcAddress(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Protocol</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Modbus TCP</option>
                          <option>OPC UA</option>
                          <option>Ethernet/IP</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Status</label>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">Connected</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-gray-900 mb-4">IoT Sensors</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">MQTT Broker</label>
                        <input
                          type="text"
                          value={mqttBroker}
                          onChange={(e) => setMqttBroker(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Topic Prefix</label>
                        <input
                          type="text"
                          value={mqttTopic}
                          onChange={(e) => setMqttTopic(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Status</label>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">Connected - 3 sensors</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-gray-900 mb-4">Data Channel Mapping</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Source</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Channel/Tag</th>
                          <th className="text-left py-3 px-4 text-sm text-gray-600">Maps To</th>
                          <th className="text-center py-3 px-4 text-sm text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">PLC Station #5</td>
                          <td className="py-3 px-4 text-gray-600 font-mono text-sm">DB1.DBD20</td>
                          <td className="py-3 px-4 text-gray-900">Torque (Nm)</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Active</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">IoT Sensor TS-045</td>
                          <td className="py-3 px-4 text-gray-600 font-mono text-sm">temp/station5</td>
                          <td className="py-3 px-4 text-gray-900">Temperature (°C)</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Active</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AR/VR Guidance */}
          {selectedCategory === 'ar-vr' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-gray-900">AR/VR Guidance (Future-Ready)</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Configure augmented reality and virtual reality assisted work instructions
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {controlItems.map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-gray-900">{item.characteristic}</h4>
                          <p className="text-sm text-gray-600">{item.station}</p>
                        </div>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          Not Configured
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">AR Content Link</label>
                          <input
                            type="text"
                            placeholder="URL to AR content or marker ID"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">VR Training Module</label>
                          <input
                            type="text"
                            placeholder="VR module identifier"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span>Enable AR guidance button in Operator View</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="text-purple-900 mb-2">Future Capability</h4>
                  <p className="text-sm text-purple-800 mb-3">
                    AR/VR integration is designed for future deployment. When configured, operators will see 
                    "Open AR Guidance" buttons that launch immersive, step-by-step visual instructions overlaid 
                    on the physical workspace.
                  </p>
                  <div className="text-xs text-purple-700 space-y-1">
                    <p>• Reduces training time and operator errors</p>
                    <p>• Provides real-time visual cues for measurement locations</p>
                    <p>• Supports remote expert guidance capabilities</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}