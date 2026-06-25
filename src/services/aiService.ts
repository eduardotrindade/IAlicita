export type AiProvider = 'siliconflow' | 'aimlap' | 'huggingface'

interface AiConfig {
  provider: AiProvider
  siliconflow: { url: string; key: string; model: string }
  aimlap: { url: string; key: string; model: string }
  huggingface: { url: string; key: string; model: string }
}

function getConfig(): AiConfig {
  return {
    provider: (import.meta.env.VITE_AI_PROVIDER as AiProvider) || 'siliconflow',
    siliconflow: {
      url: import.meta.env.VITE_AI_SILICONFLOW_URL || 'https://api.siliconflow.cn/v1',
      key: import.meta.env.VITE_AI_SILICONFLOW_KEY || '',
      model: import.meta.env.VITE_AI_SILICONFLOW_MODEL || 'Qwen/Qwen2.5-72B-Instruct',
    },
    aimlap: {
      url: import.meta.env.VITE_AI_AIML_URL || 'https://api.aimlapi.com/v1',
      key: import.meta.env.VITE_AI_AIML_KEY || '',
      model: import.meta.env.VITE_AI_AIML_MODEL || 'openai/gpt-4o-mini',
    },
    huggingface: {
      url: import.meta.env.VITE_AI_HF_URL || 'https://api-inference.huggingface.co/models/',
      key: import.meta.env.VITE_AI_HF_KEY || '',
      model: import.meta.env.VITE_AI_HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3',
    },
  }
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AiResponse {
  content: string
  provider: AiProvider
  model: string
}

const SYSTEM_PROMPT = `Você é um assistente especializado em licitações públicas brasileiras.
Responda em português brasileiro de forma clara e objetiva.
Base suas respostas na Lei 14.133/2021 (Nova Lei de Licitações), Lei 14.137/2021, regulamentos do TCU e boas práticas de contratações públicas.
Quando não souber a resposta, diga honestamente que não tem informação suficiente.
Cite artigos e fontes quando possível.`

async function callOpenAiCompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[]
): Promise<AiResponse> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`AI API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content || 'Sem resposta do modelo.'
  return { content, provider: getConfig().provider, model }
}

async function callHuggingFace(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[]
): Promise<AiResponse> {
  const prompt = messages
    .map(m => (m.role === 'system' ? `<s>[INST] ${m.content}\n\n` :
      m.role === 'user' ? `[INST] ${m.content} [/INST]\n` :
      `${m.content}\n`))
    .join('')

  const res = await fetch(`${baseUrl}${model}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7,
        return_full_text: false,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HuggingFace API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const content = Array.isArray(data) ? data[0]?.generated_text : data.generated_text || 'Sem resposta do modelo.'
  return { content, provider: 'huggingface', model }
}

export async function chatCompletion(messages: ChatMessage[]): Promise<AiResponse> {
  const config = getConfig()
  const withSystem: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ]

  switch (config.provider) {
    case 'siliconflow':
      return callOpenAiCompatible(
        config.siliconflow.url,
        config.siliconflow.key,
        config.siliconflow.model,
        withSystem
      )
    case 'aimlap':
      return callOpenAiCompatible(
        config.aimlap.url,
        config.aimlap.key,
        config.aimlap.model,
        withSystem
      )
    case 'huggingface':
      return callHuggingFace(
        config.huggingface.url,
        config.huggingface.key,
        config.huggingface.model,
        withSystem
      )
    default:
      throw new Error(`Provider desconhecido: ${config.provider}`)
  }
}

export function getActiveProvider(): AiProvider {
  return getConfig().provider
}

export function getActiveModel(): string {
  const config = getConfig()
  return config[config.provider].model
}
