'use client'

import { type JSX, type ReactNode } from 'react'

// ============================================================================
// TYPES
// ============================================================================

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  image?: string | null
  store: {
    name: string
  }
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  createdAt: string
  product: Product
}

export interface CheckoutCardProps {
  items: CartItem[]
  /** Custom link component (e.g., Next.js Link) */
  linkComponent?:
    | React.ComponentType<{ href: string; className?: string; children: ReactNode }>
    | undefined
  /** Custom image component (e.g., Next.js Image) */
  imageComponent?:
    | React.ComponentType<{
        src: string
        alt: string
        width: number
        height: number
        className?: string
      }>
    | undefined
  /** Currency format options */
  currencyOptions?:
    | {
        locale?: string
        currency?: string
      }
    | undefined
  /** Format price function */
  formatPrice?: (price: number, options?: { locale?: string; currency?: string }) => string
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Default image component
function DefaultImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}): JSX.Element {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CheckoutCard({
  items,
  imageComponent: ImageComponent,
  currencyOptions = { locale: 'id-ID', currency: 'IDR' },
  formatPrice: customFormatPrice,
}: CheckoutCardProps): JSX.Element {
  const formatPrice = customFormatPrice ?? ((price: number): string => {
    return new Intl.NumberFormat(currencyOptions.locale, {
      style: 'currency',
      currency: currencyOptions.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  })

  // Use provided components or defaults
  const ImageWrapper = ImageComponent ?? DefaultImage
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          Pesanan Anda ({items.length} item)
        </h2>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {items.map(item => {
          const imageSrc: string | null | undefined = item.product.image
          return (
            <div key={item.id} className="px-6 py-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden shrink-0">
                {imageSrc?.trim() ? (
                  <ImageWrapper
                    src={imageSrc}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    📦
                  </div>
                )}
              </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-white truncate">
                {item.product.name}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {item.quantity} x {formatPrice(item.product.price)}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {item.product.store.name}
              </p>
            </div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {formatPrice(item.product.price * item.quantity)}
            </p>
          </div>
          )
        })}
      </div>
    </div>
  )
}