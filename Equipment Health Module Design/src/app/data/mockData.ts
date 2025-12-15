// Mock data for Equipment Health Module

export type HealthStatus = 'healthy' | 'watch' | 'degrading' | 'critical' | 'data-missing';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'acknowledged' | 'investigating' | 'converted' | 'closed';
export type WorkOrderStatus = 'pending' | 'approved' | 'in-progress' | 'completed' | 'cancelled';

export interface Asset {
  id: string;
  name: string;
  tag: string;
  type: string;
  location: {
    plant: string;
    area: string;
    line: string;
  };
  criticality: 'critical' | 'high' | 'medium' | 'low';
  healthScore: number;
  healthStatus: HealthStatus;
  confidence: number;
  dataQuality: number;
  lastUpdate: string;
  rul: {
    min: number;
    max: number;
    unit: 'days' | 'hours';
  };
  predictedFailureMode?: string;
  nextAction?: string;
  dueBy?: string;
  partsReady: boolean;
  operatingContext?: {
    speed?: number;
    load?: number;
    temperature?: number;
  };
}

export interface Alert {
  id: string;
  assetId: string;
  assetName: string;
  severity: AlertSeverity;
  detectionType: 'rule' | 'anomaly' | 'threshold' | 'model';
  signal: string;
  description: string;
  firstSeen: string;
  lastSeen: string;
  status: AlertStatus;
  assignee?: string;
  confidence: number;
  suspectedFailureModes?: string[];
}

export interface WorkOrder {
  id: string;
  assetId: string;
  assetName: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: WorkOrderStatus;
  createdDate: string;
  dueDate?: string;
  completedDate?: string;
  assignee?: string;
  technician?: string;
  estimatedDuration: number; // hours
  actualDuration?: number;
  downtime?: number;
  rootCause?: string;
  spareParts?: string[];
}

export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  location: string;
  unitCost: number;
  leadTime: number; // days
  associatedAssets: string[];
}

export interface Model {
  id: string;
  name: string;
  type: 'anomaly-detection' | 'classification' | 'rul' | 'rule-based';
  version: string;
  lastTrained?: string;
  accuracy?: number;
  precision?: number;
  recall?: number;
  deploymentStatus: 'active' | 'testing' | 'inactive';
  assetsMonitored: number;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'plc' | 'historian' | 'vibration-gateway' | 'thermal-camera' | 'oil-lab' | 'iiot-platform';
  status: 'connected' | 'disconnected' | 'error';
  lastSeen: string;
  sensorsCount: number;
  dataRate: string;
  latency?: number;
}

