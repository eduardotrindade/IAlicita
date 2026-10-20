'use client'

import { useEffect, useRef, useState } from 'react'
import { chatCompletion } from '@/lib/aiService'

type Message = { id: string; role: 'user' | 'ia'; text: string }

export function GlobalRagWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputVal, setInputVal] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  async function handleSend() {
    const text = inputVal.trim()
    if (!text || isLoading) return

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text }])
    setInputVal('')
    setIsLoading(true)

    try {
      const chatMessages = [...messages, { role: 'user', text }].map((m) => ({
        role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }))

      const response = await chatCompletion(chatMessages)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'ia', text: response.content },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'ia',
          text: 'Erro ao consultar IA. Verifique a conexão e tente novamente.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Fechar assistente IA' : 'Abrir assistente IA'}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-[var(--brand)] p-4 text-xl text-white shadow-xl hover:bg-[var(--brand-hover)]"
      >
        IA
      </button>

      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-80 flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl sm:w-96"
          style={{ height: '400px' }}
        >
          <div className="flex items-center justify-between bg-[var(--brand)] p-3 text-sm font-semibold text-white">
            <span>Assistente RAG Global</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar"
              className="text-white hover:text-gray-200"
            >
              X
            </button>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[var(--surface)] p-4">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-2 text-center text-xs text-[var(--text)]">
              Acesso à Base: TCU, Lei 14.133, e Edital Atual.
            </div>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-lg p-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-[var(--brand)] text-white'
                      : 'bg-[var(--surface-hover)] text-[var(--text)]'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="animate-pulse rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-2 text-sm text-[var(--muted)]">
                  Pensando...
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 border-t border-[var(--border)] bg-[var(--surface-hover)] p-3">
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              type="text"
              disabled={isLoading}
              className="flex-1 rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm focus:border-[var(--brand)] focus:outline-none disabled:opacity-50"
              placeholder="Pergunte à IA..."
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || !inputVal.trim()}
              className="rounded bg-[var(--brand)] px-3 py-1 text-sm text-white hover:bg-[var(--brand-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
