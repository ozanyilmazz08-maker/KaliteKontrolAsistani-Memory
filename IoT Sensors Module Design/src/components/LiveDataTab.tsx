import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Activity, Droplets, RefreshCw, Settings, Maximize2, GaugeIcon, LineChart as LineChartIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { downloadJSON } from '../utils/exportHelpers';
import { NewDashboardModal, EditLayoutModal, AddWidgetModal, SaveTemplateModal } from './DashboardModals';

interface Dashboard {
  id: string;
  name: string;
  description: string;
}

const dashboards: Dashboard[] = [
  { id: 'line3-env', name: 'Line 3 Environmental', description: 'Temperature and humidity monitoring' },
  { id: 'oven2', name: 'Oven #2 Critical Sensors', description: 'Temperature zones and pressure' },
  { id: 'cleanroom', name: 'Cleanroom ISO 7 Monitoring', description: 'Particle count and environmental' },
  { id: 'energy', name: 'Energy & Quality Overview', description: 'Power consumption and quality metrics' },
];

// Generate realistic time-series data
const generateTimeSeriesData = (baseValue: number, variance: number, points: number = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(now - (points - i) * 3000);
    const value = baseValue + (Math.random() - 0.5) * variance;
    return {
      time: time.toLocaleTimeString(),
      value: Number(value.toFixed(2)),
    };
  });
};

function NumericCard({ title, value, unit, status, icon }: { 
  title: string; 
  value: number | string; 
  unit: string; 
  status: 'normal' | 'warning' | 'critical';
  icon: React.ReactNode;
}) {
  const statusColors = {
    normal: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    critical: 'border-red-200 bg-red-50',
  };

  const valueColors = {
    normal: 'text-green-700',
    warning: 'text-yellow-700',
    critical: 'text-red-700',
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${statusColors[status]}`}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-gray-700">{title}</p>
        <div className={valueColors[status]}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl ${valueColors[status]}`}>{value}</span>
        <span className="text-sm text-gray-600">{unit}</span>
      </div>
    </div>
  );
}

