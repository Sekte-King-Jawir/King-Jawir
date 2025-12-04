'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks'
import { formatPrice } from '@/lib/utils'
import styles from './CartSummary.module.css'

interface CartSummaryProps {
  totalAmount: number
  isSubmitting: boolean
  onCheckout: () => Promise<void>
  formatPrice?: (price: number) => string
}

export function CartSummary({
  totalAmount,
  isSubmitting,
  onCheckout,
  formatPrice: propFormatPrice,
}: CartSummaryProps): React.JSX.Element {
  const [_isGuestCheckout, _setIsGuestCheckout] = useState(false)
  const { _user } = useAuth()
  const _router = useRouter()

  const handleCheckout = async (): Promise<void> => {
    try {
      await onCheckout()
    } catch (error) {
      console.error('Checkout failed:', error)
    }
  }

  const localFormatPrice = (price: number): string => {
    return propFormatPrice
      ? propFormatPrice(price)
      : new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(price)
  }

  return (
    <div className={styles.summaryCard}>
      <h2 className={styles.title}>Ringkasan Pesanan</h2>

      <div className={styles.summaryItems}>
        <div className={styles.summaryRow}>
          <span className={styles.label}>Subtotal:</span>
          <span className={styles.value}>{localFormatPrice(totalAmount)}</span>
        </div>

        <div className={styles.summaryRow}>
          <span className={styles.label}>Ongkir:</span>
          <span className={styles.value}>Gratis</span>
        </div>

        <div className={styles.summaryRow}>
          <span className={styles.label}>Total:</span>
          <span className={styles.total}>{localFormatPrice(totalAmount)}</span>
        </div>
      </div>

      <button
        className={`${styles.checkoutButton} ${isSubmitting ? styles.disabled : ''}`}
        onClick={() => void handleCheckout()}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
      </button>
    </div>
  )
}
