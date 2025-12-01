import { prisma } from '../lib/db'

export const categoryRepository = {
  async findAll() {
    return prisma.category.findMany({
      include: {
        _count: { select: { products: true } }
      },
      orderBy: { name: 'asc' }
    })
  },

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } }
      }
    })
  },

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true } }
      }
    })
  },

  async create(data: { name: string; slug: string }) {
    return prisma.category.create({ data })
  },

  async update(id: string, data: { name?: string; slug?: string }) {
    return prisma.category.update({
      where: { id },
      data
    })
  },

  async delete(id: string) {
    return prisma.category.delete({ where: { id } })
  },

  async slugExists(slug: string, excludeId?: string) {
    const category = await prisma.category.findUnique({ where: { slug } })
    if (!category) return false
    if (excludeId && category.id === excludeId) return false
    return true
  },

  async nameExists(name: string, excludeId?: string) {
    const category = await prisma.category.findUnique({ where: { name } })
    if (!category) return false
    if (excludeId && category.id === excludeId) return false
    return true
  }
}
