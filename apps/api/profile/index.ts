import { Elysia, t } from 'elysia'
import { profileController } from './profile_controller'
import { jwtPlugin, authDerive } from '../lib/auth-helper'
import { v } from '../lib/validators'
import { uploadAvatar } from '../lib/minio'
import { errorResponse, ErrorCode } from '../lib/response'

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
  // POST /profile/avatar/upload - Upload avatar file directly
  .post(
    '/avatar/upload',
    async ({ user, body, set }) => {
      if (!user) {
        set.status = 401
        return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
      }

      if (!body.avatar) {
        set.status = 400
        return errorResponse('Avatar file is required', ErrorCode.BAD_REQUEST)
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(body.avatar.type)) {
        set.status = 400
        return errorResponse(
          'Invalid file type. Only JPEG, PNG, and WebP are allowed',
          ErrorCode.BAD_REQUEST
        )
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (body.avatar.size > maxSize) {
        set.status = 400
        return errorResponse('File size exceeds 5MB limit', ErrorCode.BAD_REQUEST)
      }

      try {
        // Upload to MinIO
        const avatarUrl = await uploadAvatar(body.avatar, user.id)

        // Update user profile with new avatar URL
        const result = await profileController.updateAvatar(
          user,
          { avatarUrl },
          set
        )

        return result
      } catch (error) {
        set.status = 500
        return errorResponse('Failed to upload avatar', ErrorCode.INTERNAL_ERROR)
      }
    },
    {
      body: t.Object({
        avatar: t.File({
          type: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
          maxSize: 5 * 1024 * 1024, // 5MB
        }),
      }),
      detail: {
        tags: ['Profile'],
        summary: 'Upload avatar file',
        description: 'Upload avatar image file directly to MinIO storage',
        security: [{ bearerAuth: [] }],
      },
    }
  )
