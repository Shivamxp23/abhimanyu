import React from 'react';
import { Tile } from '../../types/puzzle';
import PuzzleTile from './PuzzleTile';
import { PUZZLE_CONSTANTS } from '../../utils/puzzleUtils';

interface PuzzleBoardProps {
  tiles: Tile[];
  imageUrl: string;
  isPlaying: boolean;
  onTileClick: (index: number) => void;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ 
  tiles, 
  imageUrl, 
  isPlaying,
  onTileClick 
}) => {
  const { GRID_SIZE } = PUZZLE_CONSTANTS;
  
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
          onClick={() => onTileClick(tile.currentIndex)}
        />
      ))}
    </div>
  );
};

export default PuzzleBoard;