import { profileService } from './profile_service'
import { successResponse, errorResponse, ErrorCode } from '../lib/response'
import type { AuthUser } from '../lib/auth-helper'

interface UpdateProfileBody {
  name?: string
  phone?: string
  address?: string
  bio?: string
}

interface UpdateAvatarBody {
  avatarUrl: string
}

export const profileController = {
  async getProfile(user: AuthUser | null, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    const result = await profileService.getProfile(user.id)
    
    if (!result.success) {
      set.status = 404
      return errorResponse(result.error!, ErrorCode.NOT_FOUND)
    }

    return successResponse('Profile berhasil diambil', result.data)
  },

  async updateProfile(user: AuthUser | null, body: UpdateProfileBody, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    const result = await profileService.updateProfile(user.id, body)
    
    if (!result.success) {
      set.status = 400
      return errorResponse(result.error!, ErrorCode.BAD_REQUEST)
    }

    return successResponse('Profile berhasil diupdate', result.data)
  },

  async updateAvatar(user: AuthUser | null, body: UpdateAvatarBody, set: any) {
    if (!user) {
      set.status = 401
      return errorResponse('Unauthorized - Please login', ErrorCode.UNAUTHORIZED)
    }

    if (!body.avatarUrl) {
      set.status = 400
      return errorResponse('avatarUrl harus diisi', ErrorCode.BAD_REQUEST)
    }

    const result = await profileService.updateAvatar(user.id, body.avatarUrl)
    
    if (!result.success) {
      set.status = 400
      return errorResponse(result.error!, ErrorCode.BAD_REQUEST)
    }

    return successResponse('Avatar berhasil diupdate', result.data)
  }
}
