import { userRepository } from '../shared/user_repository'
import { refreshTokenRepository } from '../shared/refresh_token_repository'
import { verifyPassword } from '../../lib/hash'
import { successResponse, errorResponse, ErrorCode } from '../../lib/response'

export const loginService = {
  async login(
    email: string, 
    password: string, 
    jwtAccess: any, 
    jwtRefresh: any
  ) {
    // Cari user
    const user = await userRepository.findByEmail(email)
    if (!user) {
      return errorResponse('Email atau password salah', ErrorCode.INVALID_CREDENTIALS)
    }

    // Cek jika user login dengan OAuth (tidak punya password)
    if (!user.password) {
      return errorResponse('Akun ini terdaftar dengan Google. Gunakan Login with Google.', ErrorCode.OAUTH_NO_PASSWORD)
    }

    // Verifikasi password
    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return errorResponse('Email atau password salah', ErrorCode.INVALID_CREDENTIALS)
    }

    // Generate tokens
    const accessToken = await jwtAccess.sign({
      sub: user.id,
      role: user.role,
      emailVerified: user.emailVerified
    })
    const refreshToken = await jwtRefresh.sign({ sub: user.id })

    // Simpan refresh token
    await refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 hari
    })

    const message = user.emailVerified
      ? 'Login berhasil'
      : 'Login berhasil. Verifikasi email untuk akses penuh.'

    return successResponse(message, {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified
      }
    })
  }
}
