import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate, useHref, RouterProvider, createBrowserRouter, Outlet } from "react-router";
import { HeroUIProvider } from '@heroui/react'
import { HomePage } from './Home/HomePage.tsx';
import { PerfilPage } from './Perfil/PerfilPage.tsx';
import { AddAlunoPage } from './add aluno/AddAlunoPage.tsx';
import { RankingPage } from './Ranking/RankingPage.tsx';
import { RecuperaSenhaPage } from './Recupera Senha/RecuperaSenhaPage.tsx';
import { RedefinirSenhaPage } from './Redefinir Senha/RedefinirSenhaPage.tsx';
import { ListagemPage } from './Listagem Alunos/ListagemPage.tsx';
import { ListagemPerguntasPage } from './Listagem Perguntas/ListagemPerguntasPage.tsx';
import { AddEscolaPage } from './add Escola/AddEscolaPage.tsx';
import { AddPerguntaPage } from './add Pergunta/addPerguntaPage.tsx';
import DashboardPage from "./dashboard/DashboardPage.tsx"
import { Sala } from './Sala/Sala.tsx';
import Materia from './Materia/MateriaPage.tsx';
import { RootLayout } from './layout/RootLayout.tsx';
import './index.css'
import App from './Login/App.tsx'

const router = createBrowserRouter([
  {
    element: <HeroUIWithRouter />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        element: <RootLayout />,
        children: [{
          path: '/home',
          element: <HomePage />
        },
        {
          path: '/ranking/:id_turma/:id_escola',
          element: <RankingPage />
        },
        {
          path: '/perfil/:idUsuario',
          element: <PerfilPage />
        },
        {
          path: '/addAluno',
          element: <AddAlunoPage />
        },
        {
          path: '/addEscola',
          element: <AddEscolaPage />
        },
        {
          path: '/addPergunta',
          element: <AddPerguntaPage />
        },
        {
          path: '/listagem-alunos',
          element: <ListagemPage />
        },
        {
          path: '/listagem-perguntas',
          element: <ListagemPerguntasPage />
        },
        {
          path: '/materias/:nmMateria/:turmaId',
          element: <Materia />
        },
        {
          path: '/recupera-senha',
          element: <RecuperaSenhaPage />
        },
        {
          path: '/sala/:codigo',
          element: <Sala />
        },
        {
          path: '/redefinir-senha/:token',
          element: <RedefinirSenhaPage />
        },
        {
          path: '/dashboard',
          element: <DashboardPage />
        }
      ]
      }
    ]
  }
])

function HeroUIWithRouter() {
  const navigate = useNavigate();
  const useHrefFunc = useHref;

  return (
    <HeroUIProvider navigate={navigate} useHref={useHrefFunc}>
      <Outlet />
    </HeroUIProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)