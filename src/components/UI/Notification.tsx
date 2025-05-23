import React from 'react';

interface NotificationProps {
  message: string;
  emoji?: string;
  show: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, emoji, show }) => {
  if (!show) return null;

  return (
    <div
      className="fixed right-4 top-4 flex items-center gap-2 px-4 py-2 bg-[#646464] text-white font-minecraft shadow-lg z-50 animate-fade-in"
      style={{ 
        imageRendering: 'pixelated',
        animation: 'slideIn 0.3s ease-out forwards'
      }}
    >
      {emoji && <span className="text-xl">{emoji}</span>}
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default Notification;
