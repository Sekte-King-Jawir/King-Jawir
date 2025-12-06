import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider, ThemeToggle } from '@repo/ui'
import { NavbarWrapper } from '@/components/NavbarWrapper'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'King Jawir - Price Analysis',
  description: 'Advanced price analysis tool for Indonesian marketplace',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background`}
      >
        <ThemeProvider defaultTheme="system" storageKey="king-jawir-theme">
          <NavbarWrapper />
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  )
}

