import { userRepository } from '../shared/user_repository'
import { verificationRepository } from '../shared/verification_repository'
import { sendVerificationEmail } from '../../lib/mail'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'
import { randomBytes } from 'crypto'

export const resendVerificationService = {
  async resend(email: string) {
    const user = await userRepository.findByEmail(email)

    if (!user) {
      return errorResponse('User tidak ditemukan', ErrorCode.USER_NOT_FOUND)
    }

    if (user.emailVerified) {
      return errorResponse('Email sudah terverifikasi', ErrorCode.EMAIL_ALREADY_VERIFIED)
    }

    // Hapus verification lama
    await verificationRepository.deleteByUserIdAndType(user.id, 'email')

    // Buat token baru
    const token = randomBytes(32).toString('hex')
    await verificationRepository.create({
      userId: user.id,
      token,
      type: 'email',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })

    const verifyUrl = `${process.env['APP_URL']}/verify-email?token=${token}`
    await sendVerificationEmail(email, verifyUrl)

    return successResponse('Email verifikasi telah dikirim ulang')
  },
}
