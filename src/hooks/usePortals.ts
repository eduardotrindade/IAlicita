import { useCallback, useEffect, useState } from 'react'
import { healthCheckComprasGov } from '@/lib/comprasGovApi'
import { searchPncp } from '@/lib/pncpApi'
import { ApiError, withRetry } from '@/lib/retry'
import { healthCheckTransparencia } from '@/lib/transparenciaApi'

export type PortalStatus = {
  nome: string
  url: string
  temApi: boolean
  integrado: 'sim' | 'pendente' | 'nao_aplicavel'
  descricao: string
  status: 'online' | 'offline' | 'verificando' | 'nao_verificado'
  ultimaBusca?: number
}

const initialPortals: PortalStatus[] = [
  {
    nome: 'PNCP',
    url: 'https://pncp.gov.br',
    temApi: true,
    integrado: 'sim',
    descricao: 'Portal Nacional de Contratações Públicas — API integrada',
    status: 'nao_verificado',
  },
  {
    nome: 'Compras.gov.br Dados Abertos',
    url: 'https://dadosabertos.compras.gov.br',
    temApi: true,
    integrado: 'pendente',
    descricao: 'API REST disponível — pendente de integração',
    status: 'nao_verificado',
  },
  {
    nome: 'Portal da Transparência',
    url: 'https://api.portaldatransparencia.gov.br',
    temApi: true,
    integrado: 'pendente',
    descricao: 'API disponível via redirect — pendente de integração',
    status: 'nao_verificado',
  },
  {
    nome: 'BEC-SP',
    url: 'https://www.bec.sp.gov.br',
    temApi: false,
    integrado: 'nao_aplicavel',
    descricao: 'Bolsa Eletrônica de Compras de SP — sem API pública',
    status: 'nao_verificado',
  },
  {
    nome: 'Compras MG',
    url: 'https://www.compras.mg.gov.br',
    temApi: false,
    integrado: 'nao_aplicavel',
    descricao: 'Portal de Compras de MG — sem API pública documentada',
    status: 'nao_verificado',
  },
  {
    nome: 'SEPLAG/MT (SIAG)',
    url: 'https://aquisicoes.seplag.mt.gov.br/sgc/faces/pub/sgc/edlicitacoes/PropostaFornecedorEDLConsultaPageList.jsp',
    temApi: false,
    integrado: 'nao_aplicavel',
    descricao: 'Mato Grosso — sem API pública',
    status: 'nao_verificado',
  },
  {
    nome: 'Portal de Compras PA',
    url: 'https://www.portaldecompras.pa.gov.br',
    temApi: false,
    integrado: 'nao_aplicavel',
    descricao: 'Pará — sem API pública documentada',
    status: 'nao_verificado',
  },
  {
    nome: 'Compras BA',
    url: 'https://www.compras.ba.gov.br',
    temApi: false,
    integrado: 'nao_aplicavel',
    descricao: 'Bahia — sem API pública documentada',
    status: 'nao_verificado',
  },
  {
    nome: 'CEIS/CNEP',
    url: 'https://portaldacontratacao.gov.br/ceis',
    temApi: true,
    integrado: 'pendente',
    descricao: 'Cadastro de Empresas Inidôneas — API disponível',
    status: 'nao_verificado',
  },
]

const STORAGE_KEY = 'smartia_portal_status'

export function usePortals() {
  // Inicializa o estado com uma função para tentar ler do localStorage de forma segura.
  const [portais, setPortais] = useState<PortalStatus[]>(() => {
    // Esta função só roda no cliente na primeira renderização.
    if (typeof window === 'undefined') {
      return initialPortals
    }
    try {
      const storedPortals = window.localStorage.getItem(STORAGE_KEY)
      return storedPortals ? JSON.parse(storedPortals) : initialPortals
    } catch (error) {
      console.error('Failed to read from localStorage:', error)
      return initialPortals
    }
  })
  const [isVerifying, setIsVerifying] = useState(false)

  const verifyPortal = useCallback(async (portal: PortalStatus) => {
    setPortais((prev) =>
      prev.map((p) => (p.nome === portal.nome ? { ...p, status: 'verificando' } : p)),
    )

    try {
      let newStatus: Partial<PortalStatus> = {}
      await withRetry(async () => {
        if (portal.nome === 'PNCP') {
          const result = await searchPncp({ q: 'teste', tam_pagina: 1 })
          newStatus = { status: 'online', ultimaBusca: result.length }
        } else if (portal.nome === 'Portal da Transparência') {
          await healthCheckTransparencia()
          newStatus = { status: 'online' }
        } else if (portal.nome === 'Compras.gov.br Dados Abertos') {
          await healthCheckComprasGov()
          newStatus = { status: 'online' }
        } else {
          const response = await fetch(`/api/check-url?url=${encodeURIComponent(portal.url)}`)
          if (!response.ok) {
            // Lançamos um erro customizado com o status para a lógica de retry
            throw new ApiError(response.status, `Falha ao verificar ${portal.nome}`)
          }
          newStatus = { status: 'online' }
        }
      })

      setPortais((prev) => prev.map((p) => (p.nome === portal.nome ? { ...p, ...newStatus } : p)))
    } catch (_error) {
      setPortais((prev) =>
        prev.map((p) => (p.nome === portal.nome ? { ...p, status: 'offline' } : p)),
      )
    }
  }, [])

  const handleVerification = useCallback(async () => {
    setIsVerifying(true)

    // Em vez de Promise.all, criamos uma fila com concorrência limitada.
    const queue = [...portais]
    const concurrencyLimit = 3 // Processa no máximo 3 portais ao mesmo tempo.
    const promises: Promise<void>[] = []

    for (let i = 0; i < concurrencyLimit; i++) {
      const worker = async () => {
        while (queue.length > 0) {
          const portal = queue.shift() // Pega o próximo item da fila
          if (portal) {
            await verifyPortal(portal)
          }
        }
      }
      promises.push(worker())
    }

    await Promise.all(promises) // Espera todos os workers terminarem.

    setPortais((currentPortals) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPortals))
      } catch (error) {
        console.error('Failed to write to localStorage:', error)
      }
      return currentPortals
    })
    setIsVerifying(false)
  }, [portais, verifyPortal])

  useEffect(() => {
    handleVerification()
  }, [handleVerification])

  const clearAndReset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
    // Reseta o estado para a lista original e dispara uma nova verificação
    setPortais(initialPortals)
  }, [])

  return { portais, isVerifying, handleVerification, clearAndReset }
}
