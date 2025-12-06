import { describe, it, expect } from 'bun:test'
import { productDescriptionService } from '../product-description/product_description_service'
import { productDescriptionRepository } from '../product-description/product_description_repository'

describe('product description service', () => {
  it('throws error for invalid input', async () => {
    await expect(productDescriptionService.generateDescription('')).rejects.toThrow('Invalid product input')
    await expect(productDescriptionService.generateDescription('   ')).rejects.toThrow('Invalid product input')
    await expect(productDescriptionService.generateDescription('a'.repeat(501))).rejects.toThrow('Invalid product input')
  })
})

describe('product description repository', () => {
  it('validates input correctly', async () => {
    expect(await productDescriptionRepository.validateInput('Valid input')).toBe(true)
    expect(await productDescriptionRepository.validateInput('')).toBe(false)
    expect(await productDescriptionRepository.validateInput('a'.repeat(501))).toBe(false)
  })
})
