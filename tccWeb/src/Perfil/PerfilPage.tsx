import { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import Navbar from '../components/Navbar/Navbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { Avatar } from "@heroui/react";


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
    respostas_corretas_elo: number,
    respostas_corretas_total: number,
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

interface Avatar {
    id: number,
    nome: string,
    caminho: string
}

export function PerfilPage() {
    let { idUsuario } = useParams();
    const navigate = useNavigate();
    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();
    const [usuarioNavBar, setUsuarioNavBar] = useState<Usuario>();
    const [usuarios, setUsers] = useState<Usuario[]>([]);
    const [dados, setDados] = useState<Estatisticas | null>(null);
    const [eloMaterias, setEloMaterias] = useState<EloMateria[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [materiaSelecionada, setMateriaSelecionada] = useState<EloMateria | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [avatares, setAvatares] = useState<Avatar[]>([]);
    const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);

    const getEloIcon = (eloMateria: EloMateria) => {
        switch (eloMateria.subelo_id) {
            case 1:
                return eloMateria.elo.elo1;
            case 2:
                return eloMateria.elo.elo2;
            case 3:
                return eloMateria.elo.elo3;
            default:
                return '';
        }
    };

    useEffect(() => {
        async function pegaUsuarios() {

            const response = await fetch(`http://localhost:3000/usuarios?order=nivel&orderDirection=DESC`, {
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
        async function carregarAvatares() {
            const response = await fetch(`http://localhost:3000/avatares`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const estaticasUsuario = await response.json();
            setAvatares(estaticasUsuario);
        }
        carregarAvatares();
    }, [token]);

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

    async function trocaAvatar() {
        try {
            const response = await fetch(`http://localhost:3000/usuarios/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_avatar: selectedAvatarId })
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar usuário: ${response.statusText}`);
            }

            const data = await response.json();
            navigate(0);
            return data;
        } catch (error) {
            console.error("Erro ao atualizar o usuário:", error);
        }
    }

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

    return (
        <>
            <div className="w-screen flex flex-col justify-start items-center min-h-screen gap-12 mb-40">
                <Navbar id={usuarioNavBar?.id} nivel={usuarioNavBar?.nivel} avatar={usuarioNavBar?.avatar.caminho || ''} />

                <div className="w-4/5 flex flex-col justify-center items-center gap-10">
                    <div className="w-full flex p-2.5 justify-center items-center text-lg">
                        <div className="w-1/5 flex flex-col gap-5">
                            {usuario?.avatar && <img className="w-full" src={usuario?.avatar.caminho} alt="Perfil" />}
                            {
                                usuario?.id === user?.id ?
                                    <>
                                        <Button onPress={onOpen}>Trocar avatar</Button>
                                        <Modal className='text-black' size='2xl' isOpen={isOpen} onOpenChange={onOpenChange}>
                                            <ModalContent>
                                                {(onClose) => (
                                                    <>
                                                        <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                                                        <ModalBody>
                                                            <div className='flex flex-wrap justify-start items-start gap-5'>
                                                                {
                                                                    avatares.map((avatar, index) => {
                                                                        return (
                                                                            <div className="w-[10%]">
                                                                                <Avatar
                                                                                    isBordered
                                                                                    color={selectedAvatarId === avatar.id ? "success" : "default"}
                                                                                    onClick={() => setSelectedAvatarId(avatar.id)}
                                                                                    key={index}
                                                                                    size="lg"
                                                                                    src={avatar.caminho} />
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <Button color="danger" variant="light" onPress={onClose}>
                                                                Close
                                                            </Button>
                                                            <Button color="primary" onPress={trocaAvatar}>
                                                                Action
                                                            </Button>
                                                        </ModalFooter>
                                                    </>
                                                )}
                                            </ModalContent>
                                        </Modal>
                                    </>
                                    : null
                            }
                        </div>
                        <div className="w-[80%] flex flex-row justify-start gap-32 pl-20 items-center">
                            <p className="text-2xl font-bold">Nome: {usuario?.nome}</p>
                            <p className="text-2xl font-bold">Sala: {usuario?.id_turma}º ano</p>
                            {
                                usuarios.map((usuarioRank, index) => {
                                    if (usuario?.id === usuarioRank.id) {
                                        return (
                                            <p key={index} className="text-2xl font-bold">Ranking: {index + 1}º </p>
                                        );
                                    }
                                    return null;
                                })
                            }
                        </div>
                    </div>

                    <div className="w-9/10 border border-white rounded p-5 gap-6 flex flex-row justify-around items-start flex-wrap">
                        <div className="w-1/4 flex flex-col justify-center items-center">
                            <p className='text-2xl'>Perguntas totais</p>
                            <p className='text-xl'>{dados.total_perguntas}</p>
                        </div>
                        <div className="w-1/4 flex flex-col justify-center items-center">
                            <p className='text-2xl'>Perguntas acertadas</p>
                            <p className='text-xl'>{dados.total_perguntas_acertadas}</p>
                        </div>
                        <div className="w-1/4 flex flex-col justify-center items-center">
                            <p className='text-2xl'>Disputas</p>
                            <p className='text-xl'>{dados.total_disputas}</p>
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

                    <div className="w-full flex flex-row justify-start items-center mb-10">
                        <div className="w-1/6 p-1 gap-2 flex flex-col justify-center items-start">
                            {eloMaterias.map((eloMateria, index) => (
                                <p className="text-2xl" key={index} onClick={() => handleMateriaClick(eloMateria)}>
                                    {eloMateria.materia.nome}
                                </p>
                            ))}
                        </div>

                        {
                            materiaSelecionada
                                ? (
                                    <div className="w-4/5 h-9/10 border border-white rounded p-5 gap-48 flex flex-row justify-center items-center">
                                        <div className="flex flex-col justify-center items-start gap-10">
                                            <div className="flex justify-center items-center gap-4">
                                                <h2 className="text-3xl">Nome:</h2>
                                                <p className="text-2xl">{materiaSelecionada.materia.nome}</p>
                                            </div>
                                            <div className="flex justify-center items-center gap-4">
                                                <h2 className="text-3xl">Elo:</h2>
                                                <p className="text-2xl">{materiaSelecionada.elo.nome} {materiaSelecionada.subelo_id}</p>
                                            </div>
                                            <div className="flex justify-center items-center gap-4">
                                                <h2 className="text-2xl">Respostas corretas no elo:</h2>
                                                <p className="text-3xl">{materiaSelecionada.respostas_corretas_elo}</p>
                                            </div>
                                            <div className="flex justify-center items-center gap-4">
                                                <h2 className="text-2xl">Respostas corretas na matéria:</h2>
                                                <p className="text-3xl">{materiaSelecionada.respostas_corretas_total}</p>
                                            </div>
                                        </div>

                                        <img src={materiaSelecionada.eloIcon} alt="" className="w-1/4" />
                                    </div>
                                ) :
                                (
                                    <div className="w-4/5 h-9/10 border border-white rounded p-5 gap-48 flex flex-row justify-center items-center">
                                        <p>Selecione uma matéria para ver mais detalhes.</p>
                                    </div>
                                )
                        }
                    </div>
                </div>
            </div>
        </>
    );



}
