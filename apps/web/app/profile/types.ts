export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  bio: string | null
  avatar: string | null
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN'
  emailVerified: boolean
  createdAt: string
}

export interface UpdateProfileData {
  name?: string | undefined
  phone?: string | undefined
  address?: string | undefined
  bio?: string | undefined
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
