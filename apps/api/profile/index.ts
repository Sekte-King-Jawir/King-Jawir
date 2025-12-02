import { Elysia, t } from 'elysia'
import { profileController } from './profile_controller'
import { jwtPlugin, authDerive } from '../lib/auth-helper'

export const profileRoutes = new Elysia({ prefix: '/profile' })
  .use(jwtPlugin)
  .derive(authDerive)
  // GET /profile - Get current user profile
  .get(
    '/',
    async ({ user, set }) => {
      return profileController.getProfile(user, set)
    },
    {
      detail: {
        tags: ['Profile'],
        summary: 'Get my profile',
        description: 'Get current authenticated user profile',
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // PUT /profile - Update profile
  .put(
    '/',
    async ({ user, body, set }) => {
      return profileController.updateProfile(user, body, set)
    },
    {
      body: t.Object({
        name: t.Optional(t.String({ minLength: 2 })),
        phone: t.Optional(t.String()),
        address: t.Optional(t.String()),
        bio: t.Optional(t.String({ maxLength: 500 })),
      }),
      detail: {
        tags: ['Profile'],
        summary: 'Update my profile',
        description: 'Update current user profile information',
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // PUT /profile/avatar - Update avatar
  .put(
    '/avatar',
    async ({ user, body, set }) => {
      return profileController.updateAvatar(user, body, set)
    },
    {
      body: t.Object({
        avatarUrl: t.String(),
      }),
      detail: {
        tags: ['Profile'],
        summary: 'Update avatar',
        description: 'Update user avatar URL',
        security: [{ bearerAuth: [] }],
      },
    }
  )
