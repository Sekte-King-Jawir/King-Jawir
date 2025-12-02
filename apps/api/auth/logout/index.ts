import { Elysia } from 'elysia'
import { logoutController } from './logout_controller'

export const logoutRoute = new Elysia().post(
  '/logout',
  async ({ cookie }) => {
    const refreshToken = cookie.refreshToken?.value as string | undefined

    if (refreshToken) {
      await logoutController.handle(refreshToken)
    }

    // Clear cookies
    cookie.accessToken?.remove()
    cookie.refreshToken?.remove()

    return { success: true, message: 'Logout berhasil' }
  },
  {
    detail: {
      tags: ['Auth'],
      summary: 'Logout user',
      description: 'Logout current user. Clears cookies and invalidates refresh token.',
    },
  }
)