// Mock Assets
export const mockAssets: Asset[] = [
  {
    id: 'A001',
    name: 'Pump 101-A',
    tag: 'P-101-A',
    type: 'Centrifugal Pump',
    location: { plant: 'Plant A', area: 'Production Area 1', line: 'Line 1' },
    criticality: 'critical',
    healthScore: 45,
    healthStatus: 'critical',
    confidence: 0.92,
    dataQuality: 98,
    lastUpdate: '2025-12-14T09:15:00Z',
    rul: { min: 3, max: 7, unit: 'days' },
    predictedFailureMode: 'Bearing wear',
    nextAction: 'Replace bearing assembly',
    dueBy: '2025-12-17',
    partsReady: true,
    operatingContext: { speed: 1750, load: 85, temperature: 72 }
  },
  {
    id: 'A002',
    name: 'Motor 203-B',
    tag: 'M-203-B',
    type: 'Induction Motor',
    location: { plant: 'Plant A', area: 'Production Area 2', line: 'Line 3' },
    criticality: 'high',
    healthScore: 62,
    healthStatus: 'degrading',
    confidence: 0.88,
    dataQuality: 95,
    lastUpdate: '2025-12-14T09:10:00Z',
    rul: { min: 14, max: 21, unit: 'days' },
    predictedFailureMode: 'Rotor imbalance',
    nextAction: 'Balance rotor, check alignment',
    dueBy: '2025-12-28',
    partsReady: false,
    operatingContext: { speed: 1800, load: 92, temperature: 68 }
  },
  {
    id: 'A003',
    name: 'Compressor 304-C',
    tag: 'C-304-C',
    type: 'Rotary Screw Compressor',
    location: { plant: 'Plant B', area: 'Utilities', line: 'Compressed Air' },
    criticality: 'critical',
    healthScore: 78,
    healthStatus: 'watch',
    confidence: 0.85,
    dataQuality: 92,
    lastUpdate: '2025-12-14T09:12:00Z',
    rul: { min: 45, max: 60, unit: 'days' },
    predictedFailureMode: 'Oil contamination',
    nextAction: 'Oil analysis, possible oil change',
    dueBy: '2026-01-15',
    partsReady: true,
    operatingContext: { speed: 3600, load: 78, temperature: 85 }
  },
  {
    id: 'A004',
    name: 'Gearbox 105-D',
    tag: 'GB-105-D',
    type: 'Helical Gearbox',
    location: { plant: 'Plant A', area: 'Production Area 1', line: 'Line 2' },
    criticality: 'medium',
    healthScore: 88,
    healthStatus: 'healthy',
    confidence: 0.91,
    dataQuality: 97,
    lastUpdate: '2025-12-14T09:14:00Z',
    rul: { min: 90, max: 120, unit: 'days' },
    nextAction: 'Routine inspection',
    dueBy: '2026-03-15',
    partsReady: true,
    operatingContext: { speed: 450, load: 65, temperature: 55 }
  },
  {
    id: 'A005',
    name: 'Fan 401-E',
    tag: 'FN-401-E',
    type: 'Centrifugal Fan',
    location: { plant: 'Plant B', area: 'HVAC', line: 'Ventilation' },
    criticality: 'low',
    healthScore: 92,
    healthStatus: 'healthy',
    confidence: 0.89,
    dataQuality: 94,
    lastUpdate: '2025-12-14T09:08:00Z',
    rul: { min: 120, max: 180, unit: 'days' },
    nextAction: 'Routine lubrication',
    dueBy: '2026-04-01',
    partsReady: true,
    operatingContext: { speed: 1200, load: 55, temperature: 45 }
  },
  {
    id: 'A006',
    name: 'Conveyor 502-F',
    tag: 'CV-502-F',
    type: 'Belt Conveyor',
    location: { plant: 'Plant A', area: 'Production Area 3', line: 'Line 5' },
    criticality: 'medium',
    healthScore: 0,
    healthStatus: 'data-missing',
    confidence: 0,
    dataQuality: 0,
    lastUpdate: '2025-12-13T22:30:00Z',
    rul: { min: 0, max: 0, unit: 'days' },
    nextAction: 'Reconnect sensors',
    partsReady: false
  }
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'AL001',
    assetId: 'A001',
    assetName: 'Pump 101-A',
    severity: 'critical',
    detectionType: 'model',
    signal: 'Vibration RMS',
    description: 'Vibration level exceeded threshold by 45%. Bearing fault frequency detected.',
    firstSeen: '2025-12-13T14:22:00Z',
    lastSeen: '2025-12-14T09:15:00Z',
    status: 'new',
    confidence: 0.94,
    suspectedFailureModes: ['Bearing outer race defect', 'Misalignment']
  },
  {
    id: 'AL002',
    assetId: 'A002',
    assetName: 'Motor 203-B',
    severity: 'high',
    detectionType: 'anomaly',
    signal: 'Current signature',
    description: 'Abnormal current signature pattern detected. Possible rotor bar issue.',
    firstSeen: '2025-12-12T08:45:00Z',
    lastSeen: '2025-12-14T09:10:00Z',
    status: 'acknowledged',
    assignee: 'John Smith',
    confidence: 0.87,
    suspectedFailureModes: ['Rotor imbalance', 'Broken rotor bar']
  },
  {
    id: 'AL003',
    assetId: 'A003',
    assetName: 'Compressor 304-C',
    severity: 'medium',
    detectionType: 'rule',
    signal: 'Oil debris count',
    description: 'Oil debris count trending upward. Particles >10μm detected.',
    firstSeen: '2025-12-10T11:20:00Z',
    lastSeen: '2025-12-14T09:12:00Z',
    status: 'investigating',
    assignee: 'Sarah Johnson',
    confidence: 0.82,
    suspectedFailureModes: ['Bearing wear', 'Gear tooth wear']
  },
  {
    id: 'AL004',
    assetId: 'A001',
    assetName: 'Pump 101-A',
    severity: 'critical',
    detectionType: 'threshold',
    signal: 'Temperature',
    description: 'Bearing temperature exceeded 80°C. Immediate attention required.',
    firstSeen: '2025-12-14T08:30:00Z',
    lastSeen: '2025-12-14T09:15:00Z',
    status: 'new',
    confidence: 0.99,
    suspectedFailureModes: ['Bearing failure', 'Lubrication failure']
  },
  {
    id: 'AL005',
    assetId: 'A006',
    assetName: 'Conveyor 502-F',
    severity: 'low',
    detectionType: 'rule',
    signal: 'Data connectivity',
    description: 'No data received from sensors for 12 hours.',
    firstSeen: '2025-12-13T22:30:00Z',
    lastSeen: '2025-12-14T09:00:00Z',
    status: 'new',
    confidence: 1.0,
    suspectedFailureModes: ['Sensor disconnection', 'Communication failure']
  }
];

