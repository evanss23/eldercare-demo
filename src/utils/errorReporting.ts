// utils/errorReporting.ts

interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  errorBoundary?: boolean;
  metadata?: Record<string, any>;
}

class ErrorReporter {
  private queue: ErrorReport[] = [];
  private isOnline: boolean = typeof window !== 'undefined' ? navigator.onLine : true;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    if (typeof window !== 'undefined') {
      this.setupEventListeners();
      this.setupGlobalErrorHandlers();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private setupGlobalErrorHandlers() {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.report({
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.sessionId,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.report({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.sessionId,
        metadata: {
          type: 'unhandledrejection'
        }
      });
    });
  }

  public report(error: Partial<ErrorReport>) {
    const fullReport: ErrorReport = {
      message: error.message || 'Unknown error',
      timestamp: error.timestamp || new Date().toISOString(),
      userAgent: error.userAgent || navigator.userAgent,
      url: error.url || window.location.href,
      sessionId: this.sessionId,
      ...error
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Report');
      console.error(fullReport);
      console.groupEnd();
    }

    // Add to queue
    this.queue.push(fullReport);

    // Try to send immediately if online
    if (this.isOnline) {
      this.sendReport(fullReport);
    }
  }

  private async sendReport(report: ErrorReport) {
    try {
      // In production, send to your error tracking service
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report)
        });
      }

      // Remove from queue if sent successfully
      this.queue = this.queue.filter(r => r !== report);
    } catch (err) {
      console.error('Failed to send error report:', err);
      // Keep in queue for retry
    }
  }

  private async flushQueue() {
    const reports = [...this.queue];
    for (const report of reports) {
      await this.sendReport(report);
    }
  }

  public reportError(error: Error, metadata?: Record<string, any>) {
    this.report({
      message: error.message,
      stack: error.stack,
      metadata,
      errorBoundary: false
    });
  }

  public reportErrorBoundary(error: Error, errorInfo: { componentStack?: string }, metadata?: Record<string, any>) {
    this.report({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      metadata,
      errorBoundary: true
    });
  }

  public reportAPIError(endpoint: string, status: number, message: string, metadata?: Record<string, any>) {
    this.report({
      message: `API Error: ${message}`,
      metadata: {
        endpoint,
        status,
        ...metadata
      }
    });
  }

  public getUserFeedback(errorId: string): string {
    const mailtoLink = `mailto:support@eldercare.com?subject=Error Report ${errorId}&body=Please describe what you were doing when the error occurred:%0A%0A`;
    return mailtoLink;
  }
}

// Create singleton instance lazily
let errorReporterInstance: ErrorReporter | null = null;

const getErrorReporter = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!errorReporterInstance) {
    errorReporterInstance = new ErrorReporter();
  }
  return errorReporterInstance;
};

export const errorReporter = {
  report: (error: ErrorReport) => getErrorReporter()?.report(error),
  reportError: (error: Error, metadata?: Record<string, any>) => getErrorReporter()?.reportError(error, metadata),
  reportErrorBoundary: (error: Error, errorInfo: { componentStack?: string }, metadata?: Record<string, any>) => {
    getErrorReporter()?.reportErrorBoundary(error, errorInfo, metadata);
  },
  reportAPIError: (endpoint: string, status: number, message: string, metadata?: Record<string, any>) => {
    getErrorReporter()?.reportAPIError(endpoint, status, message, metadata);
  },
  getUserFeedback: (errorId: string) => getErrorReporter()?.getUserFeedback(errorId) || '',
};

// Convenience functions
export const reportError = (error: Error, metadata?: Record<string, any>) => {
  errorReporter.reportError(error, metadata);
};

export const reportErrorBoundary = (error: Error, errorInfo: { componentStack?: string }, metadata?: Record<string, any>) => {
  errorReporter.reportErrorBoundary(error, errorInfo, metadata);
};

export const reportAPIError = (endpoint: string, status: number, message: string, metadata?: Record<string, any>) => {
  errorReporter.reportAPIError(endpoint, status, message, metadata);
};