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
    // Validasi URL sudah dihandle oleh TypeBox di route level
    try {
      const updated = await profileRepository.updateAvatar(userId, avatarUrl)
      return { success: true, data: updated }
    } catch (error) {
      return { success: false, error: 'Gagal mengupdate avatar' }
    }
  },
}
