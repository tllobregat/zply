export type LoggerType = {
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, error?: unknown, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

/**
 * Centralized logger for Zply.
 * Ensures consistent logging format and provides a single point of control
 * for error reporting.
 */
export const Logger: LoggerType = {
  info: (message: string, ...args: unknown[]): void => {
    console.info(`[INFO] ${message}`, ...args);
  },

  warn: (message: string, ...args: unknown[]): void => {
    console.warn(`[WARN] ${message}`, ...args);
  },

  error: (message: string, error?: unknown, ...args: unknown[]): void => {
    console.error(`[ERROR] ${message}`, error, ...args);
  },

  debug: (message: string, ...args: unknown[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};
