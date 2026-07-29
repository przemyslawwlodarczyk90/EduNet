import { useState } from 'react'
import { ConnectionStatus } from './ConnectionStatus'
import { ScenarioSelector } from './simulation/components/ScenarioSelector'
import { ScenarioPage } from './simulation/ScenarioPage'
import './App.css'

function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null)

  return (
    <main className="app">
      <header className="app-header">
        <h1>EduNet</h1>
        <ConnectionStatus />
      </header>
      <div className="app-layout">
        <ScenarioSelector onSelect={setSelectedScenarioId} selectedScenarioId={selectedScenarioId} />
        {selectedScenarioId && <ScenarioPage key={selectedScenarioId} scenarioId={selectedScenarioId} />}
      </div>
    </main>
  )
}

export default App
