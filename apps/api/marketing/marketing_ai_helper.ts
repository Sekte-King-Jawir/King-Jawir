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

  // Define content length requirements per platform
  const platformSpecs = {
    instagram: { maxLength: 150, style: 'short, engaging post with emojis' },
    facebook: { maxLength: 200, style: 'engaging post with story' },
    twitter: { maxLength: 280, style: 'concise tweet with impact' },
    linkedin: { maxLength: 600, style: 'professional post with insights' },
    email: { maxLength: 1000, style: 'complete email with subject and body' },
    tiktok: { maxLength: 200, style: 'catchy caption for video' },
  }

  const spec = platformSpecs[platform as keyof typeof platformSpecs] || platformSpecs.instagram

  let prompt = `You are an expert Indonesian marketing copywriter for SMEs. Create engaging marketing content for ${platform} based on the product description below. Content must be in Indonesian, optimized for ${platform}, and persuasive for small businesses.

PRODUCT DESCRIPTION:
- Short: ${short}
- Long: ${long}
- Key Features: ${bullets.join('; ')}
- SEO Keywords: ${seoKeywords.join(', ')}

INSTRUCTIONS:
1) Generate content suitable for ${platform} (${spec.style}).
2) Content should be detailed and engaging, up to ${spec.maxLength} characters.
3) Include relevant hashtags if applicable (for social media platforms).
4) Add a compelling call-to-action (CTA).
5) For email: include subject line and full body.
6) Output in labeled sections: CONTENT, HASHTAGS (if applicable), CTA.

EXAMPLE OUTPUT FOR INSTAGRAM:
CONTENT: Rekam momen epik dengan kamera aksi 4K tahan air! Video tajam, stabil, dan siap adventure. Cocok untuk SME vlogger! 🚀📹
HASHTAGS: #KameraAksi #4KVideo #SMEVlogger #OutdoorAdventure
CTA: Pesan sekarang di link bio!`

  return prompt
}

