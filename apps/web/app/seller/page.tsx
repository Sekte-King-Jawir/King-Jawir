'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSellerAuth } from '@/hooks'

export default function SellerPage(): React.JSX.Element {
  const router = useRouter()
  const { user, isLoading } = useSellerAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user === null) {
        // Not logged in - redirect to seller login
        router.replace('/seller/auth/login?redirect=/seller/dashboard')
      } else {
        // Logged in - redirect to dashboard
        router.replace('/seller/dashboard')
      }
    }
  }, [router, user, isLoading])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-500 dark:text-slate-400">Mengarahkan...</p>
      </div>
    </div>
  )
}
