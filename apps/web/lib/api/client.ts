/**
 * API Client for HTTP Communication
 *
 * @description Type-safe HTTP client with error handling, timeout management,
 * and automatic credential inclusion for authenticated requests
 *
 * @module lib/api/client
 */

import { API_CONFIG } from '../config/api'

/**
 * Standard API response structure from backend
 * @template T - Type of the response data payload
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
    details?: unknown
  }
}

/**
 * API error information structure
 */
export interface ApiError {
  message: string
  code: string
  status?: number
  details?: unknown
}

/**
 * Custom error class for API client errors
 *
 * @extends Error
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

/**
 * HTTP client for making API requests
 *
 * @description Provides a clean interface for HTTP operations with built-in
 * error handling, timeouts, and credential management
 *
 * @example
 * ```typescript
 * const client = new ApiClient()
 * const response = await client.get('/api/users')
 * ```
 */
export class ApiClient {
  private baseUrl: string
  private timeout: number

  /**
   * Creates a new API client instance
   *
   * @param baseUrl - Base URL for API requests (defaults to API_CONFIG.BASE_URL)
   * @param timeout - Request timeout in milliseconds (defaults to API_CONFIG.TIMEOUT)
   */
  constructor(baseUrl?: string, timeout?: number) {
    this.baseUrl = baseUrl ?? API_CONFIG.BASE_URL
    this.timeout = timeout ?? API_CONFIG.TIMEOUT
  }

  /**
   * Internal method for making HTTP requests
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param options - Fetch API options
   * @returns Promise resolving to API response
   * @throws {ApiClientError} On request failure, timeout, or non-OK response
   * @private
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = (await response.json()) as Record<string, unknown>

      if (!response.ok) {
        const errorObj = data.error as { code?: string; details?: unknown } | undefined
        const errorCode = errorObj?.code ?? 'UNKNOWN_ERROR'
        const message = typeof data.message === 'string' ? data.message : 'Request failed'
        const errorDetails = errorObj?.details

        throw new ApiClientError(message, errorCode, response.status, errorDetails)
      }

      return data as unknown as ApiResponse<T>
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiClientError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiClientError('Request timeout', 'TIMEOUT_ERROR')
        }
        throw new ApiClientError(error.message, 'NETWORK_ERROR')
      }

      throw new ApiClientError('Unknown error occurred', 'UNKNOWN_ERROR')
    }
  }

  /**
   * Performs a GET request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param options - Additional fetch options
   * @returns Promise resolving to API response
   */
  get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * Performs a POST request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param body - Request body data
   * @param options - Additional fetch options
   * @returns Promise resolving to API response
   */
  post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : null,
    })
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : null,
    })
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : null,
    })
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

/**
 * Default API client instance using configured base URL and timeout
 */
export const apiClient = new ApiClient()

/**
 * Builds a URL query string from parameters object
 *
 * @param params - Object of query parameters
 * @returns URL-encoded query string with leading '?' or empty string
 *
 * @example
 * buildQueryString({ page: 1, limit: 10 }) // "?page=1&limit=10"
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>
): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()
  return query.length > 0 ? `?${query}` : ''
}

/**
 * Type guard to check if an error is an ApiClientError
 *
 * @param error - Error to check
 * @returns True if error is ApiClientError instance
 */
export function isApiError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError
}

/**
 * Extracts a user-friendly error message from any error
 *
 * @param error - Error object
 * @returns User-friendly error message string
 */
export function handleApiError(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}
