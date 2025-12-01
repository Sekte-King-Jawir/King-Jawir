import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { errorResponse, ErrorCode } from './response'

// Role enum (sesuai dengan Prisma schema)
export type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN'

// JWT payload type
interface JWTPayload {
  sub: string
  email: string
  role: Role
  exp?: number
  iat?: number
}

// User context dari JWT
export interface AuthUser {
  id: string
  email: string
  role: Role
}

/**
 * Auth middleware plugin
 * Verifikasi JWT dan extract user info
 */
export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .use(jwt({
    name: 'jwtAccess',
    secret: process.env.JWT_SECRET || 'secret-key-min-32-chars-long!!',
    exp: '15m'
  }))
  .derive(async ({ headers, cookie, jwtAccess }) => {
    // Ambil token dari cookie atau Authorization header
    const token = (cookie.accessToken?.value as string | undefined)
      || headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return { user: null }
    }

    try {
      const payload = await jwtAccess.verify(token) as JWTPayload | false
      
      if (!payload) {
        return { user: null }
      }

      return {
        user: {
          id: payload.sub,
          email: payload.email,
          role: payload.role
        } as AuthUser
      }
    } catch {
      return { user: null }
    }
  })

/**
 * Guard: Require authenticated user
 */
export const requireAuth = async ({ user, set }: { user: AuthUser | null; set: any }) => {
  if (!user) {
    set.status = 401
    return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
  }
}

/**
 * Guard: Require specific roles
 */
export const requireRole = (allowedRoles: Role[]) => {
  return async ({ user, set }: { user: AuthUser | null; set: any }) => {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    if (!allowedRoles.includes(user.role)) {
      set.status = 403
      return errorResponse(
        `Forbidden - Requires role: ${allowedRoles.join(' or ')}`,
        ErrorCode.FORBIDDEN
      )
    }
  }
}

/**
 * Pre-configured guards untuk kemudahan
 */
export const guards = {
  // Semua authenticated user
  auth: requireAuth,
  
  // Customer atau role lebih tinggi
  customer: requireRole(['CUSTOMER', 'SELLER', 'ADMIN']),
  
  // Seller atau admin
  seller: requireRole(['SELLER', 'ADMIN']),
  
  // Admin only
  admin: requireRole(['ADMIN']),
}

/**
 * Helper untuk check ownership
 * Misal: apakah product ini milik store user ini?
 */
export const isOwner = (resourceUserId: string, currentUserId: string): boolean => {
  return resourceUserId === currentUserId
}

/**
 * Helper untuk check apakah user adalah admin
 */
export const isAdmin = (user: AuthUser | null): boolean => {
  return user?.role === 'ADMIN'
}
