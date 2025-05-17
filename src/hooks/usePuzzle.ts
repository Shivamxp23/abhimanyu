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
const isMounted = useRef(true);
const moveQueue = useRef<(() => Promise<void>)[]>([]);
const isProcessingMove = useRef(false);

useEffect(() => {
return () => {
isMounted.current = false;
};
}, []);

const processMoveQueue = useCallback(async () => {
if (isProcessingMove.current || moveQueue.current.length === 0) return;

isProcessingMove.current = true;
const nextMove = moveQueue.current[0];

try {
await nextMove();
moveQueue.current.shift();
isProcessingMove.current = false;

// Process next move after a delay
if (moveQueue.current.length > 0) {
setTimeout(() => {
processMoveQueue();
}, 350);
}
} catch (error) {
console.error('Error processing move:', error);
isProcessingMove.current = false;
}
}, []);

const onTransitionEnd = useCallback(() => {
if (!isMounted.current) return;
setIsAnimating(false);
}, []);

// Move a tile with animation
const moveTileWithAnimation = useCallback((tileIndex: number): Promise<void> => {
return new Promise<void>((resolve, reject) => {
const emptyTile = tiles.find(t => t.isEmpty);
if (!emptyTile || !isValidMove(tileIndex, emptyTile.currentIndex)) {
reject(new Error('Invalid move'));
return;
}

setIsAnimating(true);

const updatedTiles = tiles.map(t => {
if (t.currentIndex === tileIndex) return { ...t, currentIndex: emptyTile.currentIndex };
if (t.isEmpty) return { ...t, currentIndex: tileIndex };
return t;
});

setTiles(updatedTiles);
setMoves(prev => prev + 1);

if (isPuzzleSolved(updatedTiles)) {
setIsCompleted(true);
setIsPlaying(false);
setSolution(prev => ({ ...prev, isShowingSolution: false }));
}

// Wait for animation to complete
setTimeout(() => {
setIsAnimating(false);
resolve();
}, 300);
});
}, [tiles]);

const queueMove = useCallback((tileIndex: number) => {
const moveOperation = () => moveTileWithAnimation(tileIndex);
moveQueue.current.push(moveOperation);

// Start processing the queue if not already processing
if (!isProcessingMove.current) {
processMoveQueue();
}
}, [moveTileWithAnimation, processMoveQueue]);

// Handle keyboard navigation
const handleKeyDown = useCallback((e: KeyboardEvent) => {
if (!isPlaying || isCompleted || solution.isShowingSolution || isAnimating) return;

const emptyTile = tiles.find(t => t.isEmpty);
if (!emptyTile) return;

const emptyIndex = emptyTile.currentIndex;
const gridSize = 3;

let tileToMove: number | null = null;

switch (e.key) {
case 'ArrowUp':
if (emptyIndex < 6) tileToMove = emptyIndex + gridSize;
break;
case 'ArrowDown':
if (emptyIndex >= 3) tileToMove = emptyIndex - gridSize;
break;
case 'ArrowLeft':
if (emptyIndex % gridSize !== 2) tileToMove = emptyIndex + 1;
break;
case 'ArrowRight':
if (emptyIndex % gridSize !== 0) tileToMove = emptyIndex - 1;
break;
}

if (tileToMove !== null) {
queueMove(tileToMove);
}
}, [tiles, isPlaying, isCompleted, solution.isShowingSolution, isAnimating, queueMove]);

const showSolution = useCallback(() => {
if (!isPlaying || isCompleted) return;

const solutionResult = findSolution(tiles);
if (!solutionResult.path.length) return;

console.log('Starting solution with steps:', solutionResult.path.length);

setSolution({
moves: solutionResult.moves,
path: solutionResult.path,
currentStep: 0,
isShowingSolution: true
});

// Clear existing moves
moveQueue.current = [];

// Queue up solution moves
solutionResult.path.forEach((direction, index) => {
moveQueue.current.push(async () => {
const currentEmptyTile = tiles.find(t => t.isEmpty);
if (!currentEmptyTile) return;

const tileToMoveIndex = getTileToMove(currentEmptyTile.currentIndex, direction);
if (tileToMoveIndex >= 0 && tileToMoveIndex < PUZZLE_CONSTANTS.TOTAL_TILES) {
console.log(`Executing move ${index + 1}`);
await moveTileWithAnimation(tileToMoveIndex);
setSolution(prev => ({
...prev,
currentStep: index + 1
}));
}
});
});

// Kick off the first move
processMoveQueue();
}, [tiles, isPlaying, isCompleted, moveTileWithAnimation, processMoveQueue]);

// Start the game and timer
const startGame = useCallback(() => {
if (isPlaying) return;

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

const interval = window.setInterval(() => {
setElapsedTime(prev => prev + 1);
}, 1000);

setTimerInterval(interval);
}, [isPlaying]);

// Reset the game
const resetGame = useCallback(() => {
moveQueue.current = [];
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

if (timerInterval) {
clearInterval(timerInterval);
setTimerInterval(null);
}
}, [timerInterval]);

// Move a tile if the move is valid
const moveTile = useCallback((tileIndex: number) => {
if (!isPlaying || isCompleted || isAnimating) return;
queueMove(tileIndex);
}, [isPlaying, isCompleted, isAnimating, queueMove]);

// Stop showing solution
const stopSolution = useCallback(() => {
setSolution(prev => ({ ...prev, isShowingSolution: false }));
moveQueue.current = []; // Clear the move queue
}, []);

// Clean up on unmount
useEffect(() => {
return () => {
if (timerInterval) clearInterval(timerInterval);
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
