import { Elysia, t } from 'elysia'
import { resendVerificationController } from './resend_verification_controller'

export const resendVerificationRoute = new Elysia().post(
  '/resend-verification',
  async ({ body, set }) => {
    const result = await resendVerificationController.handle(body.email)

    if (!result.success) {
      set.status = 400
    }

    return result
  },
  {
    body: t.Object({
      email: t.String({ format: 'email' }),
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Resend verification email',
      description: 'Resend email verification link to user email.',
    },
  }
)