export function parseMarketingContentResponse(
  rawText: string,
  platform: string
): MarketingContentResult {
  const result: MarketingContentResult = {
    platform,
    content: '',
    hashtags: [],
    callToAction: '',
  }

  try {
    const lines = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    let currentSection = ''
    for (const line of lines) {
      const upperLine = line.toUpperCase()
      if (
        upperLine.includes('CONTENT') &&
        !upperLine.includes('HASHTAGS') &&
        !upperLine.includes('CTA')
      ) {
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

export function buildMarketingContentPartPrompt(
  productDescription: ProductDescriptionResult,
  platform: string,
  part: number
): string {
  const { short, long, bullets, seoKeywords } = productDescription

  const parts = {
    1: {
      focus: 'pengantar dan hook menarik',
      instruction:
        'Buat pengantar yang menarik perhatian, jelaskan masalah yang diselesaikan produk, dan buat hook yang membuat audiens tertarik.',
    },
    2: {
      focus: 'fitur dan manfaat utama',
      instruction:
        'Jelaskan fitur-fitur utama produk dan manfaat spesifik yang didapat pelanggan, fokus pada nilai untuk bisnis mereka.',
    },
    3: {
      focus: 'kesimpulan dan call-to-action',
      instruction:
        'Berikan kesimpulan yang persuasif, testimonial singkat, dan ajakan kuat untuk melakukan aksi (beli, hubungi, dll).',
    },
  }

  const currentPart = parts[part as keyof typeof parts]
  if (!currentPart) throw new Error('Invalid part number')

  const prompt = `You are an expert Indonesian marketing copywriter for SMEs. Create a detailed section of marketing content for ${platform} based on the product description below. Focus on ${currentPart.focus}.

PRODUCT DESCRIPTION:
- Short: ${short}
- Long: ${long}
- Key Features: ${bullets.join('; ')}
- SEO Keywords: ${seoKeywords.join(', ')}

INSTRUCTIONS:
1) Write a detailed paragraph (minimal 150 kata) about ${currentPart.instruction}
2) Content must be in Indonesian and optimized for ${platform}.
3) Make it engaging and persuasive for small businesses.
4) Output only the paragraph text, no labels or formatting.

EXAMPLE FOR PART 1:
Halo para pemilik usaha kecil di Indonesia! Apakah Anda kesulitan membuat konten pemasaran yang menarik untuk produk Anda? Kami punya solusi: kamera aksi 4K ultra HD waterproof yang akan merevolusi cara Anda memasarkan bisnis. Bayangkan bisa merekam video berkualitas profesional tanpa perlu equipment mahal, dan menggunakannya untuk showcase produk di marketplace seperti Tokopedia atau Shopee.`

  return prompt
}

export function buildMarketingContentPartPrompt(
  productDescription: ProductDescriptionResult,
  platform: string,
  part: number
): string {
  const { short, long, bullets, seoKeywords } = productDescription

  const parts = {
    1: {
      focus: 'pengantar dan hook menarik',
      instruction:
        'Buat pengantar yang menarik perhatian, jelaskan masalah yang diselesaikan produk, dan buat hook yang membuat audiens tertarik.',
    },
    2: {
      focus: 'fitur dan manfaat utama',
      instruction:
        'Jelaskan fitur-fitur utama produk dan manfaat spesifik yang didapat pelanggan, fokus pada nilai untuk bisnis mereka.',
    },
    3: {
      focus: 'kesimpulan dan call-to-action',
      instruction:
        'Berikan kesimpulan yang persuasif, testimonial singkat, dan ajakan kuat untuk melakukan aksi (beli, hubungi, dll).',
    },
  }

  const currentPart = parts[part as keyof typeof parts]
  if (!currentPart) throw new Error('Invalid part number')

  const prompt = `You are an expert Indonesian marketing copywriter for SMEs. Create a detailed section of marketing content for ${platform} based on the product description below. Focus on ${currentPart.focus}.

PRODUCT INPUT: ${short}

INSTRUCTIONS:
1) Write a detailed paragraph (minimal 150 kata) about ${currentPart.instruction}
2) Content must be in Indonesian and optimized for ${platform}.
3) Make it engaging and persuasive for small businesses.
4) Output only the paragraph text, no labels or formatting.

EXAMPLE FOR PART 1:
Halo para pemilik usaha kecil di Indonesia! Apakah Anda kesulitan membuat konten pemasaran yang menarik untuk produk Anda? Kami punya solusi: kamera aksi 4K ultra HD waterproof yang akan merevolusi cara Anda memasarkan bisnis. Bayangkan bisa merekam video berkualitas profesional tanpa perlu equipment mahal, dan menggunakannya untuk showcase produk di marketplace seperti Tokopedia atau Shopee.`

  return prompt
}

export function getFallbackMarketingContent(platform: string): MarketingContentResult {
  const fallbacks = {
    instagram: {
      content:
        '🚀 Temukan kamera aksi 4K ultra HD waterproof yang siap menemani petualangan Anda! Dengan resolusi tinggi, stabilizer canggih, dan ketahanan air hingga kedalaman tertentu, kamera ini cocok untuk vlogger SME yang ingin menghasilkan konten profesional. Fitur WiFi dan Bluetooth memudahkan transfer file, sementara baterai tahan lama mendukung rekaman panjang. Jangan lewatkan kesempatan memiliki alat rekaman terbaik untuk bisnis kreatif Anda! 📹✨',
      hashtags: [
        '#KameraAksi',
        '#4KVideo',
        '#Waterproof',
        '#SMEVlogger',
        '#OutdoorAdventure',
        '#ContentCreator',
      ],
      callToAction: 'Pesan sekarang di link bio dan dapatkan diskon spesial!',
    },
    facebook: {
      content:
        'Halo teman-teman SME Indonesia! 🎉 Kami punya produk menarik untuk Anda: kamera aksi 4K ultra HD waterproof yang dirancang khusus untuk para content creator dan adventurer. Bayangkan bisa merekam video berkualitas sinematik di berbagai kondisi cuaca, mulai dari pantai hingga gunung. Dengan fitur stabilizer elektronik, konektivitas nirkabel, dan desain ergonomis, kamera ini memudahkan Anda menghasilkan konten yang menarik untuk marketplace seperti Tokopedia atau Shopee. Baterai awet dan aplikasi pendamping membuat pengalaman rekaman semakin smooth. Cocok untuk bisnis vlogging, fotografi outdoor, atau dokumentasi acara. Investasi cerdas untuk mengembangkan usaha kreatif Anda! 💪📸',
      hashtags: [
        '#KameraProfesional',
        '#BisnisSME',
        '#ContentCreator',
        '#OutdoorPhotography',
        '#VideoMarketing',
      ],
      callToAction: 'Klik "Pesan Sekarang" untuk detail produk dan harga spesial!',
    },
    twitter: {
      content:
        'Revolusi rekaman dengan kamera aksi 4K waterproof! 🎬 Stabilizer canggih, WiFi built-in, baterai tahan lama. Cocok untuk SME vlogger & content creator. Tingkatkan kualitas konten bisnis Anda sekarang! #KameraAksi #SME #ContentCreator 🚀',
      hashtags: [
        '#KameraAksi',
        '#4KVideo',
        '#Waterproof',
        '#SME',
        '#ContentCreator',
        '#VideoMarketing',
      ],
      callToAction: 'DM untuk info & promo spesial! 📩',
    },
    linkedin: {
      content:
        'Sebagai pemilik usaha kecil di Indonesia, Anda tahu betapa pentingnya memiliki alat yang tepat untuk memasarkan produk dan layanan. Kami hadir dengan solusi inovatif: kamera aksi 4K ultra HD waterproof yang dirancang khusus untuk kebutuhan content creation SMEs. Dengan teknologi terkini seperti stabilizer gambar elektronik, konektivitas nirkabel, dan ketahanan air yang handal, kamera ini memungkinkan Anda menghasilkan konten visual berkualitas tinggi untuk platform digital. Baik untuk vlogging bisnis, dokumentasi produk, atau konten edukasi, alat ini membantu meningkatkan engagement dan konversi penjualan. Didukung aplikasi mobile yang user-friendly dan baterai tahan lama, kamera ini adalah investasi strategis untuk mengembangkan brand Anda di era digital. Mari bersama-sama tingkatkan standar content marketing untuk UMKM Indonesia! 🌟📈',
      hashtags: [
        '#DigitalMarketing',
        '#SME',
        '#ContentCreation',
        '#BusinessTools',
        '#IndonesiaUMKM',
        '#VideoContent',
      ],
      callToAction: 'Hubungi kami untuk konsultasi gratis dan demo produk!',
    },
    email: {
      content: `Subjek: Tingkatkan Bisnis Anda dengan Kamera Aksi 4K Profesional!

Halo [Nama Penerima],

Kami dari King Jawir ingin memperkenalkan produk terbaru yang dapat membantu mengembangkan bisnis Anda: Kamera Aksi 4K Ultra HD Waterproof.

Bayangkan Anda bisa merekam konten berkualitas tinggi untuk memasarkan produk atau layanan di marketplace seperti Tokopedia dan Shopee. Dengan resolusi 4K yang tajam, stabilizer gambar canggih, dan ketahanan air hingga kedalaman tertentu, kamera ini cocok untuk berbagai skenario: vlogging bisnis, fotografi outdoor, atau dokumentasi acara perusahaan.

Fitur unggulan:
- Rekaman video 4K 60fps dengan kualitas sinematik
- Waterproof hingga 30 meter untuk kegiatan ekstrem
- Stabilizer elektronik mengurangi guncangan kamera
- Konektivitas WiFi dan Bluetooth untuk transfer cepat
- Baterai lithium-ion tahan lama hingga 3 jam
- Aplikasi mobile untuk kontrol jarak jauh
- Desain ringan dan kompak, mudah dibawa

Banyak pelanggan SME kami telah berhasil meningkatkan engagement konten mereka hingga 300% setelah menggunakan kamera ini. Dari content creator makanan hingga penyedia jasa outdoor, semua merasakan manfaatnya.

Sekarang saatnya bisnis Anda mendapatkan keuntungan serupa! Kami tawarkan harga spesial untuk pelanggan baru, termasuk garansi 1 tahun dan dukungan teknis gratis.

Klik tombol di bawah untuk melihat detail produk dan memesan sekarang:

[Pesan Sekarang]

Jangan lewatkan kesempatan ini untuk meningkatkan kualitas konten pemasaran Anda!

Salam sukses,
Tim King Jawir
Platform AI untuk SMEs Indonesia`,
      hashtags: ['#KameraAksi', '#BisnisSME', '#ContentMarketing', '#VideoProduction'],
      callToAction: 'Klik link di atas untuk memesan sekarang!',
    },
    tiktok: {
      content:
        '🎥 BOOM! Kamera aksi 4K waterproof yang bikin konten kamu JUARA! Video 4K tajam, stabilizer gila, tahan air sampe 30m! Cocok banget buat SME creator yang mau go viral! 💦📸 WiFi, Bluetooth, baterai awet - semua ada! Siap adventure atau vlog bisnis? Swipe up sekarang! 🚀 #KameraAksi #SME #ContentCreator #ViralContent',
      hashtags: [
        '#KameraAksi',
        '#4KVideo',
        '#Waterproof',
        '#SME',
        '#ContentCreator',
        '#Viral',
        '#VideoContent',
        '#BusinessTools',
      ],
      callToAction: 'Swipe up untuk link produk dan mulai create konten epic!',
    },
  }

  return {
    platform,
    ...(fallbacks[platform as keyof typeof fallbacks] || fallbacks.instagram),
  }
}
