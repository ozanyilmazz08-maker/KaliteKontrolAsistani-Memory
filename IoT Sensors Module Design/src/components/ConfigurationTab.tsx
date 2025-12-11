import { useState } from 'react';
import { Settings, Lock, Link, Database, RefreshCw, Shield, FileText, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

type ConfigSection = 'metadata' | 'protocol' | 'security' | 'quality-mapping' | 'future';

export function ConfigurationTab() {
  const [activeSection, setActiveSection] = useState<ConfigSection>('metadata');
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showAddSensorModal, setShowAddSensorModal] = useState(false);
  const [showEditSensorModal, setShowEditSensorModal] = useState(false);
  const [showCreateMappingModal, setShowCreateMappingModal] = useState(false);
  const [showAddEndpointModal, setShowAddEndpointModal] = useState(false);
  const [editingSensor, setEditingSensor] = useState<any>(null);

  const handleSaveMetadata = () => {
    toast.success('Sensor metadata saved successfully!');
  };

  const handleTestConnection = () => {
    toast.success('Testing connection... Success!');
  };

  const handleSaveProtocol = () => {
    toast.success('Protocol configuration saved successfully!');
  };

  const handleSaveSecurity = () => {
    toast.success('Security settings saved successfully!');
  };

  const handleSaveQualityMapping = () => {
    toast.success('Quality mapping saved successfully!');
  };

  const handleSaveFutureFeatures = () => {
    toast.success('Future features configuration saved successfully!');
  };

  const handleAddSensor = () => {
    setShowAddSensorModal(false);
    toast.success('Sensor added successfully!');
  };

  const handleEditSensor = () => {
    setShowEditSensorModal(false);
    toast.success('Sensor updated successfully!');
  };

  const openEditModal = (sensor: any) => {
    setEditingSensor(sensor);
    setShowEditSensorModal(true);
  };

  const sections = [
    { id: 'metadata', label: 'Sensor & Tag Metadata', icon: <Database className="w-4 h-4" /> },
    { id: 'protocol', label: 'Protocol & Endpoints', icon: <Settings className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Access', icon: <Lock className="w-4 h-4" /> },
    { id: 'quality-mapping', label: 'Quality Mapping', icon: <Link className="w-4 h-4" /> },
    { id: 'future', label: 'Future Features', icon: <RefreshCw className="w-4 h-4" /> },
  ];

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Left: Configuration Sections */}
      <div className="w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-sm text-gray-900 mb-4">Configuration</h3>

        <div className="space-y-1 mb-6">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as ConfigSection)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {section.icon}
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowAuditLog(!showAuditLog)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Audit Log</span>
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-900 mb-1">Configuration Changes</p>
              <p className="text-xs text-yellow-700">All changes are logged and require approval for production systems.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Configuration Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          {/* Sensor & Tag Metadata */}
          {activeSection === 'metadata' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg text-gray-900">Sensor & Tag Metadata</h2>
                  <p className="text-sm text-gray-600">Configure sensor mappings, units, and ranges</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setShowAddSensorModal(true)}>
                  Add Sensor
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Tag/ID</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Physical Sensor</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Engineering Unit</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Range</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Scaling Factor</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Criticality</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { tag: 'T-042', sensor: 'Thermocouple K-Type', unit: '°C', range: '0-300', scale: '1.0', criticality: 'Quality' },
                      { tag: 'V-128', sensor: 'Accelerometer 3-axis', unit: 'g', range: '0-2', scale: '0.001', criticality: 'Safety' },
                      { tag: 'P-203', sensor: 'Pressure Transducer', unit: 'bar', range: '0-250', scale: '0.1', criticality: 'Quality' },
                      { tag: 'H-067', sensor: 'Humidity Sensor', unit: '%RH', range: '0-100', scale: '1.0', criticality: 'Quality' },
                      { tag: 'C-091', sensor: 'Current Clamp', unit: 'A', range: '0-50', scale: '0.01', criticality: 'Energy' },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.tag}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.sensor}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.unit}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.range}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.scale}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.criticality === 'Safety' ? 'bg-red-100 text-red-700' :
                            item.criticality === 'Quality' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>{item.criticality}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-sm text-blue-600 hover:text-blue-700" onClick={() => openEditModal(item)}>Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm text-gray-900 mb-4">Unit Conversions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Temperature</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Celsius (°C)</option>
                      <option>Fahrenheit (°F)</option>
                      <option>Kelvin (K)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Pressure</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Bar</option>
                      <option>PSI</option>
                      <option>Pascal (Pa)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={handleSaveMetadata}>
                  Save Metadata
                </button>
              </div>
            </div>
          )}

          {/* Protocol & Endpoints */}
          {activeSection === 'protocol' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg text-gray-900">Protocol & Endpoint Configuration</h2>
                  <p className="text-sm text-gray-600">Configure protocol connections and mappings</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setShowAddEndpointModal(true)}>
                  Add Endpoint
                </button>
              </div>

              {/* OPC UA Configuration */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm text-gray-900">OPC UA Configuration</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Server Endpoint</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        defaultValue="opc.tcp://192.168.1.100:4840"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Security Policy</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option>Basic256Sha256</option>
                        <option>Aes128_Sha256_RsaOaep</option>
                        <option>None</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Node Mappings</label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs text-gray-600">Node ID</th>
                            <th className="px-3 py-2 text-left text-xs text-gray-600">Tag</th>
                            <th className="px-3 py-2 text-left text-xs text-gray-600">Data Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-3 py-2 text-sm text-gray-900">ns=2;s=Oven2.Zone1.Temp</td>
                            <td className="px-3 py-2 text-sm text-gray-700">T-042</td>
                            <td className="px-3 py-2 text-sm text-gray-700">Float</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 text-sm text-gray-900">ns=2;s=CR.Humidity</td>
                            <td className="px-3 py-2 text-sm text-gray-700">H-067</td>
                            <td className="px-3 py-2 text-sm text-gray-700">Float</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* MQTT Configuration */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm text-gray-900">MQTT Configuration</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Broker Address</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        defaultValue="mqtt.plant-a.local:1883"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">QoS Level</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" defaultValue="1 - At least once">
                        <option>0 - At most once</option>
                        <option>1 - At least once</option>
                        <option>2 - Exactly once</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Keep Alive (s)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        defaultValue="60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Topic Subscriptions</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900 flex-1">sensors/line4/motor15/vib</span>
                        <span className="text-xs text-gray-600">→ V-128</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900 flex-1">sensors/line4/ambient/temp</span>
                        <span className="text-xs text-gray-600">→ T-089</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modbus Configuration */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm text-gray-900">Modbus Configuration</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Mode</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option>Modbus TCP</option>
                        <option>Modbus RTU</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Gateway IP</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        defaultValue="192.168.1.50"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Port</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        defaultValue="502"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={handleSaveProtocol}>
                  Save Protocol
                </button>
              </div>
            </div>
          )}

          {/* Security & Access */}
          {activeSection === 'security' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg text-gray-900">Security & Access Control</h2>
                <p className="text-sm text-gray-600">Manage encryption, authentication, and access policies</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-sm text-gray-900 mb-4">Encryption Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-900">Enable TLS Encryption</span>
                      <p className="text-xs text-gray-600">All data in transit will be encrypted</p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-900">Certificate Validation</span>
                      <p className="text-xs text-gray-600">Verify server certificates</p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  </label>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">TLS Version</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm max-w-xs">
                      <option>TLS 1.3</option>
                      <option>TLS 1.2</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-sm text-gray-900 mb-4">Authentication</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Authentication Method</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm max-w-xs">
                      <option>Certificate-based</option>
                      <option>Username/Password</option>
                      <option>Token-based</option>
                    </select>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900 mb-2">Certificate Status</p>
                    <div className="space-y-1 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Issuer:</span>
                        <span>PlantA-RootCA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valid Until:</span>
                        <span>2026-12-11</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-green-600">✓ Valid</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm text-gray-900 mb-4">Role-Based Access Control</h3>
                <div className="space-y-3">
                  {[
                    { role: 'Quality Engineer', read: true, write: true, config: true },
                    { role: 'Production Supervisor', read: true, write: false, config: false },
                    { role: 'Maintenance Tech', read: true, write: true, config: false },
                    { role: 'Data Analyst', read: true, write: false, config: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">{item.role}</span>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={item.read} readOnly />
                          <span className="text-xs text-gray-600">Read</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={item.write} readOnly />
                          <span className="text-xs text-gray-600">Write</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={item.config} readOnly />
                          <span className="text-xs text-gray-600">Config</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={handleSaveSecurity}>
                  Save Security Settings
                </button>
              </div>
            </div>
          )}

          {/* Quality Mapping */}
          {activeSection === 'quality-mapping' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg text-gray-900">Quality & System Mapping</h2>
                  <p className="text-sm text-gray-600">Link sensors to quality control artifacts</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setShowCreateMappingModal(true)}>
                  Create Mapping
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-sm text-gray-900 mb-4">Sensor to Control Characteristic Mappings</h3>
                <div className="space-y-3">
                  {[
                    { sensor: 'T-042', characteristic: 'Zone 1 Temperature', spc: 'SPC-042', cp: 'CP-15' },
                    { sensor: 'V-128', characteristic: 'Motor Vibration', spc: '-', cp: 'FMEA-089' },
                    { sensor: 'P-203', characteristic: 'Press Force', spc: 'SPC-098', cp: 'CP-22' },
                    { sensor: 'H-067', characteristic: 'Cleanroom RH', spc: 'SPC-067', cp: 'CP-05, ENV-012' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-900">{item.sensor} → {item.characteristic}</span>
                        <button className="text-sm text-blue-600 hover:text-blue-700" onClick={() => toast.info('Edit quality mapping')}>Edit</button>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">SPC Chart: <span className="text-gray-900">{item.spc}</span></span>
                        <span className="text-gray-600">Control Plan: <span className="text-gray-900">{item.cp}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm text-gray-900 mb-4">Threshold to Quality Alert Mapping</h3>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs text-gray-600">Sensor</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-600">Threshold</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-600">Quality Alert</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-600">NC Trigger</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-2 text-sm text-gray-900">T-042</td>
                      <td className="px-3 py-2 text-sm text-gray-700">&gt; 270°C</td>
                      <td className="px-3 py-2 text-sm text-gray-700">High Temperature Alert</td>
                      <td className="px-3 py-2"><span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Enabled</span></td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-sm text-gray-900">V-128</td>
                      <td className="px-3 py-2 text-sm text-gray-700">&gt; 1.2g</td>
                      <td className="px-3 py-2 text-sm text-gray-700">Critical Vibration</td>
                      <td className="px-3 py-2"><span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Enabled</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={handleSaveQualityMapping}>
                  Save Quality Mapping
                </button>
              </div>
            </div>
          )}

          {/* Future Features */}
          {activeSection === 'future' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg text-gray-900">Future Features & Integration</h2>
                <p className="text-sm text-gray-600">Prepare for emerging technologies and capabilities</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm text-gray-900">Self-Configuring Sensor Networks</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Automatically discover and onboard new sensors</p>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-900">Enable Auto-Discovery</span>
                      <p className="text-xs text-gray-600">Scan network for new sensors every 5 minutes</p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </label>
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Auto-Adopt Pattern</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g., sensors/line4/*"
                    />
                    <p className="text-xs text-gray-500 mt-1">Sensors matching this pattern will be added to "Line 4" group</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm text-gray-900">Digital Twin Integration</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Link physical sensors to digital twin models</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">Twin Platform Endpoint</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="https://twin.plant-a.local/api"
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm text-gray-900 mb-2">Equipment Twin Mappings</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Motor M-15</span>
                        <span className="text-gray-600">twin://equipment/motor-m15</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Oven #2</span>
                        <span className="text-gray-600">twin://equipment/oven-02</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm text-gray-900">Energy & CO₂ Quality Links</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Correlate energy consumption with quality outcomes</p>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-900">Enable Energy-Quality Analysis</span>
                      <p className="text-xs text-gray-600">Track carbon intensity vs quality metrics</p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </label>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900 mb-2">Energy-Critical Sensors: 24/24 Active</p>
                    <p className="text-xs text-gray-700">Real-time tracking of power consumption and carbon footprint per production unit</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" onClick={handleSaveFutureFeatures}>
                  Save Future Features Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Audit Log (when shown) */}
      {showAuditLog && (
        <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <h3 className="text-sm text-gray-900 mb-4">Configuration Audit Log</h3>
          <div className="space-y-3">
            {[
              { time: '2 hours ago', user: 'john.doe@plant-a.com', action: 'Updated sensor T-042 range', status: 'approved' },
              { time: '1 day ago', user: 'jane.smith@plant-a.com', action: 'Added MQTT topic mapping', status: 'approved' },
              { time: '2 days ago', user: 'admin@plant-a.com', action: 'Enabled TLS encryption', status: 'approved' },
              { time: '3 days ago', user: 'john.doe@plant-a.com', action: 'Modified OPC UA endpoint', status: 'pending' },
            ].map((log, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{log.time}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    log.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{log.status}</span>
                </div>
                <p className="text-sm text-gray-900 mb-1">{log.action}</p>
                <p className="text-xs text-gray-600">by {log.user}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Sensor Modal */}
      {showAddSensorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg text-gray-900">Add New Sensor</h3>
              <p className="text-sm text-gray-600 mt-1">Configure new sensor metadata</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Tag/ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., T-123"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Physical Sensor Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Thermocouple K-Type</option>
                    <option>RTD PT100</option>
                    <option>Accelerometer 3-axis</option>
                    <option>Pressure Transducer</option>
                    <option>Humidity Sensor</option>
                    <option>Current Clamp</option>
                    <option>Optical Sensor</option>
                    <option>Gas Detector</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Engineering Unit</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., °C, bar, g"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Range</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 0-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Scaling Factor</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1.0"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Criticality</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Quality</option>
                    <option>Safety</option>
                    <option>Energy</option>
                    <option>Process</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Optional description of sensor purpose and location"
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddSensorModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSensor}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Sensor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sensor Modal */}
      {showEditSensorModal && editingSensor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg text-gray-900">Edit Sensor: {editingSensor.tag}</h3>
              <p className="text-sm text-gray-600 mt-1">Update sensor metadata</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Tag/ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingSensor.tag}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Physical Sensor Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue={editingSensor.sensor}>
                    <option>Thermocouple K-Type</option>
                    <option>RTD PT100</option>
                    <option>Accelerometer 3-axis</option>
                    <option>Pressure Transducer</option>
                    <option>Humidity Sensor</option>
                    <option>Current Clamp</option>
                    <option>Optical Sensor</option>
                    <option>Gas Detector</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Engineering Unit</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingSensor.unit}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Range</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingSensor.range}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Scaling Factor</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingSensor.scale}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Criticality</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue={editingSensor.criticality}>
                    <option>Quality</option>
                    <option>Safety</option>
                    <option>Energy</option>
                    <option>Process</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Optional description of sensor purpose and location"
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowEditSensorModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSensor}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Mapping Modal */}
      {showCreateMappingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg text-gray-900">Create New Mapping</h3>
              <p className="text-sm text-gray-600 mt-1">Link sensor to quality control artifacts</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Sensor Tag/ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., T-042"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Control Characteristic</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Zone 1 Temperature"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">SPC Chart</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., SPC-042"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Control Plan</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., CP-15"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateMappingModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => toast.success('Mapping created successfully!')}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Mapping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Endpoint Modal */}
      {showAddEndpointModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg text-gray-900">Add New Endpoint</h3>
              <p className="text-sm text-gray-600 mt-1">Configure new protocol endpoint</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Protocol Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>OPC UA</option>
                    <option>MQTT</option>
                    <option>Modbus</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Endpoint Address</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., opc.tcp://192.168.1.100:4840"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Security Policy</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Basic256Sha256</option>
                    <option>Aes128_Sha256_RsaOaep</option>
                    <option>None</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">QoS Level</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="1 - At least once">
                    <option>0 - At most once</option>
                    <option>1 - At least once</option>
                    <option>2 - Exactly once</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Gateway IP</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 192.168.1.50"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Port</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 502"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-2 block">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Optional description of endpoint purpose and location"
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddEndpointModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => toast.success('Endpoint added successfully!')}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Endpoint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}