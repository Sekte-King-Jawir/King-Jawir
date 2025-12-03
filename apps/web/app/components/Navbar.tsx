'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar(): React.ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto flex h-12 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="text-lg font-medium text-white"
        >
          cyber
        </Link>

        {/* Search Bar */}
        <div className="hidden md:block flex-1 max-w-xs mx-8">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-1.5 bg-[#2d2d44] rounded text-sm text-white placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-white hover:text-gray-300 transition-colors">Home</Link>
          <Link href="/product" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link>
          <Link href="/product" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link>
          <Link href="/product" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link>
        </nav>

        {/* Right Icons */}
        <div className="hidden md:flex items-center gap-4 ml-6">
          <Link href="/favourites" className="text-gray-400 hover:text-white transition-colors" aria-label="Favorites">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>
          <Link href="/cart" className="text-gray-400 hover:text-white transition-colors" aria-label="Cart">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
          <Link href="/profile" className="text-gray-400 hover:text-white transition-colors" aria-label="Profile">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gray-300 hover:text-white transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-800 bg-[#1a1a2e] md:hidden">
          <div className="px-4 py-4 space-y-3">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 bg-[#2d2d44] rounded text-sm text-white placeholder:text-gray-400 focus:outline-none"
            />
            <nav className="flex flex-col space-y-1">
              <Link href="/" className="px-3 py-2 text-sm text-white" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/product" className="px-3 py-2 text-sm text-gray-400" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link href="/product" className="px-3 py-2 text-sm text-gray-400" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
              <Link href="/product" className="px-3 py-2 text-sm text-gray-400" onClick={() => setIsMenuOpen(false)}>Blog</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
