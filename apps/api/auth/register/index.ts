import { Elysia, t } from 'elysia'
import { registerController } from './register_controller'
import { v } from '../../lib/validators'

export const registerRoute = new Elysia().post(
  '/register',
  async ({ body, set }) => {
    const result = await registerController.handle(body.email, body.password, body.name)

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
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Register new user',
      description:
        'Register a new user with email, password, and name. A verification email will be sent.',
    },
  }
)
