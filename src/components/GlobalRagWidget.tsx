import { useState } from 'react'

export function GlobalRagWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'user' | 'ia', text: string}[]>([])
  const [inputVal, setInputVal] = useState('')

  const handleSend = () => {
    if(!inputVal.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: inputVal }])
    setInputVal('')
    setTimeout(() => {
        setMessages(prev => [...prev, {role: 'ia', text: 'Estou acessando nossa base RAG do TCU e Lei de Licitações (mock)... Tudo de acordo!'}])
    }, 800)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-[var(--brand)] p-4 shadow-xl text-white hover:bg-[var(--brand-hover)]"
      >
        <span className="flex items-center gap-2 font-bold text-sm">
          <span>🧠</span> Ask IA (RAG)
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col" style={{ height: '400px' }}>
          <div className="bg-[var(--brand)] text-white p-3 font-semibold text-sm flex justify-between items-center">
             <span>Assistente RAG Global</span>
             <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">X</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--surface)]">
            <div className="bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg p-2 text-xs text-[var(--text)] text-center">
              Acesso à Base: TCU, Lei 14.133, e Edital Atual.
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                 <div className={`max-w-[85%] p-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-[var(--brand)] text-white' : 'bg-[var(--surface-hover)] text-[var(--text)]'}`}>
                   {m.text}
                 </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-hover)] flex gap-2">
             <input 
               value={inputVal}
               onChange={(e) => setInputVal(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               type="text" 
               className="flex-1 rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm focus:border-[var(--brand)] focus:outline-none" 
               placeholder="Pergunte à IA..."
             />
             <button onClick={handleSend} className="bg-[var(--brand)] text-white px-3 py-1 rounded text-sm hover:bg-[var(--brand-hover)]">Enviar</button>
          </div>
        </div>
      )}
    </>
  )
}
