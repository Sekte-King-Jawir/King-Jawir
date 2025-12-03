'use client'

import Image from 'next/image'
import Link from 'next/link'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  image?: string | null | undefined
  onAddToCart?: () => void
  onToggleWishlist?: () => void
  isWishlisted?: boolean
}

export function ProductCard({
  name,
  slug,
  price,
  image,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <button
          className={`${styles.wishlistButton} ${isWishlisted ? styles.wishlisted : ''}`}
          onClick={e => {
            e.preventDefault()
            onToggleWishlist?.()
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        <Link href={`/products/${slug}`} className={styles.imageLink}>
          {image ? (
            <Image src={image} alt={name} width={200} height={200} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ccc"
                strokeWidth="1"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
            </div>
          )}
        </Link>
      </div>

      <div className={styles.content}>
        <Link href={`/products/${slug}`} className={styles.nameLink}>
          <h3 className={styles.name}>{name}</h3>
        </Link>

        <p className={styles.price}>{formatPrice(price)}</p>

        <button
          className={styles.buyButton}
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
