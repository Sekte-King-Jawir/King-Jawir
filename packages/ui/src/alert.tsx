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
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '✕',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚠',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
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
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-4">
            ×
          </button>
        ) : null}
      </div>
    </div>
  )
}