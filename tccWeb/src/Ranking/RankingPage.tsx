import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import UserCardRank from '../components/UserCardRank/UserCardRank';

interface Usuario {
  id: number;
  nome: string;
  nivel: string;
  tipo_usuario_id: number;
  id_turma: number;
  id_escola: number;
  avatar: {
    nome: string;
    caminho: string;
  };
  // Removemos estatisticas_gerais e adicionamos winRate
  winRate: string; // string formatada com 2 casas decimais, por exemplo "75.00"
}

export function RankingPage() {
  const { token, user } = useTokenStore();
  let { id_turma, id_escola } = useParams();
  const [usuarios, setUsers] = useState<Usuario[]>([]);
  const [usuario, setUsuario] = useState<Usuario>();

  useEffect(() => {
    async function pegaUsuarios() {
      const response = await fetch(
        `http://localhost:3000/usuarios?order=nivel&orderDirection=DESC&id_turma=${id_turma}&id_escola=${id_escola}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const usuarios = await response.json();
      setUsers(usuarios);
    }
    pegaUsuarios();
  }, [id_turma, id_escola, token]); 

  useEffect(() => {
    async function pegaUsuarioAtual() {
      const response = await fetch(`http://localhost:3000/usuarios/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const usuarioAtual = await response.json();
      setUsuario(usuarioAtual);
    }
    pegaUsuarioAtual();
  }, [user, token]);

  return (
    <div className="w-screen flex flex-col justify-start items-center h-auto sm:h-screen gap-6 p-3 sm:p-5">
      <div className="flex flex-col justify-center items-center w-[95%] sm:w-[70%] gap-6 sm:gap-10">
        <h1 className="text-xl sm:text-5xl text-center">
          Rank de sala do {id_turma}º ano
        </h1>
        <div className="w-full sm:w-[90%] flex flex-col justify-center pb-6 sm:pb-12 items-center p-1 gap-2 sm:gap-3">
          {usuarios.map((usuarioRank, index) => {
            // Agora usamos o campo "winRate" diretamente
            const porcentAcerto = Number(usuarioRank.winRate) || 0;

            if (index === 0) {
              return (
                <UserCardRank
                  key={usuarioRank.id}
                  id={usuarioRank.id}
                  nivel={usuarioRank.nivel}
                  nome={usuarioRank.nome}
                  avatar={usuarioRank.avatar.caminho}
                  acertos={porcentAcerto}
                  classe="w-full flex flex-row justify-start items-center gap-4 sm:gap-10 p-2 sm:p-3 text-black rounded-lg bg-yellow-400 cursor-pointer"
                  classeStats="text-md sm:text-xl w-full flex flex-col sm:flex-row justify-center sm:justify-around gap-2 sm:gap-3 items-start sm:items-center"
                  classeImg="w-[30%] sm:w-[20%] rounded-full"
                />
              );
            }
            return (
              <UserCardRank
                key={usuarioRank.id}
                id={usuarioRank.id}
                nivel={usuarioRank.nivel}
                nome={usuarioRank.nome}
                avatar={usuarioRank.avatar.caminho}
                acertos={porcentAcerto}
                classe="w-[95%] flex flex-row justify-start items-center gap-4 sm:gap-10 p-2 sm:p-3 text-black rounded-lg bg-gray-400 cursor-pointer"
                classeStats="text-sm sm:text-xl w-full flex flex-col sm:flex-row justify-center  sm:justify-around gap-2 sm:gap-3 items-start sm:items-center"
                classeImg="w-[30%] sm:w-[20%] rounded-full"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
