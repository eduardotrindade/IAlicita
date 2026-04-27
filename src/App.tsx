import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Licitacoes } from './pages/Licitacoes'
import { MapaCompetitividade } from './pages/MapaCompetitividade'
import { MapaInteligencia } from './pages/MapaInteligencia'

// Imports recém criados
import { Pipeline } from './pages/Pipeline'
import { Matchmaking } from './pages/Matchmaking'
import { Alertas } from './pages/Alertas'
import { MonitorPCA } from './pages/MonitorPCA'
import { Empresas } from './pages/Empresas'
import { Portais } from './pages/Portais'
import { CertidoesNegativas } from './pages/CertidoesNegativas'
import { Dod } from './pages/Dod'
import { Etp } from './pages/Etp'
import { Tr } from './pages/Tr'
import { ClassificacaoIA } from './pages/ClassificacaoIA'
import { AssistenteJuridico } from './pages/AssistenteJuridico'
import { PesquisaPrecos } from './pages/PesquisaPrecos'
import { AnalisadorEspecificacoes } from './pages/AnalisadorEspecificacoes'
import { AnalisadorAtestados } from './pages/AnalisadorAtestados'
import { GestaoContratos } from './pages/GestaoContratos'
import { Propostas } from './pages/Propostas'
import { BiAvancado } from './pages/BiAvancado'
import { Compliance } from './pages/Compliance'
import { SalaOperacoes } from './pages/SalaOperacoes'
import { RoboLances } from './pages/RoboLances'
import { GrafoSocietario } from './pages/GrafoSocietario'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="pipeline" element={<Pipeline />} />
          <Route path="alertas" element={<Alertas />} />
          <Route path="buscas" element={<Licitacoes />} />

          <Route path="classificacao-ia" element={<ClassificacaoIA />} />
          <Route path="matchmaking" element={<Matchmaking />} />
          <Route path="mapas-uf" element={<MapaInteligencia />} />
          <Route path="monitor-pca" element={<MonitorPCA />} />

          <Route path="assistente-juridico" element={<AssistenteJuridico />} />
          <Route path="pesquisa-precos" element={<PesquisaPrecos />} />
          <Route path="analisador-especificacoes" element={<AnalisadorEspecificacoes />} />
          <Route path="analisador-atestados" element={<AnalisadorAtestados />} />
          <Route path="certidoes-negativas" element={<CertidoesNegativas />} />

          <Route path="dod" element={<Dod />} />
          <Route path="etp" element={<Etp />} />
          <Route path="tr" element={<Tr />} />

          <Route path="empresas" element={<Empresas />} />
          <Route path="portais" element={<Portais />} />

          <Route path="gestao-contratos" element={<GestaoContratos />} />
          <Route path="propostas" element={<Propostas />} />
          <Route path="bi-avancado" element={<BiAvancado />} />
          <Route path="compliance" element={<Compliance />} />

          <Route path="sala-operacoes" element={<SalaOperacoes />} />
          <Route path="robo-lances" element={<RoboLances />} />
          <Route path="grafo-societario" element={<GrafoSocietario />} />

          {/* Rotas legadas (mantidas para links antigos) */}
          <Route path="mapa-inteligencia" element={<Navigate to="/mapas-uf" replace />} />
          <Route path="licitacoes" element={<Navigate to="/buscas" replace />} />
          <Route path="mapa-competitividade" element={<MapaCompetitividade />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
