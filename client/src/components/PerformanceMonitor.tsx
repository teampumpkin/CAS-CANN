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

// Performance debugging component (only for development)
export const PerformanceDebugger: React.FC = () => {
  const metrics = usePerformanceMonitor();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <div className="font-bold mb-2">Performance Metrics</div>
      <div className="space-y-1">
        {metrics.pageLoadTime && (
          <div>Page Load: {Math.round(metrics.pageLoadTime)}ms</div>
        )}
        {metrics.domContentLoaded && (
          <div>DOM Ready: {Math.round(metrics.domContentLoaded)}ms</div>
        )}
        {metrics.firstContentfulPaint && (
          <div>FCP: {Math.round(metrics.firstContentfulPaint)}ms</div>
        )}
        {metrics.largestContentfulPaint && (
          <div>LCP: {Math.round(metrics.largestContentfulPaint)}ms</div>
        )}
        {metrics.cumulativeLayoutShift && (
          <div>CLS: {metrics.cumulativeLayoutShift.toFixed(3)}</div>
        )}
        {metrics.firstInputDelay && (
          <div>FID: {Math.round(metrics.firstInputDelay)}ms</div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDebugger;