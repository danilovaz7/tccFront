import { FormEvent, useEffect, useState } from 'react';
import { MdKeyboardArrowRight } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import Navbar from '../components/Navbar/Navbar';
import UserCard from '../components/UserCard/UserCard';
import CardMateria from '../components/CardMateria/CardMateria';
import ConfirmationPopup from '../components/ConfirmationPopup/ConfirmationPopup';

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

    const [matricula, setMatricula] = useState('')
    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();
    const [eloMaterias, setEloMaterias] = useState<EloMateria[]>([]);
    const [usuarios, setUsers] = useState<Usuario[]>([])
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [materiaSelecionada, setMateriaSelecionada] = useState<EloMateria | null>(null);

    function formSubmit(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        alert(matricula)
    }

    const handleShowPopup = () => setIsPopupOpen(true);
    const handleConfirm = () => {
        setIsPopupOpen(false);
        navigate(`/materias/${materiaSelecionada?.materia.nome}`)
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
    }, []);


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
    }, []);

    useEffect(() => {
        async function pegaUsuarios() {
            const response = await fetch(`http://localhost:3000/usuarios?limit=5`, {
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

    return (

        <div className="w-full flex flex-col justify-between items-center h-screen gap-12">
            <Navbar id={usuario?.id} nivel={usuario?.nivel} avatar={usuario?.avatar.caminho} />

            <div className="w-11/12 flex flex-wrap justify-around">
                <div className="w-1/5 h-auto p-5 flex flex-col justify-start items-center gap-3 rounded-md">
                    <h1 className="text-4xl">Que tal jogar com um amigo?</h1>
                    <p>É sempre melhor evoluir juntos!</p>
                    <form onSubmit={(evento) => formSubmit(evento)} className="w-full flex p-2.5 flex-col justify-start items-center gap-5 rounded-md  shadow-xl">
                        <button className="bg-cyan-400 w-2/3 text-sm flex justify-center items-center gap-2.5 text-black border border-transparent cursor-pointer p-2.5 rounded-md">CRIAR SALA</button>
                    </form>
                </div>

                <div className="w-[45%] h-full p-3 flex flex-col justify-center items-center">
                    <img className="w-[50%] rounded-full shadow-xl" src="./src/assets/gifCentro.gif" alt="" />
                </div>

                <div className="w-1/4 border border-black shadow-xl p-2.5 flex flex-col justify-start items-center rounded-md">
                    <h1 className="text-4xl">Ranking da <span className="text-yellow-400">sala</span></h1>
                    <div className="w-11/12 p-2.5 flex flex-col justify-center items-center gap-2.5">
                        {
                            usuarios.map((usuarioRank, index) => {
                                if (usuario?.id_turma === usuarioRank.id_turma && usuario?.id_escola === usuarioRank.id_escola) {
                                    if (index === 0) {
                                        return (
                                            <UserCard id={usuarioRank.id} nivel={usuarioRank.nivel} nome={usuarioRank.nome} avatar={usuarioRank.avatar.caminho}
                                                classe="w-full bg-yellow-400 flex justify-around items-center text-black p-2.5 cursor-point rounded-md transition-transform ease-in-out hover:scale-105"
                                                imgClasse='w-1/5 rounded-full' />
                                        )
                                    }
                                    return (
                                        <UserCard id={usuarioRank.id} nivel={usuarioRank.nivel} nome={usuarioRank.nome} avatar={usuarioRank.avatar.caminho}
                                            classe="w-9/10 bg-gray-400 flex justify-around items-center text-black p-2.5 cursor-point rounded-md transition-transform ease-in-out hover:scale-102"
                                            imgClasse='w-1/5 rounded-full' />
                                    );
                                }
                                return null;
                            })
                        }
                        <button className="bg-cyan-400 w-1/2 text-sm flex justify-center items-center gap-2.5 text-black border border-transparent cursor-pointer p-2.5 rounded-md" onClick={() => { navigate('/ranking'); }}>Ver mais <span><MdKeyboardArrowRight size={16} /></span></button>
                    </div>
                </div>
            </div>



            {
                usuario?.tipo_usuario_id === 2
                    ?

                    <div className="w-11/12 flex flex-col justify-center items-center gap-4 pb-14">
                        <h1 className="text-cyan-400 text-5xl">Aperfeiçoe seus conhecimentos</h1>
                        <h3 className="text-3xl">Selecione a matéria que deseja treinar</h3>

                        <div className="w-11/12 p-2.5 shadow-2xl flex gap-5 flex-wrap rounded-lg justify-center items-center">
                            {
                                eloMaterias.map((eloMateria) => {
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
                                        <>
                                            <CardMateria id={0} materiaLogo={eloMateria.materia.icone} nome={eloMateria.materia.nome} icon={eloIcon} onClick={() => {
                                                handleMateriaClick(eloMateria)
                                                handleShowPopup()
                                                }
                                            } />
                                        </>


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
                    :
                    null
            }
            {
                usuario?.tipo_usuario_id === 1
                    ?
                    <div className="w-11/12 flex flex-col justify-center items-center pb-12.5">
                        <div>
                            <NavLink to="/addAluno"><button className="bg-cyan-400 p-2.5 rounded-md">Adicionar aluno</button></NavLink>
                            <button className="bg-cyan-400 p-2.5 rounded-md">Adicionar turma</button>
                        </div>
                    </div>
                    :
                    null
            }

        </div>
    )
}
