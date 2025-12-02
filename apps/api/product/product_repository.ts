import { prisma } from '../lib/db'

export interface ProductFilter {
  categoryId?: string
  storeId?: string
  search?: string
  minPrice?: number
  maxPrice?: number
}

export interface CreateProductData {
  storeId: string
  categoryId: string
  name: string
  slug: string
  price: number
  stock: number
  image?: string
}

export const productRepository = {
  async findAll(filter?: ProductFilter, page = 1, limit = 20) {
    const where: any = {}

    if (filter?.categoryId) where.categoryId = filter.categoryId
    if (filter?.storeId) where.storeId = filter.storeId
    if (filter?.search) {
      where.name = { contains: filter.search }
    }
    if (filter?.minPrice || filter?.maxPrice) {
      where.price = {}
      if (filter.minPrice) where.price.gte = filter.minPrice
      if (filter.maxPrice) where.price.lte = filter.maxPrice
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          store: { select: { id: true, name: true, slug: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return { products, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            userId: true,
          },
        },
        _count: { select: { reviews: true } },
      },
    })
  },

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        _count: { select: { reviews: true } },
      },
    })
  },

  async findByStoreId(storeId: string, page = 1, limit = 20) {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { storeId },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where: { storeId } }),
    ])

    return { products, total, page, limit, totalPages: Math.ceil(total / limit) }
  },

  async create(data: CreateProductData) {
    return prisma.product.create({
      data: {
        storeId: data.storeId,
        categoryId: data.categoryId,
        name: data.name,
        slug: data.slug,
        price: data.price,
        stock: data.stock,
        image: data.image,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    })
  },

  async update(id: string, data: Partial<Omit<CreateProductData, 'storeId'>>) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    })
  },

  async delete(id: string) {
    return prisma.product.delete({ where: { id } })
  },

  async slugExists(slug: string, excludeId?: string) {
    const product = await prisma.product.findUnique({ where: { slug } })
    if (!product) return false
    if (excludeId && product.id === excludeId) return false
    return true
  },
}
