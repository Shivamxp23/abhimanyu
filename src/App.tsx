import React from 'react';
import PuzzleGame from './components/Puzzle/PuzzleGame';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Sliding Puzzle</h1>
        <p className="text-gray-300">Solve the 3x3 puzzle by arranging the tiles in order</p>
      </header>
      
      <main className="w-full max-w-md">
        <PuzzleGame />
      </main>
      
      <footer className="mt-6 text-sm text-gray-400 text-center">
        <p>© 2025 Sliding Puzzle Game | Images from Picsum Photos</p>
      </footer>
    </div>
  );
}

export default App;