import { prisma } from '../../lib/db'

export const verificationRepository = {
  async create(data: { userId: string; token: string; type: string; expiresAt: Date }) {
    return prisma.verification.create({ data })
  },

  async findByToken(token: string) {
    return prisma.verification.findUnique({
      where: { token },
      include: { user: true }
    })
  },

  async delete(token: string) {
    return prisma.verification.delete({ where: { token } }).catch(() => null)
  },

  async deleteByUserIdAndType(userId: string, type: string) {
    return prisma.verification.deleteMany({
      where: { userId, type }
    })
  }
}
