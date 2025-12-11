import { X, Plus, Save, Layout, Grid3x3, BarChart3, GaugeIcon, Thermometer, Activity, Droplets, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface NewDashboardModalProps {
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}

export function NewDashboardModal({ onClose, onSave }: NewDashboardModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter a dashboard name');
      return;
    }
    onSave(name, description);
    toast.success(`Dashboard "${name}" created!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg text-gray-900">Create New Dashboard</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Dashboard Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Production Line 5 Monitoring"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this dashboard monitors..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-900">💡 Tip: After creating, use "Add Widget" to add sensors and visualizations</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Create Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

interface EditLayoutModalProps {
  onClose: () => void;
  onApplyLayout: (layoutId: string) => void;
}

export function EditLayoutModal({ onClose, onApplyLayout }: EditLayoutModalProps) {
  const [selectedLayout, setSelectedLayout] = useState('2x2-grid');

  const layouts = [
    { id: '2x2-grid', name: '2x2 Grid', icon: <Grid3x3 className="w-6 h-6" />, description: 'Four equal widgets' },
    { id: '3-column', name: '3 Column', icon: <Layout className="w-6 h-6" />, description: 'Three vertical sections' },
    { id: 'main-sidebar', name: 'Main + Sidebar', icon: <Layout className="w-6 h-6" />, description: 'Large main view with sidebar' },
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart3 className="w-6 h-6" />, description: 'Mixed widget sizes' },
  ];

  const handleSave = () => {
    onApplyLayout(selectedLayout);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg text-gray-900">Edit Dashboard Layout</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">Choose a layout template for your dashboard</p>
          
          <div className="grid grid-cols-2 gap-4">
            {layouts.map(layout => (
              <button
                key={layout.id}
                onClick={() => setSelectedLayout(layout.id)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedLayout === layout.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`mb-3 ${selectedLayout === layout.id ? 'text-blue-600' : 'text-gray-400'}`}>
                    {layout.icon}
                  </div>
                  <h3 className="text-sm text-gray-900 mb-1">{layout.name}</h3>
                  <p className="text-xs text-gray-600">{layout.description}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-900">⚠️ Changing layout will rearrange existing widgets</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" />
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  );
}

interface AddWidgetModalProps {
  onClose: () => void;
  onAddWidget: (type: string, name: string) => void;
}

export function AddWidgetModal({ onClose, onAddWidget }: AddWidgetModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('sensors');
  const [selectedWidgets, setSelectedWidgets] = useState<Array<{ id: string; name: string }>>([]);

  const widgetTypes = {
    sensors: [
      { id: 'temp-gauge', name: 'Temperature Gauge', icon: <Thermometer className="w-5 h-5" />, sensors: 42 },
      { id: 'vibration-chart', name: 'Vibration Chart', icon: <Activity className="w-5 h-5" />, sensors: 28 },
      { id: 'humidity-card', name: 'Humidity Card', icon: <Droplets className="w-5 h-5" />, sensors: 15 },
      { id: 'pressure-gauge', name: 'Pressure Gauge', icon: <GaugeIcon className="w-5 h-5" />, sensors: 34 },
      { id: 'current-chart', name: 'Current Chart', icon: <Zap className="w-5 h-5" />, sensors: 19 },
    ],
    visualizations: [
      { id: 'line-chart', name: 'Line Chart', icon: <BarChart3 className="w-5 h-5" /> },
      { id: 'area-chart', name: 'Area Chart', icon: <BarChart3 className="w-5 h-5" /> },
      { id: 'gauge', name: 'Gauge Widget', icon: <GaugeIcon className="w-5 h-5" /> },
      { id: 'stat-card', name: 'Stat Card', icon: <Layout className="w-5 h-5" /> },
    ],
  };

  const toggleWidget = (widgetId: string, widgetName: string) => {
    setSelectedWidgets(prev => {
      const exists = prev.find(w => w.id === widgetId);
      if (exists) {
        return prev.filter(w => w.id !== widgetId);
      } else {
        return [...prev, { id: widgetId, name: widgetName }];
      }
    });
  };

  const isSelected = (widgetId: string) => {
    return selectedWidgets.some(w => w.id === widgetId);
  };

  const handleAddAllSelected = () => {
    if (selectedWidgets.length === 0) {
      toast.error('Please select at least one widget');
      return;
    }
    selectedWidgets.forEach(widget => {
      onAddWidget(widget.id, widget.name);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg text-gray-900">Add Widget</h2>
            {selectedWidgets.length > 0 && (
              <p className="text-sm text-blue-600 mt-1">{selectedWidgets.length} widget{selectedWidgets.length > 1 ? 's' : ''} selected</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Category Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory('sensors')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'sensors'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sensor Widgets
              </button>
              <button
                onClick={() => setSelectedCategory('visualizations')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'visualizations'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Visualizations
              </button>
            </div>

            {/* Sensor Widgets */}
            {selectedCategory === 'sensors' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">Select sensor types to add to your dashboard (multi-select enabled)</p>
                {widgetTypes.sensors.map(widget => (
                  <button
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id, widget.name)}
                    className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all group ${
                      isSelected(widget.id)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isSelected(widget.id)
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}>
                        {widget.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm text-gray-900">{widget.name}</h3>
                        <p className="text-xs text-gray-500">{widget.sensors} sensors available</p>
                      </div>
                    </div>
                    {isSelected(widget.id) ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-600 px-2 py-1 bg-blue-100 rounded">Selected</span>
                        <X className="w-5 h-5 text-blue-600" />
                      </div>
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Visualization Widgets */}
            {selectedCategory === 'visualizations' && (
              <div className="grid grid-cols-2 gap-4">
                <p className="col-span-2 text-sm text-gray-600 mb-2">Choose visualization types (multi-select enabled)</p>
                {widgetTypes.visualizations.map(widget => (
                  <button
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id, widget.name)}
                    className={`p-6 border-2 rounded-lg transition-all group ${
                      isSelected(widget.id)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-3 rounded-lg transition-colors mb-3 ${
                        isSelected(widget.id)
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}>
                        {widget.icon}
                      </div>
                      <h3 className="text-sm text-gray-900 mb-2">{widget.name}</h3>
                      {isSelected(widget.id) ? (
                        <span className="text-xs text-blue-600 px-2 py-1 bg-blue-100 rounded">Selected</span>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Done
          </button>
          <button onClick={handleAddAllSelected} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Selected
          </button>
        </div>
      </div>
    </div>
  );
}

interface SaveTemplateModalProps {
  dashboardName: string;
  onClose: () => void;
}

export function SaveTemplateModal({ dashboardName, onClose }: SaveTemplateModalProps) {
  const [templateName, setTemplateName] = useState(`${dashboardName} Template`);
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    toast.success(`Template "${templateName}" saved to library!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg text-gray-900">Save as Template</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Template Name</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe when to use this template..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-900">Templates save your current layout, widgets, and settings for reuse across dashboards</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" />
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}