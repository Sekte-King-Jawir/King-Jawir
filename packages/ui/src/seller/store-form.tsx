'use client'

import { useState } from 'react'
import type { CreateStoreData, UpdateStoreData, SellerStore } from '../types/index.js'

export interface StoreFormProps {
  store?: SellerStore | null
  onSubmit: (data: CreateStoreData | UpdateStoreData) => Promise<void>
  onCancel?: () => void
  isLoading: boolean
}

export function StoreForm({
  store,
  onSubmit,
  onCancel,
  isLoading,
}: StoreFormProps): React.JSX.Element {
  const isEdit = store !== null && store !== undefined

  const [name, setName] = useState(store?.name ?? '')
  const [slug, setSlug] = useState(store?.slug ?? '')
  const [description, setDescription] = useState(store?.description ?? '')
  const [logo, setLogo] = useState(store?.logo ?? '')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')

    if (name.trim() === '') {
      setError('Nama toko wajib diisi')
      return
    }

    try {
      const data: CreateStoreData | UpdateStoreData = {
        name: name.trim(),
        ...(slug.trim() !== '' ? { slug: slug.trim() } : {}),
        ...(description.trim() !== '' ? { description: description.trim() } : {}),
        ...(logo.trim() !== '' ? { logo: logo.trim() } : {}),
      }

      await onSubmit(data)
    } catch {
      setError('Gagal menyimpan toko')
    }
  }

  const generateSlug = (): void => {
    const newSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setSlug(newSlug)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {isEdit ? 'Edit Toko' : 'Buat Toko Baru'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isEdit
            ? 'Perbarui informasi toko Anda'
            : 'Isi informasi toko untuk mulai berjualan. Role Anda akan diupgrade menjadi SELLER.'}
        </p>
      </div>

      <form onSubmit={e => void handleSubmit(e)} className="p-6 space-y-6">
        {error !== '' ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        ) : null}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Nama Toko <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Contoh: Toko Elektronik Jaya"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            URL Toko (Slug)
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center">
              <span className="px-4 py-3 bg-slate-100 dark:bg-slate-600 border border-r-0 border-slate-200 dark:border-slate-600 rounded-l-xl text-slate-500 dark:text-slate-400 text-sm">
                /stores/
              </span>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="toko-elektronik-jaya"
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-r-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={generateSlug}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Biarkan kosong untuk generate otomatis dari nama toko
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Deskripsi Toko
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Ceritakan tentang toko Anda..."
            rows={4}
            maxLength={2000}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
            {description.length}/2000
          </p>
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Logo URL
          </label>
          <input
            type="url"
            value={logo}
            onChange={e => setLogo(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Masukkan URL gambar logo toko Anda
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          {onCancel !== undefined ? (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Batal
            </button>
          ) : null}
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Menyimpan...
              </>
            ) : (
              <>
                <span>{isEdit ? '💾' : '🚀'}</span>
                {isEdit ? 'Simpan Perubahan' : 'Buat Toko'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
