import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import App from './App.tsx'
import { themeIgnitElectronic } from './theme/theme-ignit-electronic'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={themeIgnitElectronic}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
