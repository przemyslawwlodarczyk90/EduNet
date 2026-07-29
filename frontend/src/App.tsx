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
import { TcpIpModuleHome } from './tcpIpModule/TcpIpModuleHome'
import './App.css'

type View =
  | 'fundamentals'
  | 'physical-data-link'
  | 'network-layer'
  | 'transport-layer'
  | 'session-presentation-layer'
  | 'application-layer'
  | 'tcpip-module'
  | 'scenarios'

function App() {
  const [view, setView] = useState<View>('fundamentals')
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null)

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
          Warstwa 1-2 (Fizyczna / Łącza danych)
        </button>
        <button className={view === 'network-layer' ? 'active' : ''} onClick={() => setView('network-layer')}>
          Warstwa 3 (Sieciowa)
        </button>
        <button className={view === 'transport-layer' ? 'active' : ''} onClick={() => setView('transport-layer')}>
          Warstwa 4 (Transportowa)
        </button>
        <button
          className={view === 'session-presentation-layer' ? 'active' : ''}
          onClick={() => setView('session-presentation-layer')}
        >
          Warstwa 5-6 (Sesji / Prezentacji)
        </button>
        <button className={view === 'application-layer' ? 'active' : ''} onClick={() => setView('application-layer')}>
          Warstwa 7 (Aplikacji)
        </button>
        <button className={view === 'tcpip-module' ? 'active' : ''} onClick={() => setView('tcpip-module')}>
          Model TCP/IP (4 warstwy)
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

      {view === 'tcpip-module' && <TcpIpModuleHome />}

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
