'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSellerAuth } from '@/hooks/useSellerAuth'
import { AIDescriptionGenerator } from '@/components/seller/AIDescriptionGenerator'
import { Card } from '@repo/ui/card'

export default function SellerAIToolsPage() {
  const router = useRouter()
  const { user, isLoading, isSeller } = useSellerAuth()

  // Redirect if not logged in or not seller
  useEffect(() => {
    if (!isLoading) {
      if (user === null) {
        router.push('/seller/auth/login?redirect=/seller/ai-tools')
      } else if (!isSeller) {
        router.push('/seller/dashboard')
      }
    }
  }, [isLoading, user, isSeller, router])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4" />
            <div className="h-64 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    )
  }

  // Not logged in or not seller
  if (user === null || !isSeller) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🤖 AI Tools for Sellers</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gunakan AI untuk membantu membuat deskripsi produk yang menarik dan
            SEO-friendly
          </p>
        </div>

        {/* Features Overview Card */}
        <Card className="p-6 mb-6 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-blue-200">
          <h2 className="text-xl font-semibold mb-4">
            ✨ Fitur AI yang Tersedia
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <h3 className="font-medium">Generate Description</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Buat deskripsi produk dari nol dengan AI. Cukup input nama,
                  kategori, dan spesifikasi.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <h3 className="font-medium">Improve Description</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Perbaiki deskripsi yang sudah ada agar lebih jelas, menarik,
                  atau SEO-friendly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="font-medium">Target Market</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Sesuaikan tone deskripsi: Premium, Budget, atau General sesuai
                  target pasar.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <h3 className="font-medium">SEO Keywords</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Otomatis generate keyword yang relevan untuk meningkatkan
                  visibility.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* AI Generator Component */}
        <AIDescriptionGenerator
          mode="generate"
          onDescriptionGenerated={() => {
            // Description generated successfully
          }}
        />

        {/* Usage Guide */}
        <Card className="p-6 mt-6">
          <h3 className="font-semibold mb-3">📚 Cara Menggunakan</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>
              <strong>Generate Mode:</strong> Isi nama produk, kategori (opsional),
              spesifikasi (opsional), pilih target market, lalu klik &quot;Generate
              Description&quot;
            </li>
            <li>
              <strong>Improve Mode:</strong> Paste deskripsi yang ingin
              diperbaiki, pilih fokus perbaikan (Clarity, SEO, Persuasive, atau
              Concise), lalu klik &quot;Improve Description&quot;
            </li>
            <li>
              AI akan menghasilkan: Short Description, Long Description, Key
              Features, dan SEO Keywords
            </li>
            <li>
              Copy hasil yang diinginkan dan paste ke form produk Anda
            </li>
            <li>
              Klik &quot;💡 Tips Copywriting&quot; untuk melihat panduan menulis deskripsi
              yang baik
            </li>
          </ol>
        </Card>

        {/* Best Practices */}
        <Card className="p-6 mt-6 bg-yellow-50 dark:bg-yellow-900 border-yellow-200">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>💡</span> Best Practices
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>
              Berikan informasi spesifikasi yang detail untuk hasil yang lebih
              akurat
            </li>
            <li>
              Sesuaikan target market dengan customer Anda (Premium untuk produk
              high-end, Budget untuk produk ekonomis)
            </li>
            <li>
              Jangan ragu untuk generate ulang jika hasil pertama kurang sesuai
            </li>
            <li>
              Edit hasil AI sesuai kebutuhan - AI adalah asisten, bukan
              pengganti kreativitas Anda
            </li>
            <li>
              Gunakan SEO keywords yang di-generate untuk meningkatkan
              searchability produk
            </li>
          </ul>
        </Card>

        {/* Back to Products */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/seller/products')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Kembali ke Products
          </button>
        </div>
      </div>
    </div>
  )
}
