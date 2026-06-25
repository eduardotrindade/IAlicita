import { useState, useRef, useEffect } from 'react'
import { chatCompletion, getActiveProvider, getActiveModel } from '../services/aiService'

type Message = { role: 'user' | 'ia'; text: string }

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
  }, [messages])

  async function handleSend() {
    const text = inputVal.trim()
    if (!text || isLoading) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setInputVal('')
    setIsLoading(true)

    try {
      const chatMessages = [...messages, { role: 'user' as const, text }].map(m => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text,
      }))

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
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Fechar assistente IA' : 'Abrir assistente IA'}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-[var(--brand)] p-4 shadow-xl text-white hover:bg-[var(--brand-hover)]"
      >
        <span className="flex items-center gap-2 font-bold text-sm">
          <span aria-hidden>🧠</span> Ask IA (RAG)
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col" style={{ height: '400px' }}>
          <div className="bg-[var(--brand)] text-white p-3 font-semibold text-sm flex justify-between items-center">
             <div>
               <span>Assistente RAG Global</span>
               <span className="block text-[10px] font-normal opacity-75">{provider} / {model}</span>
             </div>
             <button type="button" onClick={() => setIsOpen(false)} aria-label="Fechar" className="text-white hover:text-gray-200">X</button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--surface)]">
            <div className="bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg p-2 text-xs text-[var(--text)] text-center">
              Acesso à Base: TCU, Lei 14.133, e Edital Atual.
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                 <div className={`max-w-[85%] p-2 rounded-lg text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-[var(--brand)] text-white' : 'bg-[var(--surface-hover)] text-[var(--text)]'}`}>
                   {m.text}
                 </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg p-2 text-sm text-[var(--muted)] animate-pulse">
                  Pensando...
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-hover)] flex gap-2">
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
               className="bg-[var(--brand)] text-white px-3 py-1 rounded text-sm hover:bg-[var(--brand-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isLoading ? '...' : 'Enviar'}
             </button>
          </div>
        </div>
      )}
    </>
  )
}
