import { prisma } from '../lib/db'

export const storeRepository = {
  async findByUserId(userId: string) {
    return prisma.store.findUnique({
      where: { userId },
      include: {
        _count: { select: { products: true } }
      }
    })
  },

  async findById(id: string) {
    return prisma.store.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        _count: { select: { products: true } }
      }
    })
  },

  async findBySlug(slug: string) {
    return prisma.store.findUnique({
      where: { slug },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        _count: { select: { products: true } }
      }
    })
  },

  async create(data: { userId: string; name: string; slug: string }) {
    return prisma.store.create({
      data: {
        userId: data.userId,
        name: data.name,
        slug: data.slug
      }
    })
  },

  async update(id: string, data: { name?: string; slug?: string }) {
    return prisma.store.update({
      where: { id },
      data
    })
  },

  async slugExists(slug: string, excludeId?: string) {
    const store = await prisma.store.findUnique({ where: { slug } })
    if (!store) return false
    if (excludeId && store.id === excludeId) return false
    return true
  }
}
