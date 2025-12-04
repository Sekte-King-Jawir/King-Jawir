'use client'

import Image from 'next/image'
import type { UserProfile } from '../types'

interface AvatarSectionProps {
  profile: UserProfile
}

export function AvatarSection({ profile }: AvatarSectionProps): React.JSX.Element {
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden relative">
          {profile.avatar !== null && profile.avatar !== '' ? (
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              className="object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {profile.name}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {profile.email}
          </p>
        </div>
      </div>
    </div>
  )
}
