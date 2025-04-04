import { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import { Form, Input, Button, Select, SelectItem } from "@heroui/react";
import CardAlunoLista from '../components/CardAlunoLista/CardAlunoLista';

interface Usuario {
    id: number,
    nome: string,
    nivel: string,
    tipo_usuario_id: number,
    id_turma: number,
    id_escola: number,
    id_materia: number
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

interface Pesquisa {
    id_turma: number | null,
    materia_id: number | null,
    order: string
}

export function ListagemPage() {
    const [usuarioNavBar, setUsuarioNavBar] = useState<Usuario>();
    const [usuarios, setUsers] = useState<Usuario[]>([]);
    const [eloMaterias, setEloMaterias] = useState<EloMateria[]>([]);
    const [materias, setMaterias] = useState<[]>([]);
    const { token, user } = useTokenStore();

    const [pesquisa, setPesquisa] = useState<Pesquisa>({
        id_turma: null,
        materia_id: null,
        order: 'string'
    })

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
    }, []);

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
    }, []);

    useEffect(() => {
        if (usuarioNavBar) {
            setPesquisa((prevPesquisa) => ({
                ...prevPesquisa,
                ...(usuarioNavBar.tipo_usuario_id !== 1 && usuarioNavBar.tipo_usuario_id !== 4 && { materia_id: usuarioNavBar.id_materia })
            }));
        }
    }, [usuarioNavBar]);

    async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        console.log(pesquisa)
        async function pegaUsuarios() {

            const response = await fetch(`http://localhost:3000/usuarios?id_turma=${pesquisa.id_turma}&order=${pesquisa.order}&orderDirection=DESC&materiaId=${pesquisa.materia_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            const usuarios = await response.json()
            setUsers(usuarios)
        }
        async function pegaEloMaterais() {
            const response = await fetch(`http://localhost:3000/eloMaterias/materias/${pesquisa.materia_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            const reponseElo = await response.json()

            setEloMaterias(reponseElo)
        }


        pegaEloMaterais();
        pegaUsuarios();
    }

    if (!usuarioNavBar) {
        return <p>Carregando...</p>;
    }


    return (
        <>
            <div className="w-screen flex flex-col justify-start items-center min-h-screen gap-12 mb-40">
                <h1 className='text-white'>OLA PROFESSOR</h1>

                <Form
                    className="w-[80%]  flex flex-row gap-4 p-5 justify-center items-center border-white border-2"
                    onReset={() => { }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e)
                    }}
                >
                    <Select isRequired onChange={(e) => { setPesquisa({ ...pesquisa, id_turma: parseInt(e.target.value) }) }} value={pesquisa.id_turma} className="max-w-xs " label="Selecione a turma">
                        <SelectItem key={1} className='text-black' >1° ano</SelectItem>
                        <SelectItem key={2} className='text-black' >2° ano</SelectItem>
                        <SelectItem key={3} className='text-black' >3° ano</SelectItem>
                    </Select>
                    {(usuarioNavBar?.tipo_usuario_id === 4 || usuarioNavBar?.tipo_usuario_id === 1) && (
                        <Select isRequired onChange={(e) => { setPesquisa({ ...pesquisa, materia_id: parseInt(e.target.value) }) }} value={pesquisa.materia_id} className="max-w-xs " label="Selecione a matéria">
                            {materias.map((materia) => (
                                <SelectItem className='text-black' key={materia.id}>{materia.nome}</SelectItem>
                            ))}
                        </Select>

                    )}

                    <Select isRequired onChange={(e) => { setPesquisa({ ...pesquisa, order: e.target.value }) }} value={pesquisa.order} className="max-w-xs " label="Ordenação">
                        <SelectItem key={'nome'} className='text-black' >Nome</SelectItem>
                        <SelectItem key={'experiencia'} className='text-black' >Experiência</SelectItem>
                        <SelectItem key={'nivel'} className='text-black' >Nível</SelectItem>
                        <SelectItem key={'elo'} className='text-black' >Elo</SelectItem>
                    </Select>

                    <div className="flex gap-2">
                        <Button color="primary" type="submit">
                            Submit
                        </Button>
                        <Button type="reset" variant="flat">
                            Reset
                        </Button>
                    </div>
                </Form>

                <div className='w-[90%] border rounded-md border-white p-5 flex flex-row justify-center items-center flex-wrap gap-10'>
                    {
                        usuarios
                            ? (
                                <div className="w-[100%]  flex-wrap  p-5 gap-4 flex flex-row justify-start items-center">
                                    {
                                        usuarios.map((usuarioRank, index) => {
                                            let icone
                                            eloMaterias.map((eloMateria, index) => {
                                                if (eloMateria.usuario_id == usuarioRank.id) {
                                                    switch (eloMateria.subelo_id) {
                                                        case 1:
                                                            icone = eloMateria.elo.elo1;
                                                            break;
                                                        case 2:
                                                            icone = eloMateria.elo.elo2;
                                                            break;
                                                        case 3:
                                                            icone = eloMateria.elo.elo3;
                                                            break;
                                                        default:
                                                            icone = '';
                                                    }

                                                }

                                            })


                                            return (
                                                <CardAlunoLista id={index} avatar={usuarioRank.avatar.caminho} nome={usuarioRank.nome} icon={icone} nivel={usuarioRank.nivel} />
                                            );

                                        })
                                    }
                                </div>
                            ) :
                            (
                                <div className="w-[80%] h-9/10 border border-white rounded p-5 gap-48 flex flex-row justify-center items-center">
                                    <p>Selecione uma matéria para ver mais detalhes.</p>
                                </div>
                            )
                    }

                </div>

            </div>
        </>
    );



}
