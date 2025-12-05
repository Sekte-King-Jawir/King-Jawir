import { userRepository } from '../../../auth/shared/user_repository'
import { refreshTokenRepository } from '../../../auth/shared/refresh_token_repository'
import { verifyPassword } from '../../../lib/hash'
import { successResponse, errorResponse, ErrorCode } from '../../../lib/response'

export const sellerLoginService = {
  async login(email: string, password: string, jwtAccess: any, jwtRefresh: any) {
    // Cari user by email
    const user = await userRepository.findByEmail(email)
    if (!user) {
      return errorResponse('Email atau password salah', ErrorCode.INVALID_CREDENTIALS)
    }

    // Validasi role - harus SELLER atau ADMIN
    if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
      return errorResponse(
        'Akses ditolak. Hanya seller yang bisa login di sini.',
        ErrorCode.FORBIDDEN
      )
    }

    // Cek password
    if (!user.password) {
      return errorResponse(
        'Akun ini menggunakan Google OAuth. Gunakan login Google.',
        ErrorCode.BAD_REQUEST
      )
    }

    const validPassword = await verifyPassword(password, user.password)
    if (!validPassword) {
      return errorResponse('Email atau password salah', ErrorCode.INVALID_CREDENTIALS)
    }

    // Cek email verified
    if (!user.emailVerified) {
      return errorResponse(
        'Email belum diverifikasi. Cek email untuk verifikasi.',
        ErrorCode.EMAIL_NOT_VERIFIED
      )
    }

    // Generate tokens
    const authUser = {
      id: user.id,
      role: user.role,
    }

    const accessToken = await jwtAccess.sign(authUser)
    const refreshToken = await jwtRefresh.sign(authUser)

    // Simpan refresh token
    await refreshTokenRepository.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
    })

    return successResponse('Login berhasil', {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
      },
    })
  },
}
