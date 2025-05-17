import React, { useRef, useEffect } from 'react';
import { Tile } from '../../types/puzzle';

const TILE_SIZE = 200; // pixels

interface PuzzleTileProps {
  tile: Tile;
  imageUrl: string;
  gridSize: number;
  onClick: () => void;
  onTransitionEnd: () => void;
}

const PuzzleTile: React.FC<PuzzleTileProps> = React.memo(({ 
  tile, 
  imageUrl, 
  gridSize,
  onClick,
  onTransitionEnd
}) => {
  const tileRef = useRef<HTMLDivElement>(null);
  
  // Calculate positions
  const row = Math.floor(tile.originalIndex / gridSize);
  const col = tile.originalIndex % gridSize;
  const currentRow = Math.floor(tile.currentIndex / gridSize);
  const currentCol = tile.currentIndex % gridSize;
  
  useEffect(() => {
    const element = tileRef.current;
    if (!element) return;
    
    // Force reflow before transition
    element.style.transform = 'none';
    element.offsetHeight; // Force reflow
    element.style.transform = `translate(${currentCol * TILE_SIZE}px, ${currentRow * TILE_SIZE}px)`;
    
    const handler = (e: TransitionEvent) => {
      if (e.propertyName === 'transform') {
        requestAnimationFrame(() => {
          onTransitionEnd();
        });
      }
    };

    element.addEventListener('transitionend', handler);
    return () => element.removeEventListener('transitionend', handler);
  }, [currentCol, currentRow, onTransitionEnd]);

  // Force browser to handle each new transform as a transition
  const transformStyle = `translate(${currentCol * TILE_SIZE}px, ${currentRow * TILE_SIZE}px)`;

  const style: React.CSSProperties = {
    position: 'absolute',
    width: `${TILE_SIZE}px`,
    height: `${TILE_SIZE}px`,
    top: 0,
    left: 0,
    transform: transformStyle,
    transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: tile.isEmpty ? 'default' : 'pointer',
    userSelect: 'none',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    zIndex: tile.isEmpty ? 0 : 1,
    willChange: 'transform',
    contain: 'layout'  // Optimize rendering
  };

  if (tile.isEmpty) {
    return <div 
      ref={tileRef}
      style={style}
      data-tile-id={tile.id}
      data-empty="true"
      data-position={tile.currentIndex}
    />;
  }

  return (
    <div
      ref={tileRef}
      style={style}
      onClick={onClick}
      className="border border-gray-700 overflow-hidden"
      role="button"
      tabIndex={0}
      aria-label={`Tile ${tile.id + 1}`}
      data-tile-id={tile.id}
      data-position={tile.currentIndex}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: '600px 600px',
          backgroundPosition: `-${col * TILE_SIZE}px -${row * TILE_SIZE}px`,
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  );
});

export default PuzzleTile;