import { ConnectionStatus } from './ConnectionStatus'
import './App.css'

function App() {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>EduNet</h1>
      <p>Sprint 0 — pipeline WebSocket front↔back</p>
      <ConnectionStatus />
    </main>
  )
}

export default App
