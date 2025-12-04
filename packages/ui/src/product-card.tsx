'use client'

import { type JSX, type ReactNode } from 'react'

// ============================================================================
// TYPES
// ============================================================================

export interface ProductRatingData {
  rating: number
  totalReviews: number
  isLoading?: boolean
}

export interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  image?: string | null | undefined
  ratingData?: ProductRatingData | undefined
  onAddToCart?: (() => void) | undefined
  onToggleWishlist?: (() => void) | undefined
  isWishlisted?: boolean | undefined
  /** Custom link component (e.g., Next.js Link) */
  linkComponent?: React.ComponentType<{ href: string; className?: string; children: ReactNode }> | undefined
  /** Custom image component (e.g., Next.js Image) */
  imageComponent?: React.ComponentType<{
    src: string
    alt: string
    width: number
    height: number
    className?: string
  }> | undefined
  /** Currency format options */
  currencyOptions?: {
    locale?: string
    currency?: string
  } | undefined
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StarRating({ rating, size = 14 }: { rating: number; size?: number }): JSX.Element {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? '#fbbf24' : 'none'}
          stroke={star <= Math.round(rating) ? '#fbbf24' : '#d1d5db'}
          strokeWidth="2"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function HeartIcon({ filled }: { filled: boolean }): JSX.Element {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function PlaceholderImage(): JSX.Element {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21,15 16,10 5,21" />
      </svg>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

// Default link component
function DefaultLink({ href, className, children }: { href: string; className?: string; children: ReactNode }): JSX.Element {
  return <a href={href} className={className}>{children}</a>
}

export function ProductCard({
  name,
  slug,
  price,
  image,
  ratingData,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  linkComponent: LinkComponent,
  imageComponent: ImageComponent,
  currencyOptions = { locale: 'en-US', currency: 'USD' },
}: ProductCardProps): JSX.Element {
  const formatPrice = (value: number): string => {
    return new Intl.NumberFormat(currencyOptions.locale, {
      style: 'currency',
      currency: currencyOptions.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const productUrl = `/products/${slug}`

  // Use provided link component or default
  const LinkWrapper = LinkComponent ?? DefaultLink

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        {/* Wishlist Button */}
        <button
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 cursor-pointer flex items-center justify-center z-10 transition-all duration-200 hover:border-gray-900 dark:hover:border-gray-300 ${
            isWishlisted ? 'text-red-500 border-red-500' : 'text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          onClick={e => {
            e.preventDefault()
            onToggleWishlist?.()
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <HeartIcon filled={isWishlisted} />
        </button>

        {/* Product Image */}
        <LinkWrapper href={productUrl} className="flex items-center justify-center w-full h-full p-5">
          {image !== null && image !== undefined && image !== '' ? (
            ImageComponent !== null && ImageComponent !== undefined ? (
              <ImageComponent
                src={image}
                alt={name}
                width={200}
                height={200}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <img
                src={image}
                alt={name}
                className="max-w-full max-h-full object-contain"
              />
            )
          ) : (
            <PlaceholderImage />
          )}
        </LinkWrapper>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-2">
        {/* Product Name */}
        <LinkWrapper href={productUrl} className="no-underline text-inherit">
          <h3 className="text-sm font-normal text-gray-700 dark:text-gray-200 leading-snug m-0 line-clamp-2 min-h-10 hover:text-gray-900 dark:hover:text-white transition-colors">
            {name}
          </h3>
        </LinkWrapper>

        {/* Rating Section */}
        {ratingData !== null && ratingData !== undefined ? (
          <div className="flex items-center gap-1.5 min-h-5">
            {ratingData.isLoading === true ? (
              <span className="text-xs text-gray-400 animate-pulse">Loading...</span>
            ) : (
              <>
                <StarRating rating={ratingData.rating} />
                <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200">
                  {ratingData.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({ratingData.totalReviews})
                </span>
              </>
            )}
          </div>
        ) : null}

        {/* Price */}
        <p className="text-lg font-semibold text-gray-900 dark:text-white my-1">
          {formatPrice(price)}
        </p>

        {/* Buy Button */}
        <button
          className="w-full py-3 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-none rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 mt-2 hover:bg-gray-700 dark:hover:bg-gray-200"
          onClick={e => {
            e.preventDefault()
            onAddToCart?.()
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}
