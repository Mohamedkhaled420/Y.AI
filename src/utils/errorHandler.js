// Enhanced error handling and logging utility for Y.AI
class ErrorHandler {
  constructor() {
    this.initializeGlobalErrorHandling();
    this.setupAnalytics();
  }

  // Initialize global error handling
  initializeGlobalErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', event.reason, {
        type: 'unhandledrejection',
        promise: event.promise
      });
      event.preventDefault(); // Prevent the default browser behavior
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', event.error, {
        type: 'javascript',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.logError('Resource Loading Error', new Error(`Failed to load ${event.target.tagName}`), {
          type: 'resource',
          source: event.target.src || event.target.href,
          tagName: event.target.tagName
        });
      }
    }, true);
  }

  // Setup analytics tracking
  setupAnalytics() {
    // Track page views
    this.trackPageView();
    
    // Track user interactions
    this.setupInteractionTracking();
  }

  // Log errors with context
  logError(title, error, context = {}) {
    const errorInfo = {
      title,
      message: error?.message || error,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Y.AI Error:', errorInfo);
    }

    // Send to analytics/monitoring service
    this.sendToMonitoring(errorInfo);
  }

  // Send error data to monitoring service
  sendToMonitoring(errorInfo) {
    try {
      // In production, you would send this to a service like Sentry
      // For now, we'll use Google Analytics events
      if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: errorInfo.title,
          fatal: false,
          custom_map: {
            error_message: errorInfo.message,
            error_context: JSON.stringify(errorInfo.context)
          }
        });
      }
    } catch (e) {
      console.error('Failed to send error to monitoring:', e);
    }
  }

  // Track page views
  trackPageView() {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }

  // Track user interactions
  setupInteractionTracking() {
    // Track button clicks
    document.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (button) {
        this.trackEvent('button_click', {
          button_text: button.textContent?.trim(),
          button_class: button.className,
          page_location: window.location.href
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target;
      this.trackEvent('form_submit', {
        form_id: form.id,
        form_class: form.className,
        page_location: window.location.href
      });
    });
  }

  // Track custom events
  trackEvent(eventName, parameters = {}) {
    try {
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
          ...parameters,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  // Handle API errors specifically
  handleApiError(error, context = {}) {
    let userMessage = 'An unexpected error occurred. Please try again.';
    let errorType = 'unknown';

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      userMessage = 'Unable to connect to our services. Please check your internet connection and try again.';
      errorType = 'network';
    } else if (error.status === 429) {
      userMessage = 'Too many requests. Please wait a moment before trying again.';
      errorType = 'rate_limit';
    } else if (error.status >= 500) {
      userMessage = 'Our services are temporarily unavailable. Please try again in a few minutes.';
      errorType = 'server';
    } else if (error.status === 401 || error.status === 403) {
      userMessage = 'Authentication failed. Please refresh the page and try again.';
      errorType = 'auth';
    }

    this.logError('API Error', error, {
      ...context,
      errorType,
      status: error.status,
      statusText: error.statusText
    });

    return { userMessage, errorType };
  }

  // Performance monitoring
  measurePerformance(name, fn) {
    const start = performance.now();
    
    try {
      const result = fn();
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - start;
          this.trackEvent('performance_measure', {
            measure_name: name,
            duration: Math.round(duration),
            type: 'async'
          });
        });
      } else {
        const duration = performance.now() - start;
        this.trackEvent('performance_measure', {
          measure_name: name,
          duration: Math.round(duration),
          type: 'sync'
        });
        return result;
      }
    } catch (error) {
      const duration = performance.now() - start;
      this.logError('Performance Measure Error', error, {
        measure_name: name,
        duration: Math.round(duration)
      });
      throw error;
    }
  }
}

// Create global instance
const errorHandler = new ErrorHandler();

// Export for use in components
export default errorHandler;

// Utility functions for components
export const logError = (title, error, context) => errorHandler.logError(title, error, context);
export const trackEvent = (eventName, parameters) => errorHandler.trackEvent(eventName, parameters);
export const handleApiError = (error, context) => errorHandler.handleApiError(error, context);
export const measurePerformance = (name, fn) => errorHandler.measurePerformance(name, fn);

