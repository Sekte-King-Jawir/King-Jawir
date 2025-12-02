import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { googleController } from './google_controller'

const isProduction = process.env.NODE_ENV === 'production'

// Store untuk menyimpan state dan codeVerifier sementara
// Di production, gunakan Redis atau session storage
const oauthStateStore = new Map<string, { codeVerifier: string; expiresAt: number }>()

// Cleanup expired states setiap 5 menit
setInterval(
  () => {
    const now = Date.now()
    for (const [state, data] of oauthStateStore.entries()) {
      if (data.expiresAt < now) {
        oauthStateStore.delete(state)
      }
    }
  },
  5 * 60 * 1000
)

// [unused] export const googleRoute = new Elysia()
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
  // Start Google OAuth
  .get(
    '/google',
    async ({ redirect }) => {
      const { url, state, codeVerifier } = googleController.startAuth()

      // Simpan state dan codeVerifier (expire dalam 10 menit)
      oauthStateStore.set(state, {
        codeVerifier,
        expiresAt: Date.now() + 10 * 60 * 1000,
      })

      // Redirect ke Google
      return redirect(url)
    },
    {
      detail: {
        tags: ['Auth'],
        summary: 'Start Google OAuth',
        description:
          'Redirects to Google login page. After login, Google will redirect back to /auth/google/callback.',
      },
    }
  )
  // Google OAuth callback
  .get(
    '/google/callback',
    async ({ query, set, cookie, jwtAccess, jwtRefresh, redirect }) => {
      const { code, state } = query

      if (!code || !state) {
        set.status = 400
        return { success: false, message: 'Missing code or state' }
      }

      // Ambil dan hapus state dari store
      const storedData = oauthStateStore.get(state)
      oauthStateStore.delete(state)

      if (!storedData) {
        set.status = 400
        return { success: false, message: 'Invalid or expired state' }
      }

      if (storedData.expiresAt < Date.now()) {
        set.status = 400
        return { success: false, message: 'OAuth session expired' }
      }

      // Handle callback
      const result = await googleController.handleCallback(code, storedData.codeVerifier)

      if (!result.success) {
        set.status = 400
        return result
      }

      // Generate tokens
      const accessToken = await jwtAccess.sign({
        sub: result.user!.id,
        email: result.user!.email,
        role: result.user!.role,
      })

      const refreshToken = await jwtRefresh.sign({
        sub: result.user!.id,
        type: 'refresh',
      })

      // Save refresh token
      await googleController.createRefreshToken(result.user!.id, refreshToken)

      // Set cookies
      cookie.accessToken?.set({
        value: accessToken,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 15 * 60,
        path: '/',
      })

      cookie.refreshToken?.set({
        value: refreshToken,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      })

      // Return JSON untuk testing (nanti ganti ke redirect)
      return {
        success: true,
        message: 'Google login successful',
        data: {
          user: result.user,
          isNewUser: result.isNewUser,
          accessToken,
          refreshToken,
        },
      }

      // Redirect ke frontend (uncomment untuk production)
      // const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      // return redirect(`${frontendUrl}/auth/callback?isNewUser=${result.isNewUser}`)
    },
    {
      query: t.Object({
        code: t.Optional(t.String()),
        state: t.Optional(t.String()),
        error: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Auth'],
        summary: 'Google OAuth callback',
        description:
          'Callback URL for Google OAuth. Handles the authorization code and creates/logs in user.',
      },
    }
  )
