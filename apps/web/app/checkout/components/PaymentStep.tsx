'use client'

import styles from './PaymentStep.module.css'

interface PaymentStepProps {
  selectedMethod: string
  onSelectMethod: (method: string) => void
  onBack: () => void
  onNext: () => void
}

const paymentMethods = [
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Transfer via BCA, Mandiri, BNI, BRI',
    icon: '🏦',
  },
  {
    id: 'e_wallet',
    name: 'E-Wallet',
    description: 'GoPay, OVO, Dana, ShopeePay',
    icon: '📱',
  },
  {
    id: 'credit_card',
    name: 'Credit Card',
    description: 'Visa, Mastercard, JCB',
    icon: '💳',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: '💵',
  },
]

export function PaymentStep({ selectedMethod, onSelectMethod, onBack, onNext }: PaymentStepProps) {
  const canProceed = selectedMethod !== ''

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Payment Method</h2>
      <p className={styles.subtitle}>Choose your preferred payment method</p>

      <div className={styles.methodList}>
        {paymentMethods.map(method => (
          <label key={method.id} className={styles.methodCard}>
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onSelectMethod(method.id)}
              className={styles.radio}
            />
            <div className={styles.methodIcon}>{method.icon}</div>
            <div className={styles.methodContent}>
              <span className={styles.methodName}>{method.name}</span>
              <span className={styles.methodDescription}>{method.description}</span>
            </div>
          </label>
        ))}
      </div>

      <div className={styles.navigation}>
        <button className={styles.backButton} onClick={onBack}>
          Back
        </button>
        <button className={styles.nextButton} onClick={onNext} disabled={!canProceed}>
          Next
        </button>
      </div>
    </div>
  )
}
