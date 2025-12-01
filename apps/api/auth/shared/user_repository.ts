import { prisma } from '../../lib/db'

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },

  async findByGoogleId(googleId: string) {
    return prisma.user.findUnique({ where: { googleId } })
  },

  async create(data: { email: string; password: string; name: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        emailVerified: false
      }
    })
  },

  async createWithGoogle(data: { email: string; name: string; googleId: string; avatar?: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        googleId: data.googleId,
        avatar: data.avatar,
        emailVerified: true,
        password: null
      }
    })
  },

  async linkGoogleAccount(userId: string, googleId: string, avatar?: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { 
        googleId,
        avatar,
        emailVerified: true
      }
    })
  },

  async updateEmailVerified(id: string, verified: boolean) {
    return prisma.user.update({
      where: { id },
      data: { emailVerified: verified }
    })
  },

  async updatePassword(id: string, password: string) {
    return prisma.user.update({
      where: { id },
      data: { password }
    })
  }
}
