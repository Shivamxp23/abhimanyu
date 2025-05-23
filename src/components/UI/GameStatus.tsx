import React from 'react';
import { GameState } from '../../types/puzzle';

interface GameStatusProps {
  moves: number;
  elapsedTime: number;
  isCompleted: boolean;
  solution: GameState['solution'];
}

const GameStatus: React.FC<GameStatusProps> = ({ moves, elapsedTime, isCompleted, solution }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col bg-[#c0c0c0] border-[1px] border-solid px-2 py-1 text-xs border-t-[#808080] border-l-[#808080] border-r-white border-b-white transform scale-90 origin-top">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold">Moves:</span>
        <span className="bg-black text-[#00ff00] px-1.5 font-mono">{moves}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-bold">Time:</span>
        <span className="bg-black text-[#00ff00] px-1.5 font-mono">{formatTime(elapsedTime)}</span>
      </div>
      {solution.isShowingSolution && (
        <div className="mt-1.5">
          <div className="bg-[#000080] text-white font-bold py-0.5 mb-0.5 text-center border border-solid border-t-[#1084d0] border-l-[#1084d0] border-r-[#000040] border-b-[#000040] text-[10px]">
            Solving Puzzle...
          </div>
          <div className="text-center py-0.5 bg-[#c0c0c0] border border-solid border-t-[#808080] border-l-[#808080] border-r-white border-b-white">
            <div className="text-[10px] font-bold">
              Step {solution.currentStep + 1} of {solution.path.length}
            </div>
            <div className="text-[10px] mt-0.5">
              {solution.currentStep < solution.path.length ? (
                <>
                  <span className="font-bold">Current Move: </span>
                  Move tile #{solution.moves[solution.currentStep]} {solution.path[solution.currentStep]?.toLowerCase()}
                </>
              ) : (
                'Complete!'
              )}
            </div>
          </div>
          <div className="bg-white mt-0.5 p-1.5 max-h-24 overflow-y-auto border border-solid border-t-[#808080] border-l-[#808080] border-r-white border-b-white">
            {solution.path.map((step, index) => (
              <div 
                key={index} 
                className={`text-[10px] mb-1 p-0.5 ${
                  index === solution.currentStep 
                    ? 'bg-[#000080] text-white font-bold' 
                    : index < solution.currentStep 
                    ? 'text-gray-500 line-through' 
                    : ''
                }`}
              >
                {index + 1}. Move tile #{solution.moves[index]} {step.toLowerCase()}
              </div>
            ))}
          </div>
        </div>
      )}
      {isCompleted && (
        <div className="mt-1.5 text-center py-0.5 bg-[#000080] text-white font-bold border border-solid border-t-[#1084d0] border-l-[#1084d0] border-r-[#000040] border-b-[#000040] text-[10px]">
          Puzzle Solved!
        </div>
      )}
    </div>
  );
};

export default GameStatus;