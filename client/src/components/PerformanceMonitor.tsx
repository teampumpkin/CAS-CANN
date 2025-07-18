import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          setMetrics(prev => ({
            ...prev,
            pageLoadTime: navEntry.loadEventEnd - navEntry.fetchStart,
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
          }));
        }
        
        if (entry.entryType === 'paint') {
          const paintEntry = entry as PerformancePaintTiming;
          if (paintEntry.name === 'first-contentful-paint') {
            setMetrics(prev => ({
              ...prev,
              firstContentfulPaint: paintEntry.startTime,
            }));
          }
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          const lcpEntry = entry as PerformanceEntry;
          setMetrics(prev => ({
            ...prev,
            largestContentfulPaint: lcpEntry.startTime,
          }));
        }
        
        if (entry.entryType === 'layout-shift') {
          const layoutEntry = entry as any;
          if (!layoutEntry.hadRecentInput) {
            setMetrics(prev => ({
              ...prev,
              cumulativeLayoutShift: (prev.cumulativeLayoutShift || 0) + layoutEntry.value,
            }));
          }
        }
        
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          setMetrics(prev => ({
            ...prev,
            firstInputDelay: fidEntry.processingStart - fidEntry.startTime,
          }));
        }
      });
    });

    // Observe different types of performance entries
    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }

    return () => observer.disconnect();
  }, []);

  return metrics;
};