// Mock Work Orders
export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'WO001',
    assetId: 'A001',
    assetName: 'Pump 101-A',
    title: 'Replace bearing assembly',
    description: 'Replace bearing assembly due to excessive wear detected by vibration analysis.',
    priority: 'critical',
    status: 'approved',
    createdDate: '2025-12-14T09:20:00Z',
    dueDate: '2025-12-17T16:00:00Z',
    assignee: 'Mike Wilson',
    technician: 'Mike Wilson',
    estimatedDuration: 4,
    spareParts: ['BRG-6308-2RS', 'SEAL-45x60x8', 'OIL-ISO-VG-68']
  },
  {
    id: 'WO002',
    assetId: 'A002',
    assetName: 'Motor 203-B',
    title: 'Rotor balancing and alignment check',
    description: 'Perform rotor balancing and check motor-pump alignment.',
    priority: 'high',
    status: 'pending',
    createdDate: '2025-12-13T15:30:00Z',
    dueDate: '2025-12-28T12:00:00Z',
    estimatedDuration: 6
  },
  {
    id: 'WO003',
    assetId: 'A003',
    assetName: 'Compressor 304-C',
    title: 'Oil analysis and potential oil change',
    description: 'Conduct detailed oil analysis. Change oil if contamination confirmed.',
    priority: 'medium',
    status: 'in-progress',
    createdDate: '2025-12-11T10:00:00Z',
    dueDate: '2026-01-15T16:00:00Z',
    assignee: 'Tom Brown',
    technician: 'Tom Brown',
    estimatedDuration: 3,
    spareParts: ['OIL-COMPRESSOR-20L', 'FILTER-OIL-C304']
  },
  {
    id: 'WO004',
    assetId: 'A001',
    assetName: 'Pump 101-A',
    title: 'Monthly vibration inspection',
    description: 'Routine vibration monitoring and data collection.',
    priority: 'low',
    status: 'completed',
    createdDate: '2025-11-15T08:00:00Z',
    dueDate: '2025-11-20T16:00:00Z',
    completedDate: '2025-11-18T14:30:00Z',
    assignee: 'Jane Davis',
    technician: 'Jane Davis',
    estimatedDuration: 1,
    actualDuration: 0.75,
    downtime: 0,
    rootCause: 'Routine inspection - no issues found'
  }
];

