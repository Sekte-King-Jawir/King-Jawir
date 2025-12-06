// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
    details?: unknown
  }
}
