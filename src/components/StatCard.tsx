type Props = {
  label: string
  value: string
  hint?: string
}

export function StatCard({ label, value, hint }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text)]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>}
    </div>
  )
}
