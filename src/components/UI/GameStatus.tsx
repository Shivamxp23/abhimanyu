import React from 'react';
import { GameState } from '../../types/puzzle';

interface GameStatusProps {
  moves: number;
  elapsedTime: number;
  isCompleted: boolean;
  solution: GameState['solution'];
}

const GameStatus: React.FC<GameStatusProps> = ({ moves, elapsedTime, isCompleted, solution }) => {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col bg-gray-300 border px-2 py-1.5 text-sm border-solid border-[1.5px] shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080]">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold">Moves:</span>
        <span>{moves}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-bold">Time:</span>
        <span>{formatTime(elapsedTime)}</span>
      </div>
      {solution.isShowingSolution && (
        <div className="mt-2 text-center">
          <div className="bg-[#000080] text-white font-bold py-1 mb-1">
            Solving Puzzle...
          </div>
          <div className="text-xs">
            Step {solution.currentStep + 1} of {solution.moves.length}:{' '}
            {solution.path[solution.currentStep]?.toUpperCase()}
          </div>
        </div>
      )}
      {isCompleted && (
        <div className="mt-2 text-center py-1 bg-[#000080] text-white font-bold">
          Puzzle Solved!
        </div>
      )}
    </div>
  );
};

export default GameStatus;