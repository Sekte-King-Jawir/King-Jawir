/**
 * API Response Utilities
 * 
 * @description Provides standardized response helpers for consistent API responses
 * across all endpoints with proper error codes and logging
 * 
 * @module lib/response
 */

/**
 * Standard error codes used across the API
 * @constant
 */
export const ErrorCode = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  BAD_REQUEST: 'BAD_REQUEST',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',

  INVALID_PASSWORD: 'INVALID_PASSWORD',
  SAME_PASSWORD: 'SAME_PASSWORD',
  OAUTH_NO_PASSWORD: 'OAUTH_NO_PASSWORD',

  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  NOT_OWNER: 'NOT_OWNER',

  VALIDATION_ERROR: 'VALIDATION_ERROR',

  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

/**
 * Type-safe error code union type
 */
export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode]

import { logger } from './logger'

/**
 * Standard API response structure
 * @template T - Type of the data payload
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T | undefined
  error?: {
    code: ErrorCodeType
    details?: Record<string, string> | null
  }
}

/**
 * Creates a standardized success response
 * 
 * @template T - Type of the response data
 * @param message - Success message to display
 * @param data - Optional response data payload
 * @returns Formatted success response object
 * 
 * @example
 * ```typescript
 * return successResponse('User created successfully', user)
 * ```
 */
export function successResponse<T>(message: string, data?: T): ApiResponse<T> {
  logger.debug({ msg: '✅ Success response', message, hasData: !!data })
  return {
    success: true,
    message,
    data,
  }
}

/**
 * Creates a standardized error response
 * 
 * @param message - Error message to display
 * @param code - Error code from ErrorCode enum
 * @param details - Optional additional error details
 * @returns Formatted error response object
 * 
 * @example
 * ```typescript
 * return errorResponse('User not found', ErrorCode.USER_NOT_FOUND)
 * ```
 */
export function errorResponse(
  message: string,
  code: ErrorCodeType,
  details?: Record<string, string> | null
): ApiResponse<never> {
  logger.warn({ msg: '⚠️  Error response', code, message, details })
  return {
    success: false,
    message,
    error: {
      code,
      details: details || null,
    },
  }
}

/**
 * Pre-configured common response helpers for frequently used responses
 * 
 * @description Provides shorthand methods for common API responses
 * to reduce boilerplate code in controllers
 * 
 * @example
 * ```typescript
 * if (!user) return CommonResponse.userNotFound()
 * if (!authorized) return CommonResponse.forbidden()
 * ```
 */
export const CommonResponse = {
  unauthorized: () => errorResponse('Unauthorized', ErrorCode.UNAUTHORIZED),
  forbidden: (message?: string) =>
    errorResponse(message || 'Forbidden - Access denied', ErrorCode.FORBIDDEN),
  tokenInvalid: () => errorResponse('Token tidak valid', ErrorCode.TOKEN_INVALID),
  tokenExpired: () => errorResponse('Token expired', ErrorCode.TOKEN_EXPIRED),
  userNotFound: () => errorResponse('User tidak ditemukan', ErrorCode.USER_NOT_FOUND),
  notFound: (resource: string) => errorResponse(`${resource} tidak ditemukan`, ErrorCode.NOT_FOUND),
  notOwner: () => errorResponse('Anda tidak memiliki akses ke resource ini', ErrorCode.NOT_OWNER),
  internalError: () => errorResponse('Terjadi kesalahan server', ErrorCode.INTERNAL_ERROR),
}
