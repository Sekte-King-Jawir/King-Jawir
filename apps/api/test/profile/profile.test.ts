import { describe, it, expect, mock, beforeEach } from 'bun:test'
import { profileService } from '../../profile/profile_service'
import { profileRepository } from '../../profile/profile_repository'

mock.module('../../profile/profile_repository', () => ({
  profileRepository: {
    findById: mock(),
    updateProfile: mock(),
    updateAvatar: mock(),
  },
}))

describe('Profile Service', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    avatar: null,
    phone: null,
    address: null,
    bio: null,
    role: 'CUSTOMER',
  }

  beforeEach(() => {
    ;(profileRepository.findById as any).mockReset()
    ;(profileRepository.updateProfile as any).mockReset()
    ;(profileRepository.updateAvatar as any).mockReset()
  })

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      ;(profileRepository.findById as any).mockResolvedValue(mockUser)

      const result = await profileService.getProfile('user-123')

      expect(result.success).toBe(true)
      expect(result.data?.name).toBe('Test User')
      expect(profileRepository.findById).toHaveBeenCalledWith('user-123')
    })

    it('should return error if user not found', async () => {
      ;(profileRepository.findById as any).mockResolvedValue(null)

      const result = await profileService.getProfile('user-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('tidak ditemukan')
    })
  })

  describe('updateProfile', () => {
    const updateData = {
      name: 'Updated Name',
      phone: '081234567890',
      address: 'Jl. Test No. 123',
      bio: 'This is my bio',
    }

    it('should update profile successfully', async () => {
      ;(profileRepository.updateProfile as any).mockResolvedValue({
        ...mockUser,
        ...updateData,
      })

      const result = await profileService.updateProfile('user-123', updateData)

      expect(result.success).toBe(true)
      expect(result.data?.name).toBe('Updated Name')
      expect(profileRepository.updateProfile).toHaveBeenCalled()
    })

    it('should validate name minimum length', async () => {
      const result = await profileService.updateProfile('user-123', { name: 'A' })

      expect(result.success).toBe(false)
      expect(result.error).toContain('minimal 2 karakter')
    })

    it('should validate phone number format', async () => {
      const result = await profileService.updateProfile('user-123', { phone: 'invalid-phone' })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Format nomor HP')
    })

    it('should accept Indonesian phone number formats', async () => {
      ;(profileRepository.updateProfile as any).mockResolvedValue(mockUser)

      // Test +62 format
      let result = await profileService.updateProfile('user-123', { phone: '+628123456789' })
      expect(result.success).toBe(true)

      // Test 08 format
      result = await profileService.updateProfile('user-123', { phone: '081234567890' })
      expect(result.success).toBe(true)

      // Test 62 format
      result = await profileService.updateProfile('user-123', { phone: '628123456789' })
      expect(result.success).toBe(true)
    })

    it('should validate bio maximum length', async () => {
      const longBio = 'x'.repeat(501)
      const result = await profileService.updateProfile('user-123', { bio: longBio })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Bio maksimal 500 karakter')
    })

    it('should trim whitespace from inputs', async () => {
      ;(profileRepository.updateProfile as any).mockResolvedValue(mockUser)

      await profileService.updateProfile('user-123', {
        name: '  Test User  ',
        address: '  Test Address  ',
      })

      expect(profileRepository.updateProfile).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({
          name: 'Test User',
          address: 'Test Address',
        })
      )
    })

    it('should handle empty strings as undefined', async () => {
      ;(profileRepository.updateProfile as any).mockResolvedValue(mockUser)

      await profileService.updateProfile('user-123', {
        phone: '',
        address: '',
        bio: '',
      })

      expect(profileRepository.updateProfile).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({
          phone: undefined,
          address: undefined,
          bio: undefined,
        })
      )
    })

    it('should handle update errors', async () => {
      ;(profileRepository.updateProfile as any).mockRejectedValue(new Error('DB Error'))

      const result = await profileService.updateProfile('user-123', updateData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Gagal mengupdate')
    })
  })

  describe('updateAvatar', () => {
    it('should update avatar successfully', async () => {
      const avatarUrl = 'https://example.com/avatar.jpg'
      ;(profileRepository.updateAvatar as any).mockResolvedValue({
        ...mockUser,
        avatar: avatarUrl,
      })

      const result = await profileService.updateAvatar('user-123', avatarUrl)

      expect(result.success).toBe(true)
      expect(result.data?.avatar).toBe(avatarUrl)
      expect(profileRepository.updateAvatar).toHaveBeenCalledWith('user-123', avatarUrl)
    })

    it('should validate URL format', async () => {
      const result = await profileService.updateAvatar('user-123', 'not-a-url')

      expect(result.success).toBe(false)
      expect(result.error).toContain('URL avatar tidak valid')
    })

    it('should reject empty URL', async () => {
      const result = await profileService.updateAvatar('user-123', '')

      expect(result.success).toBe(false)
      expect(result.error).toContain('URL avatar tidak valid')
    })

    it('should accept http and https URLs', async () => {
      ;(profileRepository.updateAvatar as any).mockResolvedValue(mockUser)

      let result = await profileService.updateAvatar('user-123', 'https://example.com/avatar.jpg')
      expect(result.success).toBe(true)

      result = await profileService.updateAvatar('user-123', 'http://example.com/avatar.jpg')
      expect(result.success).toBe(true)
    })

    it('should handle update errors', async () => {
      ;(profileRepository.updateAvatar as any).mockRejectedValue(new Error('DB Error'))

      const result = await profileService.updateAvatar('user-123', 'https://example.com/avatar.jpg')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Gagal mengupdate')
    })
  })
})
