'use client'

import Image from 'next/image'
import styles from './CartItem.module.css'

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
}: CartItemProps): React.JSX.Element {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleDecrement = (): void => {
    if (quantity > 1) {
      onUpdateQuantity(id, quantity - 1)
    }
  }

  const handleIncrement = (): void => {
    onUpdateQuantity(id, quantity + 1)
  }

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageWrapper}>
        {image !== null ? (
          <Image src={image} alt={name} width={80} height={80} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <svg
              width="32"
              height="32"
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
      </div>

      <div className={styles.details}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.productId}>#{productId}</p>
      </div>

      <div className={styles.quantityControls}>
        <button
          className={styles.quantityButton}
          onClick={handleDecrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className={styles.quantity}>{quantity}</span>
        <button
          className={styles.quantityButton}
          onClick={handleIncrement}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className={styles.price}>{formatPrice(price * quantity)}</div>

      <button className={styles.removeButton} onClick={() => onRemove(id)} aria-label="Remove item">
        ×
      </button>
    </div>
  )
}
