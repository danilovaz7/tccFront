import { FormEvent, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useTokenStore } from '../hooks/useTokenStore';
import Navbar from '../components/Navbar/Navbar';
import UserCardRank from '../components/UserCardRank/UserCardRank';

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
    },
    estatisticas_gerais: {
        total_disputas: number;
        total_disputas_ganhas: number;
        total_perguntas: number;
        total_perguntas_acertadas: number;
    }
}

export function RankingPage() {
    const { token, user } = useTokenStore();
    const [usuarios, setUsers] = useState<Usuario[]>([])
    const [usuario, setUsuario] = useState<Usuario>();

    useEffect(() => {
        async function pegaUsuarios() {
            const response = await fetch(`http://localhost:3000/usuarios`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            const usuarios = await response.json()
            setUsers(usuarios)
        }
        pegaUsuarios();
    }, [])

    useEffect(() => {
        async function pegaUsuarios() {
            const response = await fetch(`http://localhost:3000/usuarios/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const usuarioAtual = await response.json();
            setUsuario(usuarioAtual);
        }
        pegaUsuarios();
    }, []);

    return (
        <>
            <div className="w-full flex flex-col justify-start items-center h-screen gap-10 mb-15">
                <Navbar id={usuario?.id} nivel={usuario?.nivel} avatar={usuario?.avatar.caminho} />
                <div className="flex flex-col justify-center items-center w-7/10 gap-10 ">
                    <h1>Rank de sala do {usuario?.id_turma}º ano</h1>
                    <div className="w-4/5 flex flex-col justify-center items-center p-1 gap-2.5">
                        {
                            usuarios.map((usuarioRank, index) => {
                                let porcentAcerto = ((usuarioRank.estatisticas_gerais.total_disputas_ganhas / usuarioRank.estatisticas_gerais.total_disputas) * 100);
                                if (isNaN(porcentAcerto)) {
                                    porcentAcerto = 0;
                                }
                                if (usuario?.id_turma === usuarioRank.id_turma && usuario?.id_escola === usuarioRank.id_escola) {
                                    if (index === 0) {
                                        return (
                                            <UserCardRank id={usuarioRank.id} nivel={usuarioRank.nivel} nome={usuarioRank.nome} avatar={usuarioRank.avatar.caminho} acertos={porcentAcerto} 
                                            classe="w-full flex justify-center items-center gap-2.5 p-2.5 text-black rounded-lg bg-yellow-400 cursor-pointer"
                                             classeStats="w-4/5 text-3xl flex justify-start gap-10 items-center" 
                                             classeImg='w-1/4' />
                                        );
                                    }
                                    return (
                                        <UserCardRank id={usuarioRank.id} nivel={usuarioRank.nivel} nome={usuarioRank.nome} avatar={usuarioRank.avatar.caminho} acertos={porcentAcerto} 
                                        classe="w-9/10  flex justify-center items-center gap-2.5 p-2.5 text-black rounded-lg bg-gray-400 cursor-pointer" 
                                        classeStats="w-4/5 text-3xl flex justify-start gap-10 items-center" 
                                        classeImg='w-1/4' />
                                    );
                                }
                                return null;
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
