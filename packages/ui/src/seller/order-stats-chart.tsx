'use client'

import type { SellerStats } from '../types/index.js'

export interface OrderStatsChartProps {
  stats: SellerStats
}

export function OrderStatsChart({ stats }: OrderStatsChartProps): React.JSX.Element {
  const total = stats.completedOrders + stats.pendingOrders + stats.cancelledOrders

  const getPercentage = (value: number): number => {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
  }

  const items = [
    {
      label: 'Selesai',
      value: stats.completedOrders,
      percentage: getPercentage(stats.completedOrders),
      color: 'bg-green-500',
    },
    {
      label: 'Pending',
      value: stats.pendingOrders,
      percentage: getPercentage(stats.pendingOrders),
      color: 'bg-yellow-500',
    },
    {
      label: 'Dibatalkan',
      value: stats.cancelledOrders,
      percentage: getPercentage(stats.cancelledOrders),
      color: 'bg-red-500',
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Status Pesanan</h3>

      {total === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-slate-500 dark:text-slate-400">Belum ada data pesanan</p>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex mb-4">
            {items.map(
              (item) =>
                item.percentage > 0 && (
                  <div
                    key={item.label}
                    className={`${item.color} transition-all duration-300`}
                    style={{ width: `${item.percentage}%` }}
                  />
                )
            )}
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {item.value}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
