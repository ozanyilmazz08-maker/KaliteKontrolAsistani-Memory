import { useState } from 'react';
import { GlobalContext } from '../../App';
import { FileText, Shield, Link2, Settings } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ConfigurationTemplatesProps {
  globalContext: GlobalContext;
}

type ConfigSection = 'templates' | 'risk-rules' | 'integration' | 'general';

export function ConfigurationTemplates({ globalContext }: ConfigurationTemplatesProps) {
  const [activeSection, setActiveSection] = useState<ConfigSection>('templates');

  const sections = [
    { id: 'templates' as ConfigSection, label: 'Templates Configuration', icon: FileText },
    { id: 'risk-rules' as ConfigSection, label: 'Critical Characteristics & Risk', icon: Shield },
    { id: 'integration' as ConfigSection, label: 'Integration Settings', icon: Link2 },
    { id: 'general' as ConfigSection, label: 'General Settings', icon: Settings }
  ];

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Left Navigation */}
      <div className="w-64 border-r border-gray-200 bg-white p-4">
        <h3 className="text-sm text-gray-900 mb-4">Configuration</h3>
        <div className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeSection === 'templates' && <TemplatesConfig />}
        {activeSection === 'risk-rules' && <RiskRulesConfig />}
        {activeSection === 'integration' && <IntegrationConfig />}
        {activeSection === 'general' && <GeneralConfig />}
      </div>
    </div>
  );
}

