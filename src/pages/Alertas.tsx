import { useState } from 'react'

const STORAGE_KEY = 'ialicita_alert_keywords'

function loadKeywords(): { word: string; active: boolean }[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return [
    { word: 'engenharia', active: true },
    { word: 'construção', active: true },
    { word: 'escolas', active: true },
    { word: 'saneamento', active: true },
  ]
}

export function Alertas() {
  const [keywords, setKeywords] = useState(loadKeywords)
  const [newWord, setNewWord] = useState('')

  function persist(next: { word: string; active: boolean }[]) {
    setKeywords(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function addKeyword() {
    const w = newWord.trim()
    if (!w) return
    if (keywords.some((k) => k.word.toLowerCase() === w.toLowerCase())) return
    persist([...keywords, { word: w, active: true }])
    setNewWord('')
  }

  function removeKeyword(word: string) {
    persist(keywords.filter((k) => k.word !== word))
  }

  function toggleKeyword(word: string) {
    persist(
      keywords.map((k) =>
        k.word === word ? { ...k, active: !k.active } : k,
      ),
    )
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Meus Alertas</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Gerencie palavras-chave para receber notificações quando licitações aderentes forem publicadas.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--text)]">Palavras-chave</h3>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
              placeholder="Nova palavra-chave..."
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
            />
            <button
              type="button"
              onClick={addKeyword}
              className="rounded-lg bg-[var(--brand)] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[var(--brand-hover)]"
            >
              + Add
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {keywords.map((k) => (
              <div
                key={k.word}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2"
              >
                <span
                  className={`text-sm ${
                    k.active ? 'text-[var(--text)]' : 'text-[var(--muted)] line-through'
                  }`}
                >
                  {k.word}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleKeyword(k.word)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                      k.active ? 'bg-[var(--brand)]' : 'bg-[var(--border)]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        k.active ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeKeyword(k.word)}
                    className="text-xs text-red-500 hover:text-red-700"
                    title="Remover"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {keywords.length === 0 ? (
              <p className="text-xs text-[var(--muted)] py-2">
                Nenhuma palavra-chave. Adicione acima.
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--text)]">Canais de Notificação</h3>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                E-mail (diário)
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                Telegram Bot
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <input type="checkbox" className="rounded border-gray-300" />
                WhatsApp (Beta)
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
