'use client'

import { useState, useCallback, useEffect } from 'react'
import styles from './page.module.css'
import { CartItem, CartSummary } from './components'

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101'

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  // Fetch cart items
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch(`${API_BASE_URL}/cart`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          // API returns { items, totalItems, totalPrice }
          setCartItems(data.data?.items || [])
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [])

  const handleUpdateQuantity = useCallback(async (id: string, quantity: number) => {
    setUpdating(true)
    try {
      const res = await fetch(`${API_BASE_URL}/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity }),
      })
      if (res.ok) {
        setCartItems(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)))
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setUpdating(false)
    }
  }, [])

  const handleRemoveItem = useCallback(async (id: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`${API_BASE_URL}/cart/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setCartItems(prev => prev.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
    } finally {
      setUpdating(false)
    }
  }, [])

  const handleCheckout = useCallback(() => {
    // TODO: Implement checkout
    console.log('Checkout clicked')
    alert('Checkout functionality coming soon!')
  }, [])

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
            isLoading={updating}
          />
        </div>
      </div>
    </div>
  )
}
