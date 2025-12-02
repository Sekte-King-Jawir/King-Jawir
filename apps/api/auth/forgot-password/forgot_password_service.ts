import { userRepository } from '../shared/user_repository'
import { verificationRepository } from '../shared/verification_repository'
import { sendResetPasswordEmail } from '../../lib/mail'
import { hashPassword, verifyPassword } from '../../lib/hash'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'
import { randomBytes } from 'crypto'

export const forgotPasswordService = {
  // Request reset password - kirim email
  async requestReset(email: string) {
    const user = await userRepository.findByEmail(email)

    // Jangan kasih tau user tidak ada (security)
    if (!user) {
      return successResponse('Jika email terdaftar, link reset password akan dikirim')
    }

    // Cek jika user OAuth (tidak punya password)
    if (!user.password) {
      return successResponse('Jika email terdaftar, link reset password akan dikirim')
    }

    // Hapus token reset lama
    await verificationRepository.deleteByUserIdAndType(user.id, 'reset_password')

    // Buat token baru
    const token = randomBytes(32).toString('hex')
    await verificationRepository.create({
      userId: user.id,
      token,
      type: 'reset_password',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 jam
    })

    const resetUrl = `${process.env.APP_URL}/auth/reset-password?token=${token}`
    await sendResetPasswordEmail(email, resetUrl)

    return successResponse('Jika email terdaftar, link reset password akan dikirim')
  },

  // Reset password dengan token
  async resetPassword(token: string, newPassword: string) {
    const verification = await verificationRepository.findByToken(token)

    if (!verification || verification.type !== 'reset_password') {
      return errorResponse('Token tidak valid atau sudah digunakan', ErrorCode.TOKEN_INVALID)
    }

    if (verification.expiresAt < new Date()) {
      await verificationRepository.delete(token)
      return errorResponse('Token expired', ErrorCode.TOKEN_EXPIRED)
    }

    // Ambil user untuk cek password lama
    const user = await userRepository.findById(verification.userId)
    if (!user || !user.password) {
      await verificationRepository.delete(token)
      return errorResponse('User tidak ditemukan', ErrorCode.USER_NOT_FOUND)
    }

    // Cek password baru tidak boleh sama dengan password lama
    const isSameAsOld = await verifyPassword(newPassword, user.password)
    if (isSameAsOld) {
      return errorResponse(
        'Password baru tidak boleh sama dengan password lama',
        ErrorCode.SAME_PASSWORD
      )
    }

    // Hash password baru
    const hashedPassword = await hashPassword(newPassword)

    // Update password user
    await userRepository.updatePassword(verification.userId, hashedPassword)

    // Hapus token (token hanya bisa dipakai 1x)
    await verificationRepository.delete(token)

    return successResponse('Password berhasil direset')
  },
}
