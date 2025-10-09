type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  userAgent?: string;
  url?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry = this.createLogEntry(level, message, data);

    // In development, log to console
    if (this.isDevelopment) {
      const colors = {
        debug: '\x1b[36m', // cyan
        info: '\x1b[32m',  // green
        warn: '\x1b[33m',  // yellow
        error: '\x1b[31m', // red
      };
      const reset = '\x1b[0m';

      console.log(`${colors[level]}[${level.toUpperCase()}]${reset} ${message}`, data || '');
    }

    // In production, you might want to send logs to a service
    if (!this.isDevelopment) {
      // Example: sendToLoggingService(entry);
      // For now, we'll still log to console but you could integrate with services like:
      // - Winston
      // - Pino
      // - CloudWatch
      // - DataDog
      // - Sentry
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  // Specialized logging methods
  apiRequest(method: string, url: string, statusCode?: number, duration?: number) {
    this.info(`API ${method} ${url}`, { statusCode, duration });
  }

  apiError(method: string, url: string, error: any, statusCode?: number) {
    this.error(`API ${method} ${url} failed`, { error: error.message || error, statusCode });
  }

  userAction(action: string, data?: any) {
    this.info(`User action: ${action}`, data);
  }

  securityEvent(event: string, data?: any) {
    this.warn(`Security event: ${event}`, data);
  }
}

export const logger = new Logger();
export default logger;