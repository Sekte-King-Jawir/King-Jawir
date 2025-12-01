import { Elysia, t } from 'elysia'
import { forgotPasswordController } from './forgot_password_controller'

export const forgotPasswordRoute = new Elysia()
  // Request reset password
  .post('/forgot-password', async ({ body }) => {
    return forgotPasswordController.requestReset(body.email)
  }, {
    body: t.Object({
      email: t.String({ format: 'email' })
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Request password reset',
      description: 'Send password reset link to user email.'
    }
  })

  // Reset password dengan token
  .post('/reset-password', async ({ body, set }) => {
    const result = await forgotPasswordController.resetPassword(body.token, body.newPassword)

    if (!result.success) {
      set.status = 400
    }

    return result
  }, {
    body: t.Object({
      token: t.String(),
      newPassword: t.String({ minLength: 6 })
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Reset password',
      description: 'Reset password using token from email.'
    }
  })
