/**
 * Logger Utilities using Pino
 *
 * @description Provides structured logging with automatic pretty printing in development
 * and JSON format in production for better log aggregation
 *
 * @module lib/logger
 */

import pino from 'pino'
import pretty from 'pino-pretty'

const isDevelopment = process.env['NODE_ENV'] !== 'production'

const prettyStream = pretty({
  colorize: true,
  translateTime: 'HH:MM:ss',
  ignore: 'pid,hostname',
  singleLine: false,
  messageFormat: '{msg}',
})

/**
 * Configured Pino logger instance
 *
 * @description Automatically switches between pretty printing (dev) and JSON (prod)
 * - Development: Colorized output with timestamps
 * - Production: Structured JSON logs for aggregation
 */
export const logger = isDevelopment
  ? pino(
      {
        level: process.env['LOG_LEVEL'] || 'debug',
      },
      prettyStream
    )
  : pino({
      level: process.env['LOG_LEVEL'] || 'info',
    })

/**
 * Logs HTTP request information
 *
 * @param method - HTTP method (GET, POST, etc.)
 * @param url - Request URL
 * @param origin - Request origin header
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
 * Logs HTTP response with appropriate log level based on status code
 *
 * @param method - HTTP method
 * @param url - Request URL
 * @param status - HTTP status code
 * @param durationMs - Request duration in milliseconds
 *
 * @description
 * - 5xx status: error level
 * - 4xx status: warn level
 * - 2xx/3xx: info level
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
