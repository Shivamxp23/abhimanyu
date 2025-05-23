import React, { useEffect } from 'react';
import { usePuzzle } from '../../hooks/usePuzzle';
import { useRandomImage } from '../../hooks/useRandomImage';
import PuzzleBoard from './PuzzleBoard';
import WindowFrame from '../UI/WindowFrame';
import Button from '../UI/Button';
import GameStatus from '../UI/GameStatus';
import { RefreshCw, Play, RotateCcw, Lightbulb, X } from 'lucide-react';

const PuzzleGame: React.FC = () => {
  const { imageUrl, isLoading, error, fetchRandomImage } = useRandomImage();
  const { 
    tiles, 
    moves, 
    elapsedTime, 
    isPlaying, 
    isCompleted,
    solution,
    startGame, 
    resetGame, 
    moveTile,
    showSolution,
    stopSolution,
    onTransitionEnd
  } = usePuzzle({ imageUrl });

  // Initialize with a random image when component mounts
  useEffect(() => {
    fetchRandomImage();
  }, [fetchRandomImage]);

  // Debug log to verify the state of the tiles array during runtime
  useEffect(() => {
    console.log('Tiles:', tiles);
  }, [tiles]);

  // Handle new game with new image
  const handleNewGame = () => {
    fetchRandomImage();
    resetGame();
  };

  // Handle start game with current image
  const handleStartGame = () => {
    if (imageUrl) {
      startGame();
    }
  };

  return (
    <WindowFrame title="Image Puzzle" className="mx-auto mt-4" style={{ width: '632px' }}>
      <div className="flex flex-col gap-4">
        {/* Game Controls */}
        <div className="flex justify-between items-center gap-2">
          <Button
            onClick={handleNewGame}
            disabled={isLoading}
            className="flex-1"
          >
            <RefreshCw size={14} className="mr-1" />
            New Game
          </Button>
          
          <Button
            onClick={handleStartGame}
            disabled={isLoading || isPlaying || !imageUrl}
            className="flex-1"
          >
            <Play size={14} className="mr-1" />
            Start
          </Button>
          
          <Button
            onClick={resetGame}
            disabled={!isPlaying}
            className="flex-1"
          >
            <RotateCcw size={14} className="mr-1" />
            Reset
          </Button>

          {solution.isShowingSolution ? (
            <Button
              onClick={stopSolution}
              disabled={!isPlaying}
              className="flex-1"
            >
              <X size={14} className="mr-1" />
              Stop
            </Button>
          ) : (
            <Button
              onClick={() => {
                console.log('Solve button clicked');
                console.log('Current game state:', { isPlaying, isCompleted, tiles });
                showSolution();
              }}
              disabled={!isPlaying || isCompleted}
              className="flex-1"
            >
              <Lightbulb size={14} className="mr-1" />
              Solve
            </Button>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm p-2 bg-white border border-red-400">
            {error}
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="h-[600px] flex items-center justify-center bg-gray-300 border border-gray-400">
            <div className="text-gray-700">Loading image...</div>
          </div>
        )}
        
        {/* Game Board */}
        <div className="flex justify-center">
          {!isLoading && (
            <PuzzleBoard
              tiles={tiles}
              imageUrl={imageUrl}
              isPlaying={isPlaying}
              onTileClick={moveTile}
              onTransitionEnd={onTransitionEnd}
            />
          )}
        </div>
        
        {/* Game Status */}
        <GameStatus 
          moves={moves} 
          elapsedTime={elapsedTime} 
          isCompleted={isCompleted}
          solution={solution}
        />
      </div>
    </WindowFrame>
  );
};

export default PuzzleGame;