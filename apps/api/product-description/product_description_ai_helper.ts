/**
 * AI Helper Functions for Product Description
 *
 * @description Utilities to build LLM prompts for product description generation,
 * parse AI responses into structured sections (short, long, bullets, seoKeywords),
 * and provide a fallback generator when AI is unavailable.
 *
 * @module product-description/product_description_ai_helper
 */

export interface ProductDescriptionResult {
  short: string
  long: string
  bullets: string[]
  seoKeywords: string[]
}

export function buildProductDescriptionPrompt(productInput: string): string {
  const prompt = `You are an expert Indonesian e-commerce copywriter for marketplaces like Tokopedia and Shopee. Produce marketplace-optimized product descriptions in Indonesian (id-ID). Return results in plain text with labeled sections.

PRODUCT INPUT: ${productInput}

INSTRUCTIONS:
1) Output four labeled sections exactly as below (use the labels on their own lines):
SHORT_DESCRIPTION: (one sentence, max 150 characters, catchy and persuasive)
LONG_DESCRIPTION: (detailed product description, max 700 characters, emphasize benefits and features)
BULLETS: (provide 3-6 bullet points; each bullet on its own line prefixed with '- ')
SEO_KEYWORDS: (provide 6-10 comma-separated keywords relevant to the product)

2) Emphasize benefits, use marketplace-friendly language, and include a call-to-action when appropriate.
3) Do not invent technical specs beyond provided input.
4) Keep descriptions compelling for Indonesian SMEs.

EXAMPLE OUTPUT FORMAT:
SHORT_DESCRIPTION: Kamera aksi 4K tahan air hingga 30m, stabilizer, WiFi.
LONG_DESCRIPTION: Kamera aksi 4K profesional dengan stabilisasi gambar, koneksi WiFi, dan bodi tahan air hingga 30 meter. Cocok untuk kegiatan outdoor dan vlogging. Kualitas video tajam, mudah digunakan, dan baterai tahan lama.
BULLETS:
- Waterproof hingga 30m
- Rekaman 4K 60fps
- WiFi & app control
- Stabilizer bawaan
- Baterai awet hingga 3 jam
SEO_KEYWORDS: kamera aksi, kamera 4K, kamera waterproof, kamera vlogging, stabilizer kamera, kamera olahraga`

  return prompt
}

export function parseProductDescriptionResponse(rawText: string): ProductDescriptionResult {
  const result: ProductDescriptionResult = {
    short: '',
    long: '',
    bullets: [],
    seoKeywords: [],
  }

  try {
    const lines = rawText.split('\n').map(line => line.trim())

    let currentSection = ''
    for (const line of lines) {
      if (line.startsWith('SHORT_DESCRIPTION:')) {
        currentSection = 'short'
        result.short = line.replace('SHORT_DESCRIPTION:', '').trim()
      } else if (line.startsWith('LONG_DESCRIPTION:')) {
        currentSection = 'long'
        result.long = line.replace('LONG_DESCRIPTION:', '').trim()
      } else if (line.startsWith('BULLETS:')) {
        currentSection = 'bullets'
      } else if (line.startsWith('SEO_KEYWORDS:')) {
        currentSection = 'seo'
        const keywords = line.replace('SEO_KEYWORDS:', '').trim()
        result.seoKeywords = keywords
          .split(',')
          .map(k => k.trim())
          .filter(k => k.length > 0)
      } else if (currentSection === 'bullets' && line.startsWith('- ')) {
        result.bullets.push(line.substring(2).trim())
      } else if (currentSection === 'short' && result.short === '') {
        result.short = line
      } else if (currentSection === 'long' && result.long === '') {
        result.long = line
      }
    }

    // Fallback if parsing failed
    if (!result.short || !result.long) {
      throw new Error('Parsing failed')
    }
  } catch (error) {
    // Use fallback
    return getFallbackDescription(rawText)
  }

  return result
}

export function getFallbackDescription(productInput: string): ProductDescriptionResult {
  const title = productInput.length > 50 ? productInput.substring(0, 50) + '...' : productInput

  return {
    short: `${title} - Produk berkualitas tinggi untuk kebutuhan Anda.`,
    long: `${title} adalah produk yang dirancang untuk memenuhi kebutuhan sehari-hari dengan kualitas terbaik. Cocok digunakan oleh semua kalangan, mudah didapatkan dan terjangkau harganya.`,
    bullets: [
      '- Kualitas terjamin',
      '- Mudah digunakan',
      '- Harga terjangkau',
      '- Cocok untuk berbagai kebutuhan',
    ],
    seoKeywords: ['produk', 'kualitas', 'terjangkau', 'indonesia', 'sme', 'belanja'],
  }
}
