import { refreshTokenRepository } from '../../../auth/shared/refresh_token_repository'
import { successResponse, errorResponse, ErrorCode } from '../../../lib/response'

export const sellerLogoutService = {
  async logout(refreshToken: string) {
    const token = await refreshTokenRepository.findByToken(refreshToken)
    if (!token) {
      return errorResponse('Token tidak ditemukan', ErrorCode.UNAUTHORIZED)
    }

    await refreshTokenRepository.delete(token.id)
    return successResponse('Logout berhasil', null)
  },
}