// Mock Spare Parts
export const mockSpareParts: SparePart[] = [
  {
    id: 'SP001',
    partNumber: 'BRG-6308-2RS',
    name: 'Deep Groove Ball Bearing 6308-2RS',
    category: 'Bearings',
    quantity: 8,
    minStock: 4,
    location: 'Warehouse A - Shelf B3',
    unitCost: 145.50,
    leadTime: 7,
    associatedAssets: ['A001', 'A004']
  },
  {
    id: 'SP002',
    partNumber: 'SEAL-45x60x8',
    name: 'Oil Seal 45x60x8mm',
    category: 'Seals',
    quantity: 15,
    minStock: 10,
    location: 'Warehouse A - Shelf C1',
    unitCost: 22.75,
    leadTime: 5,
    associatedAssets: ['A001', 'A002']
  },
  {
    id: 'SP003',
    partNumber: 'OIL-ISO-VG-68',
    name: 'Hydraulic Oil ISO VG 68 (5L)',
    category: 'Lubricants',
    quantity: 24,
    minStock: 12,
    location: 'Warehouse B - Shelf A5',
    unitCost: 38.00,
    leadTime: 3,
    associatedAssets: ['A001', 'A003', 'A004']
  },
  {
    id: 'SP004',
    partNumber: 'FILTER-OIL-C304',
    name: 'Oil Filter for Compressor C304',
    category: 'Filters',
    quantity: 3,
    minStock: 6,
    location: 'Warehouse A - Shelf D2',
    unitCost: 85.00,
    leadTime: 14,
    associatedAssets: ['A003']
  },
  {
    id: 'SP005',
    partNumber: 'OIL-COMPRESSOR-20L',
    name: 'Compressor Oil 20L',
    category: 'Lubricants',
    quantity: 6,
    minStock: 4,
    location: 'Warehouse B - Shelf A6',
    unitCost: 220.00,
    leadTime: 10,
    associatedAssets: ['A003']
  }
];

// Mock Models
export const mockModels: Model[] = [
  {
    id: 'M001',
    name: 'Bearing Fault Detector',
    type: 'classification',
    version: '2.3.1',
    lastTrained: '2025-11-28',
    accuracy: 0.94,
    precision: 0.92,
    recall: 0.96,
    deploymentStatus: 'active',
    assetsMonitored: 45
  },
  {
    id: 'M002',
    name: 'RUL Predictor - Rotating Equipment',
    type: 'rul',
    version: '1.8.0',
    lastTrained: '2025-12-05',
    accuracy: 0.87,
    deploymentStatus: 'active',
    assetsMonitored: 32
  },
  {
    id: 'M003',
    name: 'Anomaly Detection - Vibration',
    type: 'anomaly-detection',
    version: '3.1.2',
    lastTrained: '2025-12-10',
    precision: 0.89,
    recall: 0.91,
    deploymentStatus: 'active',
    assetsMonitored: 78
  },
  {
    id: 'M004',
    name: 'Temperature Threshold Rules',
    type: 'rule-based',
    version: '1.0.0',
    deploymentStatus: 'active',
    assetsMonitored: 120
  },
  {
    id: 'M005',
    name: 'Motor Current Signature Analysis',
    type: 'classification',
    version: '2.0.5',
    lastTrained: '2025-11-15',
    accuracy: 0.91,
    precision: 0.88,
    recall: 0.93,
    deploymentStatus: 'testing',
    assetsMonitored: 12
  }
];

