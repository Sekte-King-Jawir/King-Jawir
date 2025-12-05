import { userRepository } from '../../../auth/shared/user_repository'
import { storeRepository } from '../../../store/store_repository'
import { successResponse, errorResponse, ErrorCode } from '../../../lib/response'

export const sellerMeService = {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId)
    if (!user) {
      return errorResponse('User tidak ditemukan', ErrorCode.NOT_FOUND)
    }

    // Validasi role
    if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
      return errorResponse('Akses ditolak', ErrorCode.FORBIDDEN)
    }

    // Get store data jika ada
    const store = await storeRepository.findByUserId(userId)

    return successResponse('Berhasil mengambil data seller', {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      store: store
        ? {
            id: store.id,
            name: store.name,
            slug: store.slug,
            description: store.description,
            logo: store.logo,
            createdAt: store.createdAt.toISOString(),
          }
        : null,
    })
  },
}
