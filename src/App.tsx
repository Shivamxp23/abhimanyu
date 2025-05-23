import PuzzleGame from './components/Puzzle/PuzzleGame';
import { Monitor, Folder, Globe, Trash2, HardDrive, Files, User2 } from 'lucide-react';

const DesktopIcon = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex flex-col items-center gap-0.5 cursor-pointer select-none group mb-0.5 scale-75">
    <Icon className="text-white drop-shadow-md" size={24} />
    <span className="text-white text-xs font-sans bg-[#000080] px-1 group-hover:bg-[#1084d0] whitespace-nowrap">
      {label}
    </span>
  </div>
);

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Bliss Wallpaper Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat scale-100"
        style={{ backgroundImage: 'url("/Windows Xp Bliss Wallpaper HD.jpg")' }}
      />

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
        <main className="w-full max-w-xl transform scale-75 -mt-32">
          <PuzzleGame />
        </main>

        {/* Taskbar */}
        <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#c0c0c0] border-t-[1px] border-white flex items-center px-1 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf]">
          <button className="px-3 py-0.5 text-xs font-bold bg-[#c0c0c0] border-solid border-[1px] shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] active:shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] flex items-center gap-2">
            <div className="w-3 h-3 bg-[#000080] text-white flex items-center justify-center font-bold text-[10px]">W</div>
            Start
          </button>
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