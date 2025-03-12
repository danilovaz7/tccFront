import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate, useHref } from "react-router";
import { HeroUIProvider } from '@heroui/react'
import { HomePage } from './Home/HomePage.tsx';
import { PerfilPage } from './Perfil/PerfilPage.tsx';
import { AddAlunoPage } from './add aluno/AddAlunoPage.tsx';
import { RankingPage } from './Ranking/RankingPage.tsx';
import { RecuperaSenhaPage } from './Recupera Senha/RecuperaSenhaPage.tsx';
import { RedefinirSenhaPage } from './Redefinir Senha/RedefinirSenhaPage.tsx';
import { ListagemPage } from './Listagem Alunos/listagemPage.tsx';
import Materia from './Materia/MateriaPage.tsx';
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
        <Route path="/ranking/:id_turma/:id_escola" element={<RankingPage />} />
        <Route path="/perfil/:idUsuario" element={<PerfilPage />} />
        <Route path="/addAluno" element={<AddAlunoPage />} />
        <Route path="/listagem-alunos" element={<ListagemPage />} />
        <Route path="/materias/:nmMateria" element={<Materia />} />
        <Route path="/recupera-senha" element={<RecuperaSenhaPage />} />
        <Route path="/redefinir-senha/:token" element={<RedefinirSenhaPage />} />
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