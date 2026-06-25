import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { ScrollToTop } from './ScrollToTop'
import { GlobalRagWidget } from './GlobalRagWidget'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <ScrollToTop />
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--header-bg)]/95 backdrop-blur px-8 py-4">
          <h1 className="text-lg font-semibold tracking-tight">
            Painel executivo
          </h1>
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            Visão agregada de licitações, score técnico e competitividade.
          </p>
        </header>
        <main className="flex-1 overflow-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
      <GlobalRagWidget />
    </div>
  )
}
