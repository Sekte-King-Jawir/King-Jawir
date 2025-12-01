// Error Codes
export const ErrorCode = {
  // Auth Errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  BAD_REQUEST: 'BAD_REQUEST',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // User Errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',
  
  // Password Errors
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  SAME_PASSWORD: 'SAME_PASSWORD',
  OAUTH_NO_PASSWORD: 'OAUTH_NO_PASSWORD',
  
  // Resource Errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  NOT_OWNER: 'NOT_OWNER',
  
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // Server Errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode]

// Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: ErrorCodeType
    details?: Record<string, string> | null
  }
}

// Success Response Helper
export function successResponse<T>(message: string, data?: T): ApiResponse<T> {
  return {
    success: true,
    message,
    data
  }
}

// Error Response Helper
export function errorResponse(
  message: string, 
  code: ErrorCodeType, 
  details?: Record<string, string> | null
): ApiResponse<never> {
  return {
    success: false,
    message,
    error: {
      code,
      details: details || null
    }
  }
}

// Common Responses
export const CommonResponse = {
  unauthorized: () => errorResponse('Unauthorized', ErrorCode.UNAUTHORIZED),
  forbidden: (message?: string) => errorResponse(message || 'Forbidden - Access denied', ErrorCode.FORBIDDEN),
  tokenInvalid: () => errorResponse('Token tidak valid', ErrorCode.TOKEN_INVALID),
  tokenExpired: () => errorResponse('Token expired', ErrorCode.TOKEN_EXPIRED),
  userNotFound: () => errorResponse('User tidak ditemukan', ErrorCode.USER_NOT_FOUND),
  notFound: (resource: string) => errorResponse(`${resource} tidak ditemukan`, ErrorCode.NOT_FOUND),
  notOwner: () => errorResponse('Anda tidak memiliki akses ke resource ini', ErrorCode.NOT_OWNER),
  internalError: () => errorResponse('Terjadi kesalahan server', ErrorCode.INTERNAL_ERROR),
}
