import { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import { useSocket } from '../hooks/useSocket';
import Navbar from '../components/Navbar/Navbar';
import { Form, Input, Button, Select, SelectItem } from "@heroui/react";
import { useFormik } from 'formik';
import UserCard from '../components/UserCard/UserCard';

interface Usuario {
    id: number;
    nome: string;
    nivel: string;
    tipo_usuario_id: number;
    id_turma: number;
    id_escola: number;
    id_materia: number;
    avatar: {
        nome: string;
        caminho: string;
    };
}

interface Aluno {
    usuario_id: number;
    sala_id: number;
    usuario: {
        id: number;
        nome: string;
        nivel: string;
        tipo_usuario_id: number;
        id_turma: number;
        id_escola: number;
        id_materia: number;
        avatar: {
            nome: string;
            caminho: string;
        };
    };
}

interface Sala {
    id: number;
    codigo: string;
    status: string;
    vencedor_id: number;
}

export function Sala() {
    let { codigo } = useParams();
    const navigate = useNavigate();
    const { token, user } = useTokenStore();
    const socket = useSocket();

    const [usuarioNavBar, setUsuarioNavBar] = useState<Usuario>();
    const [sala, setSala] = useState<Sala>();
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [materias, setMaterias] = useState<any[]>([]);  // Modificar para qualquer tipo (recomendo refinar o tipo mais tarde)

    const [selectedMaterias, setSelectedMaterias] = useState<number[]>([]);  // Armazenar as matérias selecionadas

    useEffect(() => {
        async function getMaterias() {
            const response = await fetch(`http://localhost:3000/materias`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const materias = await response.json();
            setMaterias(materias);
        }
        getMaterias();
    }, [token]);

    const formik = useFormik({
        initialValues: {
            nome: '',
            materias: []  // Materias selecionadas inicialmente vazias
        },
        onSubmit: async (values) => {
            console.log(values);
            const resposta = await fetch(`http://localhost:3000/criar-escola`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: values.nome,
                    materias: selectedMaterias, // Enviar as matérias selecionadas
                })
            });

            if (resposta.ok) {
                navigate('/home');
            }
        }
    });

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
    }, [user]);

    useEffect(() => {
        async function pegaSala() {
            const response = await fetch(`http://localhost:3000/sala/${codigo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const sala = await response.json();
            setSala(sala);
        }
        pegaSala();
    }, [codigo, token]);

    useEffect(() => {
        async function pegaSalaAlunos() {
            const response = await fetch(`http://localhost:3000/sala-alunos/${sala?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const salaAlunos = await response.json();
            setAlunos(salaAlunos);
        }
        if (sala?.id) {
            pegaSalaAlunos();
        }
    }, [sala, token]);

    useEffect(() => {
        if (!socket || !user || !sala?.id) return;

        socket.emit("entrar_sala", { codigo, usuario: user });

        socket.on("atualizar_sala", ({ usuario }) => {
            setAlunos(prev => [
                ...prev,
                {
                    usuario_id: usuario.id,
                    sala_id: sala.id,
                    usuario: usuario
                }
            ]);
        });

        return () => {
            socket.off("atualizar_sala");
        };
    }, [socket, user, sala]);

    if (!usuarioNavBar) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <div className="w-screen flex flex-col justify-start items-center min-h-screen gap-12 mb-40">
                <Navbar id={usuarioNavBar?.id} nivel={usuarioNavBar?.nivel} avatar={usuarioNavBar?.avatar.caminho || ''} />
                <div className='w-[95%] border flex justify-center items-start gap-10 p-5'>
                    <div className='w-[25%] border flex flex-col gap-5 p-5'>
                        <h1>Selecione 3 disciplinas</h1>
                        <Form
                            className="w-[100%] flex flex-col justify-center items-center gap-4"
                            onSubmit={formik.handleSubmit}
                            onReset={formik.handleReset}
                        >
                            {['materia1', 'materia2', 'materia3'].map((materiaKey, index) => (
                                <Select
                                    key={materiaKey}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        const updatedMaterias = [...selectedMaterias];
                                        updatedMaterias[index] = value;
                                        setSelectedMaterias(updatedMaterias);
                                    }}
                                    value={selectedMaterias[index] || ''}
                                    className="max-w-[70%]"
                                    label={`Selecione a matéria ${index + 1}`}
                                >
                                    {materias.map((materia) => (
                                        <SelectItem className='text-black' key={materia.id} value={materia.id}>
                                            {materia.nome}
                                        </SelectItem>
                                    ))}
                                </Select>
                            ))}
                            <div className="flex gap-2">
                                <Button size='sm' color="primary" type="submit">
                                    Enviar
                                </Button>
                                <Button size='sm' type="reset" variant="flat">
                                    Limpar
                                </Button>
                            </div>
                        </Form>
                    </div>
                    <div className='w-[40%] border p-5 flex flex-col items-center justify-center gap-5'>
                        <h1>Lista de jogadores</h1>
                        <div className='flex w-[100%] flex-col items-center justify-center gap-5'>
                            {alunos.map((aluno) => (
                                <UserCard
                                    key={aluno.usuario.id}
                                    id={aluno.usuario.id}
                                    nivel={aluno.usuario.nivel}
                                    nome={aluno.usuario.nome}
                                    classe="w-[60%] bg-gray-400 flex justify-around items-center text-black p-2.5 cursor-pointer rounded-md"
                                />
                            ))}
                        </div>
                    </div>
                    <div className='w-[25%] border p-5'></div>
                </div>
            </div>
        </>
    );
}
