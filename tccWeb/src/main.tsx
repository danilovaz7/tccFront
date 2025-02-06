import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { HomePage } from './HomePage.tsx';
import { PerfilPage } from './PerfilPage.tsx';
import { AddAlunoPage } from './addAlunoPage.tsx';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/perfil" element={<PerfilPage />} />
      <Route path="/addAluno" element={<AddAlunoPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
