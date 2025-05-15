import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RegisterPage from './auth/register/page'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RegisterPage/>
  </StrictMode>,
)
