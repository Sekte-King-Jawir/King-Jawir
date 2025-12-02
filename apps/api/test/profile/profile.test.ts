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

    // Note: Validation is now handled by TypeBox at route level
    // Service tests focus on business logic, not validation

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

    // Note: URL validation is now handled by TypeBox at route level

    it('should handle update errors', async () => {
      ;(profileRepository.updateAvatar as any).mockRejectedValue(new Error('DB Error'))

      const result = await profileService.updateAvatar('user-123', 'https://example.com/avatar.jpg')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Gagal mengupdate')
    })
  })
})

// Integration tests for TypeBox validation at route level
// NOTE: These tests require the server to be running on localhost:4101
// These are skipped by default - run with server running to test validation
describe.skip('Profile Route Validation (TypeBox)', () => {
  const BASE_URL = 'http://localhost:4101'
  let accessToken: string

  // Helper to login and get token
  async function login() {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@marketplace.com',
        password: 'customer123',
      }),
    })
    const data = (await res.json()) as { data?: { accessToken?: string } }
    return data.data?.accessToken
  }

  it('should reject invalid phone format', async () => {
    accessToken = await login()
    if (!accessToken) return // Skip if login fails

    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ phone: 'invalid-phone' }),
    })

    expect(res.status).toBe(422) // TypeBox validation error
  })

  it('should accept valid Indonesian phone', async () => {
    accessToken = await login()
    if (!accessToken) return

    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ phone: '081234567890' }),
    })

    expect(res.status).toBe(200)
  })

  it('should reject bio over 500 chars', async () => {
    accessToken = await login()
    if (!accessToken) return

    const res = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ bio: 'x'.repeat(501) }),
    })

    expect(res.status).toBe(422)
  })

  it('should reject invalid avatar URL', async () => {
    accessToken = await login()
    if (!accessToken) return

    const res = await fetch(`${BASE_URL}/profile/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ avatarUrl: 'not-a-url' }),
    })

    expect(res.status).toBe(422)
  })

  it('should accept valid avatar URL', async () => {
    accessToken = await login()
    if (!accessToken) return

    const res = await fetch(`${BASE_URL}/profile/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ avatarUrl: 'https://example.com/avatar.jpg' }),
    })

    expect(res.status).toBe(200)
  })
})
