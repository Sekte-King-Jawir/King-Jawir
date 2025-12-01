import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { loginController } from './login_controller'
import { successResponse } from '../../lib/response'

const isProduction = process.env.NODE_ENV === 'production'

export const loginRoute = new Elysia()
  .use(jwt({
    name: 'jwtAccess',
    secret: process.env.JWT_SECRET || 'secret-key-min-32-chars-long!!',
    exp: '15m'
  }))
  .use(jwt({
    name: 'jwtRefresh',
    secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-min-32-chars!!',
    exp: '7d'
  }))
  .post('/login', async ({ body, set, cookie, jwtAccess, jwtRefresh }) => {
    const result = await loginController.handle(
      body.email, 
      body.password, 
      jwtAccess, 
      jwtRefresh
    )

    if (!result.success) {
      set.status = 401
      return result
    }

    const { accessToken, refreshToken, user } = result.data!

    // Set cookies
    cookie.accessToken?.set({
      value: accessToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    })

    cookie.refreshToken?.set({
      value: refreshToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    // Return dengan tokens (untuk API testing) dan user info
    return successResponse(result.message, { 
      accessToken,
      refreshToken,
      user 
    })
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String()
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Login user',
      description: 'Login with email and password. Access and refresh tokens are set as httpOnly cookies.'
    }
  })
