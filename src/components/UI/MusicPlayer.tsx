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
  const [currentSong, setCurrentSong] = useState('Jhol.mp3');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const wasPlayingRef = useRef(false);

  const songs = [
    'Baarish Yaariyan.mp3',
    'INTENTIONS.mp3',
    'ENDS.mp3',
    'AWAY FROM ME.mp3',
    'Kyun.mp3',
    'Downers At Dusk.mp3',
    'Lost In Time.mp3',
    'Glass Half Full.mp3',
    'Kammo ji.mp3',
    'Hoke Tetho Door Mai.mp3',
    'Jhol.mp3'
  ];

  const showNowPlayingNotification = (songName: string) => {
    // Skip notification for the first song (Jhol.mp3)
    if (songName === 'Jhol.mp3') {
      console.log('Skipping notification for Jhol.mp3');
      return;
    }
    
    // Remove .mp3 extension for display
    const displayName = songName.replace('.mp3', '');
    window.dispatchEvent(new CustomEvent('showNotification', {
      detail: {
        message: `Now playing: ${displayName}`,
        emoji: '🎵'
      }
    }));
  };

  const playRandomSong = () => {
    const availableSongs = songs.filter(song => song !== currentSong);
    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    return availableSongs[randomIndex];
  };

  const handleSongEnd = () => {
    console.log('Song ended, playing next song...');
    const nextSong = playRandomSong();
    console.log('Next song:', nextSong);
    setCurrentSong(nextSong);
    
    // Force play the next song
    if (audioRef.current) {
      audioRef.current.src = `/music/${nextSong}`;
      audioRef.current.load(); // Ensure the new source is loaded
      
      // Use a small timeout to ensure the audio is loaded
      setTimeout(() => {
        if (audioRef.current) {
          console.log('Attempting to play next song...');
          audioRef.current.play()
            .then(() => {
              console.log('Successfully started playing next song');
              setIsPlaying(true);
              wasPlayingRef.current = true;
              onPlay();
              showNowPlayingNotification(nextSong);
            })
            .catch(error => {
              console.error('Error playing next song:', error);
            });
        }
      }, 100);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        onPause();
        wasPlayingRef.current = false;
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            wasPlayingRef.current = true;
            onPlay();
            showNowPlayingNotification(currentSong);
          })
          .catch(error => {
            console.error('Error playing audio:', error);
          });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    console.log('Audio metadata loaded');
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      if (wasPlayingRef.current) {
        console.log('Resuming playback after loading metadata');
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            onPlay();
            showNowPlayingNotification(currentSong);
          })
          .catch(error => {
            console.error('Error resuming playback:', error);
          });
      }
    }
  };

  // Add effect to sync with audio element's playing state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      console.log('Play event triggered');
      setIsPlaying(true);
      wasPlayingRef.current = true;
    };
    const handlePause = () => {
      console.log('Pause event triggered');
      setIsPlaying(false);
      wasPlayingRef.current = false;
    };
    const handleEnded = () => {
      console.log('Ended event triggered');
      handleSongEnd();
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  // Add effect to handle initial song
  useEffect(() => {
    // Skip notification for initial Jhol.mp3
    if (currentSong === 'Jhol.mp3') {
      console.log('Initial song is Jhol.mp3, skipping notification');
      return;
    }
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
    // Resume playback if it was playing before
    if (audioRef.current && wasPlayingRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          onPlay();
          // Don't show notification when resuming after seeking
          if (currentSong !== 'Jhol.mp3' && !wasPlayingRef.current) {
            showNowPlayingNotification(currentSong);
          }
        })
        .catch(error => {
          console.error('Error resuming playback after click:', error);
        });
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateAudioTime(e.clientX);
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
      if (audioRef.current && wasPlayingRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            onPlay();
            // Don't show notification when resuming after seeking
            if (currentSong !== 'Jhol.mp3' && !wasPlayingRef.current) {
              showNowPlayingNotification(currentSong);
            }
          })
          .catch(error => {
            console.error('Error resuming playback after drag:', error);
          });
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

  return (
    <div className="flex items-center gap-4 w-full max-w-[632px] mt-4">
      <audio
        ref={audioRef}
        src={`/music/${currentSong}`}
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
        {/* Song name display */}
        <div className="absolute -top-6 left-0 text-sm text-black/70 font-medium">
          {currentSong.replace('.mp3', '')}
        </div>

        <div 
          ref={progressRef}
          onClick={handleProgressClick}
          className="h-[1px] bg-black/30 cursor-pointer group-hover:bg-black/50 transition-colors"
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full cursor-grab active:cursor-grabbing"
            style={{ left: `${(currentTime / duration) * 100}%` }}
            onMouseDown={handleMouseDown}
          />
        </div>
        
        {/* Time display */}
        <div className="absolute -top-6 right-0 text-[10px] text-black/70 font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
