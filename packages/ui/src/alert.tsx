'use client'

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  onClose?: () => void
}

export function Alert({ type, title, message, onClose }: AlertProps): React.JSX.Element {
  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: '✕',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/30',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: '⚠',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'ℹ',
    },
  }

  const style = styles[type]

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 ${style.text}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-xl">{style.icon}</span>
          <div>
            {title !== null && title !== undefined && title.length > 0 ? (
              <h4 className="font-semibold mb-1">{title}</h4>
            ) : null}
            <p>{message}</p>
          </div>
        </div>
        {onClose !== null && onClose !== undefined ? (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 ml-4"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  )
}
