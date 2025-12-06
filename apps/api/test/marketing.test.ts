import { describe, it, expect } from 'bun:test'
import { marketingService } from '../marketing/marketing_service'
import { marketingRepository } from '../marketing/marketing_repository'

describe('marketing service', () => {
  it('throws error for invalid input', async () => {
    const invalidDesc = { short: '', long: '', bullets: [], seoKeywords: [] } as any
    await expect(marketingService.generateContent(invalidDesc, 'invalid')).rejects.toThrow('Invalid marketing input')
  })
})

describe('marketing repository', () => {
  it('validates input correctly', () => {
    const validDesc = { short: 'test', long: 'test', bullets: [], seoKeywords: [] }
    expect(marketingRepository.validateInput(validDesc, 'instagram')).toBe(true)
    const invalidDesc = { short: '', long: '', bullets: [], seoKeywords: [] }
    expect(marketingRepository.validateInput(invalidDesc, 'instagram')).toBe(false)
    expect(marketingRepository.validateInput(validDesc, 'invalid')).toBe(false)
  })
})