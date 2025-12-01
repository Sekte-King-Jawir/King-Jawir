import { userRepository } from '../shared/user_repository'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'

export const meService = {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId)

    if (!user) {
      return errorResponse('User tidak ditemukan', ErrorCode.USER_NOT_FOUND)
    }

    return successResponse('User ditemukan', {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        emailVerified: user.emailVerified
      }
    })
  }
}
