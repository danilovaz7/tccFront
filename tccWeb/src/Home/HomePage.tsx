import { FormEvent, useEffect, useState } from 'react';
import { MdKeyboardArrowRight, } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';

import UserCard from '../components/UserCard/UserCard';
import CardMateria from '../components/CardMateria/CardMateria';
import ConfirmationPopup from '../components/ConfirmationPopup/ConfirmationPopup';
import { Form, Input, Button } from "@heroui/react";
import { useFormik } from 'formik';
import 'swiper/swiper-bundle.css';


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

interface Turmas {
    id: number,
    nome: string,
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
    const navigate = useNavigate();

    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();
    const [eloMaterias, setEloMaterias] = useState<EloMateria[]>([]);
    const [usuarios, setUsers] = useState<Usuario[]>([])
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [turmas, setTurmas] = useState<Turmas[]>([])
    const [materiaSelecionada, setMateriaSelecionada] = useState<EloMateria | null>(null);


    const handleShowPopup = () => setIsPopupOpen(true);
    const handleConfirm = () => {
        setIsPopupOpen(false);
        postSalaOffline()
        
    };
    const handleCancel = () => {
        setIsPopupOpen(false);
    };

    const handleMateriaClick = (materia: EloMateria) => {
        setMateriaSelecionada({
            ...materia,
        });
    };

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
    }, [user, token]);

    useEffect(() => {
        async function pegaTurmas() {
            const response = await fetch(`http://localhost:3000/turmas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const arrayTurmas = await response.json();
            setTurmas(arrayTurmas);
        }
        pegaTurmas();
    }, [user, token]);

    useEffect(() => {
        async function pegaEloMaterias() {
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
    }, [user, token]);

    useEffect(() => {
        async function pegaUsuarios() {
            const response = await fetch(`http://localhost:3000/usuarios?limit=5&order=nivel&orderDirection=DESC&id_turma=${usuario?.id_turma}&id_escola=${usuario?.id_escola}`, {
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
    }, [usuario, token])

    async function postSalaOnline() {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const resposta = await fetch(`http://localhost:3000/sala`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                codigo: code,
                id_host: user?.id,
                tipo: 'online'
            })
        });

        if (resposta.ok) {
            alert('sala criada');
            navigate(`/sala/${code}`);
        } else {
            alert("Erro ao criar sala");
        }
    }

    async function postSalaOffline() {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const resposta = await fetch(`http://localhost:3000/sala`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                codigo: code,
                id_host: user?.id,
                tipo: 'offline'
            })
        });

        if (resposta.ok) {
            alert('sala criada');
            navigate(`/materias/${materiaSelecionada?.materia.nome}/${usuario?.id_turma}/${code}`)
        } else {
            alert("Erro ao criar sala");
        }
    }

    const formik = useFormik({
        initialValues: {
            codigo: '',
            id_aluno: user?.id
        },
        onSubmit: async (values) => {
     
            const resposta = await fetch(`http://localhost:3000/entrar/sala`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    codigo: values.codigo,
                    id_aluno: values.id_aluno
                })
            });
            const erro = await resposta.json()

            if (resposta.ok) {
                navigate(`/sala/${values.codigo}`);
            } else {

                alert(erro.error)
            }
        }
    });

    return (

        <div className="w-11/12 flex flex-wrap overflow-x-hidden-hidden gap-10 justify-around">
            <div className="w-11/12 flex flex-wrap justify-around flex-col md:flex-row gap-5">
                {
                    usuario?.tipo_usuario_id === 2 ?
                        <div className="w-full md:w-[25%] h-fit p-5 flex flex-col justify-start items-center gap-3 rounded-md shadow-md">
                            <h1 className="text-2xl md:text-4xl text-center">Que tal jogar com amigos?</h1>
                            <p className="text-sm md:text-base text-center">É sempre melhor evoluir juntos!</p>
                            <div className="w-full flex flex-col justify-start items-center gap-5 p-3 rounded-md ">
                                <Button onClick={postSalaOnline} color="danger">CRIAR SALA</Button>
                                <Form onSubmit={formik.handleSubmit} className="w-full flex flex-col justify-center items-center gap-3">
                                    <Input
                                        isRequired
                                        errorMessage="Coloque um código válido"
                                        variant="bordered"
                                        onChange={formik.handleChange}
                                        value={formik.values.codigo}
                                        name="codigo"
                                        placeholder="Código de sala..."
                                        type="text"
                                    />
                                    <Button className="w-full" color="danger" type="submit">ENTRAR EM SALA</Button>
                                </Form>
                            </div>
                        </div>
                        :
                        <div className="w-full mb-20 md:w-[25%] border h-fit p-5 flex flex-col justify-start items-center gap-3 rounded-md shadow-sm">
                            <div className="flex flex-col justify-start items-center gap-10">
                                <h1 className="text-2xl md:text-3xl text-center">O que deseja fazer?</h1>
                                <div className="w-full flex flex-col justify-center items-start gap-5">

                                {(usuario?.tipo_usuario_id === 1) && (
                                             <NavLink className="w-full" to="/addEscola">
                                             <button className="bg-cyan-400 p-2.5 w-full rounded-md">Adicionar escola</button>
                                         </NavLink>
                                    )}
                               
                                    {(usuario?.tipo_usuario_id === 4 || usuario?.tipo_usuario_id === 1) && (
                                            <NavLink className="w-full" to="/addAluno">
                                                <button className="bg-cyan-400 p-2.5 w-full rounded-md">Adicionar usuário</button>
                                            </NavLink>
                                    )}

                                    {(usuario?.tipo_usuario_id === 3 || usuario?.tipo_usuario_id === 1) && (
                                        <NavLink className="w-full" to="/addPergunta">
                                            <button className="bg-cyan-400 p-2.5 w-full rounded-md">Adicionar pergunta</button>
                                        </NavLink>
                                    )}
                                    <NavLink className="w-full" to="/listagem-alunos">
                                        <button className="bg-cyan-400 p-2.5 w-full rounded-md">Ver turma</button>
                                    </NavLink>
                                    <NavLink className="w-full" to="/listagem-perguntas">
                                        <button className="bg-cyan-400 p-2.5 w-full rounded-md">Ver perguntas</button>
                                    </NavLink>
                                    <NavLink className="w-full" to="/dashboard">
                                        <button className="bg-cyan-400 p-2.5 w-full rounded-md">Ver dashboard</button>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                }

                <div className="w-full md:w-[40%] h-auto flex flex-col justify-center items-center">
                    <img className="w-[75%] md:w-[70%] rounded-full shadow-md" src="./src/assets/gifCentro.gif" alt="GIF" />
                </div>

                <div className="w-full md:w-[30%] pb-20 sm:pb-5 h-fit p-5 flex flex-col justify-start items-center gap-5 shadow-md">
                    {
                        usuario?.tipo_usuario_id !== 2 ?
                            <>
                                <h1 className="text-2xl md:text-4xl h-fit text-center">Ranking das<span className="text-yellow-400"> salas</span></h1>
                                <div className="w-full flex flex-col gap-3">
                                    {
                                        turmas.map((turma, index) => (
                                            <div
                                                key={index}
                                                className="w-full flex justify-between items-center p-3 bg-cyan-500 rounded-md hover:bg-cyan-700 text-white cursor-pointer"
                                                onClick={() => navigate(`/ranking/${index + 1}/${usuario?.id_escola}`)}
                                            >
                                                <h2 className="text-sm md:text-base">{turma.nome}</h2>
                                                <MdKeyboardArrowRight size={24} />
                                            </div>
                                        ))
                                    }
                                </div>
                            </>
                            :
                            <>
                                <h1 className="text-2xl md:text-4xl text-center">Ranking da <span className="text-yellow-400">sala</span></h1>
                                <div className="w-full flex flex-col justify-center items-center gap-3">
                                    {
                                        usuarios.map((usuarioRank, index) => (
                                            <UserCard
                                                key={index}
                                                id={usuarioRank.id}
                                                nivel={usuarioRank.nivel}
                                                nome={usuarioRank.nome}
                                                avatar={usuarioRank.avatar.caminho}
                                                classe={`${index === 0 ? 'w-full' : 'w-[90%]'} ${index === 0 ? 'bg-yellow-400' : 'bg-gray-400'} flex justify-around items-center text-black p-2.5 cursor-pointer rounded-md transition-transform hover:scale-105`}
                                                onClick={() => navigate(`/perfil/${usuarioRank.id}`)}
                                            />
                                        ))
                                    }
                                    <Button onClick={() => { navigate(`/ranking/${usuario?.id_turma}/${usuario?.id_escola}`); }} color="primary" className="mt-3">
                                        Ver mais <span><MdKeyboardArrowRight size={16} /></span>
                                    </Button>
                                </div>
                            </>
                    }
                </div>
            </div>





            {
                usuario?.tipo_usuario_id === 2 ?
                    <div className="w-11/12 flex flex-col justify-center items-center gap-4 pb-14">
                        <h1 className="text-cyan-400 text-3xl md:text-5xl text-center">Aperfeiçoe seus conhecimentos</h1>
                        <h3 className="text-xl md:text-3xl text-center">Selecione a matéria que deseja treinar</h3>

                        <div className="w-full p-2 shadow-2xl flex gap-3 flex-wrap rounded-lg justify-center items-center">
                            {
                                eloMaterias.map((eloMateria, index) => {
                                    let eloIcon = '';

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
                                            eloIcon = '';
                                    }

                                    return (
                                        <CardMateria
                                            key={index}
                                            id={0}
                                            materiaLogo={eloMateria.materia.icone}
                                            nome={eloMateria.materia.nome}
                                            icon={eloIcon}
                                            onClick={() => {
                                                handleMateriaClick(eloMateria);
                                                handleShowPopup();
                                            }}
                                        />
                                    );
                                })
                            }
                        </div>
                        <ConfirmationPopup
                            isOpen={isPopupOpen}
                            message={`Deseja treinar ${materiaSelecionada?.materia.nome} ?`}
                            onConfirm={handleConfirm}
                            onCancel={handleCancel}
                        />
                    </div>
                    : null
            }


        </div>
    )
}