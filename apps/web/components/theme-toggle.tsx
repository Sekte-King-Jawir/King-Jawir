'use client'

import { useTheme } from './theme-provider'

export function ThemeToggle(): React.JSX.Element {
  const { theme, setTheme } = useTheme()

  const toggleTheme = (): void => {
    if (theme === 'dark') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('system')
    } else {
      setTheme('dark')
    }
  }

  const getThemeIcon = (): string => {
    switch (theme) {
      case 'dark':
        return '🌙'
      case 'light':
        return '☀️'
      case 'system':
        return '💻'
      default:
        return '💻'
    }
  }

  const getThemeLabel = (): string => {
    switch (theme) {
      case 'dark':
        return 'Dark Mode'
      case 'light':
        return 'Light Mode'
      case 'system':
        return 'System'
      default:
        return 'System'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-300 flex items-center justify-center text-2xl hover:scale-110"
      title={`Current: ${getThemeLabel()}. Click to cycle themes.`}
    >
      <span role="img" aria-label={getThemeLabel()}>
        {getThemeIcon()}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

// Header version for navigation bars
export function HeaderThemeToggle(): React.JSX.Element {
  const { theme, setTheme } = useTheme()

  const toggleTheme = (): void => {
    if (theme === 'dark') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('system')
    } else {
      setTheme('dark')
    }
  }

  const getThemeIcon = (): string => {
    switch (theme) {
      case 'dark':
        return '🌙'
      case 'light':
        return '☀️'
      case 'system':
        return '💻'
      default:
        return '💻'
    }
  }

  const getThemeLabel = (): string => {
    switch (theme) {
      case 'dark':
        return 'Dark Mode'
      case 'light':
        return 'Light Mode'
      case 'system':
        return 'System'
      default:
        return 'System'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center w-10 h-10 rounded-md border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
      title={`Current: ${getThemeLabel()}. Click to cycle themes.`}
    >
      <span role="img" aria-label={getThemeLabel()}>
        {getThemeIcon()}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}