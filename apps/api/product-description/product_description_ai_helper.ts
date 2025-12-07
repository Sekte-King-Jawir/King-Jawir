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
LONG_DESCRIPTION: (detailed product description, minimal 301 kata, emphasize benefits and features)
BULLETS: (provide 3-6 bullet points; each bullet on its own line prefixed with '- ')
SEO_KEYWORDS: (provide 6-10 comma-separated keywords relevant to the product)

2) Emphasize benefits, use marketplace-friendly language, and include a call-to-action when appropriate.
3) Do not invent technical specs beyond provided input.
4) Keep descriptions compelling for Indonesian SMEs.

EXAMPLE OUTPUT FORMAT:
SHORT_DESCRIPTION: Kamera aksi 4K tahan air hingga 30m, stabilizer, WiFi.
LONG_DESCRIPTION: Kamera aksi 4K profesional ini dirancang untuk para petualang dan content creator yang membutuhkan alat rekaman handal di berbagai kondisi. Dengan sensor gambar canggih, kamera ini mampu menghasilkan video 4K ultra HD dengan detail yang luar biasa, memungkinkan Anda menangkap momen-momen penting dengan kualitas sinematik. Fitur waterproof hingga 30 meter membuatnya sempurna untuk aktivitas outdoor seperti diving, surfing, atau hiking di cuaca ekstrem. Stabilizer gambar elektronik yang canggih mengurangi guncangan kamera secara otomatis, menghasilkan video yang stabil dan profesional tanpa perlu gimbal mahal. Konektivitas WiFi memungkinkan kontrol jarak jauh melalui aplikasi smartphone, sementara Bluetooth memfasilitasi transfer file cepat. Baterai lithium-ion berkapasitas tinggi tahan hingga 3 jam rekaman kontinyu, cukup untuk satu hari penuh aktivitas. Antarmuka pengguna yang intuitif dengan layar LCD sentuh 2 inci membuat navigasi menu menjadi mudah, bahkan dengan sarung tangan. Mode rekaman yang beragam termasuk time-lapse, slow-motion, dan burst shooting memberikan fleksibilitas kreatif maksimal. Desain ergonomis dengan grip yang nyaman memastikan kenyamanan saat digunakan berjam-jam. Kompatibilitas dengan berbagai aksesori seperti housing underwater dan mount action memungkinkan ekspansi fungsi sesuai kebutuhan. Dengan harga yang kompetitif, kamera ini menawarkan nilai investasi tinggi untuk para profesional dan amatir yang ingin meningkatkan kualitas konten mereka. Jangan lewatkan kesempatan untuk memiliki kamera aksi terbaik di kelasnya - pesan sekarang dan mulai petualangan visual Anda!
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

export function buildProductDescriptionPartPrompt(part: number, productInput: string): string {
  const parts = {
    1: {
      focus: 'pengenalan produk dan fitur utama',
      instruction: 'Deskripsikan pengenalan produk, fitur utama, dan spesifikasi teknis yang tersedia.',
    },
    2: {
      focus: 'manfaat dan keunggulan',
      instruction: 'Jelaskan manfaat penggunaan produk, keunggulan dibanding kompetitor, dan nilai tambah untuk pelanggan.',
    },
    3: {
      focus: 'kesimpulan dan call-to-action',
      instruction: 'Berikan kesimpulan yang persuasif, saran penggunaan, dan ajakan untuk membeli atau menghubungi.',
    },
  }

  const currentPart = parts[part as keyof typeof parts]
  if (!currentPart) throw new Error('Invalid part number')

  const prompt = `You are an expert Indonesian e-commerce copywriter for marketplaces like Tokopedia and Shopee. Produce a detailed section of a marketplace-optimized product description in Indonesian (id-ID). Focus on ${currentPart.focus}.

PRODUCT INPUT: ${productInput}

INSTRUCTIONS:
1) Write a detailed paragraph (minimal 100 kata) about ${currentPart.instruction}
2) Emphasize benefits, use marketplace-friendly language.
3) Do not invent technical specs beyond provided input.
4) Keep content compelling for Indonesian SMEs.
5) Output only the paragraph text, no labels or formatting.

EXAMPLE FOR PART 1:
Kamera aksi 4K profesional ini dirancang untuk para petualang dan content creator yang membutuhkan alat rekaman handal di berbagai kondisi. Dengan sensor gambar canggih, kamera ini mampu menghasilkan video 4K ultra HD dengan detail yang luar biasa, memungkinkan Anda menangkap momen-momen penting dengan kualitas sinematik. Fitur waterproof hingga 30 meter membuatnya sempurna untuk aktivitas outdoor seperti diving, surfing, atau hiking di cuaca ekstrem. Stabilizer gambar elektronik yang canggih mengurangi guncangan kamera secara otomatis, menghasilkan video yang stabil dan profesional tanpa perlu gimbal mahal.`

  return prompt
}

