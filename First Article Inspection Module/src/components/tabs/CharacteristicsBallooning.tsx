import { useState } from 'react';
import { GlobalContext } from '../../App';
import { DrawingViewer } from '../characteristics/DrawingViewer';
import { CharacteristicsTable } from '../characteristics/CharacteristicsTable';
import { CharacteristicDetail } from '../characteristics/CharacteristicDetail';

interface CharacteristicsBallooningProps {
  globalContext: GlobalContext;
}

export function CharacteristicsBallooning({ globalContext }: CharacteristicsBallooningProps) {
  const [selectedCharId, setSelectedCharId] = useState<string | null>('CHAR-001');
  const [hoveredCharId, setHoveredCharId] = useState<string | null>(null);

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Left: Drawing Viewer */}
      <div className="w-[600px] border-r border-gray-200 bg-white">
        <DrawingViewer 
          selectedCharId={selectedCharId}
          hoveredCharId={hoveredCharId}
          onSelectChar={setSelectedCharId}
        />
      </div>

      {/* Center: Characteristics Table */}
      <div className="flex-1 overflow-y-auto p-6">
        <CharacteristicsTable 
          selectedCharId={selectedCharId}
          onSelectChar={setSelectedCharId}
          onHoverChar={setHoveredCharId}
        />
      </div>

      {/* Right: Detail Panel */}
      {selectedCharId && (
        <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
          <CharacteristicDetail charId={selectedCharId} />
        </div>
      )}
    </div>
  );
}
