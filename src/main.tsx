import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Page from './auth/login/page'
import '../src/utils/global.css';  

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page/>
  </StrictMode>,
)
