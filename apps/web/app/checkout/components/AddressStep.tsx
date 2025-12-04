'use client'

import { useState } from 'react'
import styles from './AddressStep.module.css'

interface Address {
  id: string
  label: string
  recipientName: string
  phone: string
  address: string
  city: string
  postalCode: string
  isDefault: boolean
}

interface AddressStepProps {
  addresses: Address[]
  selectedAddressId: string
  onSelectAddress: (id: string) => void
  onAddAddress: (address: Omit<Address, 'id'>) => void
  onBack: () => void
  onNext: () => void
}

export function AddressStep({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
  onBack,
  onNext,
}: AddressStepProps): React.JSX.Element {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    label: '',
    recipientName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    isDefault: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmitAddress = (e: React.FormEvent): void => {
    e.preventDefault()
    if (newAddress.label !== '' && newAddress.recipientName !== '' && newAddress.address !== '') {
      onAddAddress(newAddress)
      setNewAddress({
        label: '',
        recipientName: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        isDefault: false,
      })
      setShowAddForm(false)
    }
  }

  const canProceed = selectedAddressId !== ''

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select Address</h2>
      <p className={styles.subtitle}>Choose your delivery address</p>

      <div className={styles.addressList}>
        {addresses.map(address => (
          <label key={address.id} className={styles.addressCard}>
            <input
              type="radio"
              name="address"
              value={address.id}
              checked={selectedAddressId === address.id}
              onChange={() => onSelectAddress(address.id)}
              className={styles.radio}
            />
            <div className={styles.addressContent}>
              <div className={styles.addressHeader}>
                <span className={styles.addressLabel}>{address.label}</span>
                {address.isDefault === true && <span className={styles.defaultBadge}>Default</span>}
              </div>
              <p className={styles.recipientName}>{address.recipientName}</p>
              <p className={styles.addressText}>{address.address}</p>
              <p className={styles.addressText}>
                {address.city}, {address.postalCode}
              </p>
              <p className={styles.phone}>{address.phone}</p>
            </div>
          </label>
        ))}
      </div>

      {!showAddForm ? (
        <button className={styles.addButton} onClick={() => setShowAddForm(true)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Address
        </button>
      ) : (
        <form className={styles.addForm} onSubmit={handleSubmitAddress}>
          <h3 className={styles.formTitle}>Add New Address</h3>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Label</label>
              <input
                type="text"
                name="label"
                value={newAddress.label}
                onChange={handleInputChange}
                placeholder="e.g., Home, Office"
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Recipient Name</label>
              <input
                type="text"
                name="recipientName"
                value={newAddress.recipientName}
                onChange={handleInputChange}
                placeholder="Full name"
                className={styles.formInput}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={newAddress.phone}
              onChange={handleInputChange}
              placeholder="08xxxxxxxxxx"
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Address</label>
            <input
              type="text"
              name="address"
              value={newAddress.address}
              onChange={handleInputChange}
              placeholder="Street address"
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>City</label>
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                placeholder="City"
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={newAddress.postalCode}
                onChange={handleInputChange}
                placeholder="12345"
                className={styles.formInput}
                required
              />
            </div>
          </div>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isDefault"
              checked={newAddress.isDefault}
              onChange={handleInputChange}
              className={styles.checkbox}
            />
            Set as default address
          </label>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save Address
            </button>
          </div>
        </form>
      )}

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
