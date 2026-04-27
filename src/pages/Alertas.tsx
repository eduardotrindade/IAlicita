export function Alertas() {
  const KWS = ['SOC', 'SIEM', 'Pentest', 'Threat Intelligence', 'XDR/EDR']

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Meus Alertas MOCK</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Receba notificações push ou por e-mail/WhatsApp quando uma licitação aderente for postada.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--text)]">Palavras-chave ativas</h3>
          <div className="mt-4 space-y-3">
            {KWS.map((k) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-sm text-[var(--text)]">{k}</span>
                <button className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2">
                  <span className="sr-only">Toggle {k}</span>
                  <span className="pointer-events-none absolute mx-auto h-4 w-9 rounded-full bg-[var(--brand)] transition-colors duration-200 ease-in-out"></span>
                  <span className="pointer-events-none absolute left-0 inline-block h-5 w-5 translate-x-4 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out"></span>
                </button>
              </div>
            ))}
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
