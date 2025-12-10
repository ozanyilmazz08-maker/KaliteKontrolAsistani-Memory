import { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Move, Download, Layers, Box } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DrawingViewerProps {
  selectedCharId: string | null;
  hoveredCharId: string | null;
  onSelectChar: (charId: string) => void;
}

// Mock balloon data
const balloons = [
  { id: 'CHAR-001', number: '1', x: 230, y: 200 },
  { id: 'CHAR-002', number: '2', x: 400, y: 300 },
  { id: 'CHAR-003', number: '3', x: 315, y: 250 },
  { id: 'CHAR-004', number: '4', x: 150, y: 150 },
  { id: 'CHAR-005', number: '5', x: 450, y: 350 },
];

export function DrawingViewer({ selectedCharId, hoveredCharId, onSelectChar }: DrawingViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [view, setView] = useState('Front');
  const [show3D, setShow3D] = useState(false);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleFitToScreen = () => {
    setZoom(100);
  };

  const handleToggle3D = () => {
    setShow3D(!show3D);
  };

  const handleToggleLayers = () => {
    console.log('Toggle layers');
    toast.info('Katman paneli açılıyor - çizim katmanlarını ve notları göstermek/gizlemek için...');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm text-gray-900">Drawing: DWG-2401-001 Rev C</h3>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-200 rounded transition-colors" 
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-200 rounded transition-colors" 
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={handleFitToScreen}
              className="p-2 hover:bg-gray-200 rounded transition-colors" 
              title="Fit to Screen"
            >
              <RotateCw className="w-4 h-4 text-gray-600" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button 
              onClick={handleToggleLayers}
              className="p-2 hover:bg-gray-200 rounded transition-colors" 
              title="Layers"
            >
              <Layers className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              onClick={handleToggle3D}
              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1 hover:bg-blue-200 transition-colors"
            >
              <Box className="w-3 h-3" />
              {show3D ? 'Switch to 2D' : 'Switch to MBD/3D'}
            </button>
          </div>
        </div>
      </div>

      {/* Drawing Canvas */}
      <div className="flex-1 bg-gray-100 relative overflow-hidden">
        {/* Simple technical drawing representation */}
        <svg className="w-full h-full" viewBox="0 0 600 500" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}>
          {/* Main part outline */}
          <rect x="100" y="100" width="400" height="300" fill="none" stroke="#1f2937" strokeWidth="2" />
          
          {/* Detail lines */}
          <line x1="150" y1="100" x2="150" y2="400" stroke="#6b7280" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="300" y1="100" x2="300" y2="400" stroke="#6b7280" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="450" y1="100" x2="450" y2="400" stroke="#6b7280" strokeWidth="1" strokeDasharray="5,5" />
          
          <line x1="100" y1="150" x2="500" y2="150" stroke="#6b7280" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="100" y1="250" x2="500" y2="250" stroke="#6b7280" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="100" y1="350" x2="500" y2="350" stroke="#6b7280" strokeWidth="1" strokeDasharray="5,5" />
          
          {/* Feature details */}
          <circle cx="200" cy="200" r="30" fill="none" stroke="#1f2937" strokeWidth="2" />
          <circle cx="400" cy="300" r="40" fill="none" stroke="#1f2937" strokeWidth="2" />
          <rect x="250" y="180" width="80" height="120" fill="none" stroke="#1f2937" strokeWidth="2" />
          
          {/* Dimension lines */}
          <line x1="100" y1="420" x2="500" y2="420" stroke="#1f2937" strokeWidth="1" />
          <line x1="100" y1="415" x2="100" y2="425" stroke="#1f2937" strokeWidth="1" />
          <line x1="500" y1="415" x2="500" y2="425" stroke="#1f2937" strokeWidth="1" />
          <text x="300" y="440" fontSize="12" fill="#1f2937" textAnchor="middle">400.00 ±0.05</text>
          
          {/* Balloons */}
          {balloons.map((balloon) => {
            const isSelected = selectedCharId === balloon.id;
            const isHovered = hoveredCharId === balloon.id;
            const isActive = isSelected || isHovered;
            
            return (
              <g 
                key={balloon.id}
                onClick={() => onSelectChar(balloon.id)}
                className="cursor-pointer"
              >
                <circle
                  cx={balloon.x}
                  cy={balloon.y}
                  r="16"
                  fill={isActive ? '#3b82f6' : 'white'}
                  stroke={isActive ? '#3b82f6' : '#1f2937'}
                  strokeWidth={isSelected ? '3' : '2'}
                  className="transition-all"
                />
                <text
                  x={balloon.x}
                  y={balloon.y + 5}
                  fontSize="14"
                  fill={isActive ? 'white' : '#1f2937'}
                  textAnchor="middle"
                >
                  {balloon.number}
                </text>
                {/* Leader line */}
                <line
                  x1={balloon.x}
                  y1={balloon.y - 16}
                  x2={balloon.x}
                  y2={balloon.y - 40}
                  stroke={isActive ? '#3b82f6' : '#6b7280'}
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 px-3 py-2 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
        <span>View: {view} (Sheet 1 of 3)</span>
        <span>Zoom: {zoom}%</span>
      </div>
    </div>
  );
}