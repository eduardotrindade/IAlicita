export function RoboLances() {
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h2 className="text-base font-semibold text-[var(--text)]">Agente Autônomo de Disputa (Robô de Lances)</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Configure os parâmetros da IA para cobrir lances na Sala de Operações automaticamente.</p>
      </header>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm space-y-4">
           <h3 className="font-semibold text-sm text-[var(--text)]">Estratégia do Robô</h3>
           
           <div>
             <label className="block text-xs text-[var(--text)] mb-1">Limite Mínimo de Margem (R$)</label>
             <input type="text" className="w-full rounded border border-[var(--border)] bg-[var(--surface)] p-2 text-sm text-[var(--text)]" defaultValue="80.000,00" />
           </div>

           <div>
             <label className="block text-xs text-[var(--text)] mb-1">Intervalo de Desconto (%)</label>
             <select className="w-full rounded border border-[var(--border)] bg-[var(--surface)] p-2 text-sm text-[var(--text)]">
                <option>Cobrir em 0,5% o menor lance</option>
                <option>Cobrir em 1,0% o menor lance</option>
                <option>Apenas empatar se ME/EPP</option>
             </select>
           </div>
           
           <div className="pt-2">
             <label className="flex items-center gap-2 text-sm text-[var(--text)]">
                <input type="checkbox" defaultChecked className="rounded text-[var(--brand)]" />
                Derrubar lance agressivamente nos 30s finais
             </label>
           </div>
        </div>

        <div className="rounded border border-green-500 bg-green-50 dark:bg-green-900/10 p-5 shadow-sm text-center flex flex-col justify-center">
           <p className="text-green-800 dark:text-green-300 font-bold mb-2">STATUS: ROBÔ ATIVO (SIMULAÇÃO)</p>
           <p className="text-xs text-green-700 dark:text-green-400 mb-4 text-left">
             O Agente está conectado ao Pregão 012/2026 (Ministério Público). Ele calculará lances otimizados baseado nos oponentes.
           </p>
           <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm w-full">
             Pausar Imediatamente
           </button>
        </div>
      </div>
    </div>
  )
}
