import { userRepository } from '../shared/user_repository'
import { verificationRepository } from '../shared/verification_repository'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'

export const verifyEmailService = {
  async verify(token: string) {
    // Cari verification token
    const verification = await verificationRepository.findByToken(token)

    if (!verification || verification.type !== 'email') {
      return errorResponse('Token tidak valid', ErrorCode.TOKEN_INVALID)
    }

    if (verification.expiresAt < new Date()) {
      await verificationRepository.delete(token)
      return errorResponse('Token expired', ErrorCode.TOKEN_EXPIRED)
    }

    // Update user emailVerified
    await userRepository.updateEmailVerified(verification.userId, true)

    // Hapus verification token
    await verificationRepository.delete(token)

    return successResponse('Email berhasil diverifikasi')
  },
}
