import { Elysia, t } from 'elysia'
import { sellerRegisterController } from './register/register_controller'
import { sellerLoginController } from './login/login_controller'
import { sellerLogoutController } from './logout/logout_controller'
import { sellerRefreshController } from './refresh/refresh_controller'
import { sellerMeController } from './me/me_controller'
import { jwtPlugin, authDerive } from '../../lib/auth-helper'
import { v } from '../../lib/validators'
import { errorResponse, ErrorCode } from '../../lib/response'
import { jwt } from '@elysiajs/jwt'

// JWT Refresh plugin
const jwtRefreshPlugin = jwt({
  name: 'jwtRefresh',
  secret: process.env['JWT_SECRET'] || 'secret-key-min-32-chars-long!!',
})

export const sellerAuthRoutes = new Elysia({ prefix: '/api/seller/auth' })
  .use(jwtPlugin)
  .use(jwtRefreshPlugin)
  .derive(authDerive)

  // POST /seller/auth/register - Register seller baru dengan toko
  .post(
    '/register',
    async ({ body, set }) => {
      const result = await sellerRegisterController.handle(
        body.email,
        body.password,
        body.name,
        body.storeName,
        body.storeDescription
      )

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      body: t.Object({
        email: v.email(),
        password: v.password(),
        name: v.name(),
        storeName: t.String({ minLength: 2, maxLength: 100 }),
        storeDescription: t.Optional(t.String({ maxLength: 500 })),
      }),
      detail: {
        tags: ['Seller Auth'],
        summary: 'Register seller baru',
        description: 'Membuat akun seller baru dan toko. Email verifikasi akan dikirim.',
      },
    }
  )

  // POST /seller/auth/login - Login seller
  .post(
    '/login',
    async ({ body, set, jwtAccess, jwtRefresh, cookie }) => {
      const result = await sellerLoginController.handle(body.email, body.password, jwtAccess, jwtRefresh)

      if (!result.success) {
        set.status = 400
        return result
      }

      const { accessToken, refreshToken } = result.data!

      // Set cookies untuk access & refresh token
      cookie['accessToken']?.set({
        value: accessToken,
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 menit
      })

      cookie['refreshToken']?.set({
        value: refreshToken,
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 hari
      })

      return result
    },
    {
      body: t.Object({
        email: v.email(),
        password: t.String({ minLength: 1 }),
      }),
      detail: {
        tags: ['Seller Auth'],
        summary: 'Login seller',
        description: 'Login untuk seller. Hanya akun dengan role SELLER atau ADMIN yang bisa login.',
      },
    }
  )

  // POST /seller/auth/logout - Logout seller
  .post(
    '/logout',
    async ({ cookie, set }) => {
      const refreshToken = cookie['refreshToken']?.value

      if (!refreshToken || typeof refreshToken !== 'string') {
        set.status = 400
        return errorResponse('Refresh token tidak ditemukan', ErrorCode.BAD_REQUEST)
      }

      const result = await sellerLogoutController.handle(refreshToken)

      // Clear cookies
      cookie['accessToken']?.remove()
      cookie['refreshToken']?.remove()

      return result
    },
    {
      detail: {
        tags: ['Seller Auth'],
        summary: 'Logout seller',
        description: 'Logout dan hapus refresh token.',
      },
    }
  )

  // POST /seller/auth/refresh - Refresh access token
  .post(
    '/refresh',
    async ({ cookie, set, jwtAccess, jwtRefresh }) => {
      const refreshToken = cookie['refreshToken']?.value

      if (!refreshToken || typeof refreshToken !== 'string') {
        set.status = 400
        return errorResponse('Refresh token tidak ditemukan', ErrorCode.BAD_REQUEST)
      }

      const result = await sellerRefreshController.handle(refreshToken, jwtAccess, jwtRefresh)

      if (!result.success) {
        set.status = 401
        cookie['accessToken']?.remove()
        cookie['refreshToken']?.remove()
        return result
      }

      const { accessToken, refreshToken: newRefreshToken } = result.data!

      // Update cookies dengan token baru
      cookie['accessToken']?.set({
        value: accessToken,
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 menit
      })

      cookie['refreshToken']?.set({
        value: newRefreshToken,
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 hari
      })

      return result
    },
    {
      detail: {
        tags: ['Seller Auth'],
        summary: 'Refresh access token',
        description: 'Mendapatkan access token baru menggunakan refresh token.',
      },
    }
  )

  // GET /seller/auth/me - Get seller profile
  .get(
    '/me',
    async ({ user, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }

      const result = await sellerMeController.handle(user.id)

      if (!result.success) {
        set.status = result.error?.code === ErrorCode.FORBIDDEN ? 403 : 400
      }

      return result
    },
    {
      detail: {
        tags: ['Seller Auth'],
        summary: 'Get seller profile',
        description: 'Mendapatkan data profile seller yang sedang login beserta data toko.',
      },
    }
  )
