import { prisma } from '../lib/db'

export interface UpdateProfileData {
  name?: string
  phone?: string
  address?: string
  bio?: string
  avatar?: string
}

export const profileRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        bio: true,
        avatar: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })
  },

  async updateProfile(id: string, data: UpdateProfileData) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        bio: true,
        avatar: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })
  },

  async updateAvatar(id: string, avatarUrl: string) {
    return prisma.user.update({
      where: { id },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        avatar: true,
      },
    })
  },
}
