import { act, renderHook, waitFor } from '@testing-library/react'
import { healthCheckComprasGov } from '@/lib/comprasGovApi'
import { searchPncp } from '@/lib/pncpApi'
import { healthCheckTransparencia } from '@/lib/transparenciaApi'
import { usePortals } from '../usePortals'

// 1. Mock das dependências externas
jest.mock('@/lib/pncpApi', () => ({
  searchPncp: jest.fn(),
}))
jest.mock('@/lib/transparenciaApi', () => ({
  healthCheckTransparencia: jest.fn(),
}))
jest.mock('@/lib/comprasGovApi', () => ({
  healthCheckComprasGov: jest.fn(),
}))

// Tipagem para o mock para termos autocomplete e segurança de tipos
const mockedSearchPncp = searchPncp as jest.Mock
const mockedHealthCheckTransparencia = healthCheckTransparencia as jest.Mock
const mockedHealthCheckComprasGov = healthCheckComprasGov as jest.Mock

describe('usePortals Hook', () => {
  // Limpa os mocks e o localStorage antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock do fetch global
    global.fetch = jest.fn()
  })

  it('deve iniciar com o estado correto e verificar os portais automaticamente', async () => {
    // 2. Configuração do cenário de sucesso
    mockedSearchPncp.mockResolvedValue([{ id: '1' }])
    mockedHealthCheckTransparencia.mockResolvedValue(true)
    mockedHealthCheckComprasGov.mockResolvedValue(true)
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true }) // Simula um status 'online' para os outros

    // 3. Renderiza o hook
    const { result } = renderHook(() => usePortals())

    // 4. Asserções e espera por atualizações assíncronas
    // Verifica o estado inicial (antes do useEffect assíncrono terminar)
    expect(result.current.isVerifying).toBe(true)
    expect(result.current.portais[0].status).toBe('verificando')

    // Aguarda a conclusão de todas as promises
    await waitFor(() => {
      // Verifica se o estado de 'verificando' foi desativado
      expect(result.current.isVerifying).toBe(false)
    })

    // Verifica o estado final
    const pncpPortal = result.current.portais.find((p) => p.nome === 'PNCP')
    const transparenciaPortal = result.current.portais.find(
      (p) => p.nome === 'Portal da Transparência',
    )
    const becPortal = result.current.portais.find((p) => p.nome === 'BEC-SP')

    expect(pncpPortal?.status).toBe('online')
    expect(pncpPortal?.ultimaBusca).toBe(1) // O resultado do mock tinha 1 item
    expect(transparenciaPortal?.status).toBe('online')
    expect(becPortal?.status).toBe('online')

    // Verifica se as APIs foram chamadas
    expect(mockedSearchPncp).toHaveBeenCalledTimes(1)
    expect(mockedHealthCheckTransparencia).toHaveBeenCalledTimes(1)
    expect(mockedHealthCheckComprasGov).toHaveBeenCalledTimes(1)
    // 9 portais no total - 3 com verificação específica = 6
    expect(global.fetch).toHaveBeenCalledTimes(6)
  })

  it('deve lidar com falhas na verificação e marcar os portais como offline', async () => {
    // 2. Configuração do cenário de falha
    mockedSearchPncp.mockRejectedValue(new Error('API do PNCP indisponível'))
    mockedHealthCheckTransparencia.mockRejectedValue(new Error('API do Transparência indisponível'))
    mockedHealthCheckComprasGov.mockRejectedValue(new Error('API do Compras.gov indisponível'))
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false }) // Outros portais falham

    // 3. Renderiza o hook
    const { result } = renderHook(() => usePortals())

    // 4. Aguarda a conclusão
    await waitFor(() => {
      expect(result.current.isVerifying).toBe(false)
    })

    // Verifica o estado final
    const pncpPortal = result.current.portais.find((p) => p.nome === 'PNCP')
    const transparenciaPortal = result.current.portais.find(
      (p) => p.nome === 'Portal da Transparência',
    )
    const becPortal = result.current.portais.find((p) => p.nome === 'BEC-SP')

    expect(pncpPortal?.status).toBe('offline')
    expect(transparenciaPortal?.status).toBe('offline')
    expect(becPortal?.status).toBe('offline')

    // Verifica se as APIs foram chamadas
    expect(mockedSearchPncp).toHaveBeenCalledTimes(1)
    expect(mockedHealthCheckTransparencia).toHaveBeenCalledTimes(1)
    expect(mockedHealthCheckComprasGov).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledTimes(6)
  })

  it('deve re-verificar os portais quando handleVerification é chamado manualmente', async () => {
    // --- Primeira verificação (automática, com falha) ---
    mockedSearchPncp.mockRejectedValue(new Error('API Offline'))
    mockedHealthCheckTransparencia.mockRejectedValue(new Error('API Offline'))
    mockedHealthCheckComprasGov.mockRejectedValue(new Error('API Offline'))
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false })

    const { result } = renderHook(() => usePortals())

    await waitFor(() => expect(result.current.isVerifying).toBe(false))

    // Confirma que o primeiro status é 'offline'
    expect(result.current.portais[0].status).toBe('offline')

    // Limpa os contadores de chamadas dos mocks
    jest.clearAllMocks()

    // --- Segunda verificação (manual, com sucesso) ---
    // Reconfigura os mocks para um cenário de sucesso
    mockedSearchPncp.mockResolvedValue([{ id: '1' }, { id: '2' }])
    mockedHealthCheckTransparencia.mockResolvedValue(true)
    mockedHealthCheckComprasGov.mockResolvedValue(true)
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true })

    // 5. Dispara a ação do usuário (ou do componente)
    act(() => {
      result.current.handleVerification()
    })

    // Verifica o estado durante a verificação manual
    expect(result.current.isVerifying).toBe(true)

    // Aguarda a conclusão
    await waitFor(() => expect(result.current.isVerifying).toBe(false))

    // Verifica o estado final após a verificação manual
    const pncpPortal = result.current.portais.find((p) => p.nome === 'PNCP')
    expect(pncpPortal?.status).toBe('online')
    expect(pncpPortal?.ultimaBusca).toBe(2) // O novo mock retornou 2 itens

    // Verifica se as APIs foram chamadas novamente
    expect(mockedSearchPncp).toHaveBeenCalledTimes(1)
    expect(mockedHealthCheckTransparencia).toHaveBeenCalledTimes(1)
    expect(mockedHealthCheckComprasGov).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledTimes(6)
  })
})
