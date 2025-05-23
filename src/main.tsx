import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useNavigate, useHref, RouterProvider, createBrowserRouter, Outlet } from "react-router";
import { HeroUIProvider } from '@heroui/react'
import { HomePage } from './Home/HomePage.tsx';
import { PerfilPage } from './Perfil/PerfilPage.tsx';
import { AddAlunoPage } from './AddAluno/AddAlunoPage.tsx';
import { RankingPage } from './Ranking/RankingPage.tsx';
import { RecuperaSenhaPage } from './RecuperaSenha/RecuperaSenhaPage.tsx';
import { RedefinirSenhaPage } from './RedefinirSenha/RedefinirSenhaPage.tsx';
import { ListagemPage } from './ListagemAlunos/ListagemPage.tsx';
import { ListagemPerguntasPage } from './ListagemPerguntas/ListagemPerguntasPage.tsx';
import { AddEscolaPage } from './AddEscola/AddEscolaPage.tsx';
import { AddPerguntaPage } from './AddPergunta/addPerguntaPage.tsx';
import DashboardPage from "./Dashboard/DashboardPage.tsx"
import { Sala } from './Sala/Sala.tsx';
import Materia from './Materia/MateriaPage.tsx';
import { RootLayout } from './layout/RootLayout.tsx';
import './index.css'
import App from './Login/App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <HeroUIWithRouter />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: '/recupera-senha',
        element: <RecuperaSenhaPage />,
      },
      {
        path: '/redefinir-senha/:token',
        element: <RedefinirSenhaPage />,
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
          path: '/materias/:nmMateria/:turmaId/:codigo',
          element: <Materia />
        },
        {
          path: '/sala/:codigo',
          element: <Sala />
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
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>

)