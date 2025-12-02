import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { loginService } from '../../auth/login/login_service'
import { userRepository } from '../../auth/shared/user_repository'
import { refreshTokenRepository } from '../../auth/shared/refresh_token_repository'
import { verifyPassword } from '../../lib/hash'
import { ErrorCode } from '../../lib/response'

// Mock dependencies
mock.module('../../auth/shared/user_repository', () => ({
  userRepository: {
    findByEmail: mock(),
  },
}))

mock.module('../../auth/shared/refresh_token_repository', () => ({
  refreshTokenRepository: {
    create: mock(),
  },
}))

mock.module('../../lib/hash', () => ({
  verifyPassword: mock(),
}))

describe('Login Service', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashed-password',
    name: 'Test User',
    role: 'CUSTOMER',
    emailVerified: true,
  }

  let mockJwtAccess: any
  let mockJwtRefresh: any

  beforeEach(() => {
    // Reset all mocks
    ;(userRepository.findByEmail as any).mockReset()
    ;(refreshTokenRepository.create as any).mockReset()
    ;(verifyPassword as any).mockReset()

    // Recreate JWT mocks with implementations
    mockJwtAccess = {
      sign: mock(() => Promise.resolve('mock-access-token')),
    }
    mockJwtRefresh = {
      sign: mock(() => Promise.resolve('mock-refresh-token')),
    }
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue(mockUser)
      ;(verifyPassword as any).mockResolvedValue(true)
      ;(refreshTokenRepository.create as any).mockResolvedValue({})

      const result = await loginService.login(
        'test@example.com',
        'password123',
        mockJwtAccess,
        mockJwtRefresh
      )

      expect(result.success).toBe(true)
      expect(result.message).toContain('Login berhasil')
      expect(result.data?.accessToken).toBe('mock-access-token')
      expect(result.data?.refreshToken).toBe('mock-refresh-token')
      expect(result.data?.user?.email).toBe('test@example.com')
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com')
      expect(verifyPassword).toHaveBeenCalledWith('password123', 'hashed-password')
    })

    it('should return error for non-existent user', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue(null)

      const result = await loginService.login(
        'nonexistent@example.com',
        'password123',
        mockJwtAccess,
        mockJwtRefresh
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.INVALID_CREDENTIALS)
      expect(result.message).toContain('Email atau password salah')
    })

    it('should return error for OAuth user without password', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue({
        ...mockUser,
        password: null,
      })

      const result = await loginService.login(
        'test@example.com',
        'password123',
        mockJwtAccess,
        mockJwtRefresh
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.OAUTH_NO_PASSWORD)
      expect(result.message).toContain('Google')
    })

    it('should return error for invalid password', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue(mockUser)
      ;(verifyPassword as any).mockResolvedValue(false)

      const result = await loginService.login(
        'test@example.com',
        'wrongpassword',
        mockJwtAccess,
        mockJwtRefresh
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.INVALID_CREDENTIALS)
      expect(result.message).toContain('Email atau password salah')
    })

    it('should show different message for unverified email', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue({
        ...mockUser,
        emailVerified: false,
      })
      ;(verifyPassword as any).mockResolvedValue(true)
      ;(refreshTokenRepository.create as any).mockResolvedValue({})

      const result = await loginService.login(
        'test@example.com',
        'password123',
        mockJwtAccess,
        mockJwtRefresh
      )

      expect(result.success).toBe(true)
      expect(result.message).toContain('Verifikasi email')
    })

    it('should generate JWT tokens with correct payload', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue(mockUser)
      ;(verifyPassword as any).mockResolvedValue(true)
      ;(refreshTokenRepository.create as any).mockResolvedValue({})

      await loginService.login('test@example.com', 'password123', mockJwtAccess, mockJwtRefresh)

      expect(mockJwtAccess.sign).toHaveBeenCalledWith({
        sub: 'user-123',
        role: 'CUSTOMER',
        emailVerified: true,
      })

      expect(mockJwtRefresh.sign).toHaveBeenCalledWith({
        sub: 'user-123',
      })
    })

    it('should save refresh token to database', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue(mockUser)
      ;(verifyPassword as any).mockResolvedValue(true)
      ;(refreshTokenRepository.create as any).mockResolvedValue({})

      await loginService.login('test@example.com', 'password123', mockJwtAccess, mockJwtRefresh)

      expect(refreshTokenRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'mock-refresh-token',
          userId: 'user-123',
        })
      )
    })
  })
})
