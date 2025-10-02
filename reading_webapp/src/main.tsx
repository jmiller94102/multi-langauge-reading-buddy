import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css' - Temporarily disabled due to TailwindCSS PostCSS issues
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
