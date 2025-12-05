'use client'

import { useState } from 'react'
import type { ChangePasswordData } from '../types/profile.js'

export interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordData) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function ChangePasswordForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: ChangePasswordFormProps): React.JSX.Element {
  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const togglePassword = (field: 'current' | 'new' | 'confirm'): void => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })
  }

  return (
    <form onSubmit={e => void handleSubmit(e)} className="space-y-4">
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Password Saat Ini
        </label>
        <div className="relative">
          <input
            id="currentPassword"
            type={showPasswords.current ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
            required
          />
          <button
            type="button"
            onClick={() => togglePassword('current')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPasswords.current ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Password Baru
        </label>
        <div className="relative">
          <input
            id="newPassword"
            type={showPasswords.new ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => togglePassword('new')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPasswords.new ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Konfirmasi Password Baru
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showPasswords.confirm ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-10"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => togglePassword('confirm')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPasswords.confirm ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
        >
          {isSubmitting ? 'Menyimpan...' : 'Ubah Password'}
        </button>
      </div>
    </form>
  )
}
