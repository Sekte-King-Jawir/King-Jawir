'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSellerAuth, type SellerRegisterData } from '@/hooks'

export default function SellerRegisterPage(): React.JSX.Element {
  const router = useRouter()
  const { register, user, isLoading, error, success, clearMessages } = useSellerAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    storeName: '',
    storeDescription: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user !== null) {
      router.push('/seller/dashboard')
    }
  }, [isLoading, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setValidationError('')
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    clearMessages()
    setValidationError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Password dan konfirmasi password tidak sama')
      return
    }

    if (formData.password.length < 6) {
      setValidationError('Password minimal 6 karakter')
      return
    }

    if (formData.name.length < 2) {
      setValidationError('Nama minimal 2 karakter')
      return
    }

    if (formData.storeName.length < 2) {
      setValidationError('Nama toko minimal 2 karakter')
      return
    }

    setIsSubmitting(true)
    const registerPayload: SellerRegisterData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      storeName: formData.storeName,
      ...(formData.storeDescription !== '' && { storeDescription: formData.storeDescription }),
    }
    
    const success = await register(registerPayload)
    setIsSubmitting(false)

    if (success) {
      // Wait a bit to show success message
      setTimeout(() => {
        router.push('/seller/dashboard')
      }, 1500)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">King Jawir</h1>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Daftar Sebagai Seller
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Mulai jualan produk Anda sekarang!
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          {(error !== '' || validationError !== '') && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">
                {validationError || error}
              </p>
            </div>
          )}

          {success !== '' && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Info Section */}
            <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Informasi Akun
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seller@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Minimal 6 karakter"
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Konfirmasi Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ketik ulang password"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Store Info Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Informasi Toko
              </h3>

              <div className="space-y-4">
                {/* Store Name */}
                <div>
                  <label
                    htmlFor="storeName"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Nama Toko
                  </label>
                  <input
                    type="text"
                    id="storeName"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Toko Elektronik Jaya"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Store Description */}
                <div>
                  <label
                    htmlFor="storeDescription"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Deskripsi Toko (Optional)
                  </label>
                  <textarea
                    id="storeDescription"
                    name="storeDescription"
                    value={formData.storeDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Menjual berbagai produk elektronik berkualitas..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Mendaftar...
                </span>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sudah punya akun seller?{' '}
              <Link
                href="/seller/auth/login"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Login di sini
              </Link>
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ingin belanja?{' '}
              <Link
                href="/auth/register"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Daftar sebagai customer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
