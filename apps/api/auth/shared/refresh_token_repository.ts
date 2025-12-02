import { prisma } from '../../lib/db'

export const refreshTokenRepository = {
  async create(data: { token: string; userId: string; expiresAt: Date }) {
    return prisma.refreshToken.create({ data })
  },

  async findByToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } })
  },

  async delete(token: string) {
    return prisma.refreshToken.delete({ where: { token } }).catch(() => null)
  },

  async deleteAllByUserId(userId: string) {
    return prisma.refreshToken.deleteMany({ where: { userId } })
  },
}
