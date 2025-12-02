import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { registerService } from '../../auth/register/register_service'
import { userRepository } from '../../auth/shared/user_repository'
import { verificationRepository } from '../../auth/shared/verification_repository'
import { hashPassword } from '../../lib/hash'
import { ErrorCode } from '../../lib/response'

mock.module('../../auth/shared/user_repository', () => ({
  userRepository: {
    findByEmail: mock(),
    create: mock(),
  },
}))

mock.module('../../auth/shared/verification_repository', () => ({
  verificationRepository: {
    create: mock(),
  },
}))

mock.module('../../lib/hash', () => ({
  hashPassword: mock(),
}))

mock.module('../../lib/mail', () => ({
  sendVerificationEmail: mock(),
}))

describe('Register Service', () => {
  const validRegisterData = {
    email: 'newuser@example.com',
    password: 'Password123!',
    name: 'New User',
  }

  beforeEach(() => {
    ;(userRepository.findByEmail as any).mockReset()
    ;(userRepository.create as any).mockReset()
    ;(verificationRepository.create as any).mockReset()
    ;(hashPassword as any).mockReset()
  })

  describe('register', () => {
    it('should register new user successfully', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue(null)
      ;(hashPassword as any).mockResolvedValue('hashed-password')
      ;(userRepository.create as any).mockResolvedValue({
        id: 'user-123',
        ...validRegisterData,
        password: 'hashed-password',
        emailVerified: false,
      })
      ;(verificationRepository.create as any).mockResolvedValue({})

      const result = await registerService.register(
        validRegisterData.email,
        validRegisterData.password,
        validRegisterData.name
      )

      expect(result.success).toBe(true)
      expect(result.message).toContain('berhasil')
      expect(userRepository.findByEmail).toHaveBeenCalledWith(validRegisterData.email)
      expect(hashPassword).toHaveBeenCalledWith(validRegisterData.password)
    })

    it('should return error if email already exists', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue({
        id: 'existing-user',
        email: validRegisterData.email,
      })

      const result = await registerService.register(
        validRegisterData.email,
        validRegisterData.password,
        validRegisterData.name
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.USER_ALREADY_EXISTS)
      expect(result.message).toContain('sudah terdaftar')
    })

    it('should hash password before storing', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue(null)
      ;(hashPassword as any).mockResolvedValue('hashed-password')
      ;(userRepository.create as any).mockResolvedValue({
        id: 'user-123',
        ...validRegisterData,
        password: 'hashed-password',
      })
      ;(verificationRepository.create as any).mockResolvedValue({})

      await registerService.register(
        validRegisterData.email,
        validRegisterData.password,
        validRegisterData.name
      )

      expect(hashPassword).toHaveBeenCalledWith(validRegisterData.password)
      expect(userRepository.create).toHaveBeenCalledWith({
        email: validRegisterData.email,
        password: 'hashed-password',
        name: validRegisterData.name,
      })
    })

    it('should create verification token after registration', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue(null)
      ;(hashPassword as any).mockResolvedValue('hashed-password')
      ;(userRepository.create as any).mockResolvedValue({
        id: 'user-123',
        ...validRegisterData,
      })
      ;(verificationRepository.create as any).mockResolvedValue({})

      await registerService.register(
        validRegisterData.email,
        validRegisterData.password,
        validRegisterData.name
      )

      expect(verificationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-123',
          token: expect.any(String),
          expiresAt: expect.any(Date),
        })
      )
    })

    it('should validate email format', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue(null)

      const result = await registerService.register('invalid-email', 'Password123!', 'Test User')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR)
    })

    it('should validate password strength', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue(null)

      const result = await registerService.register('test@example.com', '123', 'Test User')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR)
    })

    it('should validate name is not empty', async () => {
      ;(userRepository.findByEmail as any).mockResolvedValue(null)

      const result = await registerService.register('test@example.com', 'Password123!', '')

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(ErrorCode.VALIDATION_ERROR)
    })
  })
})
