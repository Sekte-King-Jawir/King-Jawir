import { Elysia, t } from 'elysia'
import { registerController } from './register_controller'

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
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 6 }),
      name: t.String({ minLength: 2 }),
    }),
    detail: {
      tags: ['Auth'],
      summary: 'Register new user',
      description:
        'Register a new user with email, password, and name. A verification email will be sent.',
    },
  }
)
