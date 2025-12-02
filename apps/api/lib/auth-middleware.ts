import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { errorResponse, ErrorCode } from './response'

// Role enum (sesuai dengan Prisma schema)
export type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN'

// JWT payload type
interface JWTPayload {
  sub: string
  role: Role
  emailVerified?: boolean
  exp?: number
  iat?: number
}

// User context dari JWT
// [unused] export interface AuthUser {
  id: string
  role: Role
}

/**
 * Auth middleware plugin
 * Verifikasi JWT dan extract user info
 */
// [unused] export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .use(
    jwt({
      name: 'jwtAccess',
      secret: process.env.JWT_SECRET || 'secret-key-min-32-chars-long!!',
      exp: '15m',
    })
  )
  .resolve(async ({ headers, cookie, jwtAccess }) => {
    // Ambil token dari cookie atau Authorization header
    // headers bisa lowercase atau mixed case tergantung client
    const authHeader = headers.authorization || (headers['Authorization'] as string | undefined)
    const token =
      (cookie.accessToken?.value as string | undefined) || authHeader?.replace('Bearer ', '')

    // Debug log (remove in production)
    console.log('Auth Debug:', { hasToken: !!token, tokenStart: token?.substring(0, 30) })

    if (!token) {
      return { user: null as AuthUser | null }
    }

    try {
      const payload = (await jwtAccess.verify(token)) as JWTPayload | false

      console.log('JWT Verify Result:', {
        payload: payload ? { sub: payload.sub, role: payload.role } : false,
      })

      if (!payload) {
        return { user: null as AuthUser | null }
      }

      return {
        user: {
          id: payload.sub,
          role: payload.role,
        } as AuthUser | null,
      }
    } catch {
      return { user: null as AuthUser | null }
    }
  })

/**
 * Guard: Require authenticated user
 */
// [unused] export const requireAuth = ({ user, set }: { user: AuthUser | null; set: any }) => {
  if (!user) {
    set.status = 401
    return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
  }
}

/**
 * Guard: Require specific roles
 */
// [unused] export const requireRole = (allowedRoles: Role[]) => {
  return ({ user, set }: { user: AuthUser | null; set: any }) => {
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
// [unused] export const guards = {
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
// [unused] export const isOwner = (resourceUserId: string, currentUserId: string): boolean => {
  return resourceUserId === currentUserId
}

/**
 * Helper untuk check apakah user adalah admin
 */
// [unused] export const isAdmin = (user: AuthUser | null): boolean => {
  return user?.role === 'ADMIN'
}
