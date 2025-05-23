import React, { useEffect, useState } from 'react';

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  color: string;
}

const RainEffect: React.FC = () => {
  const [drops, setDrops] = useState<RainDrop[]>([]);
  const [opacity, setOpacity] = useState(0);

  // Calculate puzzle area dimensions
  const getPuzzleArea = () => {
    const puzzleWidth = 632; // Width of the puzzle from PuzzleGame component
    const puzzleHeight = 600; // Height of the puzzle from PuzzleBoard component
    const scale = 0.75; // Scale from main content
    const marginTop = -128; // -mt-32 from main content

    const scaledWidth = puzzleWidth * scale;
    const scaledHeight = puzzleHeight * scale;

    // Calculate center position
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 + marginTop;

    return {
      left: centerX - scaledWidth / 2,
      right: centerX + scaledWidth / 2,
      top: centerY - scaledHeight / 2,
      bottom: centerY + scaledHeight / 2
    };
  };

  // Check if a position is within the puzzle area or taskbar
  const isInExcludedArea = (x: number, y: number) => {
    const puzzleArea = getPuzzleArea();
    const taskbarHeight = 40; // Increased to account for borders and shadows
    const bufferZone = 10; // Additional buffer to prevent any overlap
    const taskbarTop = window.innerHeight - taskbarHeight - bufferZone;

    // Check if position is in puzzle area
    const inPuzzleArea = x >= puzzleArea.left && 
                        x <= puzzleArea.right && 
                        y >= puzzleArea.top && 
                        y <= puzzleArea.bottom;

    // Check if position is in taskbar area (including buffer)
    const inTaskbar = y >= taskbarTop && y <= window.innerHeight;

    return inPuzzleArea || inTaskbar;
  };

  useEffect(() => {
    // Start fade in animation
    const fadeInInterval = setInterval(() => {
      setOpacity(prev => {
        if (prev >= 0.5) { // Target opacity is 0.5 (50%)
          clearInterval(fadeInInterval);
          return 0.5;
        }
        return prev + 0.0056; // Increment by ~0.56% every 100ms to reach 50% in 9 seconds
      });
    }, 100); // Update every 100ms for smooth animation

    // Create initial drops
    const createDrop = (): RainDrop => {
      let x, y;
      do {
        x = Math.random() * window.innerWidth;
        y = Math.random() * window.innerHeight;
      } while (isInExcludedArea(x, y));

      return {
        x,
        y,
        speed: 2 + Math.random() * 3,
        length: 10 + Math.random() * 20,
        color: Math.random() > 0.5 ? '#ffffff' : '#00ffff'
      };
    };

    const initialDrops: RainDrop[] = Array.from({ length: 50 }, createDrop);
    setDrops(initialDrops);

    // Animation loop
    const animate = () => {
      setDrops(prevDrops => 
        prevDrops.map(drop => {
          let newY = drop.y + drop.speed;
          // Reset drop to top when it would enter taskbar area (including buffer)
          if (newY > window.innerHeight - 50) { // 40px taskbar + 10px buffer
            // Create a new drop at the top, avoiding excluded areas
            return createDrop();
          }
          return { ...drop, y: newY };
        })
      );
    };

    const interval = setInterval(animate, 16); // ~60fps

    return () => {
      clearInterval(interval);
      clearInterval(fadeInInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {drops.map((drop, index) => (
        <div
          key={index}
          className="absolute w-[2px]"
          style={{
            left: `${drop.x}px`,
            top: `${drop.y}px`,
            height: `${drop.length}px`,
            transform: 'scaleY(0.5)',
            backgroundColor: drop.color,
            opacity: opacity
          }}
        />
      ))}
    </div>
  );
};

export default RainEffect; 