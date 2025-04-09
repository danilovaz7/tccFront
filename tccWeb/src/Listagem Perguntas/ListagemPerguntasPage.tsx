import { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import { Form, Input, Button, Select, SelectItem } from "@heroui/react";
import { Accordion, AccordionItem, Avatar } from "@heroui/react";

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

interface Pergunta {
    id: number;
    materia_id: number;
    pergunta: string;
    elo_id: number;
    turma_id: number
    alternativas: []
}

interface Materia {
    id: number;
    nome: string
}

interface Pesquisa {
    id_turma: number | null,
    materia_id: number | null,
    escola_id: number | undefined
}

export function ListagemPerguntasPage() {
    const [usuarioNavBar, setUsuarioNavBar] = useState<Usuario>();
    const [perguntasMaterias, setPerguntasMateria] = useState<Pergunta[]>([]);
    const [materias, setMaterias] = useState<Materia[]>([]);
    const { token, user } = useTokenStore();

    const [pesquisa, setPesquisa] = useState<Pesquisa>({
        id_turma: null,
        materia_id: null,
        escola_id: usuarioNavBar?.id_escola
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
        if (usuarioNavBar) {
            setPesquisa((prevPesquisa) => ({
                ...prevPesquisa,
                escola_id: usuarioNavBar.id_escola,
                ...(usuarioNavBar.tipo_usuario_id !== 1 && { materia_id: usuarioNavBar.id_materia })
            }));
        }
    }, [usuarioNavBar]);


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

    async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        async function pegaPerguntas() {
            console.log(`http://localhost:3000/materias/${pesquisa.materia_id}/perguntas/escola/${pesquisa.escola_id}/turma/${pesquisa.id_turma}`)
            const response = await fetch(`http://localhost:3000/materias/${pesquisa.materia_id}/perguntas/escola/${pesquisa.escola_id}/turma/${pesquisa.id_turma}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            const perguntasMateria = await response.json()
            setPerguntasMateria(perguntasMateria)
        }

        pegaPerguntas();
    }

    function deixarPrimeiraLetraMaiuscula(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    if (!usuarioNavBar) {
        return <p>Carregando...</p>;
    }

    return (
        <>
            <div className="w-screen flex flex-col justify-start items-center min-h-screen gap-12 mb-40">
                
                {usuarioNavBar.tipo_usuario_id === 1 ? <h1 className='text-white'>Ola diretor {usuarioNavBar.nome} </h1> : null}
                {usuarioNavBar.tipo_usuario_id === 3 ? <h1 className='text-white'>Ola professor {usuarioNavBar.nome} </h1> : null}
                {
                    usuarioNavBar.tipo_usuario_id === 3 ?
                    materias.map((materia,index) => {
                        if (materia.id === usuarioNavBar.tipo_usuario_id) {
                            return <h1 key={index} className='text-2xl'>Materia: {deixarPrimeiraLetraMaiuscula(materia.nome)}</h1>
                        }
                        return null;
                    })
                    : null
                }
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

                    {
                        usuarioNavBar.tipo_usuario_id === 1 ?
                            <Select isRequired onChange={(e) => { setPesquisa({ ...pesquisa, materia_id: parseInt(e.target.value) }) }} value={pesquisa.materia_id} className="max-w-xs " label="Selecione a matéria">
                                {materias.map((materia,index) => (
                                    <SelectItem  className='text-black' key={index}>{materia.nome}</SelectItem>
                                ))}
                            </Select>
                            :
                            null
                    }

                    <div className="flex gap-2">
                        <Button color="primary" type="submit">
                            Submit
                        </Button>
                        <Button type="reset" variant="flat">
                            Reset
                        </Button>
                    </div>
                </Form>

                <div className='w-[90%]  p-5 flex flex-row justify-center items-center flex-wrap gap-10'>
                    {
                        perguntasMaterias
                            ? (
                                <div className="w-[100%] flex-wrap  p-5 gap-4 flex flex-row justify-start items-center">
                                    {
                                        perguntasMaterias.map((perguntaMateria, index) => {

                                            return (

                                                <Accordion key={index} className=' text-white' selectionMode="multiple">
                                                    <AccordionItem
                                                        key={index}
                                                        className='bg-gray-700 p-5 text-white'
                                                        startContent={
                                                            "Dificuldade: " + perguntaMateria.elo_id
                                                        }
                                                        title={perguntaMateria.pergunta}
                                                    >
                                                        {
                                                            perguntaMateria.alternativas.map((alternativa,indexx) => (
                                                                <div className=' flex justify-between gap-5 p-5'>

                                                                    {
                                                                        alternativa.correta ?
                                                                            <p key={indexx} className='text-green-600 text-left'>Alternativa: {alternativa.alternativa}</p>
                                                                            :
                                                                            <p key={indexx} className='text-red-400 text-left'>Alternativa: {alternativa.alternativa}</p>
                                                                    }
                                                                </div>
                                                            ))
                                                        }
                                                    </AccordionItem>

                                                </Accordion>

                                            );

                                        })
                                    }
                                </div>
                            ) :
                            (
                                <div className="w-[80%] h-9/10 border border-white rounded p-5 gap-48 flex flex-row justify-center items-center">
                                    <p>Selecione uma pergunta para ver mais detalhes.</p>
                                </div>
                            )
                    }

                </div>

            </div>
        </>
    );



}
