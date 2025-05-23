import React, { useEffect, useRef } from 'react';
import { usePuzzle } from '../../hooks/usePuzzle';
import { useRandomImage } from '../../hooks/useRandomImage';
import PuzzleBoard from './PuzzleBoard';
import WindowFrame from '../UI/WindowFrame';
import Button from '../UI/Button';
import GameStatus from '../UI/GameStatus';
import MusicPlayer from '../UI/MusicPlayer';
import { RefreshCw, Play, RotateCcw, Lightbulb, X } from 'lucide-react';
import SoundManager from '../../utils/SoundManager';

const PuzzleGame: React.FC = () => {
  const musicPlayerRef = useRef<HTMLAudioElement>(null);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [flickerStarted, setFlickerStarted] = React.useState(false);
  const [firstTransitionComplete, setFirstTransitionComplete] = React.useState(false);
  const soundManager = useRef(SoundManager.getInstance());
  const { imageUrl, isLoading, error, fetchRandomImage } = useRandomImage();
  const { 
    tiles, 
    moves, 
    elapsedTime, 
    isPlaying, 
    isCompleted,
    isFading,
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

  // Initialize ambient sound
  useEffect(() => {
    soundManager.current.playAmbience('/music/Birds Chirp.mp3');

    return () => {
      soundManager.current.stop();
    };
  }, []);

  // Debug log to verify the state of the tiles array during runtime
  useEffect(() => {
    console.log('Tiles:', tiles);
  }, [tiles]);

  // Dispatch puzzle completion event
  useEffect(() => {
    if (isCompleted) {
      window.dispatchEvent(new Event('puzzleComplete'));
    }
  }, [isCompleted]);

  // Handle new game with new image
  const handleNewGame = () => {
    // First fetch new image
    fetchRandomImage();
    
    // Then reset the game state after a short delay
    setTimeout(() => {
      resetGame();
      setFlickerStarted(false);
      setFirstTransitionComplete(false);
    }, 100);
  };

  // Handle start game with current image
  const handleStartGame = () => {
    if (imageUrl) {
      // First disable interactions
      setFlickerStarted(false);
      setFirstTransitionComplete(false);
      
      // Start the game
      startGame();
      setGameStarted(true);
      
      // Dispatch gameStart event for background transition with custom data
      window.dispatchEvent(new CustomEvent('gameStart', {
        detail: {
          message: 'The game begins! 🎮 Let the music guide you...',
          emoji: '🎵'
        }
      }));

      // Crossfade to rain and thunder ambience
      soundManager.current.playAmbience('/Rain and thunder.mp3');

      // Start music
      const audioElement = document.querySelector('audio');
      if (audioElement) {
        audioElement.play().catch(err => console.error('Failed to play audio:', err));
      }

      // Wait for the background transition to complete before enabling interactions
      // The background transition takes about 2 seconds
      setTimeout(() => {
        setFlickerStarted(true);
        // Wait for the first flicker to complete (additional 2 seconds)
        setTimeout(() => {
          setFirstTransitionComplete(true);
        }, 2000);
      }, 2000);
    }
  };

  const handleMusicPlay = () => {
    console.log('Music started playing');
  };

  const handleMusicPause = () => {
    console.log('Music paused');
  };

  // Handle solve button click
  const handleSolveClick = () => {
    if (!flickerStarted || !firstTransitionComplete) return; // Prevent solve if transitions aren't complete
    console.log('Solve button clicked');
    console.log('Current game state:', { isPlaying, isCompleted, tiles });
    showSolution();
  };

  // Handle stop solve button click
  const handleStopSolve = () => {
    console.log('Stop solve clicked');
    // Stop the solution process
    stopSolution();
    // Clear any pending solution moves
    window.removeEventListener('keydown', handleKeyDown);
    // Force stop any ongoing animations
    const tiles = document.querySelectorAll('[data-tile-id]');
    tiles.forEach(tile => {
      if (tile instanceof HTMLElement) {
        tile.style.transition = 'none';
        // Force reflow
        tile.offsetHeight;
        tile.style.transition = '';
      }
    });
    // Re-add the event listener after a short delay
    setTimeout(() => {
      window.addEventListener('keydown', handleKeyDown);
    }, 100);
  };

  return (
    <WindowFrame title="Kintsugi" className="mx-auto mt-4" style={{ width: '632px' }}>
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
            disabled={!isPlaying || !flickerStarted}
            className="flex-1"
          >
            <RotateCcw size={14} className="mr-1" />
            Reset
          </Button>

          {solution.isShowingSolution ? (
            <Button
              onClick={handleStopSolve}
              disabled={!isPlaying || !flickerStarted}
              className="flex-1"
            >
              <X size={14} className="mr-1" />
              Stop
            </Button>
          ) : (
            <Button
              onClick={handleSolveClick}
              disabled={!isPlaying || isCompleted || !flickerStarted || !firstTransitionComplete}
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
              isFading={isFading}
              onTileClick={moveTile}
              onTransitionEnd={onTransitionEnd}
              isInteractive={flickerStarted && firstTransitionComplete}
            />
          )}
        </div>
        
        {/* Game Status and Music Player in a row */}
        <div className="flex items-center justify-between gap-4">
          <GameStatus 
            moves={moves} 
            elapsedTime={elapsedTime} 
            isCompleted={isCompleted}
          />
          <MusicPlayer onPlay={handleMusicPlay} onPause={handleMusicPause} />
        </div>
      </div>
    </WindowFrame>
  );
};

export default PuzzleGame;