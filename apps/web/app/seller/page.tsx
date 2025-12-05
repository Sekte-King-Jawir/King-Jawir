'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SellerPage(): React.JSX.Element {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard
    router.replace('/seller/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-500 dark:text-slate-400">Mengarahkan ke dashboard...</p>
      </div>
    </div>
  )
}
