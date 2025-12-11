import { X, Book, Shield, Database, Network, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';

interface HelpPanelProps {
  onClose: () => void;
}

export function HelpPanel({ onClose }: HelpPanelProps) {
  const topics = [
    {
      id: 'iiot-concepts',
      icon: <Network className="w-5 h-5" />,
      title: 'Industrial IoT Concepts',
      description: 'Understanding sensors, protocols, and edge/cloud architecture',
      content: [
        'Field sensors collect real-time data from production equipment',
        'Edge nodes aggregate and filter data before cloud transmission',
        'Protocols like OPC UA, MQTT, and Modbus enable industrial communication',
        'Data quality depends on sampling frequency, latency, and connectivity',
      ]
    },
    {
      id: 'protocols',
      icon: <Database className="w-5 h-5" />,
      title: 'Industrial Protocols',
      description: 'OPC UA, MQTT, Modbus, Profinet, and EtherNet/IP',
      content: [
        'OPC UA: Secure, platform-independent communication for industrial automation',
        'MQTT: Lightweight pub/sub protocol for IoT messaging',
        'Modbus: Widely-used serial/TCP protocol for industrial devices',
        'Profinet: Real-time Ethernet protocol for manufacturing',
        'EtherNet/IP: Industrial protocol based on standard Ethernet',
      ]
    },
    {
      id: 'data-quality',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Data Quality & Streaming',
      description: 'Ensuring reliable, timely sensor data',
      content: [
        'Sampling frequency affects data resolution and analysis accuracy',
        'Latency impacts real-time decision making and control',
        'Data gaps can be handled through interpolation, forward-fill, or alerting',
        'Time synchronization is critical for multi-sensor correlation',
        'SLA compliance ensures data meets operational requirements',
      ]
    },
    {
      id: 'security',
      icon: <Shield className="w-5 h-5" />,
      title: 'Security & Data Governance',
      description: 'Best practices for industrial IoT security',
      content: [
        'TLS encryption protects data in transit',
        'Certificate-based authentication ensures device identity',
        'Network segmentation isolates production from IT networks',
        'Role-based access control limits configuration changes',
        'Audit logs track all system modifications',
        'Compliance with IEC 62443 and similar standards',
      ]
    },
    {
      id: 'quality-integration',
      icon: <Book className="w-5 h-5" />,
      title: 'Quality Management Integration',
      description: 'Linking sensors to SPC, control plans, and FMEA',
      content: [
        'Sensors can feed directly into SPC charts for real-time monitoring',
        'Control plans reference sensor thresholds and acceptance criteria',
        'FMEA risk items can trigger sensor-based alerts',
        'Root cause analysis benefits from time-correlated sensor data',
        'Batch/lot traceability links sensor readings to specific products',
      ]
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50" onClick={onClose}>
      <div
        className="w-[600px] h-full bg-white shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-gray-900">IoT Sensors Help</h3>
            <p className="text-sm text-gray-600">Industrial IoT concepts and best practices</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close help"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 mb-2">Important Notice</p>
            <p className="text-sm text-gray-700">
              Figma Make is designed for demonstration and development purposes. 
              For production systems handling PII or sensitive data, ensure proper 
              security measures and compliance with relevant regulations.
            </p>
          </div>

          <div className="space-y-6">
            {topics.map(topic => (
              <div key={topic.id} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 text-blue-600 mt-0.5">
                    {topic.icon}
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-900 mb-1">{topic.title}</h4>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                  </div>
                </div>
                <ul className="space-y-2 ml-8">
                  {topic.content.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm text-gray-900 mb-4">Standards & References</h4>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-900 mb-1">IEC 62443</p>
                <p className="text-xs text-gray-600">Industrial automation and control systems security</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-900 mb-1">ISA-95</p>
                <p className="text-xs text-gray-600">Enterprise-control system integration</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-900 mb-1">ISO 9001</p>
                <p className="text-xs text-gray-600">Quality management systems requirements</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-900 mb-1">OPC UA Specification</p>
                <p className="text-xs text-gray-600">Platform-independent data exchange standard</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm text-gray-900 mb-4">Additional Resources</h4>
            <div className="space-y-2">
              <button 
                className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => toast.info('Opening documentation portal...')}
              >
                <p className="text-sm text-gray-900 mb-1">📚 Documentation</p>
                <p className="text-xs text-gray-600">Complete system documentation and user guides</p>
              </button>
              <button 
                className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => toast.info('Loading training videos...')}
              >
                <p className="text-sm text-gray-900 mb-1">🎓 Training Videos</p>
                <p className="text-xs text-gray-600">Step-by-step tutorials and best practices</p>
              </button>
              <button 
                className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => toast.success('Support ticket system opened!')}
              >
                <p className="text-sm text-gray-900 mb-1">💬 Support</p>
                <p className="text-xs text-gray-600">Contact technical support team</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}