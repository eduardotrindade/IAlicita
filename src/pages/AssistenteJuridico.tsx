import { useState, useRef, useEffect } from 'react'
import { chatCompletion, getActiveProvider, getActiveModel } from '../services/aiService'

type Message = { role: 'user' | 'ia'; text: string; source?: string }

export function AssistenteJuridico() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ia', text: 'Olá! Sou seu assistente de Licitações. Como posso ajudar com a Lei 14.133 ou jurisprudências hoje?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setIsLoading(true)

    try {
      const chatMessages = messages.map(m => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text,
      }))
      chatMessages.push({ role: 'user', content: text })

      const response = await chatCompletion(chatMessages)
      setMessages(prev => [...prev, { role: 'ia', text: response.content }])
    } catch {
      setMessages(prev => [...prev, { role: 'ia', text: 'Erro ao consultar IA. Verifique a conexão e tente novamente.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const provider = getActiveProvider()
  const model = getActiveModel()

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4 max-w-4xl">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Assistente Jurídico (Lei 14.133/21)</h2>
        <p className="text-sm text-[var(--muted)]">
          Jurisprudência, Acórdãos do TCU e Leis de Licitação.
          <span className="ml-2 text-[10px] opacity-60">[{provider} / {model}]</span>
        </p>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-[var(--brand)] text-white'
                : 'bg-[var(--surface-hover)] text-[var(--text)]'
            }`}>
              {m.text}
            </div>
            {m.source && (
              <span className="text-xs text-[var(--muted)] mt-1 ml-2">Fonte: {m.source}</span>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--muted)] animate-pulse">
              Consultando base de dados...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
          className="flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:ring-[var(--brand)] disabled:opacity-50"
          placeholder="Digite sua dúvida sobre leis e acórdãos..."
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="rounded-md bg-[var(--brand)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  )
}
