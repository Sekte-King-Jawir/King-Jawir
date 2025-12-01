import bcrypt from 'bcryptjs'

// Hash password sebelum simpan ke database
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

// Verifikasi password saat login
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}