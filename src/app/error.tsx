'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-20">
      <p className="text-base font-semibold text-[var(--text)]">Algo deu errado</p>
      <p className="max-w-md text-center text-sm text-[var(--muted)]">
        {error.message || 'Ocorreu um erro inesperado.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="text-sm font-medium text-[var(--accent)] hover:underline"
      >
        Tentar novamente
      </button>
    </div>
  )
}
