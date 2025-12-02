import { createOpenAI } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'

// Initialize OpenAI provider with custom base URL
// Make sure to set OPENAI_API_KEY, OPENAI_API_BASE, and OPENAI_MODEL in your .env file
const apiKey = process.env['OPENAI_API_KEY']
const baseURL = process.env['OPENAI_API_BASE']
const defaultModelName = process.env['OPENAI_MODEL'] || 'GLM 4.6'

if (!apiKey && process.env.NODE_ENV !== 'test') {
  console.warn('⚠️ OPENAI_API_KEY is not set. AI features will not work.')
}

if (!baseURL && process.env.NODE_ENV !== 'test') {
  console.warn('⚠️ OPENAI_API_BASE is not set. Using default OpenAI base URL.')
}

// Create custom OpenAI provider with custom base URL
const openai = createOpenAI({
  apiKey: apiKey || 'dummy-key',
  baseURL: baseURL || 'https://api.openai.com/v1',
})

// Default model configuration
const defaultModel = openai(defaultModelName)

/**
 * Generate text completion (non-streaming)
 * @param prompt - The prompt to generate text from
 * @param options - Additional options (model, temperature, etc.)
 * @returns Generated text and metadata
 */
export async function generateCompletion(
  prompt: string,
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
    system?: string
  }
) {
  const model = options?.model ? openai(options.model) : defaultModel

  const result = await generateText({
    model,
    prompt,
    temperature: options?.temperature ?? 0.7,
    ...(options?.maxTokens !== undefined && { maxOutputTokens: options.maxTokens }),
    ...(options?.system !== undefined && { system: options.system }),
  })

  return {
    text: result.text,
    usage: result.usage,
    finishReason: result.finishReason,
  }
}

/**
 * Generate streaming text completion
 * @param prompt - The prompt to generate text from
 * @param options - Additional options (model, temperature, etc.)
 * @returns Text stream and metadata
 */
export async function generateStreamingCompletion(
  prompt: string,
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
    system?: string
    onFinish?: (result: { text: string; usage: any; finishReason: string }) => void
  }
) {
  const model = options?.model ? openai(options.model) : defaultModel

  const result = streamText({
    model,
    prompt,
    temperature: options?.temperature ?? 0.7,
    ...(options?.maxTokens !== undefined && { maxOutputTokens: options.maxTokens }),
    ...(options?.system !== undefined && { system: options.system }),
    ...(options?.onFinish !== undefined && { onFinish: options.onFinish }),
  })

  return result
}

/**
 * Generate chat completion (non-streaming)
 * @param messages - Array of chat messages
 * @param options - Additional options
 */
export async function generateChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
  }
) {
  const model = options?.model ? openai(options.model) : defaultModel

  const result = await generateText({
    model,
    messages,
    temperature: options?.temperature ?? 0.7,
    ...(options?.maxTokens !== undefined && { maxOutputTokens: options.maxTokens }),
  })

  return {
    text: result.text,
    usage: result.usage,
    finishReason: result.finishReason,
  }
}

/**
 * Generate streaming chat completion
 * @param messages - Array of chat messages
 * @param options - Additional options
 */
export async function generateStreamingChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
    onFinish?: (result: { text: string; usage: any; finishReason: string }) => void
  }
) {
  const model = options?.model ? openai(options.model) : defaultModel

  const result = streamText({
    model,
    messages,
    temperature: options?.temperature ?? 0.7,
    ...(options?.maxTokens !== undefined && { maxOutputTokens: options.maxTokens }),
    ...(options?.onFinish !== undefined && { onFinish: options.onFinish }),
  })

  return result
}

// Export providers for custom usage
export { openai, defaultModelName }
