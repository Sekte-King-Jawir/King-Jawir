'use client'

import styles from './ProductGrid.module.css'
import { ProductCard } from './ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image?: string | null
}

interface ProductGridProps {
  products: Product[]
  onAddToCart?: (productId: string) => void
  onToggleWishlist?: (productId: string) => void
  wishlistedIds?: string[]
}

export function ProductGrid({
  products,
  onAddToCart,
  onToggleWishlist,
  wishlistedIds = [],
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No products found</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.slug}
          price={Number(product.price)}
          image={product.image}
          onAddToCart={() => onAddToCart?.(product.id)}
          onToggleWishlist={() => onToggleWishlist?.(product.id)}
          isWishlisted={wishlistedIds.includes(product.id)}
        />
      ))}
    </div>
  )
}
