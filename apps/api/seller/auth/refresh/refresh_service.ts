import { refreshTokenRepository } from '../../../auth/shared/refresh_token_repository'
import { userRepository } from '../../../auth/shared/user_repository'
import { successResponse, errorResponse, ErrorCode } from '../../../lib/response'

export const sellerRefreshService = {
  async refresh(refreshToken: string, jwtAccess: any, jwtRefresh: any) {
    // Cari refresh token di database
    const tokenDoc = await refreshTokenRepository.findByToken(refreshToken)
    if (!tokenDoc) {
      return errorResponse('Refresh token tidak valid', ErrorCode.UNAUTHORIZED)
    }

    // Cek expired
    if (tokenDoc.expiresAt < new Date()) {
      await refreshTokenRepository.delete(tokenDoc.id)
      return errorResponse('Refresh token sudah expired', ErrorCode.UNAUTHORIZED)
    }

    // Cari user
    const user = await userRepository.findById(tokenDoc.userId)
    if (!user) {
      return errorResponse('User tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Validasi role - harus SELLER atau ADMIN
    if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
      return errorResponse('Akses ditolak. Hanya seller yang bisa refresh token di sini.', ErrorCode.FORBIDDEN)
    }

    // Generate tokens baru
    const authUser = {
      id: user.id,
      role: user.role,
    }

    const newAccessToken = await jwtAccess.sign(authUser)
    const newRefreshToken = await jwtRefresh.sign(authUser)

    // Hapus old refresh token & simpan yang baru
    await refreshTokenRepository.delete(tokenDoc.id)
    await refreshTokenRepository.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
    })

    return successResponse('Token berhasil di-refresh', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  },
}
