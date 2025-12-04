import { Elysia, t } from 'elysia'
import { profileController } from './profile_controller'
import { jwtPlugin, authDerive } from '../lib/auth-helper'
import { v } from '../lib/validators'

export const profileRoutes = new Elysia({ prefix: '/api/profile' })
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
        name: t.Optional(v.name()),
        phone: t.Optional(v.phoneID()),
        address: t.Optional(v.address()),
        bio: t.Optional(v.bio()),
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
        avatarUrl: v.url(),
      }),
      detail: {
        tags: ['Profile'],
        summary: 'Update avatar',
        description: 'Update user avatar URL',
        security: [{ bearerAuth: [] }],
      },
    }
  )
