'use client'

import type { ReactNode } from 'react'
import { GlobalRagWidget } from '@/components/GlobalRagWidget'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Sidebar } from '@/components/Sidebar'

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <ScrollToTop />
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--header-bg)]/95 px-8 py-4 backdrop-blur">
          <h1 className="text-lg font-semibold tracking-tight">Painel executivo</h1>
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            Visão agregada de licitações, score técnico e competitividade.
          </p>
        </header>
        <main className="flex-1 overflow-auto px-8 py-6">{children}</main>
      </div>
      <GlobalRagWidget />
    </div>
  )
}
