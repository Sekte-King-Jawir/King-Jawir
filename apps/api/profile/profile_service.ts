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
    // Validasi sudah dihandle oleh TypeBox di route level
    // Clean up the data - only include defined values with actual content
    const cleanData: UpdateProfileData = {}

    if (data.name) {
      const trimmed = data.name.trim()
      if (trimmed) cleanData.name = trimmed
    }
    if (data.phone !== undefined) {
      const trimmed = data.phone.trim()
      if (trimmed) cleanData.phone = trimmed
    }
    if (data.address !== undefined) {
      const trimmed = data.address.trim()
      if (trimmed) cleanData.address = trimmed
    }
    if (data.bio !== undefined) {
      const trimmed = data.bio.trim()
      if (trimmed) cleanData.bio = trimmed
    }

    try {
      const updated = await profileRepository.updateProfile(userId, cleanData)
      return { success: true, data: updated }
    } catch (error) {
      return { success: false, error: 'Gagal mengupdate profile' }
    }
  },

  async updateAvatar(userId: string, avatarUrl: string) {
    // Validasi URL sudah dihandle oleh TypeBox di route level
    try {
      const updated = await profileRepository.updateAvatar(userId, avatarUrl)
      return { success: true, data: updated }
    } catch (error) {
      return { success: false, error: 'Gagal mengupdate avatar' }
    }
  },
}
