import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import App from './App.tsx'
import { ignitFireTheme } from './theme/semantic-theme-system'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={ignitFireTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
