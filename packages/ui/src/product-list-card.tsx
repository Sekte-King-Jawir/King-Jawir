'use client'

import { type JSX, type ReactNode } from 'react'

// ============================================================================
// TYPES
// ============================================================================

export interface ProductListCardRatingData {
  rating: number
  totalReviews: number
  isLoading?: boolean
}

export interface ProductListCardStore {
  name: string
  slug: string
}

export interface ProductListCardProps {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  image?: string | null | undefined
  store: ProductListCardStore
  ratingData?: ProductListCardRatingData | undefined
  onAddToCart?: (() => void) | undefined
  /** Custom link component (e.g., Next.js Link) */
  linkComponent?: React.ComponentType<{
    href: string
    className?: string
    children: ReactNode
  }> | undefined
  /** Custom image component (e.g., Next.js Image) */
  imageComponent?: React.ComponentType<{
    src: string
    alt: string
    fill?: boolean
    className?: string
  }> | undefined
  /** Price formatter function */
  formatPrice?: ((price: number) => string) | undefined
  /** Cart icon component */
  cartIcon?: ReactNode | undefined
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StarIcon({
  filled,
  className,
}: {
  filled: boolean
  className?: string
}): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function StarRating({ rating }: { rating: number }): JSX.Element {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <StarIcon
          key={star}
          filled={star <= Math.round(rating)}
          className={`w-4 h-4 ${
            star <= Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600'
          }`}
        />
      ))}
    </div>
  )
}

function PlaceholderIcon(): JSX.Element {
  return (
    <svg
      className="w-16 h-16 text-slate-300 dark:text-slate-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h5v10a1 1 0 0 1-1 1H6" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function DefaultCartIcon(): JSX.Element {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

// Default link component
function DefaultLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}): JSX.Element {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

// Default price formatter
function defaultFormatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ProductListCard({
  name,
  slug,
  price,
  stock,
  image,
  store,
  ratingData,
  onAddToCart,
  linkComponent: LinkComponent,
  imageComponent: ImageComponent,
  formatPrice = defaultFormatPrice,
  cartIcon,
}: ProductListCardProps): JSX.Element {
  const LinkWrapper = LinkComponent ?? DefaultLink
  const CartIcon = cartIcon ?? <DefaultCartIcon />

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
      <LinkWrapper href={`/products/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
          {image !== null && image !== undefined && image !== '' ? (
            ImageComponent !== null && ImageComponent !== undefined ? (
              <ImageComponent
                src={image}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlaceholderIcon />
            </div>
          )}
          {stock < 10 && stock > 0 ? (
            <div className="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
              Stok terbatas
            </div>
          ) : null}
          {stock === 0 ? (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Stok Habis</span>
            </div>
          ) : null}
        </div>
      </LinkWrapper>

      <div className="p-4">
        <LinkWrapper href={`/products/${slug}`} className="block">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name}
          </h3>
        </LinkWrapper>

        <LinkWrapper
          href={`/stores/${store.slug}`}
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-2 block"
        >
          {store.name}
        </LinkWrapper>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatPrice(price)}
          </span>
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-1 mb-4">
          {ratingData !== null && ratingData !== undefined ? (
            ratingData.isLoading === true ? (
              <span className="text-sm text-slate-400 animate-pulse">Loading...</span>
            ) : (
              <>
                <StarRating rating={ratingData.rating} />
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
                  ({ratingData.rating.toFixed(1)})
                </span>
              </>
            )
          ) : (
            <>
              <StarRating rating={0} />
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">(0.0)</span>
            </>
          )}
        </div>

        <button
          onClick={e => {
            e.preventDefault()
            onAddToCart?.()
          }}
          disabled={stock === 0}
          className="w-full py-2.5 px-4 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
        >
          {CartIcon}
          {stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
        </button>
      </div>
    </div>
  )
}
