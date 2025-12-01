import { Elysia, t } from 'elysia'
import { verifyEmailController } from './verify_email_controller'

export const verifyEmailRoute = new Elysia()
  .get('/verify-email', async ({ query, set }) => {
    const result = await verifyEmailController.handle(query.token)

    if (!result.success) {
      set.status = 400
    }

    return result
  }, {
    query: t.Object({
      token: t.String()
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Verify email',
      description: 'Verify user email using token sent via email.'
    }
  })
