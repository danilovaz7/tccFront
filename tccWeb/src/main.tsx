import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate, useHref } from "react-router";
import { HeroUIProvider } from '@heroui/react'
import { HomePage } from './Home/HomePage.tsx';
import { PerfilPage } from './Perfil/PerfilPage.tsx';
import { AddAlunoPage } from './add aluno/AddAlunoPage.tsx';
import { RankingPage } from './Ranking/RankingPage.tsx';
import Materia from './Materia/Materia.tsx';
import './index.css'
import App from './Login/App.tsx'

const HeroUIWithRouter = () => {
  const navigate = useNavigate();
  const useHrefFunc = useHref;

  return (
    <HeroUIProvider navigate={navigate} useHref={useHrefFunc}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/perfil/:idUsuario" element={<PerfilPage />} />
        <Route path="/addAluno" element={<AddAlunoPage />} />
        <Route path="/materias/:nmMateria" element={<Materia />} />
      </Routes>
    </HeroUIProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIWithRouter />
    </BrowserRouter>
  </StrictMode>,
)