import { userRepository } from '../shared/user_repository'
import { refreshTokenRepository } from '../shared/refresh_token_repository'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'

export const refreshService = {
  async refresh(refreshToken: string, jwtAccess: any, jwtRefresh: any) {
    // Verify token
    const payload = await jwtRefresh.verify(refreshToken)
    if (!payload) {
      return errorResponse('Token tidak valid', ErrorCode.TOKEN_INVALID)
    }

    // Cek di database
    const stored = await refreshTokenRepository.findByToken(refreshToken)
    if (!stored || stored.expiresAt < new Date()) {
      return errorResponse('Token expired', ErrorCode.TOKEN_EXPIRED)
    }

    // Cari user
    const user = await userRepository.findById(payload.sub as string)
    if (!user) {
      return errorResponse('User tidak ditemukan', ErrorCode.USER_NOT_FOUND)
    }

    // Hapus refresh token lama
    await refreshTokenRepository.delete(refreshToken)

    // Generate new tokens
    const newAccessToken = await jwtAccess.sign({
      sub: user.id,
      role: user.role,
      emailVerified: user.emailVerified
    })

    const newRefreshToken = await jwtRefresh.sign({ sub: user.id })

    // Simpan refresh token baru
    await refreshTokenRepository.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    return successResponse('Token berhasil diperbarui', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    })
  }
}
