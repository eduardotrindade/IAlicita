import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'

const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Pipeline = lazy(() => import('./pages/Pipeline').then(m => ({ default: m.Pipeline })))
const Alertas = lazy(() => import('./pages/Alertas').then(m => ({ default: m.Alertas })))
const Licitacoes = lazy(() => import('./pages/Licitacoes').then(m => ({ default: m.Licitacoes })))
const ClassificacaoIA = lazy(() => import('./pages/ClassificacaoIA').then(m => ({ default: m.ClassificacaoIA })))
const Matchmaking = lazy(() => import('./pages/Matchmaking').then(m => ({ default: m.Matchmaking })))
const MapaInteligencia = lazy(() => import('./pages/MapaInteligencia').then(m => ({ default: m.MapaInteligencia })))
const MonitorPCA = lazy(() => import('./pages/MonitorPCA').then(m => ({ default: m.MonitorPCA })))
const AssistenteJuridico = lazy(() => import('./pages/AssistenteJuridico').then(m => ({ default: m.AssistenteJuridico })))
const PesquisaPrecos = lazy(() => import('./pages/PesquisaPrecos').then(m => ({ default: m.PesquisaPrecos })))
const AnalisadorEspecificacoes = lazy(() => import('./pages/AnalisadorEspecificacoes').then(m => ({ default: m.AnalisadorEspecificacoes })))
const AnalisadorAtestados = lazy(() => import('./pages/AnalisadorAtestados').then(m => ({ default: m.AnalisadorAtestados })))
const CertidoesNegativas = lazy(() => import('./pages/CertidoesNegativas').then(m => ({ default: m.CertidoesNegativas })))
const Dod = lazy(() => import('./pages/Dod').then(m => ({ default: m.Dod })))
const Etp = lazy(() => import('./pages/Etp').then(m => ({ default: m.Etp })))
const Tr = lazy(() => import('./pages/Tr').then(m => ({ default: m.Tr })))
const Empresas = lazy(() => import('./pages/Empresas').then(m => ({ default: m.Empresas })))
const Portais = lazy(() => import('./pages/Portais').then(m => ({ default: m.Portais })))
const GestaoContratos = lazy(() => import('./pages/GestaoContratos').then(m => ({ default: m.GestaoContratos })))
const Propostas = lazy(() => import('./pages/Propostas').then(m => ({ default: m.Propostas })))
const BiAvancado = lazy(() => import('./pages/BiAvancado').then(m => ({ default: m.BiAvancado })))
const Compliance = lazy(() => import('./pages/Compliance').then(m => ({ default: m.Compliance })))
const SalaOperacoes = lazy(() => import('./pages/SalaOperacoes').then(m => ({ default: m.SalaOperacoes })))
const RoboLances = lazy(() => import('./pages/RoboLances').then(m => ({ default: m.RoboLances })))
const GrafoSocietario = lazy(() => import('./pages/GrafoSocietario').then(m => ({ default: m.GrafoSocietario })))
const MapaCompetitividade = lazy(() => import('./pages/MapaCompetitividade').then(m => ({ default: m.MapaCompetitividade })))

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-[var(--muted)] animate-pulse">Carregando...</p>
      </div>
    }>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<SuspenseWrap><Dashboard /></SuspenseWrap>} />
          <Route path="pipeline" element={<SuspenseWrap><Pipeline /></SuspenseWrap>} />
          <Route path="alertas" element={<SuspenseWrap><Alertas /></SuspenseWrap>} />
          <Route path="buscas" element={<SuspenseWrap><Licitacoes /></SuspenseWrap>} />
          <Route path="classificacao-ia" element={<SuspenseWrap><ClassificacaoIA /></SuspenseWrap>} />
          <Route path="matchmaking" element={<SuspenseWrap><Matchmaking /></SuspenseWrap>} />
          <Route path="mapas-uf" element={<SuspenseWrap><MapaInteligencia /></SuspenseWrap>} />
          <Route path="monitor-pca" element={<SuspenseWrap><MonitorPCA /></SuspenseWrap>} />
          <Route path="assistente-juridico" element={<SuspenseWrap><AssistenteJuridico /></SuspenseWrap>} />
          <Route path="pesquisa-precos" element={<SuspenseWrap><PesquisaPrecos /></SuspenseWrap>} />
          <Route path="analisador-especificacoes" element={<SuspenseWrap><AnalisadorEspecificacoes /></SuspenseWrap>} />
          <Route path="analisador-atestados" element={<SuspenseWrap><AnalisadorAtestados /></SuspenseWrap>} />
          <Route path="certidoes-negativas" element={<SuspenseWrap><CertidoesNegativas /></SuspenseWrap>} />
          <Route path="dod" element={<SuspenseWrap><Dod /></SuspenseWrap>} />
          <Route path="etp" element={<SuspenseWrap><Etp /></SuspenseWrap>} />
          <Route path="tr" element={<SuspenseWrap><Tr /></SuspenseWrap>} />
          <Route path="empresas" element={<SuspenseWrap><Empresas /></SuspenseWrap>} />
          <Route path="portais" element={<SuspenseWrap><Portais /></SuspenseWrap>} />
          <Route path="gestao-contratos" element={<SuspenseWrap><GestaoContratos /></SuspenseWrap>} />
          <Route path="propostas" element={<SuspenseWrap><Propostas /></SuspenseWrap>} />
          <Route path="bi-avancado" element={<SuspenseWrap><BiAvancado /></SuspenseWrap>} />
          <Route path="compliance" element={<SuspenseWrap><Compliance /></SuspenseWrap>} />
          <Route path="sala-operacoes" element={<SuspenseWrap><SalaOperacoes /></SuspenseWrap>} />
          <Route path="robo-lances" element={<SuspenseWrap><RoboLances /></SuspenseWrap>} />
          <Route path="grafo-societario" element={<SuspenseWrap><GrafoSocietario /></SuspenseWrap>} />
          <Route path="mapa-inteligencia" element={<Navigate to="/mapas-uf" replace />} />
          <Route path="licitacoes" element={<Navigate to="/buscas" replace />} />
          <Route path="mapa-competitividade" element={<SuspenseWrap><MapaCompetitividade /></SuspenseWrap>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