// Mock Data Sources
export const mockDataSources: DataSource[] = [
  {
    id: 'DS001',
    name: 'Plant A PLC Network',
    type: 'plc',
    status: 'connected',
    lastSeen: '2025-12-14T09:15:00Z',
    sensorsCount: 245,
    dataRate: '1 Hz',
    latency: 120
  },
  {
    id: 'DS002',
    name: 'OSIsoft PI Historian',
    type: 'historian',
    status: 'connected',
    lastSeen: '2025-12-14T09:14:00Z',
    sensorsCount: 1850,
    dataRate: 'Variable',
    latency: 200
  },
  {
    id: 'DS003',
    name: 'SKF Vibration Gateway',
    type: 'vibration-gateway',
    status: 'connected',
    lastSeen: '2025-12-14T09:15:00Z',
    sensorsCount: 64,
    dataRate: '10 kHz',
    latency: 50
  },
  {
    id: 'DS004',
    name: 'FLIR Thermal Camera System',
    type: 'thermal-camera',
    status: 'connected',
    lastSeen: '2025-12-14T09:10:00Z',
    sensorsCount: 8,
    dataRate: 'On-demand',
    latency: 500
  },
  {
    id: 'DS005',
    name: 'Oil Lab Analysis Feed',
    type: 'oil-lab',
    status: 'connected',
    lastSeen: '2025-12-13T16:00:00Z',
    sensorsCount: 12,
    dataRate: 'Weekly',
    latency: 0
  },
  {
    id: 'DS006',
    name: 'IoT Platform - Plant B',
    type: 'iiot-platform',
    status: 'error',
    lastSeen: '2025-12-13T22:30:00Z',
    sensorsCount: 156,
    dataRate: '0.1 Hz',
    latency: 0
  }
];

// Helper functions
export const getAssetById = (id: string): Asset | undefined => {
  return mockAssets.find(asset => asset.id === id);
};

export const getAlertsByAssetId = (assetId: string): Alert[] => {
  return mockAlerts.filter(alert => alert.assetId === assetId);
};

export const getWorkOrdersByAssetId = (assetId: string): WorkOrder[] => {
  return mockWorkOrders.filter(wo => wo.assetId === assetId);
};

export const getSparePartsByAssetId = (assetId: string): SparePart[] => {
  return mockSpareParts.filter(part => part.associatedAssets.includes(assetId));
};

// Mock time series data for charts
export const generateMockTimeSeriesData = (days: number = 30) => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      timestamp: date.toISOString(),
      vibrationRMS: 2.5 + Math.random() * 1.5 + (days - i) * 0.05,
      temperature: 65 + Math.random() * 10 + (days - i) * 0.1,
      current: 45 + Math.random() * 5,
      healthScore: Math.max(0, 90 - (days - i) * 1.5 + Math.random() * 5)
    });
  }
  return data;
};

// Mock FFT spectrum data
export const generateMockFFTData = () => {
  const data = [];
  for (let i = 0; i <= 1000; i += 5) {
    let amplitude = Math.random() * 0.1;
    
    // Add peaks at bearing fault frequencies
    if (Math.abs(i - 120) < 5) amplitude += 1.2; // BPFO
    if (Math.abs(i - 180) < 5) amplitude += 0.8; // BPFI
    if (Math.abs(i - 250) < 5) amplitude += 0.5; // 2x line frequency
    if (Math.abs(i - 500) < 5) amplitude += 0.6; // BSF
    
    data.push({
      frequency: i,
      amplitude: amplitude
    });
  }
  return data;
};

// Mock RUL distribution data
export const generateMockRULData = () => {
  return [
    { days: 0, probability: 0 },
    { days: 1, probability: 0.02 },
    { days: 2, probability: 0.08 },
    { days: 3, probability: 0.18 },
    { days: 4, probability: 0.25 },
    { days: 5, probability: 0.22 },
    { days: 6, probability: 0.15 },
    { days: 7, probability: 0.07 },
    { days: 8, probability: 0.02 },
    { days: 9, probability: 0.01 },
    { days: 10, probability: 0 }
  ];
};

// Mock quality impact data
export const generateMockQualityData = (days: number = 30) => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      defects: Math.floor(Math.random() * 10 + (days - i) * 0.3),
      scrap: Math.floor(Math.random() * 5 + (days - i) * 0.2),
      rework: Math.floor(Math.random() * 8 + (days - i) * 0.25),
      healthScore: Math.max(0, 90 - (days - i) * 1.5 + Math.random() * 5)
    });
  }
  return data;
};
