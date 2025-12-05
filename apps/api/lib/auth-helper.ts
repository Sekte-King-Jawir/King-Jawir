import { jwt } from '@elysiajs/jwt'
import { type Role } from './auth-middleware'

// JWT Payload type
export interface JWTPayload {
  sub: string
  role: Role
  emailVerified?: boolean
  exp?: number
  iat?: number
}

// User context dari JWT
export interface AuthUser {
  id: string
  role: Role
}

/**
 * Shared JWT configuration
 */
export const jwtConfig = {
  name: 'jwtAccess' as const,
  secret: process.env['JWT_SECRET'] || 'secret-key-min-32-chars-long!!',
}

/**
 * JWT plugin - just the jwt instance
 */
export const jwtPlugin = jwt(jwtConfig)

/**
 * Auth derive function - extracts user from JWT token
 * Use with .derive() in route files
 */
export const authDerive = async ({
  headers,
  cookie,
  jwtAccess,
}: any): Promise<{ user: AuthUser | null }> => {
  const authHeader = headers.authorization || headers['Authorization']
  const token = cookie.accessToken?.value || authHeader?.replace('Bearer ', '')

  if (!token) {
    return { user: null }
  }

  try {
    const payload = (await jwtAccess.verify(token)) as any
    if (!payload || typeof payload !== 'object') {
      return { user: null }
    }
    const userId = payload.id || payload.sub
    if (typeof userId !== 'string' || typeof payload.role !== 'string') {
      return { user: null }
    }
    return {
      user: { id: userId, role: payload.role },
    }
  } catch {
    return { user: null }
  }
}

/**
 * Check if user has required role
 */
export const hasRole = (user: AuthUser | null, requiredRoles: Role[]): boolean => {
  if (!user) return false
  return requiredRoles.includes(user.role)
}

/**
 * Role hierarchy check helpers
 */
export const isSeller = (user: AuthUser | null): boolean => {
  return hasRole(user, ['SELLER', 'ADMIN'])
}

export const isAdmin = (user: AuthUser | null): boolean => {
  return hasRole(user, ['ADMIN'])
}

export const isAuthenticated = (user: AuthUser | null): boolean => {
  return user !== null
}
