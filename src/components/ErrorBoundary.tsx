import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode; fallback?: ReactNode }
type State = { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    void info
    void error
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <p className="text-base font-semibold text-[var(--text)]">Algo deu errado</p>
          <p className="text-sm text-[var(--muted)] max-w-md text-center">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
