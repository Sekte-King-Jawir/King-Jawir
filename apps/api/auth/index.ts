import { Elysia } from 'elysia'
import { registerRoute } from './register'
import { loginRoute } from './login'
import { logoutRoute } from './logout'
import { refreshRoute } from './refresh'
import { verifyEmailRoute } from './verify-email'
import { resendVerificationRoute } from './resend-verification'
import { meRoute } from './me'
import { forgotPasswordRoute } from './forgot-password'
import { changePasswordRoute } from './change-password'
import { googleRoute } from './google'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(registerRoute)
  .use(loginRoute)
  .use(logoutRoute)
  .use(refreshRoute)
  .use(verifyEmailRoute)
  .use(resendVerificationRoute)
  .use(meRoute)
  .use(forgotPasswordRoute)
  .use(changePasswordRoute)
  .use(googleRoute)
