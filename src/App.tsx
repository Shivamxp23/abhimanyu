import PuzzleGame from './components/Puzzle/PuzzleGame';
import Notification from './components/UI/Notification';
import { Monitor, Folder, Globe, Trash2, HardDrive, Files, User2, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import RainEffect from './components/UI/RainEffect';

const DesktopIcon = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex flex-col items-center gap-0.5 cursor-pointer select-none group mb-0.5 scale-75">
    <Icon className="text-white drop-shadow-md" size={24} />
    <span className="text-white text-xs font-sans bg-[#000080] px-1 group-hover:bg-[#1084d0] whitespace-nowrap">
      {label}
    </span>
  </div>
);

function App() {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    emoji: ''
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showIllumination, setShowIllumination] = useState(false);
  const [isIlluminationBroken, setIsIlluminationBroken] = useState(false);
  const [hasShownStartNotification, setHasShownStartNotification] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const [hasShownAudioNotification, setHasShownAudioNotification] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and play background audio
  useEffect(() => {
    audioRef.current = new Audio('/Birds Chirp.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Set volume to 30% for a more subtle effect
    
    // Play audio when component mounts
    const playAudio = async () => {
      try {
        await audioRef.current?.play();
        // Don't show any notification on initial autoplay success
      } catch (error) {
        console.log('Audio autoplay failed:', error);
        // Always show click notification first
        setNotification({
          show: true,
          message: 'Click anywhere to enable sounds',
          emoji: '🔇'
        });
        // Clear notification after 3 seconds
        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
      }
    };
    playAudio();

    // Add click listener to enable audio
    const enableAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          // Show enabled notification only after clicking
          setNotification({
            show: true,
            message: 'Ambient sounds enabled',
            emoji: '🔊'
          });
          // Clear notification after 3 seconds
          setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
          }, 3000);
        } catch (error) {
          console.log('Audio playback failed:', error);
        }
      }
    };
    document.addEventListener('click', enableAudio, { once: true });

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', enableAudio);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      setNotification({
        show: true,
        message: isMuted ? 'Ambient sounds enabled' : 'Ambient sounds muted',
        emoji: isMuted ? '🔊' : '🔇'
      });
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  // Listen for game start event
  useEffect(() => {
    const handleGameStart = (event: CustomEvent) => {
      console.log('Game start event received:', event.detail);
      setIsGameStarted(true);
      
      // Only show start notification if it hasn't been shown before
      if (!hasShownStartNotification) {
        setNotification({
          show: true,
          message: event.detail.message,
          emoji: event.detail.emoji
        });
        setHasShownStartNotification(true);
        // Clear start notification after 5 seconds
        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }));
        }, 5000);
      }

      // Start the dark mode transition
      setTimeout(() => {
        setIsDarkMode(true);
        // Show illumination after dark mode transition
        setTimeout(() => {
          setShowIllumination(true);
        }, 10000); // Wait for dark mode transition to complete
      }, 500);
    };

    window.addEventListener('gameStart', handleGameStart as EventListener);
    return () => window.removeEventListener('gameStart', handleGameStart as EventListener);
  }, [hasShownStartNotification]);

  // Reset rain effect when game is reset
  useEffect(() => {
    if (!isGameStarted) {
      setShowRain(false);
    }
  }, [isGameStarted]);

  // Add event listener for custom notifications
  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
      console.log('Notification event received:', event.detail);
      setNotification({
        show: true,
        message: event.detail.message,
        emoji: event.detail.emoji
      });
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    };

    window.addEventListener('showNotification', handleNotification as EventListener);
    return () => window.removeEventListener('showNotification', handleNotification as EventListener);
  }, []);

  // Debug notification state changes
  useEffect(() => {
    console.log('Notification state changed:', notification);
  }, [notification]);

  const handleMusicPlay = () => {
    setIsPlaying(true);
    setNotification({
      show: true,
      message: 'Now playing: Jhol',
      emoji: '🎵'
    });
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleMusicPause = () => {
    setIsPlaying(false);
    setNotification({
      show: true,
      message: 'Music paused',
      emoji: '⏸️'
    });
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Listen for puzzle completion
  useEffect(() => {
    const handlePuzzleComplete = () => {
      setIsIlluminationBroken(true);
      // Reset after animation completes
      setTimeout(() => {
        setIsIlluminationBroken(false);
      }, 4000); // Duration of broken bulb animation
    };

    window.addEventListener('puzzleComplete', handlePuzzleComplete as EventListener);
    return () => window.removeEventListener('puzzleComplete', handlePuzzleComplete as EventListener);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Night Wallpaper Background - positioned behind */}
      <div
        className={`fixed inset-0 bg-cover bg-center bg-no-repeat scale-100 transition-all duration-[10000ms] ease-in-out ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          backgroundImage: 'url("/Windows Xp Bliss Wallpaper at night.png")',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />

      {/* Bliss Wallpaper Background - positioned in front and fades out */}
      <div 
        className={`fixed inset-0 bg-cover bg-center bg-no-repeat scale-100 transition-all duration-[10000ms] ease-in-out ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          backgroundImage: 'url("/Windows Xp Bliss Wallpaper HD.jpg")',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />

      {/* Rain Effect */}
      {showRain && <RainEffect />}

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Desktop Icons */}
        <div className="absolute top-2 left-2 flex flex-col items-center gap-0.5">
          <DesktopIcon icon={Monitor} label="My Computer" />
          <DesktopIcon icon={User2} label="My Documents" />
          <DesktopIcon icon={Globe} label="Internet Explorer" />
          <DesktopIcon icon={HardDrive} label="Local Disk (C:)" />
          <DesktopIcon icon={Folder} label="My Pictures" />
          <DesktopIcon icon={Files} label="Control Panel" />
          <DesktopIcon icon={Trash2} label="Recycle Bin" />
        </div>
        
        {/* Main Content */}
        <main className="w-full max-w-xl transform scale-75 -mt-32 relative">
          {/* Illumination effect */}
          {showIllumination && (
            <div 
              className="absolute -inset-8 bg-white/40 blur-3xl rounded-full transition-opacity duration-1000"
              style={{
                animation: isIlluminationBroken 
                  ? 'brokenBulb 4s ease-out forwards'
                  : 'flicker 1s ease-out forwards, pulse 2s ease-in-out infinite 1.5s'
              }}
            />
          )}
          <PuzzleGame />
        </main>

        {/* Notification */}
        <Notification 
          message={notification.message}
          emoji={notification.emoji}
          show={notification.show}
        />

        {/* Taskbar */}
        <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#c0c0c0] border-t-[1px] border-white flex items-center justify-between px-1 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf]">
          <button className="px-3 py-0.5 text-xs font-bold bg-[#c0c0c0] border-solid border-[1px] shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] active:shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] flex items-center gap-2">
            <div className="w-3 h-3 bg-[#000080] text-white flex items-center justify-center font-bold text-[10px]">W</div>
            Start
          </button>
          
          <div className="flex items-center gap-2">
            {isPlaying && (
              <div className="flex items-center gap-2 px-2 py-0.5 text-xs bg-[#000080] text-white">
                <span className="animate-pulse">♪</span>
                <span>Playing: Jhol</span>
              </div>
            )}
            
            {isGameStarted && (
              <button
                onClick={() => setShowRain(!showRain)}
                className={`px-2 py-0.5 text-xs font-bold border-solid border-[1px] flex items-center gap-1 ${
                  showRain 
                    ? 'bg-[#000080] text-white border-t-[#1084d0] border-l-[#1084d0] border-r-[#000040] border-b-[#000040]' 
                    : 'bg-[#c0c0c0] text-black border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080]'
                }`}
              >
                <span className="text-[10px]">🌧️</span>
                {showRain ? 'Rain On' : 'Rain Off'}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Warning Message */}
        <div className="fixed inset-0 bg-black text-red-500 font-bold text-center p-4 flex items-center justify-center lg:hidden md:hidden sm:landscape:hidden">
          Best experienced on a bigger screen like a laptop or tablet
        </div>
      </div>
    </div>
  );
}

export default App;