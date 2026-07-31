import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingChooser } from './LandingChooser'

const NetworksApp = lazy(() => import('./networks/NetworksApp'))
const ContainersApp = lazy(() => import('./containerization/ContainersApp'))

export function AppRoot() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ padding: 24, fontFamily: 'sans-serif' }}>Ładowanie…</div>}>
        <Routes>
          <Route path="/" element={<LandingChooser />} />
          <Route path="/networks/*" element={<NetworksApp />} />
          <Route path="/containers/*" element={<ContainersApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