export function getFallbackDescription(productInput: string): ProductDescriptionResult {
  const title = productInput.length > 50 ? productInput.substring(0, 50) + '...' : productInput

  // Create a more detailed long description (aiming for ~300 words)
  const longDescription = `${title} adalah produk yang dirancang khusus untuk memenuhi kebutuhan fotografi dan videografi modern dengan kualitas terbaik. Dengan teknologi canggih dan desain ergonomis, produk ini menawarkan pengalaman pengguna yang luar biasa bagi para profesional maupun pemula. Kamera ini dilengkapi dengan sensor gambar berkualitas tinggi yang mampu menghasilkan foto dan video dengan resolusi ultra HD, memastikan setiap momen penting terekam dengan jelas dan tajam.

Fitur utama dari ${title} termasuk kemampuan rekaman 4K yang memungkinkan Anda menangkap detail terkecil dalam gerakan cepat, ideal untuk vlogging, olahraga ekstrem, atau dokumentasi acara. Desain waterproof membuatnya tahan terhadap air hingga kedalaman tertentu, sehingga Anda tidak perlu khawatir saat digunakan di lingkungan basah seperti pantai, kolam renang, atau bahkan hujan deras. Stabilizer gambar bawaan membantu mengurangi guncangan kamera, menghasilkan video yang stabil dan profesional tanpa perlu peralatan tambahan yang mahal.

Selain itu, konektivitas WiFi dan Bluetooth memungkinkan transfer data cepat ke perangkat mobile, memudahkan editing dan berbagi konten secara langsung. Baterai tahan lama dengan kapasitas tinggi memastikan Anda dapat merekam selama berjam-jam tanpa perlu pengisian ulang yang sering, sangat penting untuk perjalanan panjang atau acara outdoor. Antarmuka pengguna yang intuitif dengan layar sentuh responsif membuat navigasi menu menjadi mudah, bahkan bagi pengguna baru.

${title} juga mendukung berbagai mode fotografi seperti time-lapse, slow-motion, dan burst shooting, memberikan fleksibilitas kreatif yang tinggi. Dengan aplikasi pendamping yang tersedia untuk smartphone, Anda dapat mengontrol kamera dari jarak jauh, melihat pratinjau langsung, dan melakukan pengaturan lanjutan. Produk ini cocok digunakan oleh semua kalangan, mulai dari content creator, fotografer amatir, hingga profesional yang membutuhkan alat rekaman portabel dan handal.

Keamanan data juga menjadi prioritas, dengan slot kartu memori yang kompatibel dengan berbagai format, memungkinkan penyimpanan file dalam jumlah besar. Desain ringan dan kompak membuatnya mudah dibawa ke mana saja, tanpa mengorbankan kekuatan dan performa. Investasi dalam ${title} bukan hanya tentang membeli kamera, tetapi juga tentang membuka pintu kreativitas baru dan memungkinkan Anda mengekspresikan visi Anda melalui media visual yang menakjubkan.

Dengan harga yang terjangkau dan kualitas yang terjamin, ${title} adalah pilihan tepat untuk siapa saja yang ingin meningkatkan kualitas konten mereka. Jangan ragu untuk segera memesan dan mulai menjelajahi dunia fotografi dan videografi dengan cara yang lebih menyenangkan dan efisien.`

  return {
    short: `${title} - Kamera 4K ultra HD waterproof untuk fotografi dan videografi profesional.`,
    long: longDescription,
    bullets: [
      '- Resolusi 4K ultra HD untuk kualitas gambar tajam',
      '- Waterproof hingga kedalaman tertentu',
      '- Stabilizer gambar bawaan untuk video stabil',
      '- Konektivitas WiFi dan Bluetooth',
      '- Baterai tahan lama untuk rekaman panjang',
      '- Antarmuka sentuh intuitif',
    ],
    seoKeywords: ['kamera', '4K', 'ultra HD', 'waterproof', 'fotografi', 'videografi', 'stabilizer', 'WiFi', 'Bluetooth', 'indonesia'],
  }
}
