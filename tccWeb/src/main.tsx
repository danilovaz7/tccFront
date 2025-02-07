import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import { HomePage } from './Home/HomePage.tsx';
import { PerfilPage } from './Perfil/PerfilPage.tsx';
import { AddAlunoPage } from './add aluno/AddAlunoPage.tsx';
import './index.css'
import App from './Login/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/perfil/:idUsuario" element={<PerfilPage />} />
      <Route path="/addAluno" element={<AddAlunoPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
