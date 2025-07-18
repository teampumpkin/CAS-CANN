import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 80,
  loading = 'lazy',
  sizes = '100vw',
  priority = false,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'lazy' && !priority && imgRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );

      observerRef.current.observe(imgRef.current);
    } else if (loading === 'eager' || priority) {
      setIsInView(true);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading, priority]);

  // Generate optimized src
  const getOptimizedSrc = () => {
    if (!isInView) return '';
    
    // For now, return the original src
    // In production, this would integrate with an image optimization service
    return src;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const optimizedSrc = getOptimizedSrc();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Image failed to load
          </span>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          style={
            width && height
              ? {
                  aspectRatio: `${width} / ${height}`,
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default OptimizedImage;