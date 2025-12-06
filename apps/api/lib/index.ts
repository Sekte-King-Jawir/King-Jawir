/**
 * Central Library Exports
 *
 * @description Single import point for all shared utilities across the API.
 * Provides response helpers, validators, logging, database access, AI, MinIO, and formatting.
 *
 * @module lib/index
 *
 * @example
 * // Import everything from one place
 * import { successResponse, v, logger, prisma, formatRupiah } from './lib'
 *
 * @example
 * // Or import specific utilities
 * import { ErrorCode, errorResponse } from './lib/response'
 * import { formatDate, formatNumber } from './lib/format'
 */

export {
  ErrorCode,
  type ErrorCodeType,
  type ApiResponse,
  successResponse,
  errorResponse,
  CommonResponse,
} from './response'

export { v } from './validators'

export { logger, logRequest, logResponse } from './logger'

export { prisma } from './db'

export {
  generateCompletion,
  generateStreamingCompletion,
  generateChatCompletion,
  generateStreamingChatCompletion,
  openai,
  defaultModelName,
} from './ai'

export {
  minioClient,
  minioConfig,
  initMinIO,
  uploadToMinIO,
  uploadAvatar,
  uploadProductImage,
  deleteFromMinIO,
  getPresignedUrl,
} from './minio'

export {
  formatRupiah,
  formatNumber,
  formatDate,
  formatRelativeTime,
  calculatePercentage,
} from './format'
