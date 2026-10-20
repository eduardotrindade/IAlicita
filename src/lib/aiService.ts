export type AiProvider = 'siliconflow' | 'aimlap' | 'huggingface'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AiResponse {
  content: string
  provider: AiProvider
  model: string
}

export async function chatCompletion(messages: ChatMessage[]): Promise<AiResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`AI API error ${res.status}: ${err}`)
  }

  return res.json()
}

export function getActiveProvider(): AiProvider {
  return 'siliconflow'
}

export function getActiveModel(): string {
  return 'Qwen/Qwen2.5-72B-Instruct'
}
