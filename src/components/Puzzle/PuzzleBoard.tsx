import React, { useRef, useEffect, useState } from 'react';
import { Tile } from '../../types/puzzle';
import PuzzleTile from './PuzzleTile';
import { PUZZLE_CONSTANTS } from '../../utils/puzzleUtils';

interface PuzzleBoardProps {
  tiles: Tile[];
  imageUrl: string;
  isPlaying: boolean;
  isFading: boolean;
  onTileClick: (index: number) => void;
  onTransitionEnd: () => void;
  isInteractive: boolean;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ 
  tiles, 
  imageUrl, 
  isPlaying,
  isFading,
  onTileClick,
  onTransitionEnd,
  isInteractive
}) => {
  const { GRID_SIZE } = PUZZLE_CONSTANTS;
  const [currentImage, setCurrentImage] = useState(imageUrl);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  // Handle image changes smoothly
  useEffect(() => {
    if (imageUrl !== currentImage) {
      setIsImageTransitioning(true);
      setIsVisible(false);
      
      const timer = setTimeout(() => {
        setCurrentImage(imageUrl);
        setIsImageTransitioning(false);
        setIsVisible(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [imageUrl]);
  
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
    <div className="relative" style={{ width: '600px', height: '600px' }}>
      {/* Completed image that fades in */}
      <div 
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
          isFading ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ zIndex: isFading ? 1 : 0 }}
      >
        <img 
          src={currentImage} 
          alt="Complete puzzle" 
          className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Puzzle board that fades out */}
      <div 
        className={`absolute inset-0 border-2 border-gray-700 shadow-inner bg-gray-800 select-none overflow-hidden transition-opacity duration-1000 ease-in-out ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ zIndex: isFading ? 0 : 1 }}
      >
        {!isPlaying && !currentImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-700">
            Click "New Game" to start
          </div>
        )}
        
        {!isPlaying && currentImage && !isFading && (
          <div className="w-full h-full">
            <img 
              src={currentImage} 
              alt="Complete puzzle" 
              className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        )}
        
        {isPlaying && tiles.map(tile => (
          <PuzzleTile 
            key={tile.id}
            tile={tile}
            imageUrl={currentImage}
            gridSize={GRID_SIZE}
            onClick={() => handleTileClick(tile.currentIndex)}
            onTransitionEnd={handleTransitionEnd}
            isInteractive={isInteractive}
          />
        ))}
      </div>
    </div>
  );
};

export default PuzzleBoard;