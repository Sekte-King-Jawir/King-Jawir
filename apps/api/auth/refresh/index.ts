import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { refreshController } from './refresh_controller'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'

const isProduction = process.env.NODE_ENV === 'production'

// [unused] export const refreshRoute = new Elysia()
  .use(
    jwt({
      name: 'jwtAccess',
      secret: process.env.JWT_SECRET || 'secret-key-min-32-chars-long!!',
      exp: '15m',
    })
  )
  .use(
    jwt({
      name: 'jwtRefresh',
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-min-32-chars!!',
      exp: '7d',
    })
  )
  .post(
    '/refresh',
    async ({ set, cookie, jwtAccess, jwtRefresh }) => {
      const refreshToken = cookie.refreshToken?.value as string | undefined

      if (!refreshToken) {
        set.status = 401
        return errorResponse('Refresh token tidak ditemukan', ErrorCode.TOKEN_INVALID)
      }

      const result = await refreshController.handle(refreshToken, jwtAccess, jwtRefresh)

      if (!result.success) {
        set.status = 401
        return result
      }

      const { accessToken, refreshToken: newRefreshToken } = result.data!

      // Update cookies dengan token baru
      cookie.accessToken?.set({
        value: accessToken,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 15 * 60,
        path: '/',
      })

      cookie.refreshToken?.set({
        value: newRefreshToken,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      })

      return successResponse('Token berhasil diperbarui')
    },
    {
      detail: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        description:
          'Get new access token using refresh token from cookie. Implements token rotation.',
      },
    }
  )
