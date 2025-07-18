import { useState, useEffect } from 'react';

interface ImageOptimizationOptions {
  src: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  loading?: 'lazy' | 'eager';
}

export const useImageOptimization = (options: ImageOptimizationOptions) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizedSrc, setOptimizedSrc] = useState<string>(options.src);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setError(null);
    };
    
    img.onerror = () => {
      setError('Failed to load image');
      setIsLoaded(false);
    };
    
    // For now, just use the original src
    // In a real app, you might transform this to use a CDN or optimization service
    img.src = options.src;
    setOptimizedSrc(options.src);
  }, [options.src]);

  return {
    src: optimizedSrc,
    isLoaded,
    error,
    loading: options.loading || 'lazy'
  };
};

// Optimized Image Component
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  loading?: 'lazy' | 'eager';
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  quality = 85,
  format = 'webp',
  loading = 'lazy',
  sizes = '100vw',
  onLoad,
  onError
}) => {
  const { src: optimizedSrc, isLoaded, error } = useImageOptimization({
    src,
    quality,
    format,
    loading
  });

  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    onError?.();
  };

  if (error) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-800 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 dark:text-gray-400 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      sizes={sizes}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};