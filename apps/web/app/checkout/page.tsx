'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import { CheckoutSteps, AddressStep, PaymentStep, ConfirmationStep } from './components'

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

export interface Address {
  id: string
  label: string
  recipientName: string
  phone: string
  address: string
  city: string
  postalCode: string
  isDefault: boolean
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4101'

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [cartItems, setCartItems] = useState<CartItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Rumah',
      recipientName: 'John Doe',
      phone: '081234567890',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta Selatan',
      postalCode: '12345',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Kantor',
      recipientName: 'John Doe',
      phone: '081234567891',
      address: 'Jl. Gatot Subroto No. 456',
      city: 'Jakarta Pusat',
      postalCode: '10110',
      isDefault: false,
    },
  ])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('1')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')

  // Fetch cart items
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch(`${API_BASE_URL}/cart`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          // API returns { data: { items: [...], totalItems, totalPrice } }
          const items = data.data?.items || data.data || []
          setCartItems(Array.isArray(items) ? items : [])
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [])

  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    }
  }, [currentStep])

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    } else {
      router.push('/cart')
    }
  }, [currentStep, router])

  const handleAddAddress = useCallback((newAddress: Omit<Address, 'id'>) => {
    const id = Date.now().toString()
    setAddresses(prev => [...prev, { ...newAddress, id }])
  }, [])

  const handleSelectAddress = useCallback((id: string) => {
    setSelectedAddressId(id)
  }, [])

  const handleSelectPayment = useCallback((method: string) => {
    setSelectedPaymentMethod(method)
  }, [])

  const handlePlaceOrder = useCallback(async () => {
    // TODO: Implement order placement
    console.log('Placing order...', {
      addressId: selectedAddressId,
      paymentMethod: selectedPaymentMethod,
      items: cartItems,
    })
    alert('Order placed successfully!')
    router.push('/orders')
  }, [selectedAddressId, selectedPaymentMethod, cartItems, router])

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  )
  const estimatedTax = Math.round(subtotal * 0.02)
  const shippingCost = cartItems.length > 0 ? 29 : 0
  const total = subtotal + estimatedTax + shippingCost

  const selectedAddress = addresses.find(a => a.id === selectedAddressId)

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading checkout...</div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
          <a href="/products" className={styles.continueLink}>
            Continue Shopping
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>

      <CheckoutSteps currentStep={currentStep} />

      <div className={styles.layout}>
        <div className={styles.mainSection}>
          {currentStep === 1 && (
            <AddressStep
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={handleSelectAddress}
              onAddAddress={handleAddAddress}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <PaymentStep
              selectedMethod={selectedPaymentMethod}
              onSelectMethod={handleSelectPayment}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {currentStep === 3 && (
            <ConfirmationStep
              cartItems={cartItems}
              selectedAddress={selectedAddress}
              selectedPaymentMethod={selectedPaymentMethod}
              subtotal={subtotal}
              estimatedTax={estimatedTax}
              shippingCost={shippingCost}
              total={total}
              onBack={handleBack}
              onPlaceOrder={handlePlaceOrder}
            />
          )}
        </div>

        <div className={styles.summarySection}>
          <div className={styles.orderSummary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryItems}>
              {cartItems.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <span className={styles.itemName}>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className={styles.itemPrice}>
                    ${(Number(item.product.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>${estimatedTax.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>${shippingCost.toLocaleString()}</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
