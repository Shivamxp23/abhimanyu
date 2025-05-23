import React from 'react';

interface GameStatusProps {
  moves: number;
  elapsedTime: number;
  isCompleted: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({ moves, elapsedTime, isCompleted }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col bg-[#c0c0c0] border-[1px] border-solid px-2 py-1 text-xs border-t-[#808080] border-l-[#808080] border-r-white border-b-white min-w-[200px]">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold">Moves:</span>
        <span className="bg-black text-[#00ff00] px-1.5 font-mono">{moves}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-bold">Time:</span>
        <span className="bg-black text-[#00ff00] px-1.5 font-mono">{formatTime(elapsedTime)}</span>
      </div>
      {isCompleted && (
        <div className="mt-1.5 text-center py-0.5 bg-[#000080] text-white font-bold border border-solid border-t-[#1084d0] border-l-[#1084d0] border-r-[#000040] border-b-[#000040] text-[10px]">
          Puzzle Solved!
        </div>
      )}
    </div>
  );
};

export default GameStatus;