import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  emoji?: string;
  show: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, emoji, show }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animation, setAnimation] = useState('');

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setAnimation('slide-in');
      const timer = setTimeout(() => {
        setAnimation('slide-out');
        setTimeout(() => setIsVisible(false), 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed right-0 top-8 flex items-center gap-2 px-4 py-2 bg-[#646464]/80 text-white font-minecraft shadow-md transform ${
        animation === 'slide-in' ? 'animate-slide-in' : 'animate-slide-out'
      }`}
      style={{ imageRendering: 'pixelated' }}
    >
      {emoji && <span className="text-xl">{emoji}</span>}
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default Notification;
