'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar(): React.ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount] = useState(3)

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-black/5' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
              KingJawir
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari produk, kategori, atau brand..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-transparent rounded-2xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
              />
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-lg text-xs text-gray-500 font-medium">
                  <span>⌘</span>K
                </kbd>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
            >
              Home
            </Link>
            <Link
              href="/product"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
            >
              Produk
            </Link>
            <Link
              href="/category"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
            >
              Kategori
            </Link>
            <Link
              href="/promo"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 transition-all"
            >
              🔥 Promo
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button - Mobile */}
            <button className="md:hidden p-2.5 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              href="/favourites"
              className="relative p-2.5 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all hidden sm:flex"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-gray-200 mx-2" />

            {/* Profile / Login */}
            <Link
              href="/auth/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden lg:block">Masuk</span>
            </Link>

            <Link
              href="/auth/register"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all"
            >
              Daftar
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Mobile Nav Links */}
            <nav className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 bg-white rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-all"
              >
                <span className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  🏠
                </span>
                <span className="font-medium">Home</span>
              </Link>
              <Link
                href="/product"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 bg-white rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-all"
              >
                <span className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  📦
                </span>
                <span className="font-medium">Produk</span>
              </Link>
              <Link
                href="/category"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 bg-white rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-all"
              >
                <span className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  📂
                </span>
                <span className="font-medium">Kategori</span>
              </Link>
              <Link
                href="/promo"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl text-white transition-all"
              >
                <span className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  🔥
                </span>
                <span className="font-medium">Promo</span>
              </Link>
            </nav>

            {/* Mobile Divider */}
            <div className="h-px bg-gray-200" />

            {/* Mobile Quick Links */}
            <div className="flex gap-2">
              <Link
                href="/favourites"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-white rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Wishlist</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-white rounded-xl text-gray-600 hover:bg-violet-50 hover:text-violet-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-sm font-medium">Profil</span>
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex gap-2 pt-2">
              <Link
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 py-3 text-center text-sm font-semibold text-violet-600 bg-violet-100 rounded-xl hover:bg-violet-200 transition-all"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:shadow-lg transition-all"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
