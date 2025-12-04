import OpenAI from 'openai'

// Initialize OpenAI client with NVIDIA API configuration
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

// Create OpenAI client instance
const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key',
  baseURL: baseURL || 'https://api.openai.com/v1',
})

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
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []

  if (options?.system) {
    messages.push({ role: 'system', content: options.system })
  }
  messages.push({ role: 'user', content: prompt })

  const params: Record<string, unknown> = {
    model: options?.model || defaultModelName,
    messages,
    temperature: options?.temperature ?? 0.7,
  }
  if (options?.maxTokens !== undefined) {
    params['max_tokens'] = options.maxTokens
  }
  const completion = await openai.chat.completions.create(params as any)

  return {
    text: completion.choices[0]?.message?.content || '',
    usage: completion.usage,
    finishReason: completion.choices[0]?.finish_reason || 'unknown',
  }
}

/**
 * Generate streaming text completion
 * @param prompt - The prompt to generate text from
 * @param options - Additional options (model, temperature, etc.)
 * @returns Text stream
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
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []

  if (options?.system) {
    messages.push({ role: 'system', content: options.system })
  }
  messages.push({ role: 'user', content: prompt })

  const params: Record<string, unknown> = {
    model: options?.model || defaultModelName,
    messages,
    temperature: options?.temperature ?? 0.7,
    stream: true,
  }
  if (options?.maxTokens !== undefined) {
    params['max_tokens'] = options.maxTokens
  }
  const stream = await openai.chat.completions.create(params as any)

  return stream
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
  const params: Record<string, unknown> = {
    model: options?.model || defaultModelName,
    messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    temperature: options?.temperature ?? 0.7,
  }
  if (options?.maxTokens !== undefined) {
    params['max_tokens'] = options.maxTokens
  }
  const completion = await openai.chat.completions.create(params as any)

  return {
    text: completion.choices[0]?.message?.content || '',
    usage: completion.usage,
    finishReason: completion.choices[0]?.finish_reason || 'unknown',
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
  const params: Record<string, unknown> = {
    model: options?.model || defaultModelName,
    messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    temperature: options?.temperature ?? 0.7,
    stream: true,
  }
  if (options?.maxTokens !== undefined) {
    params['max_tokens'] = options.maxTokens
  }
  const stream = await openai.chat.completions.create(params as any)

  return stream
}

// Export client and model name for custom usage
export { openai, defaultModelName }
