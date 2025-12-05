'use client'

import { useState } from 'react'
import type { UserProfile, UpdateProfileData } from '../types/profile.js'

export interface ProfileFormProps {
  profile: UserProfile
  onSubmit: (data: UpdateProfileData) => Promise<void>
  isSubmitting: boolean
}

export function ProfileForm({
  profile,
  onSubmit,
  isSubmitting,
}: ProfileFormProps): React.JSX.Element {
  const [formData, setFormData] = useState({
    name: profile.name,
    phone: profile.phone ?? '',
  })

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Informasi Pribadi</h2>
      <form onSubmit={e => void handleSubmit(e)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Nomor Telepon
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder="08xxxxxxxxxx"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Format: 08xxxxxxxxxx (opsional)
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⏳</span>
              Menyimpan...
            </>
          ) : (
            'Simpan Perubahan'
          )}
        </button>
      </form>
    </div>
  )
}
