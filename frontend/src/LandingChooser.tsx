import { Link } from 'react-router-dom'
import './App.css'

export function LandingChooser() {
  return (
    <main className="landing-chooser">
      <h1>EduNet</h1>
      <p className="landing-subtitle">Wybierz blok, w który chcesz wejść — każdy jest osobną, niezależną aplikacją.</p>
      <div className="landing-cards">
        <Link to="/networks" className="landing-card">
          <div className="landing-card-icon">🌐</div>
          <h2>Sieci komputerowe</h2>
          <p>
            Model OSI i TCP/IP, adresacja IP i podsieci, routing, bezpieczeństwo, wydajność sieci,
            sieci w chmurze — 13 modułów z żywymi symulacjami krok po kroku, quizami i trybem
            detektywa.
          </p>
          <span className="landing-card-cta">Wejdź do bloku Sieci →</span>
        </Link>
        <Link to="/containers" className="landing-card">
          <div className="landing-card-icon">📦</div>
          <h2>Konteryzacja: Docker</h2>
          <p>
            Podstawy konteryzacji: obrazy i kontenery, Dockerfile i warstwy, rejestry, sieci i
            wolumeny, Docker Compose — od zera, poziom łatwy-średni, z animacjami, quizami i
            ścieżką nauki.
          </p>
          <span className="landing-card-cta">Wejdź do bloku Konteryzacja →</span>
        </Link>
      </div>
    </main>
  )
}
