import React, { ReactNode } from 'react';
import { Minus, Square, X } from 'lucide-react';

interface WindowFrameProps {
  title: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ 
  title, 
  children,
  className = '',
  style
}) => {
  return (
    <div 
      className={`flex flex-col rounded-none border-solid border-[1px] border-[#dfdfdf] shadow-[2px_2px_4px_rgba(0,0,0,0.5)] ${className}`}
      style={{ ...style, transform: 'scale(0.75)', transformOrigin: 'center' }}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#000080] to-[#1084d0] px-1.5 py-0.5 border border-solid border-[#dfdfdf] select-none">
        <div className="flex items-center gap-1">
          <img 
            src="/favicon.ico" 
            alt="icon" 
            className="w-3 h-3"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="text-white text-xs font-bold truncate mr-2">{title}</span>
        </div>
        <div className="flex items-center space-x-0.5">
          <button className="w-3.5 h-3.5 flex items-center justify-center bg-[#c0c0c0] hover:bg-[#dfdfdf] border border-solid border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white">
            <Minus size={8} className="text-black -mt-0.5" />
          </button>
          <button className="w-3.5 h-3.5 flex items-center justify-center bg-[#c0c0c0] hover:bg-[#dfdfdf] border border-solid border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white">
            <Square size={8} className="text-black" />
          </button>
          <button className="w-3.5 h-3.5 flex items-center justify-center bg-[#c0c0c0] hover:bg-red-600 hover:text-white border border-solid border-t-white border-l-white border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white">
            <X size={8} className="text-black hover:text-white" />
          </button>
        </div>
      </div>
      
      {/* Window Content with classic Windows border effect */}
      <div className="flex-1 bg-[#c0c0c0] p-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white border-[1px] border-solid">
        {children}
      </div>
    </div>
  );
}

export default WindowFrame;