function GaugeWidget({ title, value, min, max, unit, thresholds }: {
  title: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  thresholds: { warning: number; critical: number };
}) {
  const percentage = ((value - min) / (max - min)) * 100;
  const getColor = () => {
    if (value >= thresholds.critical) return '#ef4444';
    if (value >= thresholds.warning) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h4 className="text-sm text-gray-700 mb-4">{title}</h4>
      <div className="relative w-full h-32 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 200 120">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={getColor()}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.51} 251`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl" style={{ color: getColor() }}>{value}</span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

function MiniChart({ title, data, unit, color = '#3b82f6' }: {
  title: string;
  data: Array<{ time: string; value: number }>;
  unit: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm text-gray-700">{title}</h4>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke={color} fill={`url(#gradient-${title})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LiveDataTab() {
  const [selectedDashboard, setSelectedDashboard] = useState(dashboards[0]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showNewDashboardModal, setShowNewDashboardModal] = useState(false);
  const [showEditLayoutModal, setShowEditLayoutModal] = useState(false);
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [customDashboards, setCustomDashboards] = useState<Dashboard[]>([]);
  
  // Her dashboard için ayrı configuration
  const [dashboardConfigs, setDashboardConfigs] = useState<{
    [dashboardId: string]: {
      widgets: Array<{
        id: string;
        type: string;
        name: string;
        sensor?: string;
      }>;
      layout: string;
    }
  }>({});

  // Aktif dashboard'ın config'ini al
  const currentConfig = dashboardConfigs[selectedDashboard.id] || { 
    widgets: [], 
    layout: '2x2-grid' 
  };
  
  const dashboardWidgets = currentConfig.widgets;
  const dashboardLayout = currentConfig.layout;

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setRefreshCounter(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleAddWidget = (type: string, name: string) => {
    const newWidget = {
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      name,
      sensor: type.includes('temp') ? 'T-042' : type.includes('vibration') ? 'V-128' : type.includes('humidity') ? 'H-067' : undefined
    };
    setDashboardConfigs(prev => {
      const currentDashboardConfig = prev[selectedDashboard.id] || { widgets: [], layout: '2x2-grid' };
      return {
        ...prev,
        [selectedDashboard.id]: {
          ...currentDashboardConfig,
          widgets: [...currentDashboardConfig.widgets, newWidget]
        }
      };
    });
    toast.success(`${name} added to dashboard!`, {
      description: 'Widget has been added to your dashboard'
    });
    setShowAddWidgetModal(false);
  };

  const handleEditWidget = (widget: string) => {
    toast.info(`Editing ${widget} widget...`);
  };

  const handleRemoveWidget = (widgetId: string) => {
    setDashboardConfigs(prev => {
      const currentDashboardConfig = prev[selectedDashboard.id] || { widgets: [], layout: '2x2-grid' };
      return {
        ...prev,
        [selectedDashboard.id]: {
          ...currentDashboardConfig,
          widgets: currentDashboardConfig.widgets.filter(w => w.id !== widgetId)
        }
      };
    });
    toast.success('Widget removed from dashboard');
  };

  const handleApplyLayout = (layoutId: string) => {
    setDashboardConfigs(prev => {
      const currentDashboardConfig = prev[selectedDashboard.id] || { widgets: [], layout: '2x2-grid' };
      return {
        ...prev,
        [selectedDashboard.id]: {
          ...currentDashboardConfig,
          layout: layoutId
        }
      };
    });
    toast.success('Layout updated successfully!', {
      description: `Dashboard is now using ${layoutId.replace('-', ' ')} layout`
    });
    setShowEditLayoutModal(false);
  };

  const handleDeleteDashboard = (dashboardId: string) => {
    const dashboardToDelete = customDashboards.find(d => d.id === dashboardId);
    setCustomDashboards(customDashboards.filter(d => d.id !== dashboardId));
    
    // If deleted dashboard was selected, switch to first default dashboard
    if (selectedDashboard.id === dashboardId) {
      setSelectedDashboard(dashboards[0]);
    }
    
    toast.success(`Dashboard "${dashboardToDelete?.name}" deleted`);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setFullscreen(true);
        toast.success('Fullscreen mode activated');
      }).catch(() => {
        toast.error('Fullscreen not supported');
      });
    } else {
      document.exitFullscreen().then(() => {
        setFullscreen(false);
        toast.info('Exited fullscreen mode');
      });
    }
  };

  const tempData = generateTimeSeriesData(245, 5);
  const vibrationData = generateTimeSeriesData(0.45, 0.15);
  const pressureData = generateTimeSeriesData(185, 8);
  const humidityData = generateTimeSeriesData(42, 3);

  // Get grid classes based on layout
  const getLayoutGridClasses = () => {
    switch (dashboardLayout) {
      case '2x2-grid':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
      case '3-column':
        return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-3';
      case 'main-sidebar':
        return 'grid-cols-1 lg:grid-cols-3'; // Will use col-span for main area
      case 'dashboard':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {/* Left: Dashboard Selector */}
      <div className="w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-900">Dashboards</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700" onClick={() => setShowNewDashboardModal(true)}>+ New</button>
        </div>

        <div className="space-y-2 mb-6">
          {dashboards.map(dashboard => (
            <button
              key={dashboard.id}
              onClick={() => setSelectedDashboard(dashboard)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedDashboard.id === dashboard.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <p className="text-sm text-gray-900 mb-1">{dashboard.name}</p>
              <p className="text-xs text-gray-600">{dashboard.description}</p>
            </button>
          ))}
          
          {/* Custom Dashboards */}
          {customDashboards.length > 0 && (
            <>
              <div className="py-2">
                <div className="border-t border-gray-200"></div>
              </div>
              {customDashboards.map(dashboard => (
                <div
                  key={dashboard.id}
                  className={`relative group rounded-lg transition-colors ${
                    selectedDashboard.id === dashboard.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <button
                    onClick={() => setSelectedDashboard(dashboard)}
                    className="w-full text-left p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-900">{dashboard.name}</p>
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">New</span>
                    </div>
                    <p className="text-xs text-gray-600">{dashboard.description}</p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDashboard(dashboard.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                    title="Delete dashboard"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-sm text-gray-900 mb-3">Dashboard Settings</h4>
          
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Auto-refresh (5s)</span>
          </label>

          <div className="space-y-2">
            <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowEditLayoutModal(true)}>
              Edit Layout
            </button>
            <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowAddWidgetModal(true)}>
              Add Widget
            </button>
            <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowSaveTemplateModal(true)}>
              Save as Template
            </button>
            <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => downloadJSON(selectedDashboard, 'dashboard')}>
              Export View
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 mt-6">
          <h4 className="text-sm text-gray-900 mb-3">Widget Library</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setShowAddWidgetModal(true)}>
              <Thermometer className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <span className="text-xs text-gray-700 block">Numeric</span>
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setShowAddWidgetModal(true)}>
              <GaugeIcon className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <span className="text-xs text-gray-700 block">Gauge</span>
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setShowAddWidgetModal(true)}>
              <LineChartIcon className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <span className="text-xs text-gray-700 block">Chart</span>
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setShowAddWidgetModal(true)}>
              <Activity className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <span className="text-xs text-gray-700 block">Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* Center: Dashboard Widgets */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg text-gray-900">{selectedDashboard.name}</h2>
              <p className="text-sm text-gray-600">{selectedDashboard.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {autoRefresh && (
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </span>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-xs text-blue-700">Layout:</span>
                <span className="text-xs text-blue-900">{dashboardLayout.replace('-', ' ')}</span>
              </div>
              <button className="px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm" onClick={handleFullscreen}>
                Fullscreen
              </button>
            </div>
          </div>

          {/* Numeric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <NumericCard
              title="Oven Zone 1 Temp"
              value={245.3}
              unit="°C"
              status="normal"
              icon={<Thermometer className="w-5 h-5" />}
            />
            <NumericCard
              title="Motor M-15 Vibration"
              value={0.72}
              unit="g"
              status="warning"
              icon={<Activity className="w-5 h-5" />}
            />
            <NumericCard
              title="Hydraulic Pressure"
              value={185.2}
              unit="bar"
              status="normal"
              icon={<GaugeIcon className="w-5 h-5" />}
            />
            <NumericCard
              title="Cleanroom Humidity"
              value={42.8}
              unit="%RH"
              status="normal"
              icon={<Droplets className="w-5 h-5" />}
            />
          </div>

          {/* Gauges Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <GaugeWidget
              title="Temperature Zone 1"
              value={245}
              min={200}
              max={280}
              unit="°C"
              thresholds={{ warning: 260, critical: 270 }}
            />
            <GaugeWidget
              title="Vibration Level"
              value={0.72}
              min={0}
              max={2}
              unit="g"
              thresholds={{ warning: 0.8, critical: 1.2 }}
            />
            <GaugeWidget
              title="Pressure"
              value={185}
              min={150}
              max={220}
              unit="bar"
              thresholds={{ warning: 200, critical: 210 }}
            />
          </div>

          {/* Time-series Charts */}
          <div className={`grid ${getLayoutGridClasses()} gap-4 mb-6`}>
            <MiniChart
              title="Temperature Trend (1 min)"
              data={tempData}
              unit="°C"
              color="#ef4444"
            />
            <MiniChart
              title="Vibration Trend (1 min)"
              data={vibrationData}
              unit="g"
              color="#f59e0b"
            />
            <MiniChart
              title="Pressure Trend (1 min)"
              data={pressureData}
              unit="bar"
              color="#3b82f6"
            />
            <MiniChart
              title="Humidity Trend (1 min)"
              data={humidityData}
              unit="%RH"
              color="#10b981"
            />
          </div>

          {/* User-Added Widgets */}
          {dashboardWidgets.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-900">Custom Widgets</h3>
                <span className="text-xs text-gray-500">{dashboardWidgets.length} widget{dashboardWidgets.length > 1 ? 's' : ''}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardWidgets.map(widget => (
                  <div key={widget.id} className="bg-white rounded-lg border border-gray-200 p-4 relative group">
                    <button
                      onClick={() => handleRemoveWidget(widget.id)}
                      className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                      title="Remove widget"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-3 mb-3">
                      {widget.type.includes('temp') && <Thermometer className="w-5 h-5 text-red-600" />}
                      {widget.type.includes('vibration') && <Activity className="w-5 h-5 text-yellow-600" />}
                      {widget.type.includes('humidity') && <Droplets className="w-5 h-5 text-blue-600" />}
                      {widget.type.includes('pressure') && <GaugeIcon className="w-5 h-5 text-purple-600" />}
                      {widget.type.includes('chart') && <LineChartIcon className="w-5 h-5 text-gray-600" />}
                      <h4 className="text-sm text-gray-900">{widget.name}</h4>
                    </div>
                    {widget.sensor && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Sensor</span>
                          <span className="text-xs text-gray-700">{widget.sensor}</span>
                        </div>
                        {widget.type.includes('temp') && (
                          <>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl text-red-700">245.3</span>
                              <span className="text-sm text-gray-600">°C</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-red-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                          </>
                        )}
                        {widget.type.includes('vibration') && (
                          <>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl text-yellow-700">0.72</span>
                              <span className="text-sm text-gray-600">g</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '36%' }}></div>
                            </div>
                          </>
                        )}
                        {widget.type.includes('humidity') && (
                          <>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl text-blue-700">42.8</span>
                              <span className="text-sm text-gray-600">%RH</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '43%' }}></div>
                            </div>
                          </>
                        )}
                        {widget.type.includes('chart') && (
                          <div className="h-24 flex items-center justify-center bg-gray-50 rounded">
                            <LineChartIcon className="w-8 h-8 text-gray-400" />
                            <span className="text-xs text-gray-500 ml-2">Chart placeholder</span>
                          </div>
                        )}
                      </div>
                    )}
                    {!widget.sensor && (
                      <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
                        <div className="text-center">
                          <div className="text-2xl mb-1">📊</div>
                          <p className="text-xs text-gray-500">{widget.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Grid */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm text-gray-900 mb-4">Equipment Status Grid</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {['Motor M-12', 'Motor M-13', 'Motor M-14', 'Motor M-15', 'Pump P-1', 'Pump P-2',
                'Oven #1', 'Oven #2', 'Press #1', 'Press #2', 'Robot #3', 'Conveyor C-4'].map((equipment, idx) => (
                <div
                  key={equipment}
                  className={`p-3 rounded-lg border-2 ${
                    idx === 3 ? 'border-yellow-200 bg-yellow-50' :
                    idx === 7 ? 'border-red-200 bg-red-50' :
                    'border-green-200 bg-green-50'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full mb-2 ${
                    idx === 3 ? 'bg-yellow-500' :
                    idx === 7 ? 'bg-red-500' :
                    'bg-green-500'
                  }`}></div>
                  <p className="text-xs text-gray-900">{equipment}</p>
                  <p className="text-xs text-gray-500">
                    {idx === 3 ? 'Warning' : idx === 7 ? 'Error' : 'OK'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Context & Quick Config */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-sm text-gray-900 mb-4">Widget Details</h3>
        <p className="text-sm text-gray-600 mb-6">Select a widget to view configuration options</p>

        <div className="space-y-6">
          <div>
            <h4 className="text-xs text-gray-500 mb-2">Display Options</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="text-sm text-gray-700">Show units</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="text-sm text-gray-700">Show thresholds</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Show sparklines</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-500 mb-2">Unit Conversion</h4>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>°C (Celsius)</option>
              <option>°F (Fahrenheit)</option>
              <option>K (Kelvin)</option>
            </select>
          </div>

          <div>
            <h4 className="text-xs text-gray-500 mb-2">Time Window</h4>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Last 1 minute</option>
              <option>Last 5 minutes</option>
              <option>Last 15 minutes</option>
              <option>Last 1 hour</option>
            </select>
          </div>

          <div>
            <h4 className="text-xs text-gray-500 mb-2">Threshold Configuration</h4>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-600">Warning</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  defaultValue="260"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Critical</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  defaultValue="270"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-xs text-gray-500 mb-3">Quick Links</h4>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => toast.info('Opening sensor details...')}>
                View Sensor Details
              </button>
              <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => toast.info('Loading historical data...')}>
                View Historical Data
              </button>
              <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => toast.info('Opening alert rule creator...')}>
                Create Alert Rule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showNewDashboardModal && (
        <NewDashboardModal
          onClose={() => setShowNewDashboardModal(false)}
          onSave={(name, description) => {
            const newDashboard: Dashboard = {
              id: `custom-${Date.now()}`,
              name,
              description
            };
            setCustomDashboards([...customDashboards, newDashboard]);
            // Initialize config for new dashboard
            setDashboardConfigs(prev => ({
              ...prev,
              [newDashboard.id]: {
                widgets: [],
                layout: '2x2-grid'
              }
            }));
            setSelectedDashboard(newDashboard);
          }}
        />
      )}
      {showEditLayoutModal && (
        <EditLayoutModal
          onClose={() => setShowEditLayoutModal(false)}
          onApplyLayout={handleApplyLayout}
        />
      )}
      {showAddWidgetModal && (
        <AddWidgetModal
          onClose={() => setShowAddWidgetModal(false)}
          onAddWidget={handleAddWidget}
        />
      )}
      {showSaveTemplateModal && (
        <SaveTemplateModal
          dashboardName={selectedDashboard.name}
          onClose={() => setShowSaveTemplateModal(false)}
        />
      )}
    </div>
  );
}