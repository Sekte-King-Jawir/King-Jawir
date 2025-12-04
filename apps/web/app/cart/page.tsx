'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks'
import styles from './page.module.css'
import { CartItem, CartSummary } from './components'

export default function CartPage() {
  const router = useRouter()
  const { items: cartItems, loading, updateQuantity, removeItem, fetchCart } = useCart()

  // Fetch cart on mount
  useEffect(() => {
    void fetchCart()
  }, [fetchCart])

  const handleUpdateQuantity = useCallback(
    async (id: string, quantity: number) => {
      await updateQuantity(id, quantity)
    },
    [updateQuantity]
  )

  const handleRemoveItem = useCallback(
    async (id: string) => {
      await removeItem(id)
    },
    [removeItem]
  )

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      alert('Keranjang masih kosong!')
      return
    }
    router.push('/checkout')
  }, [cartItems.length, router])

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  )
  const estimatedTax = Math.round(subtotal * 0.02) // 2% tax
  const shippingCost = cartItems.length > 0 ? 29 : 0

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading cart...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.cartSection}>
          <h1 className={styles.title}>Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Your cart is empty</p>
              <a href="/products" className={styles.continueLink}>
                Continue Shopping
              </a>
            </div>
          ) : (
            <div className={styles.cartItems}>
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.product.name}
                  productId={item.product.id}
                  price={Number(item.product.price)}
                  quantity={item.quantity}
                  image={item.product.image}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.summarySection}>
          <CartSummary
            subtotal={subtotal}
            estimatedTax={estimatedTax}
            shippingCost={shippingCost}
            onCheckout={handleCheckout}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  )
}
