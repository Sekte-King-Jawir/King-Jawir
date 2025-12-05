 'use client'

import Image from 'next/image'

interface CartItemProps {
  id: string
  name: string
  productId: string
  price: number
  quantity: number
  image?: string | null
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({
  id,
  name,
  productId,
  price,
  quantity,
  image,
  onUpdateQuantity,
  onRemove,
}: CartItemProps): JSX.Element {
  const formatPrice = (priceValue: number): string =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
      priceValue
    )

  const handleDecrement = (): void => {
    if (quantity > 1) onUpdateQuantity(id, quantity - 1)
  }

  const handleIncrement = (): void => onUpdateQuantity(id, quantity + 1)

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
        {image ? (
          <Image src={image} alt={name} width={80} height={80} className="w-full h-full object-cover" />
        ) : (
          <div className="text-2xl">📦</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-900 dark:text-white truncate">{name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">#{productId}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded disabled:opacity-50"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded" onClick={handleIncrement} aria-label="Increase quantity">
          +
        </button>
      </div>

      <div className="w-24 text-right font-semibold text-slate-900 dark:text-white">
        {formatPrice(price * quantity)}
      </div>

      <button className="ml-2 text-red-600" onClick={() => onRemove(id)} aria-label="Remove item">
        ×
      </button>
    </div>
  )
}

export type { CartItemProps }
