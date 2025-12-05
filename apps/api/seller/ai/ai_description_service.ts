import { generateCompletion } from '../../lib/ai'
import { successResponse, errorResponse, ErrorCode, type ApiResponse } from '../../lib/response'

interface GenerateDescriptionInput {
  productName: string
  category?: string
  specs?: string[]
  targetMarket?: 'premium' | 'budget' | 'general'
  currentDescription?: string
}

interface GenerateDescriptionOutput {
  shortDescription: string
  longDescription: string
  keyFeatures: string[]
  seoKeywords: string[]
}

export const aiDescriptionService = {
  async generateDescription(
    input: GenerateDescriptionInput
  ): Promise<ApiResponse<GenerateDescriptionOutput>> {
    try {
      const { productName, category, specs, targetMarket = 'general', currentDescription } = input

      // Validation
      if (!productName || productName.trim().length < 3) {
        return errorResponse('Nama produk minimal 3 karakter', ErrorCode.VALIDATION_ERROR)
      }

      // Build prompt
      const prompt = this.buildDescriptionPrompt(input)

      // Generate dengan AI
      const aiResponse = await generateCompletion(prompt, {
        temperature: 0.7,
        maxTokens: 1000,
      })

      if (!aiResponse) {
        return errorResponse('Gagal generate deskripsi dengan AI', ErrorCode.INTERNAL_ERROR)
      }

      // Parse AI response
      const parsed = this.parseAIResponse(aiResponse)

      if (!parsed) {
        return errorResponse(
          'Format response AI tidak valid. Silakan coba lagi.',
          ErrorCode.INTERNAL_ERROR
        )
      }

      return successResponse('Deskripsi berhasil di-generate', parsed)
    } catch (error) {
      console.error('Error generating description:', error)
      return errorResponse('Terjadi kesalahan saat generate deskripsi', ErrorCode.INTERNAL_ERROR)
    }
  },

  buildDescriptionPrompt(input: GenerateDescriptionInput): string {
    const { productName, category, specs, targetMarket, currentDescription } = input

    let prompt = `Kamu adalah AI copywriter expert yang membantu UMKM Indonesia membuat deskripsi produk yang menarik dan SEO-friendly.

Tugas: Generate deskripsi produk untuk marketplace e-commerce dalam Bahasa Indonesia.

INFORMASI PRODUK:
- Nama Produk: ${productName}
${category ? `- Kategori: ${category}` : ''}
${specs && specs.length > 0 ? `- Spesifikasi: ${specs.join(', ')}` : ''}
- Target Market: ${targetMarket === 'premium' ? 'Premium (high-end, luxury)' : targetMarket === 'budget' ? 'Budget-friendly (value for money)' : 'General (mass market)'}
${currentDescription ? `- Deskripsi Saat Ini (untuk improvement): ${currentDescription}` : ''}

REQUIREMENTS:
1. Short Description: 1-2 kalimat ringkas (max 150 karakter), hook yang menarik perhatian
2. Long Description: 3-4 paragraf detail (300-400 kata):
   - Paragraph 1: Perkenalan produk dan unique selling point
   - Paragraph 2: Fitur dan keunggulan detail
   - Paragraph 3: Manfaat untuk customer
   - Paragraph 4: Call-to-action yang persuasif
3. Key Features: 5-7 bullet points fitur utama (singkat, jelas)
4. SEO Keywords: 8-10 keywords untuk SEO (bahasa Indonesia, relevan)

TONE & STYLE:
- ${targetMarket === 'premium' ? 'Elegant, sophisticated, profesional' : targetMarket === 'budget' ? 'Friendly, value-focused, relatable' : 'Conversational, engaging, trustworthy'}
- Gunakan emoji secukupnya (1-2 per section)
- Fokus pada benefit untuk customer, bukan hanya fitur
- Hindari hyperbola berlebihan
- SEO-friendly tapi tetap natural

OUTPUT FORMAT (JSON):
{
  "shortDescription": "...",
  "longDescription": "...",
  "keyFeatures": ["...", "...", ...],
  "seoKeywords": ["...", "...", ...]
}

Generate sekarang:`

    return prompt
  },

  parseAIResponse(aiResponse: string): GenerateDescriptionOutput | null {
    try {
      // Try to extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error('No JSON found in AI response')
        return null
      }

      const parsed = JSON.parse(jsonMatch[0])

      // Validate structure
      if (
        !parsed.shortDescription ||
        !parsed.longDescription ||
        !Array.isArray(parsed.keyFeatures) ||
        !Array.isArray(parsed.seoKeywords)
      ) {
        console.error('Invalid structure in parsed JSON')
        return null
      }

      return {
        shortDescription: parsed.shortDescription.trim(),
        longDescription: parsed.longDescription.trim(),
        keyFeatures: parsed.keyFeatures.filter((f: any) => typeof f === 'string' && f.trim()),
        seoKeywords: parsed.seoKeywords.filter((k: any) => typeof k === 'string' && k.trim()),
      }
    } catch (error) {
      console.error('Error parsing AI response:', error)
      return null
    }
  },

  async improveDescription(
    currentDescription: string,
    productName: string,
    improvements: string[]
  ): Promise<ApiResponse<{ improvedDescription: string }>> {
    try {
      const prompt = `Kamu adalah AI copywriter expert. Improve deskripsi produk berikut dengan fokus pada: ${improvements.join(', ')}.

Produk: ${productName}

Deskripsi Saat Ini:
${currentDescription}

Berikan versi yang lebih baik. Output dalam format JSON:
{
  "improvedDescription": "..."
}`

      const aiResponse = await generateCompletion(prompt, {
        temperature: 0.6,
        maxTokens: 800,
      })

      if (!aiResponse) {
        return errorResponse('Gagal improve deskripsi', ErrorCode.INTERNAL_ERROR)
      }

      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return errorResponse('Format response tidak valid', ErrorCode.INTERNAL_ERROR)
      }

      const parsed = JSON.parse(jsonMatch[0])
      return successResponse('Deskripsi berhasil di-improve', {
        improvedDescription: parsed.improvedDescription,
      })
    } catch (error) {
      console.error('Error improving description:', error)
      return errorResponse('Terjadi kesalahan saat improve deskripsi', ErrorCode.INTERNAL_ERROR)
    }
  },
}
