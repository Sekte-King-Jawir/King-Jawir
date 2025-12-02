import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { meController } from './me_controller'
import { errorResponse, ErrorCode } from '../../lib/response'

export const meRoute = new Elysia()
  .use(
    jwt({
      name: 'jwtAccess',
      secret: process.env['JWT_SECRET'] || 'secret-key-min-32-chars-long!!',
      exp: '15m',
    })
  )
  .get(
    '/me',
    async ({ headers, cookie, set, jwtAccess }) => {
      // Baca dari cookie, fallback ke header untuk API clients
      const token =
        (cookie['accessToken']?.value as string | undefined) ||
        headers['authorization']?.replace('Bearer ', '')

      if (!token) {
        set.status = 401
        return errorResponse('Unauthorized', ErrorCode.UNAUTHORIZED)
      }

      const payload = await jwtAccess.verify(token)
      if (!payload) {
        set.status = 401
        return errorResponse('Token tidak valid', ErrorCode.TOKEN_INVALID)
      }

      const result = await meController.handle(payload.sub as string)

      if (!result.success) {
        set.status = 404
      }

      return result
    },
    {
      detail: {
        tags: ['Auth'],
        summary: 'Get current user',
        description:
          'Get current logged-in user information. Requires access token in cookie or Authorization header.',
      },
    }
  )
