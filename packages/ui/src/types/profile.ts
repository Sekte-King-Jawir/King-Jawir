/**
 * Profile-related types for @repo/ui package
 */

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string | null
  avatar?: string | null
  role: string
  emailVerified: boolean
  createdAt?: string | Date
}

export interface UpdateProfileData {
  name?: string
  phone?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
