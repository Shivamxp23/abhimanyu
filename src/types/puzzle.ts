export interface Tile {
  id: number;
  currentIndex: number;
  originalIndex: number;
  isEmpty: boolean;
}

export interface GameState {
  tiles: Tile[];
  moves: number;
  elapsedTime: number;
  isPlaying: boolean;
  isCompleted: boolean;
  imageUrl: string;
  solution: {
    moves: number[];
    path: string[];
    currentStep: number;
    isShowingSolution: boolean;
  };
}