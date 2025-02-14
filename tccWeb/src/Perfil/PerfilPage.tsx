import { FormEvent, useEffect, useState } from 'react';
import './PerfilPage.css'
import { NavLink, useParams } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import Navbar from '../components/Navbar/Navbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";

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

interface Estatisticas {
    total_disputas: number;
    total_disputas_ganhas: number;
    total_perguntas: number;
    total_perguntas_acertadas: number;
}

interface EloMateria {
    id: number,
    usuario_id: number,
    materia_id: number,
    elo_id: number,
    subelo_id: number,
    respostas_corretas_elo: string,
    respostas_corretas_total: string,
    eloIcon: string,
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


export function PerfilPage() {
    let { idUsuario } = useParams();
    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();
    const [usuarioNavBar, setUsuarioNavBar] = useState<Usuario>();
    const [usuarios, setUsers] = useState<Usuario[]>([]);
    const [dados, setDados] = useState<Estatisticas | null>(null);
    const [eloMaterias, setEloMaterias] = useState<EloMateria[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [materiaSelecionada, setMateriaSelecionada] = useState<EloMateria | null>(null);

    const getEloIcon = (eloMateria: EloMateria) => {
        switch (eloMateria.subelo_id) {
            case 1:
                return eloMateria.elo.elo1;
            case 2:
                return eloMateria.elo.elo2;
            case 3:
                return eloMateria.elo.elo3;
            default:
                return ''; // Valor padrão caso não haja subelo
        }
    };

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
    }, [idUsuario])

    useEffect(() => {
        async function pegaUsuario() {
            const response = await fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const usuarioAtual = await response.json();
            setUsuario(usuarioAtual);
        }
        pegaUsuario();
    }, [idUsuario]);

    useEffect(() => {
        async function pegaUsuarioNav() {
            const response = await fetch(`http://localhost:3000/usuarios/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const userNav = await response.json();
            setUsuarioNavBar(userNav);
        }
        pegaUsuarioNav();
    }, [idUsuario]);

    useEffect(() => {
        async function pegaEloMaterias() {
            const response = await fetch(`http://localhost:3000/eloMaterias/${usuario?.id}`, {
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
    }, [usuario]);

    const handleMateriaClick = (materia: EloMateria) => {
        setMateriaSelecionada({
            ...materia,
            eloIcon: getEloIcon(materia),
        });
    };


    useEffect(() => {
        async function carregarDados() {
            const response = await fetch(`http://localhost:3000/estatisticas/${idUsuario}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const estaticasUsuario = await response.json();
            setDados(estaticasUsuario);
            setCarregando(false);
        }
        carregarDados();
    }, [idUsuario])


    const dataGrafico = [
        {
            categoria: "Perguntas",
            Total: dados?.total_perguntas,
            Corretas: dados?.total_perguntas_acertadas,
        },
    ];

    const totalDisputas = dados?.total_disputas || 0;
    const totalDisputasGanhas = dados?.total_disputas_ganhas || 0;
    const disputasPerdidas = totalDisputas - totalDisputasGanhas;

    const dataGraficoPizza = [
        { name: "Disputas Ganhas", value: dados?.total_disputas_ganhas || 0 },
        { name: "Disputas Perdidas", value: disputasPerdidas || 0 },
    ];

    if (dados?.total_disputas === 0) {
        dataGraficoPizza.push({ name: "Nenhuma Partida", value: 1 });
    }

    if (totalDisputas > 0) {
        const index = dataGraficoPizza.findIndex(item => item.name === "Nenhuma Partida");
        if (index > -1) {
            dataGraficoPizza.splice(index, 1);
        }
    }

    const COLORS = ['#82ca9d', '#ff6347', '#FFD700'];
    if (carregando) return <p>Carregando estatísticas...</p>;
    if (!dados) return <p>Erro ao carregar estatísticas.</p>;

    console.log(eloMaterias)

    return (
        <>
            <div className='containerPerfil'>

                <Navbar id={usuarioNavBar?.id} nivel={usuarioNavBar?.nivel} avatar={usuarioNavBar?.avatar.caminho || ''} />

                <div className='perfilStats'>
                    <div className='perfilTop'>
                        <div className='imgContainer'>
                            {usuario?.avatar && <img className='imgPerfil' src={usuario?.avatar.caminho} alt="Perfil" />}
                        </div>
                        <div className='alunoInfo'>
                            <p>Nome:  {usuario?.nome} </p>
                            <p>Sala:  {usuario?.id_turma}º ano</p>
                            {
                                usuarios.map((usuarioRank, index) => {
                                    if (usuario?.id === usuarioRank.id) {
                                        return (
                                            <p key={index}>Ranking: {index + 1}º  </p>
                                        );
                                    }
                                })
                            }

                        </div>
                    </div>

                    <div className='caracteristicasGerais'>
                        <div className='status'>
                            <p>Perguntas totais</p>
                            <p>{dados.total_perguntas}</p>
                        </div>
                        <div className='status'>
                            <p>Perguntas acertadas</p>
                            <p>{dados.total_perguntas_acertadas}</p>
                        </div>
                        <div className='status'>
                            <p>Disputas</p>
                            <p>{dados.total_disputas}</p>
                        </div>

                        <BarChart width={500} height={300} data={dataGrafico}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="categoria" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Total" fill="#8884d8" name="Total de Perguntas" />
                            <Bar dataKey="Corretas" fill="#82ca9d" name="Perguntas Corretas" />
                        </BarChart>

                        <PieChart width={300} height={300}>
                            <Pie
                                data={dataGraficoPizza}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {dataGraficoPizza.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>

                    <div className='alunoStats'>
                        <div className='materiasName'>
                            {eloMaterias.map((eloMateria, index) => (
                                <p key={index} onClick={() => handleMateriaClick(eloMateria)}>
                                    {eloMateria.materia.nome}
                                </p>
                            ))}
                        </div>

                        {
                            materiaSelecionada
                                ?
                                (
                                    <div className='materiasContainer'>
                                        <div className='materiasStats'>
                                            <div className='materiaStats'>
                                                <h2>Nome: </h2>
                                                <p>{materiaSelecionada.materia.nome}</p>
                                            </div>
                                            <div className='materiaStats'>
                                                <h2>Elo: </h2>
                                                <p>{materiaSelecionada.elo.nome} {materiaSelecionada.subelo_id}</p>
                                            </div>
                                            <div className='materiaStats'>
                                                <h2>Respostas corretas no elo: </h2>
                                                <p>{materiaSelecionada.respostas_corretas_elo}</p>
                                            </div>
                                            <div className='materiaStats'>
                                                <h2>Respostas corretas na matéra: </h2>
                                                <p>{materiaSelecionada.respostas_corretas_total}</p>
                                            </div>
                                        </div>

                                        <img src={materiaSelecionada.eloIcon} alt="" />
                                    </div>


                                )
                                :
                                (
                                    <p>Selecione uma matéria para ver mais detalhes.</p>
                                )
                        }



                    </div>

                </div>
            </div>

        </>
    )
}
