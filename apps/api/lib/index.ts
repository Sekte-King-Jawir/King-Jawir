/**
 * Central export file for shared library utilities
 * This file provides a single import point for commonly used functions
 */

// Response utilities
export {
  ErrorCode,
  type ErrorCodeType,
  type ApiResponse,
  successResponse,
  errorResponse,
  CommonResponse,
} from './response'

// Validation utilities
export { v } from './validators'

// Logging utilities
export { logger, logRequest, logResponse } from './logger'

// Database connection
export { prisma } from './db'

// AI utilities
export {
  generateCompletion,
  generateStreamingCompletion,
  generateChatCompletion,
  generateStreamingChatCompletion,
  openai,
  defaultModelName,
} from './ai'

// MinIO utilities
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

// Formatting utilities
export {
  formatRupiah,
  formatNumber,
  formatDate,
  formatRelativeTime,
  calculatePercentage,
} from './format'
