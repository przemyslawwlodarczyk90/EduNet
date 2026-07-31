import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConnectionStatus } from '../ConnectionStatus'
import { TopicPage } from './TopicPage'
import { CONTAINER_TOPICS } from './topics'
import { GamificationPage } from './gamification/GamificationPage'
import { log } from '../lib/logger'
import '../App.css'
import './containerization.css'

type View = (typeof CONTAINER_TOPICS)[number]['id'] | 'gamification'

function ContainersApp() {
  const [view, setViewState] = useState<View>(CONTAINER_TOPICS[0].id)

  const setView = (nextView: View) => {
    log('nav', `${view} → ${nextView}`)
    setViewState(nextView)
  }

  const activeTopic = CONTAINER_TOPICS.find((topic) => topic.id === view)

  return (
    <main className="app">
      <header className="app-header">
        <h1>
          <Link to="/" className="app-block-back">← Wybór bloku</Link> EduNet: Konteryzacja
        </h1>
        <ConnectionStatus />
      </header>
      <nav className="main-nav mode-toggle">
        {CONTAINER_TOPICS.map((topic) => (
          <button key={topic.id} className={view === topic.id ? 'active' : ''} onClick={() => setView(topic.id)}>
            {topic.navLabel}
          </button>
        ))}
        <button className={view === 'gamification' ? 'active' : ''} onClick={() => setView('gamification')}>
          10. Gamifikacja: ścieżka nauki i quizy
        </button>
      </nav>

      {activeTopic && <TopicPage topic={activeTopic} />}

      {view === 'gamification' && (
        <GamificationPage onNavigate={(navView) => setView(navView as View)} />
      )}
    </main>
  )
}

export default ContainersApp
