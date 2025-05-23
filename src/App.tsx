import PuzzleGame from './components/Puzzle/PuzzleGame';
import { Monitor, Folder, Globe, Trash2, HardDrive, Files, User2 } from 'lucide-react';

const DesktopIcon = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex flex-col items-center gap-1 cursor-pointer select-none group mb-1">
    <Icon className="text-white drop-shadow-md" size={32} />
    <span className="text-white text-sm font-sans bg-[#000080] px-1 group-hover:bg-[#1084d0] whitespace-nowrap">
      {label}
    </span>
  </div>
);

function App() {
  return (
    <div className="min-h-screen relative">
      {/* Bliss Wallpaper Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/Windows Xp Bliss Wallpaper HD.jpg")' }}
      />

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Desktop Icons */}
        <div className="absolute top-4 left-4 flex flex-col items-center gap-1">
          <DesktopIcon icon={Monitor} label="My Computer" />
          <DesktopIcon icon={User2} label="My Documents" />
          <DesktopIcon icon={Globe} label="Internet Explorer" />
          <DesktopIcon icon={HardDrive} label="Local Disk (C:)" />
          <DesktopIcon icon={Folder} label="My Pictures" />
          <DesktopIcon icon={Files} label="Control Panel" />
          <DesktopIcon icon={Trash2} label="Recycle Bin" />
        </div>
        
        {/* Main Content */}
        <main className="w-full max-w-2xl">
          <PuzzleGame />
        </main>

        {/* Taskbar */}
        <div className="fixed bottom-0 left-0 right-0 h-10 bg-[#c0c0c0] border-t-[1px] border-white flex items-center px-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf]">
          <button className="px-4 py-1 text-sm font-bold bg-[#c0c0c0] border-solid border-[1px] shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] active:shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] flex items-center gap-2">
            <div className="w-4 h-4 bg-[#000080] text-white flex items-center justify-center font-bold text-xs">W</div>
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;