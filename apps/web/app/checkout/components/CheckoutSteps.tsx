'use client'

import styles from './CheckoutSteps.module.css'

interface CheckoutStepsProps {
  currentStep: number
}

const steps = [
  { number: 1, label: 'Address' },
  { number: 2, label: 'Payment' },
  { number: 3, label: 'Confirmation' },
]

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={step.number} className={styles.stepWrapper}>
            <div
              className={`${styles.step} ${
                currentStep === step.number
                  ? styles.active
                  : currentStep > step.number
                    ? styles.completed
                    : ''
              }`}
            >
              <div className={styles.stepNumber}>
                {currentStep > step.number ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={styles.stepLabel}>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`${styles.connector} ${currentStep > step.number ? styles.connectorCompleted : ''}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
