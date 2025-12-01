import { refreshTokenRepository } from '../shared/refresh_token_repository'
import { successResponse } from '../../lib/response'

export const logoutService = {
  async logout(refreshToken: string) {
    await refreshTokenRepository.delete(refreshToken)
    return successResponse('Logout berhasil')
  }
}
