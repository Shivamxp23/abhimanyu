import { useState, useEffect, useCallback, useRef } from 'react';
import { Tile, GameState } from '../types/puzzle';
import { 
  createInitialTiles, 
  isPuzzleSolved, 
  isValidMove,
  shuffleTiles,
  PUZZLE_CONSTANTS
} from '../utils/puzzleUtils';
import { findSolution, getTileToMove } from '../utils/puzzleSolver';

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
  onTransitionEnd: () => void;
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
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutId = useRef<number | null>(null);
  const moveCompleteResolver = useRef<(() => void) | null>(null);

  // Handle tile transition completion
  const onTransitionEnd = useCallback(() => {
    setIsAnimating(false);
    if (moveCompleteResolver.current) {
      moveCompleteResolver.current();
      moveCompleteResolver.current = null;
    }
  }, []);

  // Move a tile with animation and wait for completion
  const moveTileWithAnimation = useCallback(async (tileIndex: number): Promise<void> => {
    return new Promise<void>((resolve) => {
      const emptyTile = tiles.find(t => t.isEmpty);
      if (!emptyTile) {
        console.error('No empty tile found');
        resolve();
        return;
      }

      const emptyIndex = emptyTile.currentIndex;
      if (!isValidMove(tileIndex, emptyIndex)) {
        console.error('Invalid move attempt');
        resolve();
        return;
      }

      // Set up completion handler
      moveCompleteResolver.current = resolve;

      // Trigger the move
      const updatedTiles = tiles.map(t => {
        if (t.currentIndex === tileIndex) {
          return { ...t, currentIndex: emptyIndex };
        }
        if (t.isEmpty) {
          return { ...t, currentIndex: tileIndex };
        }
        return t;
      });

      setIsAnimating(true);
      setTiles(updatedTiles);
      setMoves(prevMoves => prevMoves + 1);

      // Safety timeout in case transition event doesn't fire
      animationTimeoutId.current = window.setTimeout(() => {
        if (moveCompleteResolver.current) {
          moveCompleteResolver.current();
          moveCompleteResolver.current = null;
          setIsAnimating(false);
        }
      }, 400); // A bit longer than the animation duration
    });
  }, [tiles]);

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
    if (animationTimeoutId.current) {
      clearTimeout(animationTimeoutId.current);
    }
  }, [timerInterval]);

  // Move a tile if the move is valid
  const moveTile = useCallback((tileIndex: number) => {
    if (!isPlaying || isCompleted || isAnimating) return;
    
    const tile = tiles.find(t => t.currentIndex === tileIndex);
    if (!tile || tile.isEmpty) return;
    
    const emptyTile = tiles.find(t => t.isEmpty);
    if (!emptyTile) return;
    
    const emptyIndex = emptyTile.currentIndex;
    
    if (isValidMove(tileIndex, emptyIndex)) {
      setIsAnimating(true);
      
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
  }, [tiles, isPlaying, isCompleted, isAnimating, timerInterval]);

  // Animate solution sequence
  const runSolveAnimation = useCallback(async () => {
    if (!solution.isShowingSolution || !isPlaying) return;
    
    try {
      for (let i = solution.currentStep; i < solution.path.length; i++) {
        if (!solution.isShowingSolution) break;

        const step = solution.path[i];
        const emptyTile = tiles.find(t => t.isEmpty);
        if (!emptyTile) break;

        const tileToMoveIndex = getTileToMove(emptyTile.currentIndex, step);
        if (tileToMoveIndex < 0 || tileToMoveIndex >= PUZZLE_CONSTANTS.TOTAL_TILES) continue;

        // Move tile and wait for animation
        await moveTileWithAnimation(tileToMoveIndex);
        
        // Add a small pause between moves
        await new Promise(r => setTimeout(r, 100));
        
        // Update solution progress
        setSolution(prev => ({
          ...prev,
          currentStep: i + 1
        }));

        if (isPuzzleSolved(tiles)) {
          setIsCompleted(true);
          setIsPlaying(false);
          setSolution(prev => ({ ...prev, isShowingSolution: false }));
          break;
        }
      }
    } finally {
      setIsAnimating(false);
    }
  }, [tiles, isPlaying, solution, moveTileWithAnimation]);

  // Show solution
  const showSolution = useCallback(async () => {
    if (!isPlaying || isCompleted) return;

    const solutionResult = findSolution(tiles);
    if (solutionResult.path.length === 0) {
      console.warn('No solution found');
      return;
    }

    setSolution({
      moves: solutionResult.moves,
      path: solutionResult.path,
      currentStep: 0,
      isShowingSolution: true
    });

    // Start animation sequence
    setTimeout(() => runSolveAnimation(), 100);
  }, [tiles, isPlaying, isCompleted, runSolveAnimation]);

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
    }
    
    if (tileToMove !== null) {
      moveTile(tileToMove);
    }
  }, [tiles, isPlaying, isCompleted, moveTile, solution.isShowingSolution]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (animationTimeoutId.current) {
        clearTimeout(animationTimeoutId.current);
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
    stopSolution,
    onTransitionEnd
  };
};