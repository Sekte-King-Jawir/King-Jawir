import { userRepository } from '../shared/user_repository'
import { verificationRepository } from '../shared/verification_repository'
import { hashPassword } from '../../lib/hash'
import { sendVerificationEmail } from '../../lib/mail'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'
import { randomBytes } from 'crypto'

export const registerService = {
  async register(email: string, password: string, name: string) {
    // Cek email sudah ada
    const exists = await userRepository.findByEmail(email)
    if (exists) {
      return errorResponse('Email sudah terdaftar', ErrorCode.USER_ALREADY_EXISTS)
    }

    // Hash password & buat user
    const hashedPassword = await hashPassword(password)
    const user = await userRepository.create({
      email,
      password: hashedPassword,
      name,
    })

    // Buat token verifikasi
    const token = randomBytes(32).toString('hex')
    await verificationRepository.create({
      userId: user.id,
      token,
      type: 'email',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam
    })

    // Kirim email
    const verifyUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`
    await sendVerificationEmail(email, verifyUrl)

    return successResponse('Register berhasil. Cek email untuk verifikasi.', {
      user: { id: user.id, email: user.email, name: user.name },
    })
  },
}
