import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'King Jawir - Authentication',
  description: 'Login atau Daftar ke King Jawir Marketplace',
}

export default function AuthLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <>{children}</>
}
