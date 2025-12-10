import { useState } from 'react';
import { Search, Lock, Unlock, Download, Plus, Square, Circle, Tag } from 'lucide-react';

export function DatasetLabelingTab() {
  const [view, setView] = useState<'list' | 'workspace'>('list');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [annotationMode, setAnnotationMode] = useState<'box' | 'polygon'>('box');
  const [selectedDefectType, setSelectedDefectType] = useState('Solder Bridge');
  const [selectedSeverity, setSelectedSeverity] = useState('Critical');
  const [annotations, setAnnotations] = useState<Array<{id: number, type: string, severity: string}>>([
    { id: 1, type: 'Solder Bridge', severity: 'Critical' }
  ]);

  const handleSaveAndNext = () => {
    console.log('Saving annotations:', annotations);
    // Save annotations logic
    if (selectedImage !== null && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    } else {
      setSelectedImage(0);
    }
    setAnnotations([]);
  };

  const handleSkip = () => {
    if (selectedImage !== null && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    } else {
      setSelectedImage(0);
    }
  };

  const handleRemoveAnnotation = (id: number) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  const handleAddAnnotation = () => {
    const newId = annotations.length > 0 ? Math.max(...annotations.map(a => a.id)) + 1 : 1;
    setAnnotations(prev => [...prev, { 
      id: newId, 
      type: selectedDefectType, 
      severity: selectedSeverity 
    }]);
  };

  const handleExport = (datasetId: number) => {
    console.log('Exporting dataset:', datasetId);
    // Export logic
  };

  const handleLockToggle = (datasetId: number) => {
    console.log('Toggling lock for dataset:', datasetId);
    // Lock toggle logic
  };

  const datasets = [
    {
      id: 1,
      name: 'DS-PCB001-v3',
      version: 'v3',
      purpose: 'Training',
      scope: 'PCB-001',
      period: '2024-Q3',
      images: 8542,
      labeled: 8542,
      quality: 94.2,
      locked: true,
    },
    {
      id: 2,
      name: 'DS-PCB001-v4',
      version: 'v4',
      purpose: 'Training',
      scope: 'PCB-001',
      period: '2024-Q4',
      images: 12453,
      labeled: 9824,
      quality: 91.8,
      locked: false,
    },
    {
      id: 3,
      name: 'DS-Validation-Dec',
      version: 'v1',
      purpose: 'Validation',
      scope: 'All products',
      period: '2024-12',
      images: 2341,
      labeled: 2341,
      quality: 96.5,
      locked: true,
    },
  ];

  const images = [
    { id: 1, filename: 'IMG_20241210_001.png', labeled: true, confidence: 'High', defects: 2 },
    { id: 2, filename: 'IMG_20241210_002.png', labeled: false, confidence: null, defects: 0 },
    { id: 3, filename: 'IMG_20241210_003.png', labeled: true, confidence: 'Low', defects: 1 },
    { id: 4, filename: 'IMG_20241210_004.png', labeled: true, confidence: 'High', defects: 3 },
  ];

  if (view === 'workspace') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setView('list')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Datasets
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Dataset: DS-PCB001-v4</span>
            <div className="h-4 w-px bg-gray-300"></div>
            <span className="text-sm text-gray-600">Progress: 9824 / 12453 (78.9%)</span>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left Panel - Image List */}
          <div className="w-64 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex gap-2 mb-4">
              <button className="flex-1 px-3 py-2 text-sm bg-blue-50 border border-blue-500 text-blue-700 rounded-lg">
                Unlabeled
              </button>
              <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                All
              </button>
            </div>
            <div className="space-y-2">
              {images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(img.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedImage === img.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm text-gray-900 mb-1">{img.filename}</div>
                  <div className="flex items-center gap-2">
                    {img.labeled ? (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Labeled</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">Unlabeled</span>
                    )}
                    {img.defects > 0 && <span className="text-xs text-gray-600">{img.defects} defects</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center - Image Viewer */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">IMG_20241210_002.png</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAnnotationMode('box')}
                  className={`p-2 rounded-lg border ${
                    annotationMode === 'box' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Rectangle Tool"
                >
                  <Square className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAnnotationMode('polygon')}
                  className={`p-2 rounded-lg border ${
                    annotationMode === 'polygon' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Polygon Tool"
                >
                  <Circle className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleAddAnnotation}
                  className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add Annotation
                </button>
              </div>
            </div>

            {/* Image Canvas */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-green-900 to-green-950 rounded-lg overflow-hidden cursor-crosshair">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/20 text-sm">Click to annotate defects</div>
              </div>
              {/* Example annotation box */}
              <div className="absolute top-1/3 left-1/4 w-24 h-24 border-2 border-red-500 rounded cursor-move">
                <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Solder Bridge
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-900">AI Suggestions</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  2 potential defects detected. Click boxes to accept or modify labels.
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                    Accept All
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    Reject All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Label Settings */}
          <div className="w-80 bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-gray-900 mb-4">Label Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Defect Type</label>
                <select 
                  value={selectedDefectType}
                  onChange={(e) => setSelectedDefectType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Solder Bridge</option>
                  <option>Insufficient Solder</option>
                  <option>Missing Component</option>
                  <option>Tombstone</option>
                  <option>Polarity Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Severity</label>
                <div className="flex gap-2">
                  {['Critical', 'Major', 'Minor'].map((severity) => (
                    <button
                      key={severity}
                      onClick={() => setSelectedSeverity(severity)}
                      className={`flex-1 px-3 py-2 text-sm border rounded-lg transition-colors ${
                        selectedSeverity === severity
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm text-gray-700 mb-2">Current Annotations</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {annotations.map((annotation) => (
                    <div key={annotation.id} className="p-2 bg-red-50 rounded border border-red-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{annotation.type}</span>
                        <button 
                          onClick={() => handleRemoveAnnotation(annotation.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{annotation.severity} · Location: (245, 180)</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-700 mb-2">Inter-rater Agreement</div>
                  <div className="text-xs text-gray-600">Consensus: 3/4 labelers agree</div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button 
                  onClick={handleSaveAndNext}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save & Next
                </button>
                <button 
                  onClick={handleSkip}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search datasets..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Create Dataset
          </button>
        </div>
      </div>

      {/* Dataset List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-sm text-gray-700">Dataset Name</th>
              <th className="text-left py-3 px-4 text-sm text-gray-700">Version</th>
              <th className="text-left py-3 px-4 text-sm text-gray-700">Purpose</th>
              <th className="text-left py-3 px-4 text-sm text-gray-700">Scope</th>
              <th className="text-left py-3 px-4 text-sm text-gray-700">Period</th>
              <th className="text-right py-3 px-4 text-sm text-gray-700">Images</th>
              <th className="text-right py-3 px-4 text-sm text-gray-700">Labeled</th>
              <th className="text-right py-3 px-4 text-sm text-gray-700">Quality Score</th>
              <th className="text-center py-3 px-4 text-sm text-gray-700">Status</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((dataset) => (
              <tr key={dataset.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="text-gray-900">{dataset.name}</div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">{dataset.version}</td>
                <td className="py-4 px-4">
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                    {dataset.purpose}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">{dataset.scope}</td>
                <td className="py-4 px-4 text-sm text-gray-700">{dataset.period}</td>
                <td className="py-4 px-4 text-sm text-right text-gray-900">{dataset.images.toLocaleString()}</td>
                <td className="py-4 px-4 text-sm text-right">
                  <div className="text-gray-900">{dataset.labeled.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">
                    {Math.round((dataset.labeled / dataset.images) * 100)}%
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-right text-gray-900">{dataset.quality}%</td>
                <td className="py-4 px-4 text-center">
                  <button 
                    onClick={() => handleLockToggle(dataset.id)}
                    className="hover:bg-gray-100 p-1 rounded"
                  >
                    {dataset.locked ? (
                      <Lock className="w-4 h-4 text-gray-400 inline" />
                    ) : (
                      <Unlock className="w-4 h-4 text-green-600 inline" />
                    )}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {!dataset.locked && (
                      <button
                        onClick={() => setView('workspace')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Label
                      </button>
                    )}
                    <button 
                      onClick={() => handleExport(dataset.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Export"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}