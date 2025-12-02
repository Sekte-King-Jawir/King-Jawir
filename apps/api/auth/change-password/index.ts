import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { changePasswordController } from './change_password_controller'
import { errorResponse, ErrorCode } from '../../lib/response'

// [unused] export const changePasswordRoute = new Elysia()
  .use(
    jwt({
      name: 'jwtAccess',
      secret: process.env.JWT_SECRET || 'secret-key-min-32-chars-long!!',
      exp: '15m',
    })
  )
  .post(
    '/change-password',
    async ({ body, headers, cookie, set, jwtAccess }) => {
      // Baca dari cookie, fallback ke header untuk API clients
      const token =
        (cookie.accessToken?.value as string | undefined) ||
        headers.authorization?.replace('Bearer ', '')

      if (!token) {
        set.status = 401
        return errorResponse('Unauthorized', ErrorCode.UNAUTHORIZED)
      }

      const payload = await jwtAccess.verify(token)
      if (!payload) {
        set.status = 401
        return errorResponse('Token tidak valid', ErrorCode.TOKEN_INVALID)
      }

      const result = await changePasswordController.handle(
        payload.sub as string,
        body.currentPassword,
        body.newPassword
      )

      if (!result.success) {
        set.status = 400
      }

      return result
    },
    {
      body: t.Object({
        currentPassword: t.String(),
        newPassword: t.String({ minLength: 6 }),
      }),
      detail: {
        tags: ['Auth'],
        summary: 'Change password',
        description: 'Change password for logged-in user. Requires current password verification.',
      },
    }
  )
