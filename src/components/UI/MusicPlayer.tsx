import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface MusicPlayerProps {
  onPlay?: () => void;
  onPause?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onPlay, onPause }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSong, setCurrentSong] = useState("Jhol.mp3");
  const [songHistory, setSongHistory] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [songHistory, setSongHistory] = useState<string[]>([]);

  const songs = [
    "Jhol.mp3",
    "Baarish Yaariyan.mp3",
    "INTENTIONS.mp3",
    "ENDS.mp3",
    "AWAY FROM ME.mp3",
    "Kyun.mp3",
    "Downers At Dusk.mp3",
    "Lost In Time.mp3",
    "Glass Half Full.mp3",
    "Kammo ji.mp3",
    "Hoke Tetho Door Mai.mp3"
  ];

  const showNowPlayingNotification = (songName: string) => {
    // Skip notification for the first song (Jhol.mp3)
    if (songName === 'Jhol.mp3') {
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

  const playAudio = async (audio: HTMLAudioElement) => {
    try {
      // Only load if the source has changed
      if (audio.dataset.lastSrc !== audio.src) {
        await audio.load();
        audio.dataset.lastSrc = audio.src;
      }
      await audio.play();
      setIsPlaying(true);
      onPlay?.();
    } catch (err) {
      console.error('Failed to play audio:', err);
    }
  };

  const handleSongEnd = () => {
    const nextSong = playRandomSong();
    setSongHistory(prev => [...prev, currentSong]);
    setCurrentSong(nextSong);
    if (audioRef.current) {
      audioRef.current.src = `/music/${nextSong}`;
      playAudio(audioRef.current);
      showNowPlayingNotification(nextSong);
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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const wasPlaying = isPlaying;
    
    // Pause if playing
    if (wasPlaying) {
      audioRef.current.pause();
    }
    
    // Update position
    audioRef.current.currentTime = pos * audioRef.current.duration;
    
    // Resume if it was playing
    if (wasPlaying) {
      playAudio(audioRef.current);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        onPause?.();
        setIsPlaying(false);
      } else {
        playAudio(audioRef.current);
        showNowPlayingNotification(currentSong);
      }
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      const nextSong = playRandomSong();
      setSongHistory(prev => [...prev, currentSong]);
      setCurrentSong(nextSong);
      audioRef.current.src = `/music/${nextSong}`;
      playAudio(audioRef.current);
      showNowPlayingNotification(nextSong);
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      // Go back 10 seconds if more than 10 seconds have passed
      if (audioRef.current.currentTime > 10) {
        audioRef.current.currentTime -= 10;
      } else {
        // If less than 10 seconds have passed, go to the previous song
        if (songHistory.length > 0) {
          const prevSong = songHistory[songHistory.length - 1];
          setSongHistory(prev => prev.slice(0, -1));
          setCurrentSong(prevSong);
          audioRef.current.src = `/music/${prevSong}`;
          playAudio(audioRef.current);
          showNowPlayingNotification(prevSong);
        }
        // If no history, do nothing
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleSongEnd);
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleSongEnd);
        audio.removeEventListener('play', () => setIsPlaying(true));
        audio.removeEventListener('pause', () => setIsPlaying(false));
      }
    };
  }, []);

  // Add keyboard event listener for spacebar
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if spacebar is pressed and not in an input field
      if (e.code === 'Space' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault(); // Prevent page scroll
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]); // Add isPlaying to dependencies since togglePlay uses it

  return (
    <div className="relative w-full max-w-md">
      <audio
        ref={audioRef}
        src={`/music/${currentSong}`}
        onEnded={handleSongEnd}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Song Name */}
      <div className="text-sm text-gray-600 mb-1">
        {currentSong.replace('.mp3', '')}
      </div>

      {/* Controls and Progress */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        
        <div 
          ref={progressRef}
          className="flex-1 h-1 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        
        <div className="text-xs text-gray-500 w-16 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Skip Controls */}
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={handleSkipBackward}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          title="Previous song or rewind 10 seconds"
        >
          <SkipBack size={16} />
        </button>
        
        <button
          onClick={handleSkipForward}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          title="Next song"
        >
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
