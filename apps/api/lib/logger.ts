import pino from 'pino'

// Configure Pino logger with pretty printing for development
const isDevelopment = process.env['NODE_ENV'] !== 'production'

export const logger = isDevelopment
  ? pino({
      level: process.env['LOG_LEVEL'] || 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
          singleLine: false,
          messageFormat: '{msg}',
        },
      },
    })
  : pino({
      level: process.env['LOG_LEVEL'] || 'info',
    })

/**
 * Log HTTP request with method, URL, and origin
 */
export function logRequest(method: string, url: string, origin: string | null) {
  logger.info({
    type: 'request',
    method,
    url,
    origin: origin || 'null',
  })
}

/**
 * Log HTTP response with status and duration
 */
export function logResponse(method: string, url: string, status: number, durationMs: number) {
  const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
  logger[level]({
    type: 'response',
    method,
    url,
    status,
    duration: `${durationMs}ms`,
  })
}
