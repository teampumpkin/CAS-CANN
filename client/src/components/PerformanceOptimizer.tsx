import { useEffect, useState, useRef } from 'react';

// Performance optimization utility
export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      const links = [
        { rel: 'preload', as: 'style', href: '/src/index.css' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      ];

      links.forEach(link => {
        const linkElement = document.createElement('link');
        Object.assign(linkElement, link);
        document.head.appendChild(linkElement);
      });
    };

    // Optimize font loading
    const optimizeFonts = () => {
      const fontFaces = [
        { family: 'Rosarivo', url: 'https://fonts.googleapis.com/css2?family=Rosarivo:ital,wght@0,400;1,400&display=swap' },
        { family: 'Mulish', url: 'https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap' },
      ];

      fontFaces.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = font.url;
        link.media = 'print';
        link.onload = () => {
          link.media = 'all';
        };
        document.head.appendChild(link);
      });
    };

    // Minimize layout shifts
    const minimizeLayoutShifts = () => {
      // Add CSS for consistent sizing
      const style = document.createElement('style');
      style.textContent = `
        img {
          width: 100%;
          height: auto;
          aspect-ratio: attr(width) / attr(height);
        }
        
        .lazy-image {
          background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
          background-size: 400% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        
        .dark .lazy-image {
          background: linear-gradient(90deg, #374151 25%, transparent 37%, #374151 63%);
        }
      `;
      document.head.appendChild(style);
    };

    // Defer non-critical scripts
    const deferNonCriticalScripts = () => {
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
          script.setAttribute('defer', '');
        }
      });
    };

    // Initialize optimizations
    preloadCriticalResources();
    optimizeFonts();
    minimizeLayoutShifts();
    deferNonCriticalScripts();

    // Cleanup function
    return () => {
      // Remove performance optimization elements if needed
    };
  }, []);

  return null;
};

// Hook for lazy loading images
export const useLazyImage = (src: string, threshold = 0.1) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (isInView && !isLoaded) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = src;
    }
  }, [isInView, isLoaded, src]);

  return { imgRef, isLoaded, isInView };
};

export default PerformanceOptimizer;