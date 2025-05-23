import React, { useRef } from 'react';
import { Tile } from '../../types/puzzle';
import PuzzleTile from './PuzzleTile';
import { PUZZLE_CONSTANTS } from '../../utils/puzzleUtils';

interface PuzzleBoardProps {
  tiles: Tile[];
  imageUrl: string;
  isPlaying: boolean;
  onTileClick: (index: number) => void;
  onTransitionEnd: () => void;
  isInteractive: boolean;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ 
  tiles, 
  imageUrl, 
  isPlaying,
  onTileClick,
  onTransitionEnd,
  isInteractive
}) => {
  const { GRID_SIZE } = PUZZLE_CONSTANTS;
  
  // Prevent clicks during transitions
  const isTransitioning = useRef(false);
  const handleTileClick = (index: number) => {
    if (isTransitioning.current || !isInteractive) return;
    onTileClick(index);
  };

  const handleTransitionEnd = () => {
    isTransitioning.current = false;
    onTransitionEnd();
  };
  
  return (
    <div 
      className="relative border-2 border-gray-700 shadow-inner bg-gray-800 select-none overflow-hidden"
      style={{ width: '600px', height: '600px' }}
    >
      {!isPlaying && !imageUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-700">
          Click "New Game" to start
        </div>
      )}
      
      {!isPlaying && imageUrl && (
        <div className="w-full h-full">
          <img src={imageUrl} alt="Complete puzzle" className="w-full h-full object-cover" />
        </div>
      )}
      
      {isPlaying && tiles.map(tile => (
        <PuzzleTile 
          key={tile.id}
          tile={tile}
          imageUrl={imageUrl}
          gridSize={GRID_SIZE}
          onClick={() => handleTileClick(tile.currentIndex)}
          onTransitionEnd={handleTransitionEnd}
          isInteractive={isInteractive}
        />
      ))}
    </div>
  );
};

export default PuzzleBoard;