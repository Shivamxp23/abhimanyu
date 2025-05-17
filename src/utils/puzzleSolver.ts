import { Tile } from '../types/puzzle';
import { PUZZLE_CONSTANTS, getAdjacentIndices } from './puzzleUtils';

const { GRID_SIZE } = PUZZLE_CONSTANTS;

interface PuzzleState {
  tiles: Tile[];
  emptyIndex: number;
  moves: number[];
  path: string[];
  cost: number; // g(n) - steps taken so far
  heuristic: number; // h(n) - Manhattan distance
}

class PriorityQueue {
  private items: PuzzleState[] = [];

  enqueue(item: PuzzleState) {
    const index = this.items.findIndex(
      existing => this.getFScore(existing) > this.getFScore(item)
    );
    if (index === -1) {
      this.items.push(item);
    } else {
      this.items.splice(index, 0, item);
    }
  }

  dequeue(): PuzzleState | undefined {
    return this.items.shift();
  }

  private getFScore(state: PuzzleState): number {
    return state.cost + state.heuristic; // f(n) = g(n) + h(n)
  }

  get length(): number {
    return this.items.length;
  }
}

// Calculate Manhattan distance for a single tile
const getManhattanDistance = (currentIndex: number, targetIndex: number): number => {
  const currentRow = Math.floor(currentIndex / GRID_SIZE);
  const currentCol = currentIndex % GRID_SIZE;
  const targetRow = Math.floor(targetIndex / GRID_SIZE);
  const targetCol = targetIndex % GRID_SIZE;
  return Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
};

// Calculate total Manhattan distance for all tiles
const getTotalManhattanDistance = (tiles: Tile[]): number => {
  return tiles.reduce((total, tile) => {
    if (!tile.isEmpty) {
      return total + getManhattanDistance(tile.currentIndex, tile.originalIndex);
    }
    return total;
  }, 0);
};

// Get state key for visited states tracking
const getStateKey = (tiles: Tile[]): string => {
  return tiles.map(tile => tile.currentIndex).join(',');
};

// Get move direction for path tracking
const getMoveDirection = (fromIndex: number, toIndex: number): string => {
  const fromRow = Math.floor(fromIndex / GRID_SIZE);
  const fromCol = fromIndex % GRID_SIZE;
  const toRow = Math.floor(toIndex / GRID_SIZE);
  const toCol = toIndex % GRID_SIZE;

  if (fromRow > toRow) return 'up';
  if (fromRow < toRow) return 'down';
  if (fromCol > toCol) return 'left';
  if (fromCol < toCol) return 'right';
  return '';
};

// Create a new state after making a move
const createNewState = (
  currentState: PuzzleState,
  tileIndex: number,
  emptyIndex: number
): PuzzleState => {
  // Create new tiles array with the move applied
  const newTiles = currentState.tiles.map(tile => {
    if (tile.currentIndex === tileIndex) {
      return { ...tile, currentIndex: emptyIndex };
    }
    if (tile.isEmpty) {
      return { ...tile, currentIndex: tileIndex };
    }
    return tile;
  });

  const direction = getMoveDirection(emptyIndex, tileIndex);
  
  return {
    tiles: newTiles,
    emptyIndex: tileIndex,
    moves: [...currentState.moves, tileIndex],
    path: [...currentState.path, direction],
    cost: currentState.cost + 1, // Increment cost by 1 for each move
    heuristic: getTotalManhattanDistance(newTiles)
  };
};

export const findSolution = (tiles: Tile[]): { moves: number[]; path: string[] } => {
  const emptyTile = tiles.find(tile => tile.isEmpty);
  if (!emptyTile) return { moves: [], path: [] };

  const initialState: PuzzleState = {
    tiles,
    emptyIndex: emptyTile.currentIndex,
    moves: [],
    path: [],
    cost: 0,
    heuristic: getTotalManhattanDistance(tiles)
  };

  const openSet = new PriorityQueue();
  openSet.enqueue(initialState);

  const visitedStates = new Set<string>();
  visitedStates.add(getStateKey(tiles));

  while (openSet.length > 0) {
    const currentState = openSet.dequeue()!;

    // Check if puzzle is solved
    if (currentState.heuristic === 0) {
      console.log('Solution found in', currentState.cost, 'moves');
      return { 
        moves: currentState.moves,
        path: currentState.path
      };
    }

    // Get all possible moves from current state
    const adjacentIndices = getAdjacentIndices(currentState.emptyIndex);

    for (const tileIndex of adjacentIndices) {
      const newState = createNewState(
        currentState,
        tileIndex,
        currentState.emptyIndex
      );

      const stateKey = getStateKey(newState.tiles);
      if (!visitedStates.has(stateKey)) {
        visitedStates.add(stateKey);
        openSet.enqueue(newState);
      }
    }
  }

  console.warn('No solution found');
  return { moves: [], path: [] };
};