import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// CRITICAL: Element ID must exactly match repository name for YaleSites embed
createRoot(document.getElementById('test-app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)