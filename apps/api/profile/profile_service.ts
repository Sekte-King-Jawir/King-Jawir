import { profileRepository, type UpdateProfileData } from './profile_repository'

export const profileService = {
  async getProfile(userId: string) {
    const user = await profileRepository.findById(userId)
    
    if (!user) {
      return { success: false, error: 'User tidak ditemukan' }
    }

    return { success: true, data: user }
  },

  async updateProfile(userId: string, data: UpdateProfileData) {
    // Validate name if provided
    if (data.name !== undefined && data.name.trim().length < 2) {
      return { success: false, error: 'Nama minimal 2 karakter' }
    }

    // Validate phone if provided (Indonesian format)
    if (data.phone !== undefined && data.phone.trim() !== '') {
      const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
      if (!phoneRegex.test(data.phone.replace(/\s|-/g, ''))) {
        return { success: false, error: 'Format nomor HP tidak valid' }
      }
    }

    // Validate bio length
    if (data.bio !== undefined && data.bio.length > 500) {
      return { success: false, error: 'Bio maksimal 500 karakter' }
    }

    // Clean up the data
    const cleanData: UpdateProfileData = {}
    if (data.name) cleanData.name = data.name.trim()
    if (data.phone !== undefined) cleanData.phone = data.phone.trim() || undefined
    if (data.address !== undefined) cleanData.address = data.address.trim() || undefined
    if (data.bio !== undefined) cleanData.bio = data.bio.trim() || undefined

    try {
      const updated = await profileRepository.updateProfile(userId, cleanData)
      return { success: true, data: updated }
    } catch (error) {
      return { success: false, error: 'Gagal mengupdate profile' }
    }
  },

  async updateAvatar(userId: string, avatarUrl: string) {
    // Validate URL format
    if (!avatarUrl || !avatarUrl.startsWith('http')) {
      return { success: false, error: 'URL avatar tidak valid' }
    }

    try {
      const updated = await profileRepository.updateAvatar(userId, avatarUrl)
      return { success: true, data: updated }
    } catch (error) {
      return { success: false, error: 'Gagal mengupdate avatar' }
    }
  }
}
