import { Tile } from '../types/puzzle';

const GRID_SIZE = 3;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

// Create initial set of tiles
export const createInitialTiles = (): Tile[] => {
  const tiles: Tile[] = [];
  
  for (let i = 0; i < TOTAL_TILES; i++) {
    // Make the last tile empty
    const isEmpty = i === TOTAL_TILES - 1;
    
    tiles.push({
      id: i,
      currentIndex: i,
      originalIndex: i,
      isEmpty
    });
  }
  
  return tiles;
};

// Check if the puzzle is solved
export const isPuzzleSolved = (tiles: Tile[]): boolean => {
  return tiles.every(tile => tile.currentIndex === tile.originalIndex);
};

// Get the indices of adjacent tiles to the empty tile
export const getAdjacentIndices = (emptyIndex: number): number[] => {
  const row = Math.floor(emptyIndex / GRID_SIZE);
  const col = emptyIndex % GRID_SIZE;
  
  const adjacentIndices: number[] = [];
  
  // Check top
  if (row > 0) adjacentIndices.push(emptyIndex - GRID_SIZE);
  
  // Check right
  if (col < GRID_SIZE - 1) adjacentIndices.push(emptyIndex + 1);
  
  // Check bottom
  if (row < GRID_SIZE - 1) adjacentIndices.push(emptyIndex + GRID_SIZE);
  
  // Check left
  if (col > 0) adjacentIndices.push(emptyIndex - 1);
  
  return adjacentIndices;
};

// Check if a move is valid
export const isValidMove = (tileIndex: number, emptyIndex: number): boolean => {
  const adjacentIndices = getAdjacentIndices(emptyIndex);
  return adjacentIndices.includes(tileIndex);
};

// Shuffle the tiles (ensuring the puzzle is solvable)
export const shuffleTiles = (tiles: Tile[]): Tile[] => {
  const shuffledTiles = [...tiles];
  let emptyIndex = shuffledTiles.findIndex(tile => tile.isEmpty);
  
  // Make a series of valid moves to shuffle
  // This ensures the puzzle is always solvable
  for (let i = 0; i < 100; i++) {
    const adjacentIndices = getAdjacentIndices(emptyIndex);
    const randomAdjacentIndex = adjacentIndices[Math.floor(Math.random() * adjacentIndices.length)];
    
    // Swap empty tile with a random adjacent tile
    const tileToMove = shuffledTiles.find(tile => tile.currentIndex === randomAdjacentIndex);
    if (tileToMove) {
      tileToMove.currentIndex = emptyIndex;
      const emptyTile = shuffledTiles.find(tile => tile.isEmpty);
      if (emptyTile) {
        emptyTile.currentIndex = randomAdjacentIndex;
        emptyIndex = randomAdjacentIndex;
      }
    }
  }
  
  return shuffledTiles;
};

// Get the position of a tile in the grid based on its index
export const getTilePosition = (index: number): { top: number; left: number } => {
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  
  return {
    top: row * (100 / GRID_SIZE),
    left: col * (100 / GRID_SIZE)
  };
};

// Constants for the puzzle
export const PUZZLE_CONSTANTS = {
  GRID_SIZE,
  TOTAL_TILES
};