'use client'

import { useState } from 'react'
import styles from './CartSummary.module.css'

interface CartSummaryProps {
  subtotal: number
  estimatedTax?: number
  shippingCost?: number
  onCheckout: () => void
  isLoading?: boolean
}

export function CartSummary({
  subtotal,
  estimatedTax = 0,
  shippingCost = 0,
  onCheckout,
  isLoading = false,
}: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState('')
  const [cardNumber, setCardNumber] = useState('')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const total = subtotal + estimatedTax + shippingCost

  const handleApplyCard = () => {
    // TODO: Implement bonus card logic
    console.log('Apply card:', cardNumber)
  }

  return (
    <div className={styles.summary}>
      <h2 className={styles.title}>Order Summary</h2>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Discount code / Promo code</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Your bonus card number</label>
        <div className={styles.inputWithButton}>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <button
            className={styles.applyButton}
            onClick={handleApplyCard}
            disabled={!cardNumber}
          >
            Apply
          </button>
        </div>
      </div>

      <div className={styles.breakdown}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Subtotal</span>
          <span className={styles.rowValue}>{formatPrice(subtotal)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Estimated Tax</span>
          <span className={styles.rowValue}>{formatPrice(estimatedTax)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Estimated shipping & Handling</span>
          <span className={styles.rowValue}>{formatPrice(shippingCost)}</span>
        </div>
      </div>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>{formatPrice(total)}</span>
      </div>

      <button
        className={styles.checkoutButton}
        onClick={onCheckout}
        disabled={isLoading || subtotal === 0}
      >
        {isLoading ? 'Processing...' : 'Checkout'}
      </button>
    </div>
  )
}
