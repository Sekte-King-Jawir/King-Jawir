import { API_CONFIG } from '@/lib/config/api'

// ============================================================================
// TYPE DEFINITIONS
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

export interface ApiError {
  message: string
  code: string
  status?: number
  details?: unknown
}

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

// ============================================================================
// API CLIENT
// ============================================================================

export class ApiClient {
  private baseUrl: string
  private timeout: number

  constructor(baseUrl?: string, timeout?: number) {
    this.baseUrl = baseUrl ?? API_CONFIG.BASE_URL
    this.timeout = timeout ?? API_CONFIG.TIMEOUT
  }

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
        // If unauthorized (401) or token invalid, clear storage
        const errorObj = data.error as { code?: string; details?: unknown } | undefined
        if (response.status === 401 || errorObj?.code === 'UNAUTHORIZED') {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            // Trigger a storage event to notify other components
            window.dispatchEvent(new Event('auth-cleared'))
          }
        }

        const message = typeof data.message === 'string' ? data.message : 'Request failed'
        const errorCode = typeof errorObj?.code === 'string' ? errorObj.code : 'UNKNOWN_ERROR'
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

  get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

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

// ============================================================================
// DEFAULT CLIENT INSTANCE
// ============================================================================

export const apiClient = new ApiClient()

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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

export function isApiError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError
}

export function handleApiError(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}
