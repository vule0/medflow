import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme.js'
import { ThemeModeProvider } from './context/ThemeModeContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeModeProvider>
    {/* <ThemeProvider theme={theme}> */}
      {/* <CssBaseline/> */}
          <App />
    {/* </ThemeProvider> */}
  </ThemeModeProvider>
  </StrictMode>,
)
