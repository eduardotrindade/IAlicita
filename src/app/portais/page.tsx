'use client'

import { useEffect, useMemo, useState } from 'react'
import { type PortalStatus, usePortals } from '@/hooks/usePortals'

type SortConfig = {
  key: keyof PortalStatus
  direction: 'ascending' | 'descending'
}

export default function Portais() {
  const { portais, isVerifying, handleVerification, clearAndReset } = usePortals()
  const [isTableVisible, setIsTableVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Define quantos itens por página
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nome', direction: 'ascending' })

  const filteredPortals = portais.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedAndFilteredPortals = useMemo(() => {
    const sortableItems = [...filteredPortals]
    sortableItems.sort((a, b) => {
      // Use `localeCompare` for robust string comparison
      const valA = a[sortConfig.key] ?? ''
      const valB = b[sortConfig.key] ?? ''

      if (valA < valB) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (valA > valB) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })
    return sortableItems
  }, [filteredPortals, sortConfig])

  // Lógica de Paginação
  const totalPages = Math.ceil(sortedAndFilteredPortals.length / itemsPerPage)
  const paginatedPortals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedAndFilteredPortals.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedAndFilteredPortals, currentPage])

  useEffect(() => {
    // Quando a verificação terminar (pela primeira vez ou manualmente), torna a tabela visível.
    if (!isVerifying) {
      setIsTableVisible(true)
    }
  }, [isVerifying])

  // Reseta para a primeira página ao filtrar ou reordenar
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const requestSort = (key: keyof PortalStatus) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
    setCurrentPage(1)
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <header>
          <h2 className="text-base font-semibold text-[var(--text)]">Diretório de Portais</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Status atual de integração de portais de licitações.
          </p>
        </header>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearAndReset}
            disabled={isVerifying}
            className="inline-flex items-center gap-2 rounded-md bg-transparent px-3 py-2 text-sm font-medium text-[var(--muted)] shadow-sm ring-1 ring-inset ring-[var(--border)] transition-colors hover:bg-[var(--hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Limpar Cache
          </button>
          <button
            type="button"
            onClick={handleVerification}
            disabled={isVerifying}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text)] shadow-sm ring-1 ring-inset ring-[var(--border)] transition-colors hover:bg-[var(--hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className={`h-4 w-4 ${isVerifying ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isVerifying ? 'Verificando...' : 'Verificar Novamente'}
          </button>
        </div>
      </div>

      <div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-[var(--muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            name="search"
            id="search"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="block w-full rounded-md border-0 bg-[var(--surface)] py-1.5 pl-10 text-[var(--text)] ring-1 ring-inset ring-[var(--border)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-inset focus:ring-[var(--accent)] sm:text-sm sm:leading-6"
            placeholder="Filtrar por nome ou descrição..."
          />
        </div>
      </div>

      <div
        className={`overflow-x-auto rounded-xl border border-[var(--border)] transition-opacity duration-500 ${
          isTableVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)] hover:bg-[var(--hover)]">
                <button
                  type="button"
                  onClick={() => requestSort('nome')}
                  className="flex w-full items-center gap-1"
                >
                  <span>Portal</span>
                  {sortConfig.key === 'nome' && (
                    <span className="ml-auto">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)] hover:bg-[var(--hover)]">
                <button
                  type="button"
                  onClick={() => requestSort('status')}
                  className="flex w-full items-center gap-1"
                >
                  <span>Status</span>
                  {sortConfig.key === 'status' && (
                    <span className="ml-auto">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)] hover:bg-[var(--hover)]">
                <button
                  type="button"
                  onClick={() => requestSort('temApi')}
                  className="flex w-full items-center gap-1"
                >
                  <span>API</span>
                  {sortConfig.key === 'temApi' && (
                    <span className="ml-auto">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)] hover:bg-[var(--hover)]">
                <button
                  type="button"
                  onClick={() => requestSort('integrado')}
                  className="flex w-full items-center gap-1"
                >
                  <span>Integrado</span>
                  {sortConfig.key === 'integrado' && (
                    <span className="ml-auto">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Descrição
              </th>
            </tr>
          </thead>
          <tbody>
            {isVerifying &&
            portais.every((p) => p.status !== 'online' && p.status !== 'offline') ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-sm text-[var(--muted)]">
                  Verificando status dos portais...
                </td>
              </tr>
            ) : paginatedPortals.length > 0 ? (
              paginatedPortals.map((p) => (
                <tr key={p.nome} className="border-b border-[var(--border)] last:border-0">
                  <td className="p-3 text-[var(--text)]">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--accent)]"
                    >
                      {p.nome}
                    </a>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        p.status === 'online'
                          ? 'bg-green-900/30 text-green-400'
                          : p.status === 'offline'
                            ? 'bg-red-900/30 text-red-400'
                            : 'animate-pulse bg-gray-700/30 text-gray-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          p.status === 'online'
                            ? 'bg-green-500'
                            : p.status === 'offline'
                              ? 'bg-red-500'
                              : 'bg-gray-500 animate-pulse'
                        }`}
                      />
                      {p.status === 'online'
                        ? 'Online'
                        : p.status === 'offline'
                          ? 'Offline'
                          : p.status === 'verificando'
                            ? 'Verificando...'
                            : 'Não verificado'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs ${p.temApi ? 'text-green-400' : 'text-[var(--muted)]'}`}
                    >
                      {p.temApi ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs ${
                        p.integrado === 'sim'
                          ? 'text-green-400'
                          : p.integrado === 'pendente'
                            ? 'text-yellow-400'
                            : 'text-[var(--muted)]'
                      }`}
                    >
                      {p.integrado === 'sim'
                        ? 'Sim'
                        : p.integrado === 'pendente'
                          ? 'Pendente'
                          : 'N/A'}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-[var(--muted)]">{p.descricao}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-sm text-[var(--muted)]">
                  Nenhum portal encontrado para "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-[var(--muted)]">
            Página <span className="font-medium text-[var(--text)]">{currentPage}</span> de{' '}
            <span className="font-medium text-[var(--text)]">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--text)] shadow-sm ring-1 ring-inset ring-[var(--border)] transition-colors hover:bg-[var(--hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>← Anterior</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--text)] shadow-sm ring-1 ring-inset ring-[var(--border)] transition-colors hover:bg-[var(--hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Próximo →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
