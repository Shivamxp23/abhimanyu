import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface MusicPlayerProps {
  onPlay: () => void;
  onPause: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onPlay, onPause }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        onPause();
      } else {
        audioRef.current.play();
        onPlay();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Add effect to sync with audio element's playing state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);
  const updateAudioTime = (clientX: number) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updateAudioTime(e.clientX);
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateAudioTime(e.clientX);
    // Pause while dragging for smoother experience
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateAudioTime(e.clientX);
    }
  };
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Always play after dragging ends
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        onPlay(); // Notify parent component about playback
      }
    }
  };

  // Add and remove mouse event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isPlaying]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  return (    <div className="flex items-center gap-4 w-full max-w-[632px] mt-4">      <audio
        ref={audioRef}
        src="/music/Jhol.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      <button
        onClick={togglePlay}
        className="text-black hover:text-gray-700 transition-colors"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      {/* Minimalist Progress Bar */}
      <div className="flex-1 relative group">
        <div 
          ref={progressRef}
          onClick={handleProgressClick}
          className="h-[1px] bg-black/30 cursor-pointer group-hover:bg-black/50 transition-colors"
        >          <div
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full cursor-grab active:cursor-grabbing"
            style={{ left: `${(currentTime / duration) * 100}%` }}
            onMouseDown={handleMouseDown}
          />
        </div>
        
        {/* Time tooltip */}
        <div className="absolute -top-6 left-0 text-[10px] text-black/70 font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
