'use client'

import type { UserProfile } from '../types/profile.js'

export interface AvatarSectionProps {
  profile: UserProfile
}

export function AvatarSection({ profile }: AvatarSectionProps): React.JSX.Element {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-2xl">
          {profile.avatar != null && profile.avatar.length > 0 ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>👤</span>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{profile.name}</h2>
          <p className="text-slate-500 dark:text-slate-400">{profile.email}</p>
        </div>
      </div>
    </div>
  )
}
