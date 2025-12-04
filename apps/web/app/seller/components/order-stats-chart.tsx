'use client'

// Local type to match SellerStats from hooks
interface SellerStatsLocal {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
}

interface OrderStatsChartProps {
  stats: SellerStatsLocal
}

export function OrderStatsChart({ stats }: OrderStatsChartProps): React.JSX.Element {
  const total = stats.completedOrders + stats.pendingOrders + stats.cancelledOrders

  const getPercentage = (value: number): number => {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
  }

  const completedPercent = getPercentage(stats.completedOrders)
  const pendingPercent = getPercentage(stats.pendingOrders)
  const cancelledPercent = getPercentage(stats.cancelledOrders)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Status Pesanan</h3>

      {total === 0 ? (
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-slate-500 dark:text-slate-400">Belum ada data pesanan</p>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="h-4 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex">
            {completedPercent > 0 && (
              <div
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${completedPercent}%` }}
              />
            )}
            {pendingPercent > 0 && (
              <div
                className="bg-yellow-500 transition-all duration-500"
                style={{ width: `${pendingPercent}%` }}
              />
            )}
            {cancelledPercent > 0 && (
              <div
                className="bg-red-500 transition-all duration-500"
                style={{ width: `${cancelledPercent}%` }}
              />
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Selesai</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {stats.completedOrders}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({completedPercent}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {stats.pendingOrders}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({pendingPercent}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Dibatalkan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {stats.cancelledOrders}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({cancelledPercent}%)
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
