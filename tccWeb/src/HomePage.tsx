import { FormEvent, useEffect, useState } from 'react';
import './HomePage.css'
import { MdMenu, MdKeyboardArrowRight } from "react-icons/md";
import { NavLink } from 'react-router';
import { useTokenStore } from './hooks/useTokenStore';

interface Usuario {
    id: number,
    nome: string,
    foto: string,
    nivel: string,
    tipo_usuario_id: number,
    id_turma: number,
    id_escola: number
}

interface EloMateria {
    id: number,
    usuario_id: number,
    materia_id: number,
    elo_id: number,
    subelo_id: number,
    perguntas_acertadas: string,
    elo: {
        nome: string,
        elo1: string,
        elo2: string,
        elo3: string
    },
    materia: {
        nome: string,
        icone: string
    }
}


export function HomePage() {

    const [matricula, setMatricula] = useState('')
    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();
    const [eloMaterias, setEloMaterias] = useState<EloMateria[]>([]);
    const [usuarios, setUsers] = useState<Usuario[]>([])


    function formSubmit(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        alert(matricula)
    }

    useEffect(() => {
        async function pegaUsuarios() {
            // Faz requisição autenticada usando o token
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


    useEffect(() => {
        async function pegaEloMaterias() {
            // Faz requisição autenticada usando o token
            const response = await fetch(`http://localhost:3000/eloMaterias/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const eloMaterias = await response.json();
            setEloMaterias(eloMaterias);
        }
        pegaEloMaterias();
    }, []);

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

    console

    return (
        
            <div className='containerHome'>
                <div className='nav'>
                    <div className='logoIcon'>
                        <img src="./src/assets/logo1Play2Learn.png" alt="" />
                    </div>

                    <div className='perfilContainer'>
                        <NavLink to="/perfil" >
                            <div className='perfil'>
                                <p>Nível {usuario?.nivel}</p>
                                <img className='imgPerfil'src={usuario?.foto} alt="" />
                            </div>
                        </NavLink>
                    </div>
                </div>

                <div className='page'>
                    <div className='left'>
                        <h1>Que tal jogar com um amigo?</h1>
                        <p>É sempre melhor evoluir juntos!</p>
                        <form onSubmit={(evento) => formSubmit(evento)} className='conviteJogo'>
                            <input
                                type="text"
                                placeholder='Insira a matrícula'
                                value={matricula}
                                maxLength={6}
                                onChange={(e) => { setMatricula(e.target.value.replace(/[^0-9]/g, '')) }}
                            />
                            <button className='btn'>CONVIDAR</button>
                        </form>
                    </div>

                    <div className='center'>
                        <img className='gif' src="./src/assets/gifCentro.gif" alt="" />
                    </div>

                    <div className='right'>
                        <h1>Ranking da <span style={{ color: 'yellow' }}>sala</span></h1>
                        <div className='areaTop10'>
                            {
                                usuarios.map((usuarioRank, index) => {

                                    if (usuario?.id_turma === usuarioRank.id_turma && usuario?.id_escola === usuarioRank.id_escola) {
                                        if (index == 0) {
                                            return (
                                                <div className='aluno1'>
                                                    <img src={usuarioRank.foto} alt="" />
                                                    <p>{usuarioRank.nome}</p>
                                                    <p>Lvl {usuarioRank.nivel}</p>
                                                </div>
                                            )
                                        }

                                        return (
                                            <div className='aluno'>
                                                <img src={usuarioRank.foto} alt="" />
                                                <p>{usuarioRank.nome}</p>
                                                <p>Lvl {usuarioRank.nivel}</p>
                                            </div>
                                        );
                                    }

                                })
                            }

                            <button className='btn'>Ver mais <span><MdKeyboardArrowRight size={16} /></span></button>
                        </div>
                    </div>
                </div>

                <div className='treinamentoMaterias'>

                    <h1 style={{ color: 'cyan' }}>Aperfeiçoe seus conhecimentos</h1>
                    <h3>Selecione a materia que deseja treinar</h3>

                    {
                        usuario?.tipo_usuario_id === 2
                            ?
                            <div className='materias'>
                                {
                                    eloMaterias.map((eloMateria, index) => {
                                        let eloIcon = '';

                                        // Lógica para escolher o ícone dependendo do subelo_id
                                        switch (eloMateria.subelo_id) {
                                            case 1:
                                                eloIcon = eloMateria.elo.elo1;
                                                break;
                                            case 2:
                                                eloIcon = eloMateria.elo.elo2;
                                                break;
                                            case 3:
                                                eloIcon = eloMateria.elo.elo3;
                                                break;
                                            default:
                                                eloIcon = ''; // Valor default caso não haja subelo
                                        }

                                        return (
                                            <div key={index} className='materia'>
                                                <img className='materiaLogo' src={eloMateria.materia.icone} alt="" />
                                                <div className='materiaSection'>
                                                    <p>{eloMateria.materia.nome}</p>
                                                    <img className='icon' src={eloIcon} alt="" />
                                                </div>
                                            </div>

                                        );
                                    })

                                }

                            </div>
                            :
                            null
                    }

                    {
                         usuario?.tipo_usuario_id === 1
                         ?
                         <div>
                              <NavLink to="/addAluno" ><button>Adicionar aluno</button> </NavLink>
                            <button>Adicionar turma</button>
                         </div>
                         : 
                         null
                    }
                </div>
            </div>


        
    )
}