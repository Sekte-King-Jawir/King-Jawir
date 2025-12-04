'use client'

import { useState } from 'react'
import type { UserProfile, UpdateProfileData } from '../types'

interface ProfileFormProps {
  profile: UserProfile
  onSubmit: (data: UpdateProfileData) => Promise<void>
  isSubmitting: boolean
}

export function ProfileForm({ profile, onSubmit, isSubmitting }: ProfileFormProps): React.JSX.Element {
  const [formData, setFormData] = useState({
    name: profile.name,
    phone: profile.phone ?? '',
    address: profile.address ?? '',
    bio: profile.bio ?? '',
  })

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    const data: UpdateProfileData = {
      name: formData.name,
    }
    if (formData.phone !== '') {
      data.phone = formData.phone
    }
    if (formData.address !== '') {
      data.address = formData.address
    }
    if (formData.bio !== '') {
      data.bio = formData.bio
    }
    void onSubmit(data)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
    >
      <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
        Informasi Profil
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Nomor Telepon
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="08xxxxxxxxxx"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Alamat
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Alamat lengkap..."
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Ceritakan sedikit tentang dirimu..."
            rows={2}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </form>
  )
}
