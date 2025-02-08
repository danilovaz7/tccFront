import { FormEvent, useEffect, useState } from 'react';
import './RankingPage.css'
import { NavLink, useParams } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import Navbar from '../components/Navbar/Navbar';

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

export function RankingPage() {
    const { token, user } = useTokenStore();
    const [usuarios, setUsers] = useState<Usuario[]>([])
    const [usuario, setUsuario] = useState<Usuario>();

    useEffect(() => {
        async function pegaUsuarios() {
            // Faz requisição autenticada usando o token
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
            <div className='containerRanking'>
                <Navbar id={usuario?.id} nivel={usuario?.nivel} avatar={usuario?.avatar.caminho} />
                <div className='rank'>
                    <h1>Rank de sala do {usuario?.id_turma}º ano</h1>
                    <div className='cardsTurma'>
                        {
                            usuarios.map((usuarioRank, index) => {
                                if (usuario?.id_turma === usuarioRank.id_turma && usuario?.id_escola === usuarioRank.id_escola) {
                                    if (index == 0) {
                                        return (
                                            <div className='aluno1Rank'>
                                                <img src={usuarioRank?.avatar.caminho} alt="" />
                                                <div className='aluno1RankStats'>
                                                    <p>Nome: {usuarioRank?.nome}</p>
                                                    <p>Acertos 20%</p>
                                                    <p>Lvl {usuarioRank?.nivel}</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return (
                                        <div className='alunoRank'>
                                            <img src={usuarioRank?.avatar.caminho} alt="" />
                                            <div className='alunoRankStats'>
                                                <p>Nome: {usuarioRank?.nome}</p>
                                                <p>Acertos 20%</p>
                                                <p>Lvl {usuarioRank?.nivel}</p>
                                            </div>
                                        </div>
                                    );
                                }
                            })
                        }
                    </div>
                </div>
            </div>

        </>
    )
}