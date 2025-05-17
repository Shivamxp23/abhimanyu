import { useState, useEffect, useCallback } from 'react';
import { Tile, GameState } from '../types/puzzle';
import { 
  createInitialTiles, 
  isPuzzleSolved, 
  isValidMove,
  shuffleTiles
} from '../utils/puzzleUtils';
import { findSolution } from '../utils/puzzleSolver';

interface UsePuzzleOptions {
  imageUrl: string;
}

interface UsePuzzleResult extends GameState {
  startGame: () => void;
  resetGame: () => void;
  moveTile: (tileIndex: number) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  showSolution: () => void;
  stopSolution: () => void;
}

export const usePuzzle = ({ imageUrl }: UsePuzzleOptions): UsePuzzleResult => {
  const [tiles, setTiles] = useState<Tile[]>(createInitialTiles());
  const [moves, setMoves] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [solution, setSolution] = useState<GameState['solution']>({
    moves: [],
    path: [],
    currentStep: 0,
    isShowingSolution: false
  });

  // Start the game and timer
  const startGame = useCallback(() => {
    if (isPlaying) return;
    
    // Shuffle tiles
    const shuffledTiles = shuffleTiles(createInitialTiles());
    setTiles(shuffledTiles);
    setMoves(0);
    setElapsedTime(0);
    setIsCompleted(false);
    setIsPlaying(true);
    setSolution({
      moves: [],
      path: [],
      currentStep: 0,
      isShowingSolution: false
    });
    
    // Start timer
    const interval = window.setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  }, [isPlaying]);

  // Reset the game
  const resetGame = useCallback(() => {
    setTiles(createInitialTiles());
    setMoves(0);
    setElapsedTime(0);
    setIsCompleted(false);
    setIsPlaying(false);
    setSolution({
      moves: [],
      path: [],
      currentStep: 0,
      isShowingSolution: false
    });
    
    // Clear timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerInterval]);

  // Move a tile if the move is valid
  const moveTile = useCallback((tileIndex: number) => {
    if (!isPlaying || isCompleted) return;
    
    const tile = tiles.find(t => t.currentIndex === tileIndex);
    if (!tile || tile.isEmpty) return;
    
    const emptyTile = tiles.find(t => t.isEmpty);
    if (!emptyTile) return;
    
    const emptyIndex = emptyTile.currentIndex;
    
    if (isValidMove(tileIndex, emptyIndex)) {
      // Swap positions
      const updatedTiles = tiles.map(t => {
        if (t.currentIndex === tileIndex) {
          return { ...t, currentIndex: emptyIndex };
        }
        if (t.isEmpty) {
          return { ...t, currentIndex: tileIndex };
        }
        return t;
      });
      
      setTiles(updatedTiles);
      setMoves(prevMoves => prevMoves + 1);
      
      // Check if puzzle is solved
      if (isPuzzleSolved(updatedTiles)) {
        setIsCompleted(true);
        setIsPlaying(false);
        setSolution(prev => ({ ...prev, isShowingSolution: false }));
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
      }
    }
  }, [tiles, isPlaying, isCompleted, timerInterval]);

  // Show solution
  const showSolution = useCallback(async () => {
    if (!isPlaying || isCompleted) return;
    
    const solutionResult = findSolution(tiles);
    if (solutionResult.moves.length === 0) {
      console.warn('No solution found');
      return;
    }

    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    // Set initial solution state
    setSolution({
      moves: solutionResult.moves,
      path: solutionResult.path,
      currentStep: 0,
      isShowingSolution: true
    });

    // Execute moves sequentially with precise timing
    for (let i = 0; i < solutionResult.moves.length; i++) {
      // Check if component is still mounted and solution is still active
      const currentSolution = await new Promise<GameState['solution']>(resolve => {
        setSolution(prev => {
          resolve(prev);
          return prev;
        });
      });
      
      if (!currentSolution.isShowingSolution) break;
      
      moveTile(solutionResult.moves[i]);
      setSolution(prev => ({ ...prev, currentStep: i }));
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Clear solution state when done
    setSolution(prev => ({ ...prev, isShowingSolution: false }));
  }, [tiles, isPlaying, isCompleted, moveTile, timerInterval]);

  // Stop showing solution
  const stopSolution = useCallback(() => {
    setSolution(prev => ({ ...prev, isShowingSolution: false }));
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying || isCompleted || solution.isShowingSolution) return;
    
    const emptyTile = tiles.find(t => t.isEmpty);
    if (!emptyTile) return;
    
    const emptyIndex = emptyTile.currentIndex;
    const gridSize = 3;
    
    let tileToMove: number | null = null;
    
    switch (e.key) {
      case 'ArrowUp':
        // Move tile below empty space up
        if (emptyIndex < 6) { // Not in bottom row
          tileToMove = emptyIndex + gridSize;
        }
        break;
      case 'ArrowDown':
        // Move tile above empty space down
        if (emptyIndex >= 3) { // Not in top row
          tileToMove = emptyIndex - gridSize;
        }
        break;
      case 'ArrowLeft':
        // Move tile to right of empty space left
        if (emptyIndex % gridSize !== 2) { // Not in rightmost column
          tileToMove = emptyIndex + 1;
        }
        break;
      case 'ArrowRight':
        // Move tile to left of empty space right
        if (emptyIndex % gridSize !== 0) { // Not in leftmost column
          tileToMove = emptyIndex - 1;
        }
        break;
      default:
        break;
    }
    
    if (tileToMove !== null) {
      moveTile(tileToMove);
    }
  }, [tiles, isPlaying, isCompleted, moveTile, solution.isShowingSolution]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    tiles,
    moves,
    elapsedTime,
    isPlaying,
    isCompleted,
    imageUrl,
    solution,
    startGame,
    resetGame,
    moveTile,
    handleKeyDown,
    showSolution,
    stopSolution
  };
};