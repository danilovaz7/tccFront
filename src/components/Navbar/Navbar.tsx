import { NavLink, useNavigate } from 'react-router';
import { Skeleton } from "@heroui/react";
import { useTokenStore } from '../../hooks/useTokenStore';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {  useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';

interface Usuario {
  id: number,
  nome: string,
  nivel: string,
  tipo_usuario_id: number,
  id_turma: number,
  id_escola: number
  avatar: {
    nome: string,
    caminho: string
  }
}

function Navbar() {
  const navigate = useNavigate();
  const { setToken, setUser } = useTokenStore();
  const { token, user } = useTokenStore();
  const { reset } = useQueryErrorResetBoundary();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(undefined);
    setUser(undefined);
    navigate('/');
  }

  async function fetchUser() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user?.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data: Usuario = await response.json();
    return data;
  }

  function CardNavbar() {
    const { data: usuario } = useSuspenseQuery({
      queryKey: ['usuarios', 'nav'],
      queryFn: () => {
        return fetchUser();
      },
    })
    return (
      <div className="flex items-center justify-end w-[40%] sm:w-[20%] gap-4">
        <NavLink to={`/perfil/${usuario.id}`} className="w-full">
          <div className="w-full flex items-center justify-around gap-2 p-2 sm:p-3 border border-white rounded-md">
            <p className="text-sm sm:text-xl">Nível {usuario.nivel}</p>
            <img
              className="w-12 sm:w-16 rounded-full"
              src={usuario.avatar.caminho}
              alt="Imagem de perfil"
            />
          </div>
        </NavLink>
      </div>

    )
  }

  function CarregandoCardNavBar() {
    return (
      <div className="flex items-center justify-end w-[40%] sm:w-[20%] gap-4">
        <div className="w-full flex items-center justify-around gap-2 p-2 sm:p-3 border border-white rounded-md">
          <Skeleton className="rounded-lg w-[20%] bg-gray-600">
            <div className="h-5 rounded-lg bg-default-300" />
          </Skeleton>
          <Skeleton className="rounded-full w-12 h-12 bg-gray-600">
            <div className="h-12 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full items-center justify-between shadow-2xl p-3">
      <div className="flex items-center justify-start w-[60%] sm:w-[70%]">
        <img
          onClick={() => { navigate('/home') }}
          src="/src/assets/logo1Play2Learn.png"
          alt="Logo"
          className="w-[80%] sm:w-[35%] cursor-pointer"
        />
      </div>

      <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => {
        return (
          <div className='flex justify-center items-center'>
            <p className='text-red-700'>OII</p>
            <button onClick={(() => resetErrorBoundary())}>Tente novamente</button>
          </div>
        )
      }} >
        <Suspense fallback={<CarregandoCardNavBar />}>
          <CardNavbar />
        </Suspense>
      </ErrorBoundary>

      <button onClick={handleLogout} className='bg-cyan-500 p-3  rounded-lg'>
        <p className='font-bold text-lg text-black'>Sair</p>
      </button>
    </div>


  );
}

export default Navbar;
