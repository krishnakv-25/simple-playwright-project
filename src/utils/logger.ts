import pino from 'pino';

/**
 * Structured logger for test execution.
 * Pretty-printed in local/dev runs, JSON in CI for log aggregation.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.CI
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
});

export function stepLogger(step: string): void {
  logger.info(`▶ ${step}`);
}
