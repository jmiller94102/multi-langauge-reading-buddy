import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  apiResponseTimes: { [key: string]: number };
  renderTime: number;
  interactionLatency: number;
  storageUsage: number;
  componentMountTime: number;
}

interface PerformanceAlert {
  type: 'warning' | 'error' | 'info';
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: number;
}

interface PerformanceMonitorProps {
  theme: ThemeStyle;
  onPerformanceAlert?: (alert: PerformanceAlert) => void;
  enableRealTimeMonitoring?: boolean;
  showDetailedMetrics?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  theme,
  onPerformanceAlert,
  enableRealTimeMonitoring = true,
  showDetailedMetrics = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    apiResponseTimes: {},
    renderTime: 0,
    interactionLatency: 0,
    storageUsage: 0,
    componentMountTime: 0
  });
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const mountTimeRef = useRef<number>(Date.now());
  const renderTimeRef = useRef<number>(Date.now());

  // Performance thresholds for child-friendly app
  const thresholds = {
    pageLoadTime: 3000, // 3 seconds max for children's attention
    memoryUsage: 100, // 100MB reasonable limit
    cacheHitRate: 60, // 60% minimum cache efficiency
    apiResponseTime: 2000, // 2 seconds max API response
    renderTime: 100, // 100ms max render time
    interactionLatency: 50, // 50ms max interaction response
    storageUsage: 50 // 50MB localStorage limit
  };

  // Collect performance metrics (frontend monitoring only)
  const collectMetrics = useCallback(async () => {
    const newMetrics: PerformanceMetrics = { ...metrics };

    try {
      // 1. Page Load Time
      if (performance.getEntriesByType) {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          const nav = navigationEntries[0];
          newMetrics.pageLoadTime = nav.loadEventEnd - nav.loadEventStart;
        }
      }

      // 2. Memory Usage (if available)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        newMetrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
      }

      // 3. Cache Hit Rate (from localStorage analytics)
      const cacheStats = getCacheStatistics();
      newMetrics.cacheHitRate = cacheStats.hitRate;

      // 4. API Response Times (from recent API calls)
      newMetrics.apiResponseTimes = getApiResponseTimes();

      // 5. Render Time (component lifecycle)
      newMetrics.renderTime = Date.now() - renderTimeRef.current;
      renderTimeRef.current = Date.now();

      // 6. Storage Usage
      newMetrics.storageUsage = getStorageUsage();

      // 7. Component Mount Time
      newMetrics.componentMountTime = Date.now() - mountTimeRef.current;

      // 8. Interaction Latency (estimated from recent interactions)
      newMetrics.interactionLatency = getInteractionLatency();

      setMetrics(newMetrics);
      checkPerformanceThresholds(newMetrics);
      setLastUpdate(Date.now());

    } catch (error) {
      console.warn('Performance monitoring error:', error);
    }
  }, [metrics]);

  // Get cache statistics from localStorage
  const getCacheStatistics = useCallback((): { hitRate: number; totalRequests: number } => {
    try {
      const cacheStats = localStorage.getItem('readquest_cache_stats');
      if (cacheStats) {
        const stats = JSON.parse(cacheStats);
        const hitRate = stats.hits && stats.total 
          ? Math.round((stats.hits / stats.total) * 100) 
          : 0;
        return { hitRate, totalRequests: stats.total || 0 };
      }
    } catch (error) {
      console.warn('Cache statistics error:', error);
    }
    return { hitRate: 0, totalRequests: 0 };
  }, []);

  // Get API response times from recent calls
  const getApiResponseTimes = useCallback((): { [key: string]: number } => {
    try {
      const apiStats = localStorage.getItem('readquest_api_stats');
      if (apiStats) {
        const stats = JSON.parse(apiStats);
        return stats.responseTimes || {};
      }
    } catch (error) {
      console.warn('API statistics error:', error);
    }
    return {};
  }, []);

  // Calculate storage usage
  const getStorageUsage = useCallback((): number => {
    try {
      let totalSize = 0;
      for (const key in localStorage) {
        if (key.startsWith('readquest_')) {
          totalSize += localStorage.getItem(key)?.length || 0;
        }
      }
      return Math.round(totalSize / 1024 / 1024 * 100) / 100; // MB with 2 decimal places
    } catch (error) {
      console.warn('Storage usage calculation error:', error);
      return 0;
    }
  }, []);

  // Estimate interaction latency
  const getInteractionLatency = useCallback((): number => {
    try {
      const interactionStats = localStorage.getItem('readquest_interaction_stats');
      if (interactionStats) {
        const stats = JSON.parse(interactionStats);
        return stats.averageLatency || 0;
      }
    } catch (error) {
      console.warn('Interaction latency error:', error);
    }
    return 0;
  }, []);

  // Check performance against thresholds
  const checkPerformanceThresholds = useCallback((currentMetrics: PerformanceMetrics) => {
    const newAlerts: PerformanceAlert[] = [];

    // Check page load time
    if (currentMetrics.pageLoadTime > thresholds.pageLoadTime) {
      newAlerts.push({
        type: 'warning',
        message: 'Page load time exceeds child-friendly threshold',
        metric: 'pageLoadTime',
        value: currentMetrics.pageLoadTime,
        threshold: thresholds.pageLoadTime,
        timestamp: Date.now()
      });
    }

    // Check memory usage
    if (currentMetrics.memoryUsage > thresholds.memoryUsage) {
      newAlerts.push({
        type: 'error',
        message: 'Memory usage is high - may impact performance',
        metric: 'memoryUsage',
        value: currentMetrics.memoryUsage,
        threshold: thresholds.memoryUsage,
        timestamp: Date.now()
      });
    }

    // Check cache hit rate
    if (currentMetrics.cacheHitRate < thresholds.cacheHitRate) {
      newAlerts.push({
        type: 'info',
        message: 'Cache hit rate below optimal - consider cache improvements',
        metric: 'cacheHitRate',
        value: currentMetrics.cacheHitRate,
        threshold: thresholds.cacheHitRate,
        timestamp: Date.now()
      });
    }

    // Check API response times
    Object.entries(currentMetrics.apiResponseTimes).forEach(([api, time]) => {
      if (time > thresholds.apiResponseTime) {
        newAlerts.push({
          type: 'warning',
          message: `${api} API response time is slow`,
          metric: 'apiResponseTime',
          value: time,
          threshold: thresholds.apiResponseTime,
          timestamp: Date.now()
        });
      }
    });

    // Check storage usage
    if (currentMetrics.storageUsage > thresholds.storageUsage) {
      newAlerts.push({
        type: 'warning',
        message: 'Local storage usage is high - consider cleanup',
        metric: 'storageUsage',
        value: currentMetrics.storageUsage,
        threshold: thresholds.storageUsage,
        timestamp: Date.now()
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev.slice(-4), ...newAlerts]); // Keep last 5 alerts
      newAlerts.forEach(alert => {
        if (onPerformanceAlert) {
          onPerformanceAlert(alert);
        }
      });
    }
  }, [onPerformanceAlert]);

  // Real-time monitoring effect
  useEffect(() => {
    if (enableRealTimeMonitoring) {
      setIsMonitoring(true);
      const interval = setInterval(collectMetrics, 5000); // Every 5 seconds
      collectMetrics(); // Initial collection

      return () => {
        clearInterval(interval);
        setIsMonitoring(false);
      };
    }
  }, [enableRealTimeMonitoring, collectMetrics]);

  // Component mount time tracking
  useEffect(() => {
    mountTimeRef.current = Date.now();
  }, []);

  // Memory cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup any performance observers or intervals
      if (isMonitoring) {
        setIsMonitoring(false);
      }
    };
  }, [isMonitoring]);

  const getMetricColor = (value: number, threshold: number, inverse = false) => {
    const ratio = inverse ? threshold / value : value / threshold;
    if (ratio <= 0.7) return '#4ecdc4'; // Good
    if (ratio <= 1.0) return '#ffa726'; // Warning
    return '#ff6b6b'; // Poor
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return '#ff6b6b';
      case 'warning': return '#ffa726';
      case 'info': return theme.accent;
      default: return theme.text;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📊';
    }
  };

  return (
    <div style={{
      padding: '20px',
      background: `${theme.background}f0`,
      borderRadius: '16px',
      border: `1px solid ${theme.primary}20`,
      maxWidth: '900px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '28px' }}>⚡</div>
          <div>
            <h3 style={{ 
              margin: '0', 
              color: theme.text,
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Performance Monitor
            </h3>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '12px',
              color: `${theme.text}70`
            }}>
              Child-friendly app performance optimization
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: `${theme.text}70`
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isMonitoring ? '#4ecdc4' : '#ff6b6b'
          }} />
          {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Page Load Time */}
        <div style={{
          background: `${getMetricColor(metrics.pageLoadTime, thresholds.pageLoadTime)}10`,
          border: `2px solid ${getMetricColor(metrics.pageLoadTime, thresholds.pageLoadTime)}30`,
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>🚀</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: getMetricColor(metrics.pageLoadTime, thresholds.pageLoadTime),
            marginBottom: '4px'
          }}>
            {metrics.pageLoadTime}ms
          </div>
          <div style={{ fontSize: '12px', color: `${theme.text}70` }}>
            Page Load Time
          </div>
          <div style={{ fontSize: '10px', color: `${theme.text}60`, marginTop: '4px' }}>
            Target: &lt;{thresholds.pageLoadTime}ms
          </div>
        </div>

        {/* Memory Usage */}
        <div style={{
          background: `${getMetricColor(metrics.memoryUsage, thresholds.memoryUsage)}10`,
          border: `2px solid ${getMetricColor(metrics.memoryUsage, thresholds.memoryUsage)}30`,
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>🧠</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: getMetricColor(metrics.memoryUsage, thresholds.memoryUsage),
            marginBottom: '4px'
          }}>
            {metrics.memoryUsage}MB
          </div>
          <div style={{ fontSize: '12px', color: `${theme.text}70` }}>
            Memory Usage
          </div>
          <div style={{ fontSize: '10px', color: `${theme.text}60`, marginTop: '4px' }}>
            Target: &lt;{thresholds.memoryUsage}MB
          </div>
        </div>

        {/* Cache Hit Rate */}
        <div style={{
          background: `${getMetricColor(metrics.cacheHitRate, thresholds.cacheHitRate, true)}10`,
          border: `2px solid ${getMetricColor(metrics.cacheHitRate, thresholds.cacheHitRate, true)}30`,
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>💾</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: getMetricColor(metrics.cacheHitRate, thresholds.cacheHitRate, true),
            marginBottom: '4px'
          }}>
            {metrics.cacheHitRate}%
          </div>
          <div style={{ fontSize: '12px', color: `${theme.text}70` }}>
            Cache Hit Rate
          </div>
          <div style={{ fontSize: '10px', color: `${theme.text}60`, marginTop: '4px' }}>
            Target: &gt;{thresholds.cacheHitRate}%
          </div>
        </div>

        {/* Storage Usage */}
        <div style={{
          background: `${getMetricColor(metrics.storageUsage, thresholds.storageUsage)}10`,
          border: `2px solid ${getMetricColor(metrics.storageUsage, thresholds.storageUsage)}30`,
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>💿</div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: getMetricColor(metrics.storageUsage, thresholds.storageUsage),
            marginBottom: '4px'
          }}>
            {metrics.storageUsage}MB
          </div>
          <div style={{ fontSize: '12px', color: `${theme.text}70` }}>
            Storage Usage
          </div>
          <div style={{ fontSize: '10px', color: `${theme.text}60`, marginTop: '4px' }}>
            Target: &lt;{thresholds.storageUsage}MB
          </div>
        </div>
      </div>

      {/* Performance Alerts */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: theme.accent,
            fontSize: '16px',
            fontWeight: '600'
          }}>
            🚨 Performance Alerts
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {alerts.slice(-3).map((alert, index) => (
              <div
                key={index}
                style={{
                  background: `${getAlertColor(alert.type)}10`,
                  border: `1px solid ${getAlertColor(alert.type)}30`,
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '16px' }}>
                  {getAlertIcon(alert.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: theme.text,
                    marginBottom: '2px'
                  }}>
                    {alert.message}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: `${theme.text}70`
                  }}>
                    {alert.metric}: {alert.value} (threshold: {alert.threshold})
                  </div>
                </div>

                <div style={{
                  fontSize: '10px',
                  color: `${theme.text}60`,
                  whiteSpace: 'nowrap'
                }}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Metrics (if enabled) */}
      {showDetailedMetrics && (
        <div style={{
          background: `${theme.primary}05`,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${theme.primary}10`
        }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: theme.accent,
            fontSize: '14px',
            fontWeight: '600'
          }}>
            📈 Detailed Performance Metrics
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            fontSize: '12px',
            color: `${theme.text}80`
          }}>
            <div>
              <strong>Component Mount:</strong> {metrics.componentMountTime}ms
            </div>
            <div>
              <strong>Render Time:</strong> {metrics.renderTime}ms
            </div>
            <div>
              <strong>Interaction Latency:</strong> {metrics.interactionLatency}ms
            </div>
            <div>
              <strong>Last Update:</strong> {new Date(lastUpdate).toLocaleTimeString()}
            </div>
          </div>

          {Object.keys(metrics.apiResponseTimes).length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>API Response Times:</div>
              {Object.entries(metrics.apiResponseTimes).map(([api, time]) => (
                <div key={api} style={{ fontSize: '11px', marginBottom: '2px' }}>
                  <strong>{api}:</strong> {time}ms
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manual Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          onClick={collectMetrics}
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          🔄 Refresh Metrics
        </button>
      </div>
    </div>
  );
};
