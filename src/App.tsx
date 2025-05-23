import PuzzleGame from './components/Puzzle/PuzzleGame';

function App() {
  return (
    <div className="min-h-screen bg-[#f5f5dc] flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-2xl">
        <PuzzleGame />
      </main>
    </div>
  );
}

export default App;