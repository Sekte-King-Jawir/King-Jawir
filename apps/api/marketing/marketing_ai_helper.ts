/**
 * AI Helper Functions for Marketing Content Generation
 *
 * @description Utilities to build LLM prompts for generating marketing content
 * (social media posts, emails, etc.) based on product descriptions.
 *
 * @module marketing/marketing_ai_helper
 */

import type { ProductDescriptionResult } from '../product-description/product_description_ai_helper'

export interface MarketingContentResult {
  platform: string
  content: string
  hashtags: string[]
  callToAction: string
}

export function buildMarketingContentPrompt(
  productDescription: ProductDescriptionResult,
  platform: string
): string {
  const { short, long, bullets, seoKeywords } = productDescription

  let prompt = `You are an expert Indonesian marketing copywriter for SMEs. Create engaging marketing content for ${platform} based on the product description below. Content must be in Indonesian, optimized for ${platform}, and persuasive for small businesses.

PRODUCT DESCRIPTION:
- Short: ${short}
- Long: ${long}
- Key Features: ${bullets.join('; ')}
- SEO Keywords: ${seoKeywords.join(', ')}

INSTRUCTIONS:
1) Generate content suitable for ${platform} (e.g., for Instagram/Facebook/Twitter: short post with emojis and hashtags; for LinkedIn: professional post; for Email: subject + body; for TikTok: catchy caption).
2) Keep content concise but engaging.
3) Include relevant hashtags if applicable (for social media platforms).
4) Add a call-to-action (CTA) like "Pesan sekarang!" or "DM untuk info!".
5) Output in labeled sections: CONTENT, HASHTAGS (if applicable), CTA.

EXAMPLE OUTPUT FOR INSTAGRAM:
CONTENT: Rekam momen epik dengan kamera aksi 4K tahan air! Video tajam, stabil, dan siap adventure. Cocok untuk SME vlogger! 🚀📹
HASHTAGS: #KameraAksi #4KVideo #SMEVlogger #OutdoorAdventure
CTA: Pesan sekarang di link bio!`

  return prompt
}

export function parseMarketingContentResponse(rawText: string, platform: string): MarketingContentResult {
  const result: MarketingContentResult = {
    platform,
    content: '',
    hashtags: [],
    callToAction: '',
  }

  try {
    const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0)

    let currentSection = ''
    for (const line of lines) {
      const upperLine = line.toUpperCase()
      if (upperLine.includes('CONTENT') && !upperLine.includes('HASHTAGS') && !upperLine.includes('CTA')) {
        currentSection = 'content'
        const contentStart = line.toUpperCase().indexOf('CONTENT') + 'CONTENT'.length
        result.content = line.substring(contentStart).trim()
      } else if (upperLine.includes('HASHTAGS')) {
        currentSection = 'hashtags'
        const hashtagsStart = line.toUpperCase().indexOf('HASHTAGS') + 'HASHTAGS'.length
        const hashtagsStr = line.substring(hashtagsStart).trim()
        result.hashtags = hashtagsStr.split(' ').filter(h => h.startsWith('#'))
      } else if (upperLine.includes('CTA')) {
        currentSection = 'cta'
        const ctaStart = line.toUpperCase().indexOf('CTA') + 'CTA'.length
        result.callToAction = line.substring(ctaStart).trim()
      } else if (currentSection === 'content' && result.content) {
        result.content += ' ' + line
      } else if (currentSection === 'hashtags' && line.startsWith('#')) {
        result.hashtags.push(...line.split(' ').filter(h => h.startsWith('#')))
      } else if (currentSection === 'cta' && result.callToAction) {
        result.callToAction += ' ' + line
      }
    }

    // Jika content masih kosong, gunakan raw text
    if (!result.content) {
      result.content = rawText.replace(/\*\*/g, '').trim()
    }

    // Generate default hashtags jika kosong
    if (result.hashtags.length === 0) {
      result.hashtags = ['#ProdukKualitas', '#SMEIndonesia']
    }

    // Generate default CTA jika kosong
    if (!result.callToAction) {
      result.callToAction = 'Pesan sekarang!'
    }
  } catch (error) {
    // Use fallback
    return getFallbackMarketingContent(platform)
  }

  return result
}

export function getFallbackMarketingContent(platform: string): MarketingContentResult {
  const fallbacks = {
    instagram: {
      content: 'Produk berkualitas tinggi untuk kebutuhan Anda! Temukan sekarang.',
      hashtags: ['#ProdukKualitas', '#SMEIndonesia'],
      callToAction: 'Pesan sekarang!',
    },
    facebook: {
      content: 'Temukan produk unggulan ini untuk bisnis Anda! Kualitas terjamin dan harga bersaing.',
      hashtags: ['#ProdukUnggulan', '#BisnisSME'],
      callToAction: 'Klik untuk detail!',
    },
    twitter: {
      content: 'Produk baru yang wajib dicoba! Cocok untuk semua kebutuhan. #ProdukBaru',
      hashtags: ['#ProdukBaru', '#SME'],
      callToAction: 'RT dan follow!',
    },
    linkedin: {
      content: 'Produk profesional untuk meningkatkan efisiensi bisnis Anda. Solusi terbaik untuk SMEs.',
      hashtags: ['#BisnisProfesional', '#SMESolutions'],
      callToAction: 'Hubungi kami!',
    },
    email: {
      content: 'Subjek: Produk Terbaru untuk Bisnis Anda\n\nHalo,\n\nKami punya produk menarik yang cocok untuk usaha kecil Anda.',
      hashtags: ['#ProdukBisnis', '#SME'],
      callToAction: 'Klik di sini untuk detail!',
    },
    tiktok: {
      content: 'Produk keren untuk content creator! Cek sekarang! 🎉',
      hashtags: ['#ProdukKeren', '#CreatorSME'],
      callToAction: 'Follow untuk update!',
    },
  }

  return {
    platform,
    ...fallbacks[platform as keyof typeof fallbacks] || fallbacks.instagram,
  }
}