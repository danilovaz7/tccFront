import { FormEvent, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Form, Input, Button } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import React from 'react';

interface Avatar {
    id: number,
    nome: string,
    caminho: string
}

interface Escola {
    id: number,
    nome: string,
}

interface Aluno {

    nome: string,
    email: string,
    matricula: string,
    id_turma: number | undefined,
    id_escola: number | undefined,
    genero: string,
    tipo_usuario_id: number,
    id_avatar: number | undefined
}

export function AddAlunoPage() {
    const navigate = useNavigate();
    const { token, user } = useTokenStore();
    const [avatares, setAvatares] = useState<Avatar[]>([]);
    const [escolas, setEscolas] = useState<Escola[]>([]);
    const [contador, setContador] = useState(0);
    const [action, setAction] = React.useState(null);

    const [aluno, setAluno] = useState<Aluno>({
        nome: '',
        email: '',
        matricula: '',
        id_turma: undefined,
        id_escola: undefined,
        genero: '',
        id_avatar: undefined,
        tipo_usuario_id: 2
    })
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
        async function carregaEscolas() {
            const response = await fetch(`http://localhost:3000/escolas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const escolasResponse = await response.json();
            setEscolas(escolasResponse);
        }
        carregaEscolas();
    }, [token]);



    async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        console.log(aluno)

        const resposta = await fetch(`http://localhost:3000/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(
                { ...aluno, id_avatar: (contador + 1) }
            )
        });

        if (resposta.ok) {
            alert('Usuario salvo com sucesso');
            navigate('/home');
        } else {
            alert("Erro ao salvar usuario");
        }
    }

    function selecionarAvatarAleatorio() {
        const randomIndex = Math.floor(Math.random() * avatares.length);
        setContador(randomIndex);
    }

    return (
        <div className="size-[90vw] flex flex-col justify-start items-center gap-8">
            <h1 className="text-2xl font-bold">Adicione aqui um aluno novo</h1>
            <Form
                className="w-[80%] flex flex-col justify-center  gap-4 border-2 p-10 border-white"
                onReset={()=>{}}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e)
                }}
            >
                <Input
                    isRequired
                    errorMessage="Coloque um nome valido"
                    label="Nome"
                    labelPlacement="outside"
                    onChange={(e) => { setAluno({ ...aluno, nome: e.target.value }) }}
                    value={aluno.nome}
                    name="nome"
                    placeholder="Nome..."
                    type="text"
                    classNames={{
                        label: '!text-white'
                    }}
                />

                <Input
                    isRequired
                    errorMessage="Insira um email válido"
                    label="Email"
                    labelPlacement="outside"
                    onChange={(e) => { setAluno({ ...aluno, email: e.target.value }) }}
                    value={aluno.email}
                    name="email"
                    placeholder="Email..."
                    type="email"
                    classNames={{
                        label: '!text-white'
                    }}
                />



                <Select onChange={(e) => { setAluno({ ...aluno, genero: e.target.value }) }} value={aluno.genero} className="max-w-xs " label="Selecione o gênero">
                    <SelectItem key={'M'} className='text-black' >Masculino</SelectItem>
                    <SelectItem key={'F'} className='text-black' >Feminino</SelectItem>
                </Select>

                <Input
                    isRequired
                    className="max-w-xs "
                    errorMessage="Insira uma matrícula válida de 6 digitos"
                    label="Matricula"
                    onChange={(e) => { setAluno({ ...aluno, matricula: e.target.value }) }}
                    value={aluno.matricula}
                    labelPlacement="outside"
                    name="matricula"
                    placeholder="Matricula..."
                    type="text"
                    maxLength={6}
                    minLength={6}
                    classNames={{
                        label: '!text-white'
                    }}
                />

                <Select onChange={(e) => { setAluno({ ...aluno, id_turma: parseInt(e.target.value) }) }} value={aluno.id_turma} className="max-w-xs " label="Selecione a turma">
                    <SelectItem key={1} className='text-black' >1° ano</SelectItem>
                    <SelectItem key={2} className='text-black' >2° ano</SelectItem>
                    <SelectItem key={3} className='text-black' >3° ano</SelectItem>
                </Select>

                <Select onChange={(e) => { setAluno({ ...aluno, id_escola: parseInt(e.target.value) }) }} value={aluno.id_escola} className="max-w-xs " label="Selecione a escola">
                    {escolas.map((escola) => (
                        <SelectItem className='text-black' key={escola.id}>{escola.nome}</SelectItem>
                    ))}
                </Select>

                <div className="w-full flex justify-start items-center gap-5">
                    <label className="w-1/10 p-2">Avatar</label>
                    <div className="flex w-1/5 justify-center items-center flex-col gap-5">
                        {avatares[contador] ? (
                            <img className="w-4/5 rounded-full" src={avatares[contador].caminho} alt="" />
                        ) : (
                            <div>Carregando Avatar...</div>
                        )}
                        <div className="flex justify-center items-center w-full gap-5">
                            <button type="button" onClick={() => setContador(contador => (contador > 0 ? contador - 1 : 0))} className="w-2/5 bg-cyan-400 text-black flex justify-center items-center p-1 rounded cursor-pointer text-xs border-none">
                                <FaArrowLeft />
                            </button>
                            <button type='button' onClick={selecionarAvatarAleatorio} className="w-2/5 bg-cyan-400 text-black flex justify-center items-center p-1 rounded cursor-pointer text-xs border-none"><strong>?</strong></button>
                            <button type="button" onClick={() => setContador(contador => (contador < avatares.length - 1 ? contador + 1 : avatares.length - 1))} className="w-2/5 bg-cyan-400 text-black flex justify-center items-center p-1 rounded cursor-pointer text-xs border-none">
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>


                    <div className="w-[40%] bg-yellow-400 flex justify-around items-center text-black text-lg p-2 rounded cursor-pointer transition-transform duration-300 ease-in-out">
                        {avatares[contador] ? (
                            <img className="w-1/5 rounded-full" src={avatares[contador].caminho} alt="" />
                        ) : (
                            <img src="/src/assets/userDefault.png" alt="" />
                        )}

                        <p>{aluno.nome ? aluno.nome : 'Nome aluno'}</p>
                        <p>Lvl 1</p>
                    </div>

                </div>


                <div className="flex gap-2">
                    <Button size='lg' color="primary" type="submit">
                        Enviar
                    </Button>
                    <Button size='lg' type="reset" variant="flat">
                        Limpar
                    </Button>
                </div>

            </Form>
        </div>
    );
}
