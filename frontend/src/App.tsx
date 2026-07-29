import { useState } from 'react'
import { ConnectionStatus } from './ConnectionStatus'
import { ScenarioSelector } from './simulation/components/ScenarioSelector'
import { ScenarioPage } from './simulation/ScenarioPage'
import { FundamentalsPage } from './fundamentals/FundamentalsPage'
import './App.css'

type View = 'fundamentals' | 'scenarios'

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
        <button className={view === 'scenarios' ? 'active' : ''} onClick={() => setView('scenarios')}>
          Scenariusze (demo silnika)
        </button>
      </nav>

      {view === 'fundamentals' && <FundamentalsPage />}

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
