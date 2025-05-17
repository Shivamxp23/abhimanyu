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
      className={`flex flex-col rounded shadow-md overflow-hidden border border-gray-400 ${className}`}
      style={style}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1">
        <span className="text-white text-sm font-bold truncate mr-4">{title}</span>
        <div className="flex items-center space-x-1">
          <button className="flex items-center justify-center w-4 h-4 bg-gray-300 hover:bg-gray-400 border border-gray-400 rounded-sm">
            <Minus size={8} className="text-black" />
          </button>
          <button className="flex items-center justify-center w-4 h-4 bg-gray-300 hover:bg-gray-400 border border-gray-400 rounded-sm">
            <Square size={8} className="text-black" />
          </button>
          <button className="flex items-center justify-center w-4 h-4 bg-red-500 hover:bg-red-600 border border-gray-400 rounded-sm">
            <X size={8} className="text-white" />
          </button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="flex-1 bg-gray-200 p-2">
        {children}
      </div>
    </div>
  );
};

export default WindowFrame;