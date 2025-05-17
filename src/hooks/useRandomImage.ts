import { useState, useCallback } from 'react';

const IMAGES = [
  '/images/image1.jpg',
  '/images/image2.jpg',
  '/images/image3.png',
  '/images/image4.png',
  '/images/image5.png',
  '/images/image6.png',
  '/images/image7.png',
  '/images/image8.png'
];

interface UseRandomImageResult {
  imageUrl: string;
  isLoading: boolean;
  error: string | null;
  fetchRandomImage: () => Promise<void>;
}

export const useRandomImage = (): UseRandomImageResult => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const randomIndex = Math.floor(Math.random() * IMAGES.length);
      const selectedUrl = IMAGES[randomIndex];
      setImageUrl(selectedUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load image';
      setError(errorMessage);
      console.error('Error loading image:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { imageUrl, isLoading, error, fetchRandomImage };
};