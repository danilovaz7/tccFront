import { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import Navbar from '../components/Navbar/Navbar';
import { Form, Input, Button, Select, SelectItem } from "@heroui/react";
import CardAlunoLista from '../components/CardAlunoLista/CardAlunoLista';





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

interface Pergunta {
    id: number;
    materia_id: number;
    pergunta: string;
}

interface Alternativa {
    id: number;
    pergunta_id: number;
    alternativa: string;
    correta: boolean
}

interface Pesquisa {
    id_turma: number | null,
    materia_id: number | null
}

export function ListagemPerguntasPage() {
    const [usuarioNavBar, setUsuarioNavBar] = useState<Usuario>();
    const [perguntasMaterias, setPerguntasMateria] = useState<Pergunta[]>([]);
    const [materias, setMaterias] = useState<[]>([]);
    const { token, user } = useTokenStore();

    const [pesquisa, setPesquisa] = useState<Pesquisa>({
        id_turma: null,
        materia_id: null
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

    async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        console.log(`http://localhost:3000/materias/${pesquisa.materia_id}/perguntas/turma/${pesquisa.id_turma}`)
        async function pegaPerguntas() {
           console.log(pesquisa)
            const response = await fetch(`http://localhost:3000/materias/${pesquisa.materia_id}/perguntas/turma/${pesquisa.id_turma}`, {
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
    return (
        <>
            <div className="w-screen flex flex-col justify-start items-center min-h-screen gap-12 mb-40">
                <Navbar id={usuarioNavBar?.id} nivel={usuarioNavBar?.nivel} avatar={usuarioNavBar?.avatar.caminho || ''} />
                <h1 className='text-white'>OLA PROFESSOR Lista pergunaaatas</h1>

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

                    <Select isRequired onChange={(e) => { setPesquisa({ ...pesquisa, materia_id: parseInt(e.target.value) }) }} value={pesquisa.materia_id} className="max-w-xs " label="Selecione a matéria">
                        {materias.map((materia) => (
                            <SelectItem className='text-black' key={materia.id}>{materia.nome}</SelectItem>
                        ))}
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
                        perguntasMaterias
                            ? (
                                <div className="w-[100%]  flex-wrap  p-5 gap-4 flex flex-row justify-start items-center">
                                    {
                                        perguntasMaterias.map((perguntaMateria, index) => {
                                            
                                            return (
                                                <p>{perguntaMateria.pergunta}</p>
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
