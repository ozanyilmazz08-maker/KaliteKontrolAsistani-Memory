import { useState } from 'react';
import { Camera, Video, Settings, CheckCircle, XCircle, Edit, Save } from 'lucide-react';

type ConfigView = 'cameras' | 'recipes';

export function ConfigurationTab() {
  const [view, setView] = useState<ConfigView>('cameras');
  const [editingRecipe, setEditingRecipe] = useState<string | null>(null);
  const [recipeData, setRecipeData] = useState<{[key: string]: any}>({});

  const handleSaveRecipe = (recipeName: string) => {
    console.log('Saving recipe:', recipeName, recipeData[recipeName]);
    // Save recipe logic
    setEditingRecipe(null);
  };

  const handleCalibrateCamera = (cameraId: number) => {
    console.log('Starting calibration for camera:', cameraId);
    // Calibration logic
  };

  const handleCaptureTest = (cameraId: number) => {
    console.log('Capturing test image from camera:', cameraId);
    // Capture logic
  };

  const cameras = [
    {
      id: 1,
      name: 'Camera 1 - Top View',
      status: 'Online',
      resolution: '4096x3072',
      frameRate: 30,
      lastCalibration: '2024-12-01',
      position: 'Top center, 45cm height',
    },
    {
      id: 2,
      name: 'Camera 2 - Side View',
      status: 'Online',
      resolution: '4096x3072',
      frameRate: 30,
      lastCalibration: '2024-11-28',
      position: 'Side left, 30° angle',
    },
    {
      id: 3,
      name: 'Camera 3 - Detail View',
      status: 'Offline',
      resolution: '4096x3072',
      frameRate: 30,
      lastCalibration: '2024-11-15',
      position: 'Top right, macro lens',
    },
    {
      id: 4,
      name: 'Camera 4 - Bottom View',
      status: 'Online',
      resolution: '4096x3072',
      frameRate: 30,
      lastCalibration: '2024-12-05',
      position: 'Bottom, mirror setup',
    },
  ];

  const recipes = [
    {
      id: 1,
      name: 'PCB-001 Standard',
      product: 'PCB-001 Main Board',
      lines: ['SMT Line 3', 'SMT Line 4'],
      model: 'CNN-v2.3.1',
      status: 'Active',
    },
    {
      id: 2,
      name: 'PCB-002 High Density',
      product: 'PCB-002 Controller',
      lines: ['SMT Line 2'],
      model: 'Segmentation-v1.8.2',
      status: 'Draft',
    },
  ];

  if (view === 'cameras') {
    return (
      <div className="space-y-6">
        {/* View Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setView('cameras')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <Camera className="w-5 h-5" />
            Cameras & Lighting
          </button>
          <button
            onClick={() => setView('recipes')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Settings className="w-5 h-5" />
            Inspection Recipes
          </button>
        </div>

        {/* Camera List */}
        <div className="grid grid-cols-2 gap-6">
          {cameras.map((camera) => (
            <div key={camera.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">{camera.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {camera.status === 'Online' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">Online</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-600">Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Live Preview */}
              <div className="mb-4 aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white/50 text-sm">Live Preview</span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-600">Resolution</div>
                  <div className="text-gray-900">{camera.resolution}</div>
                </div>
                <div>
                  <div className="text-gray-600">Frame Rate</div>
                  <div className="text-gray-900">{camera.frameRate} fps</div>
                </div>
                <div>
                  <div className="text-gray-600">Last Calibration</div>
                  <div className="text-gray-900">{camera.lastCalibration}</div>
                </div>
                <div>
                  <div className="text-gray-600">Position</div>
                  <div className="text-gray-900">{camera.position}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button 
                  onClick={() => handleCaptureTest(camera.id)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Capture Test Image
                </button>
                <button 
                  onClick={() => handleCalibrateCamera(camera.id)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Calibrate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('cameras')}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Camera className="w-5 h-5" />
          Cameras & Lighting
        </button>
        <button
          onClick={() => setView('recipes')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <Settings className="w-5 h-5" />
          Inspection Recipes
        </button>
      </div>

      {/* Recipe List */}
      <div className="space-y-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-gray-900">{recipe.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      recipe.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {recipe.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Product: {recipe.product}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (editingRecipe === recipe.name) {
                      handleSaveRecipe(recipe.name);
                    } else {
                      setEditingRecipe(recipe.name);
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  {editingRecipe === recipe.name ? (
                    <Save className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Edit className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {editingRecipe === recipe.name ? (
              /* Edit Mode */
              <div className="space-y-4">
                {/* General */}
                <div>
                  <h4 className="text-sm text-gray-700 mb-3">General</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Product/Recipe ID</label>
                      <input
                        type="text"
                        defaultValue={recipe.product}
                        onChange={(e) => setRecipeData(prev => ({
                          ...prev,
                          [recipe.name]: { ...prev[recipe.name], product: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Active Model</label>
                      <select 
                        defaultValue={recipe.model}
                        onChange={(e) => setRecipeData(prev => ({
                          ...prev,
                          [recipe.name]: { ...prev[recipe.name], model: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>{recipe.model}</option>
                        <option>Segmentation-v1.8.2</option>
                        <option>Anomaly-v3.1.0</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Defect Definitions */}
                <div>
                  <h4 className="text-sm text-gray-700 mb-3">Defect Definitions</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-2 px-3">Defect Type</th>
                          <th className="text-left py-2 px-3">Severity</th>
                          <th className="text-left py-2 px-3">Min Confidence</th>
                          <th className="text-left py-2 px-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { type: 'Solder Bridge', severity: 'Critical', confidence: 95, action: 'Reject' },
                          { type: 'Insufficient Solder', severity: 'Major', confidence: 90, action: 'Rework' },
                          { type: 'Component Shift', severity: 'Minor', confidence: 85, action: 'Accept with flag' },
                        ].map((defect, idx) => (
                          <tr key={idx} className="border-t border-gray-100">
                            <td className="py-2 px-3">{defect.type}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  defect.severity === 'Critical'
                                    ? 'bg-red-100 text-red-700'
                                    : defect.severity === 'Major'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {defect.severity}
                              </span>
                            </td>
                            <td className="py-2 px-3">{defect.confidence}%</td>
                            <td className="py-2 px-3">{defect.action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ROI Configuration */}
                <div>
                  <h4 className="text-sm text-gray-700 mb-3">Regions of Interest</h4>
                  <div className="aspect-[4/3] bg-gradient-to-br from-green-900 to-green-950 rounded-lg relative">
                    <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 border-2 border-blue-500 rounded cursor-move">
                      <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        ROI 1: Component Area
                      </div>
                    </div>
                    <div className="absolute bottom-1/4 right-1/4 w-1/4 h-1/4 border-2 border-green-500 rounded cursor-move">
                      <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        ROI 2: Connector
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Applied to Lines</div>
                  <div className="text-gray-900">{recipe.lines.join(', ')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Active Model</div>
                  <div className="text-gray-900">{recipe.model}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Defect Types</div>
                  <div className="text-gray-900">8 configured</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}