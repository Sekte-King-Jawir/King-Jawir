'use client'

import Image from 'next/image'
import type { Address } from '../page'
import styles from './ConfirmationStep.module.css'

interface CartItemData {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    stock: number
    image: string | null
    store: {
      id: string
      name: string
      slug: string
    }
  }
}

interface ConfirmationStepProps {
  cartItems: CartItemData[]
  selectedAddress?: Address
  selectedPaymentMethod: string
  subtotal: number
  estimatedTax: number
  shippingCost: number
  total: number
  onBack: () => void
  onPlaceOrder: () => void
}

const paymentMethodLabels: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  e_wallet: 'E-Wallet',
  credit_card: 'Credit Card',
  cod: 'Cash on Delivery',
}

export function ConfirmationStep({
  cartItems,
  selectedAddress,
  selectedPaymentMethod,
  subtotal,
  estimatedTax,
  shippingCost,
  total,
  onBack,
  onPlaceOrder,
}: ConfirmationStepProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Order Confirmation</h2>
      <p className={styles.subtitle}>Please review your order before placing it</p>

      {/* Shipping Address */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Shipping Address</h3>
        {selectedAddress ? (
          <div className={styles.addressCard}>
            <div className={styles.addressHeader}>
              <span className={styles.addressLabel}>{selectedAddress.label}</span>
            </div>
            <p className={styles.recipientName}>{selectedAddress.recipientName}</p>
            <p className={styles.addressText}>{selectedAddress.address}</p>
            <p className={styles.addressText}>
              {selectedAddress.city}, {selectedAddress.postalCode}
            </p>
            <p className={styles.phone}>{selectedAddress.phone}</p>
          </div>
        ) : (
          <p className={styles.noData}>No address selected</p>
        )}
      </div>

      {/* Payment Method */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Payment Method</h3>
        <div className={styles.paymentCard}>
          <span className={styles.paymentMethod}>
            {paymentMethodLabels[selectedPaymentMethod] || 'Not selected'}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Order Items</h3>
        <div className={styles.itemsList}>
          {cartItems.map(item => (
            <div key={item.id} className={styles.orderItem}>
              <div className={styles.itemImage}>
                {item.product.image ? (
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <svg
                      width="24"
                      height="24"
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
              <div className={styles.itemDetails}>
                <h4 className={styles.itemName}>{item.product.name}</h4>
                <p className={styles.itemStore}>{item.product.store.name}</p>
                <p className={styles.itemQuantity}>Qty: {item.quantity}</p>
              </div>
              <div className={styles.itemPrice}>
                ${(Number(item.product.price) * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Order Total</h3>
        <div className={styles.totalCard}>
          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Tax</span>
            <span>${estimatedTax.toLocaleString()}</span>
          </div>
          <div className={styles.totalRow}>
            <span>Shipping</span>
            <span>${shippingCost.toLocaleString()}</span>
          </div>
          <div className={styles.totalDivider} />
          <div className={styles.grandTotal}>
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className={styles.navigation}>
        <button className={styles.backButton} onClick={onBack}>
          Back
        </button>
        <button className={styles.placeOrderButton} onClick={onPlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  )
}
