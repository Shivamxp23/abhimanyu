import React from 'react';
import { Tile } from '../../types/puzzle';

interface PuzzleTileProps {
  tile: Tile;
  imageUrl: string;
  gridSize: number;
  onClick: () => void;
}

const PuzzleTile: React.FC<PuzzleTileProps> = React.memo(({ 
  tile, 
  imageUrl, 
  gridSize,
  onClick 
}) => {
  // Calculate the tile's position in the grid (0-based)
  const row = Math.floor(tile.originalIndex / gridSize);
  const col = tile.originalIndex % gridSize;
  
  // Calculate the tile's position for rendering
  const currentRow = Math.floor(tile.currentIndex / gridSize);
  const currentCol = tile.currentIndex % gridSize;
  
  const style: React.CSSProperties = {
    position: 'absolute',
    top: `${currentRow * 200}px`,
    left: `${currentCol * 200}px`,
    width: '200px',
    height: '200px',
    transition: 'top 0.3s ease, left 0.3s ease',
    cursor: tile.isEmpty ? 'default' : 'pointer',
    userSelect: 'none',
  };

  if (tile.isEmpty) {
    return <div style={style} />;
  }

  return (
    <div
      style={style}
      onClick={onClick}
      className="border border-gray-700 overflow-hidden"
      role="button"
      tabIndex={0}
      aria-label={`Tile ${tile.id + 1}`}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: '600px 600px',
          backgroundPosition: `-${col * 200}px -${row * 200}px`,
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  );
});

export default PuzzleTile;