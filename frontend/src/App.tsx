import { useState } from 'react'
import { ConnectionStatus } from './ConnectionStatus'
import { ScenarioSelector } from './simulation/components/ScenarioSelector'
import { ScenarioPage } from './simulation/ScenarioPage'
import { FundamentalsPage } from './fundamentals/FundamentalsPage'
import { PhysicalDataLinkPage } from './physicalDataLink/PhysicalDataLinkPage'
import { NetworkLayerPage } from './networkLayer/NetworkLayerPage'
import { TransportLayerPage } from './transportLayer/TransportLayerPage'
import { SessionPresentationPage } from './sessionPresentationLayer/SessionPresentationPage'
import { ApplicationLayerPage } from './applicationLayer/ApplicationLayerPage'
import { HttpEvolutionPage } from './httpEvolution/HttpEvolutionPage'
import { TcpIpModuleHome } from './tcpIpModule/TcpIpModuleHome'
import { CrossCuttingSecurityPage } from './crossCuttingSecurity/CrossCuttingSecurityPage'
import { NetworkPerformancePage } from './networkPerformance/NetworkPerformancePage'
import { CloudNetworksPage } from './cloudNetworks/CloudNetworksPage'
import { GamificationPage } from './gamification/GamificationPage'
import { RealSocketLabPage } from './realSocketLab/RealSocketLabPage'
import { log } from './lib/logger'
import './App.css'

type View =
  | 'fundamentals'
  | 'physical-data-link'
  | 'network-layer'
  | 'transport-layer'
  | 'session-presentation-layer'
  | 'application-layer'
  | 'http-evolution'
  | 'tcpip-module'
  | 'cross-cutting-security'
  | 'network-performance'
  | 'cloud-networks'
  | 'gamification'
  | 'real-socket-lab'
  | 'scenarios'

function App() {
  const [view, setViewState] = useState<View>('fundamentals')
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null)

  const setView = (nextView: View) => {
    log('nav', `${view} → ${nextView}`)
    setViewState(nextView)
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>EduNet</h1>
        <ConnectionStatus />
      </header>
      <nav className="main-nav mode-toggle">
        <button className={view === 'fundamentals' ? 'active' : ''} onClick={() => setView('fundamentals')}>
          Fundamenty
        </button>
        <button className={view === 'physical-data-link' ? 'active' : ''} onClick={() => setView('physical-data-link')}>
          Warstwa 1-2 (Fizyczna / Łącza danych) — model ISO/OSI
        </button>
        <button className={view === 'network-layer' ? 'active' : ''} onClick={() => setView('network-layer')}>
          Warstwa 3 (Sieciowa) — model ISO/OSI
        </button>
        <button className={view === 'transport-layer' ? 'active' : ''} onClick={() => setView('transport-layer')}>
          Warstwa 4 (Transportowa) — model ISO/OSI
        </button>
        <button
          className={view === 'session-presentation-layer' ? 'active' : ''}
          onClick={() => setView('session-presentation-layer')}
        >
          Warstwa 5-6 (Sesji / Prezentacji) — model ISO/OSI
        </button>
        <button className={view === 'application-layer' ? 'active' : ''} onClick={() => setView('application-layer')}>
          Warstwa 7 (Aplikacji) — model ISO/OSI
        </button>
        <button className={view === 'http-evolution' ? 'active' : ''} onClick={() => setView('http-evolution')}>
          HTTP: ewolucja protokołu i jego wersje
        </button>
        <button className={view === 'tcpip-module' ? 'active' : ''} onClick={() => setView('tcpip-module')}>
          Model TCP/IP (4 warstwy)
        </button>
        <button
          className={view === 'cross-cutting-security' ? 'active' : ''}
          onClick={() => setView('cross-cutting-security')}
        >
          Bezpieczeństwo: firewall, VPN, ataki
        </button>
        <button
          className={view === 'network-performance' ? 'active' : ''}
          onClick={() => setView('network-performance')}
        >
          Wydajność sieci i diagnostyka
        </button>
        <button className={view === 'cloud-networks' ? 'active' : ''} onClick={() => setView('cloud-networks')}>
          Sieci w chmurze: CDN i load balancing
        </button>
        <button className={view === 'gamification' ? 'active' : ''} onClick={() => setView('gamification')}>
          Gamifikacja: quizy zbiorcze i tryb detektywa
        </button>
        <button className={view === 'real-socket-lab' ? 'active' : ''} onClick={() => setView('real-socket-lab')}>
          Real-socket-lab (opcjonalnie)
        </button>
        <button className={view === 'scenarios' ? 'active' : ''} onClick={() => setView('scenarios')}>
          Scenariusze (demo silnika)
        </button>
      </nav>

      {view === 'fundamentals' && <FundamentalsPage />}

      {view === 'physical-data-link' && <PhysicalDataLinkPage />}

      {view === 'network-layer' && <NetworkLayerPage />}

      {view === 'transport-layer' && <TransportLayerPage />}

      {view === 'session-presentation-layer' && <SessionPresentationPage />}

      {view === 'application-layer' && <ApplicationLayerPage />}

      {view === 'http-evolution' && <HttpEvolutionPage />}

      {view === 'tcpip-module' && <TcpIpModuleHome />}

      {view === 'cross-cutting-security' && <CrossCuttingSecurityPage />}

      {view === 'network-performance' && <NetworkPerformancePage />}

      {view === 'cloud-networks' && <CloudNetworksPage />}

      {view === 'gamification' && <GamificationPage onNavigate={(navView) => setView(navView as View)} />}

      {view === 'real-socket-lab' && <RealSocketLabPage />}

      {view === 'scenarios' && (
        <div className="app-layout">
          <ScenarioSelector onSelect={setSelectedScenarioId} selectedScenarioId={selectedScenarioId} />
          {selectedScenarioId && <ScenarioPage key={selectedScenarioId} scenarioId={selectedScenarioId} />}
        </div>
      )}
    </main>
  )
}

export default App
