// Image optimization utilities
export const compressImage = (file: File, quality: number = 0.8, maxWidth: number = 1920, maxHeight: number = 1080): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Generate responsive image sources
export const generateResponsiveSources = (baseSrc: string) => {
  const sizes = [
    { width: 480, suffix: '-mobile' },
    { width: 768, suffix: '-tablet' },
    { width: 1200, suffix: '-desktop' },
    { width: 1920, suffix: '-hd' },
  ];
  
  return sizes.map(size => ({
    srcSet: `${baseSrc}${size.suffix}.webp`,
    media: `(max-width: ${size.width}px)`,
    type: 'image/webp'
  }));
};

// Lazy loading intersection observer
export const createLazyLoadObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  });
};

// Preload critical images
export const preloadCriticalImages = (urls: string[]) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Convert image to WebP format (client-side)
export const convertToWebP = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          resolve(webpFile);
        } else {
          resolve(file);
        }
      }, 'image/webp', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
};