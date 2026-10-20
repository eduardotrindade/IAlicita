'use client'

import { useEffect, useRef, useState } from 'react'
import { chatCompletion } from '@/lib/aiService'

type Message = { id: string; role: 'user' | 'assistant'; content: string }

function uid() {
  return crypto.randomUUID()
}

export default function AssistenteJuridico() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { id: uid(), role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const chatMessages: { role: 'user' | 'assistant'; content: string }[] = [
        ...messages,
        { role: 'user', content: text },
      ]
      const response = await chatCompletion(chatMessages)
      setMessages((prev) => [...prev, { id: uid(), role: 'assistant', content: response.content }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          content: 'Erro ao consultar IA. Verifique a conexão.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col space-y-4">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Assistente Jurídico IA</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Tire dúvidas sobre Lei 14.133/2021, TCU e contratações públicas.
        </p>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-[var(--muted)]">
            Faça uma pergunta sobre licitações públicas, Lei 14.133/2021, TCU, etc.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-[var(--brand)] text-white'
                  : 'bg-[var(--surface-hover)] text-[var(--text)]'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="animate-pulse rounded-lg bg-[var(--surface-hover)] p-3 text-sm text-[var(--muted)]">
              Pensando...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua pergunta..."
          disabled={loading}
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="rounded-lg bg-[var(--brand)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] disabled:opacity-50"
        >
          {loading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  )
}
