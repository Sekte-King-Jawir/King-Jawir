import { userRepository } from '../../../auth/shared/user_repository'
import { verificationRepository } from '../../../auth/shared/verification_repository'
import { storeRepository } from '../../../store/store_repository'
import { hashPassword } from '../../../lib/hash'
import { sendVerificationEmail } from '../../../lib/mail'
import { successResponse, errorResponse, ErrorCode } from '../../../lib/response'
import { randomBytes } from 'crypto'

export const sellerRegisterService = {
  async register(email: string, password: string, name: string, storeName: string, storeDescription?: string) {
    // Validasi input
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return errorResponse('Format email tidak valid', ErrorCode.VALIDATION_ERROR)
    }

    if (!name || name.trim().length === 0) {
      return errorResponse('Nama tidak boleh kosong', ErrorCode.VALIDATION_ERROR)
    }

    if (password.length < 8) {
      return errorResponse('Password minimal 8 karakter', ErrorCode.VALIDATION_ERROR)
    }

    if (!storeName || storeName.trim().length === 0) {
      return errorResponse('Nama toko tidak boleh kosong', ErrorCode.VALIDATION_ERROR)
    }

    // Cek email sudah ada
    const exists = await userRepository.findByEmail(email)
    if (exists) {
      return errorResponse('Email sudah terdaftar', ErrorCode.USER_ALREADY_EXISTS)
    }

    // Generate store slug from store name
    const slug = storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Cek store slug sudah ada
    const storeExists = await storeRepository.findBySlug(slug)
    if (storeExists) {
      return errorResponse('Nama toko sudah digunakan, silakan gunakan nama lain', ErrorCode.VALIDATION_ERROR)
    }

    // Hash password & buat user dengan role SELLER
    const hashedPassword = await hashPassword(password)
    const user = await userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: 'SELLER', // Set role sebagai SELLER
    })

    // Guard: user bisa null jika creation gagal
    if (!user) {
      return errorResponse('Gagal membuat akun seller', ErrorCode.BAD_REQUEST)
    }

    // Buat store untuk seller
    const store = await storeRepository.create({
      userId: user.id,
      name: storeName,
      slug,
      ...(storeDescription && { description: storeDescription }),
    })

    if (!store) {
      return errorResponse('Gagal membuat toko', ErrorCode.BAD_REQUEST)
    }

    // Buat token verifikasi
    const token = randomBytes(32).toString('hex')
    await verificationRepository.create({
      userId: user.id,
      token,
      type: 'email',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam
    })

    // Kirim email
    const verifyUrl = `${process.env['APP_URL']}/seller/verify-email?token=${token}`
    await sendVerificationEmail(email, verifyUrl)

    return successResponse('Register seller berhasil. Cek email untuk verifikasi.', {
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
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
        description: store.description,
      },
    })
  },
}
