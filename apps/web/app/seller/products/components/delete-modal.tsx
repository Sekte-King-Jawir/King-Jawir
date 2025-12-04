'use client'

interface DeleteModalProps {
  productName: string
  onConfirm: () => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function DeleteModal({
  productName,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteModalProps): React.JSX.Element {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Hapus Produk?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Anda yakin ingin menghapus produk{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{productName}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={() => void onConfirm()}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
