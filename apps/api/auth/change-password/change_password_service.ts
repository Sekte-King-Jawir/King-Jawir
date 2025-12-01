import { userRepository } from '../shared/user_repository'
import { hashPassword, verifyPassword } from '../../lib/hash'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'

export const changePasswordService = {
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // Cari user
    const user = await userRepository.findById(userId)

    if (!user) {
      return errorResponse('User tidak ditemukan', ErrorCode.USER_NOT_FOUND)
    }

    // Cek jika user OAuth (tidak punya password)
    if (!user.password) {
      return errorResponse('Akun ini terdaftar dengan Google. Tidak bisa ubah password.', ErrorCode.OAUTH_NO_PASSWORD)
    }

    // Verifikasi password lama
    const valid = await verifyPassword(currentPassword, user.password)
    if (!valid) {
      return errorResponse('Password lama salah', ErrorCode.INVALID_PASSWORD)
    }

    // Cek password baru tidak sama dengan yang lama
    const sameAsOld = await verifyPassword(newPassword, user.password)
    if (sameAsOld) {
      return errorResponse('Password baru tidak boleh sama dengan password lama', ErrorCode.SAME_PASSWORD)
    }

    // Hash dan update password
    const hashedPassword = await hashPassword(newPassword)
    await userRepository.updatePassword(userId, hashedPassword)

    return successResponse('Password berhasil diubah')
  }
}