function TemplatesConfig() {
  const [fields, setFields] = useState([
    { id: 1, name: 'Part Number', mandatory: true, enabled: true },
    { id: 2, name: 'Drawing Number & Revision', mandatory: true, enabled: true },
    { id: 3, name: 'Customer', mandatory: true, enabled: true },
    { id: 4, name: 'Supplier (if applicable)', mandatory: false, enabled: false }
  ]);

  const handleFieldToggle = (id: number) => {
    setFields(fields.map(f => f.id === id && !f.mandatory ? { ...f, enabled: !f.enabled } : f));
  };

  const handleAddTemplate = () => {
    console.log('Adding new template');
    toast.info('Yeni şablon oluşturma penceresi açılıyor...');
  };

  const handleEditMapping = (templateName: string) => {
    console.log('Editing mapping for:', templateName);
    toast.info(`${templateName} için alan eşleme düzenleyicisi açılıyor...`);
  };

  return (
    <div>
      <h3 className="text-gray-900 mb-6">Templates Configuration</h3>

      {/* FAI Order Template */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h4 className="text-sm text-gray-900 mb-4">FAI Order Metadata Template</h4>
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={field.enabled} 
                  onChange={() => handleFieldToggle(field.id)}
                  disabled={field.mandatory}
                  className="rounded" 
                />
                <span className="text-sm text-gray-900">{field.name}</span>
              </div>
              <span className="text-xs text-gray-600">{field.mandatory ? 'Mandatory' : 'Optional'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-sm text-gray-900 mb-4">FAI Report Formats</h4>
        <div className="space-y-3">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-gray-900">AS9102 Form 1/2/3</div>
                <div className="text-xs text-gray-600 mt-1">Aerospace standard format</div>
              </div>
              <button 
                onClick={() => handleEditMapping('AS9102')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Edit Mapping
              </button>
            </div>
            <div className="text-xs text-gray-600">
              <div>Status: Active</div>
              <div>Last Modified: 2024-10-15</div>
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-gray-900">PPAP FAI Report</div>
                <div className="text-xs text-gray-600 mt-1">Automotive PPAP standard</div>
              </div>
              <button 
                onClick={() => handleEditMapping('PPAP')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Edit Mapping
              </button>
            </div>
            <div className="text-xs text-gray-600">
              <div>Status: Active</div>
              <div>Last Modified: 2024-09-22</div>
            </div>
          </div>
        </div>
        <button 
          onClick={handleAddTemplate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Add New Template
        </button>
      </div>
    </div>
  );
}

function RiskRulesConfig() {
  const handleEditRule = (ruleName: string) => {
    console.log('Editing rule:', ruleName);
    toast.info(`${ruleName} sınıflandırma kuralları düzenleniyor...`);
  };

  return (
    <div>
      <h3 className="text-gray-900 mb-6">Critical Characteristics & Risk Rules</h3>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h4 className="text-sm text-gray-900 mb-4">Classification Rules</h4>
        <p className="text-sm text-gray-600 mb-4">
          Define criteria for automatically classifying characteristics as Critical, Major, or Minor based on risk factors.
        </p>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">Critical</span>
              <button 
                onClick={() => handleEditRule('Critical')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Edit Rule
              </button>
            </div>
            <div className="text-sm text-gray-700 mb-2">Conditions (ANY):</div>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Safety impact = High</li>
              <li>• Regulatory requirement = Yes</li>
              <li>• FMEA RPN {'>'}= 200</li>
              <li>• Customer-specified critical</li>
              <li>• Interface dimension (fit/function)</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm">Major</span>
              <button 
                onClick={() => handleEditRule('Major')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Edit Rule
              </button>
            </div>
            <div className="text-sm text-gray-700 mb-2">Conditions (ANY):</div>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• FMEA RPN 100-199</li>
              <li>• Functional impact = Medium</li>
              <li>• Historical quality issues</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">Minor</span>
              <button 
                onClick={() => handleEditRule('Minor')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Edit Rule
              </button>
            </div>
            <div className="text-sm text-gray-700 mb-2">Conditions:</div>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• All other characteristics not classified as Critical or Major</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FMEA Integration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-sm text-gray-900 mb-4">FMEA Integration</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Link to FMEA System:</span>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-12 h-6 bg-green-600 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300">
                <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full transition-transform"></div>
              </div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Auto-update from FMEA:</span>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-12 h-6 bg-green-600 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300">
                <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full transition-transform"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationConfig() {
  const [plmSystem, setPlmSystem] = useState('Windchill');
  const [connectionString, setConnectionString] = useState('');
  const [cmmSoftware, setCmmSoftware] = useState('PC-DMIS');
  const [importPath, setImportPath] = useState('');
  const [erpSystem, setErpSystem] = useState('SAP');

  const handleTestConnection = () => {
    console.log('Testing connection to:', connectionString);
    toast.success('Bağlantı testi başarılı!');
  };

  return (
    <div>
      <h3 className="text-gray-900 mb-6">Integration Settings</h3>

      {/* PLM/CAD Integration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h4 className="text-sm text-gray-900 mb-4">PLM/CAD Integration</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">PLM System</label>
            <select 
              value={plmSystem}
              onChange={(e) => setPlmSystem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option>Windchill</option>
              <option>Teamcenter</option>
              <option>ENOVIA</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Connection String</label>
            <input
              type="text"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="https://plm.company.com/api"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="mbd-enable" className="rounded" />
            <label htmlFor="mbd-enable" className="text-sm text-gray-700">
              Enable Model-Based Definition (MBD) feature extraction
            </label>
          </div>
          <button 
            onClick={handleTestConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Test Connection
          </button>
        </div>
      </div>

      {/* Metrology Integration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h4 className="text-sm text-gray-900 mb-4">Metrology Integration</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">CMM Software</label>
            <select 
              value={cmmSoftware}
              onChange={(e) => setCmmSoftware(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option>PC-DMIS</option>
              <option>Calypso (Zeiss)</option>
              <option>PolyWorks</option>
              <option>Custom API</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Import File Path</label>
            <input
              type="text"
              value={importPath}
              onChange={(e) => setImportPath(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="\\\\server\\share\\cmm-exports"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="auto-import" defaultChecked className="rounded" />
            <label htmlFor="auto-import" className="text-sm text-gray-700">
              Auto-import CMM results when files are detected
            </label>
          </div>
        </div>
      </div>

      {/* ERP/MES Integration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-sm text-gray-900 mb-4">ERP/MES Integration</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">ERP System</label>
            <select 
              value={erpSystem}
              onChange={(e) => setErpSystem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option>SAP</option>
              <option>Oracle ERP</option>
              <option>Microsoft Dynamics</option>
              <option>Custom</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="sync-status" defaultChecked className="rounded" />
            <label htmlFor="sync-status" className="text-sm text-gray-700">
              Sync FAI approval status back to ERP
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneralConfig() {
  return (
    <div>
      <h3 className="text-gray-900 mb-6">General Settings</h3>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h4 className="text-sm text-gray-900 mb-4">Default Workflow Settings</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Default FAI Cycle Time (days)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              defaultValue={30}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Overdue Warning Threshold (days)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              defaultValue={3}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-sm text-gray-900 mb-4">Notifications</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Email notifications for new FAI orders</span>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" checked readOnly className="sr-only peer" />
              <div className="w-12 h-6 bg-green-600 rounded-full">
                <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full"></div>
              </div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Email notifications for overdue FAIs</span>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" checked readOnly className="sr-only peer" />
              <div className="w-12 h-6 bg-green-600 rounded-full">
                <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}