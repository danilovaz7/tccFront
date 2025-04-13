import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Form, Input, Button } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { useFormik } from 'formik';
import { useMaterias } from '../hooks/useMaterias.js';


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

interface Avatar {
    id: number,
    nome: string,
    caminho: string
}

interface Escola {
    id: number,
    nome: string,
}

export function AddAlunoPage() {
    const navigate = useNavigate();
    const materias = useMaterias();
    const { token, user } = useTokenStore();
    const [avatares, setAvatares] = useState<Avatar[]>([]);
    const [escolas, setEscolas] = useState<Escola[]>([]);
    const [contador, setContador] = useState(0);
    const [usuario, setUsuario] = useState<Usuario>();

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
        if (avatares.length > 0) {
          const selectedAvatar = avatares[contador];
          formik.setFieldValue('id_avatar', selectedAvatar.id);
        }
      }, [contador, avatares]);

    const formik = useFormik({
        initialValues: {
            nome: '',
            email: '',
            matricula: '',
            id_turma: undefined,
            id_escola: undefined,
            genero: '',
            id_avatar: undefined,
            tipo_usuario_id: undefined,
            id_materia: undefined
        },
        onSubmit: async (values) => {
            console.log(values)
            const resposta = await fetch(`http://localhost:3000/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(values)
            });

            if (resposta.ok) {
                navigate('/home');
            }
        }
    });

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
        if (usuario && usuario.tipo_usuario_id !== 1) {
          formik.setFieldValue('id_escola', usuario.id_escola);
        }
      }, [usuario]);

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

    function selecionarAvatarAleatorio() {
        if (avatares.length > 0) {
          const randomIndex = Math.floor(Math.random() * avatares.length);
          setContador(randomIndex);
        }
      }

      if (avatares.length === 0) {
        return <div>Carregando avatares...</div>;
      }

    return (
        <div className="size-[90vw] w-screen flex flex-col justify-start items-center gap-8 p-4 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-center">Adicione aqui um aluno novo</h1>
            <Form
                className="w-[95%] sm:w-[80%] flex flex-col justify-center gap-6  p-6 sm:p-10 "
                onSubmit={formik.handleSubmit}
                onReset={formik.handleReset}
            >
                <Input
                    isRequired
                    errorMessage="Coloque um nome válido"
                    label="Nome"
                    labelPlacement="outside"
                    onChange={formik.handleChange}
                    value={formik.values.nome}
                    name="nome"
                    placeholder="Nome..."
                    type="text"
                    classNames={{
                        label: '!text-white',
                    }}
                />
                <Select
                    isRequired
                    onChange={(e) => formik.setFieldValue('tipo_usuario_id', parseInt(e.target.value))}
                    value={formik.values.tipo_usuario_id}
                    className="max-w-full sm:max-w-xs"
                    label="Selecione o tipo do usuário"
                >
                    <SelectItem key={2} className="text-black">Aluno</SelectItem>
                    <SelectItem key={3} className="text-black">Professor</SelectItem>
                    {
                        usuario?.tipo_usuario_id == 1 ?
                        <>
                         <SelectItem key={1} className="text-black">Administrador</SelectItem>
                         <SelectItem key={4} className="text-black">Diretor</SelectItem>
                        </>
                        :null
                    }
                </Select>

                {formik.values.tipo_usuario_id == 3 && (
                    <Select
                        onChange={(e) => formik.setFieldValue('id_materia', parseInt(e.target.value))}
                        value={formik.values.id_materia}
                        className="max-w-full sm:max-w-xs"
                        label="Selecione a matéria"
                    >
                        {materias.map((materia) => (
                            <SelectItem className="text-black" key={materia.id}>{materia.nome}</SelectItem>
                        ))}
                    </Select>
                )}

                <Input
                    isRequired
                    errorMessage="Insira um email válido 'exemplo@email.com'"
                    label="Email"
                    labelPlacement="outside"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    name="email"
                    placeholder="Email..."
                    type="email"
                    classNames={{
                        label: '!text-white',
                    }}
                />

                <Select
                    isRequired
                    onChange={(e) => formik.setFieldValue('genero', e.target.value)}
                    value={formik.values.genero}
                    className="max-w-full sm:max-w-xs"
                    label="Selecione o gênero"
                >
                    <SelectItem key={'M'} className="text-black">Masculino</SelectItem>
                    <SelectItem key={'F'} className="text-black">Feminino</SelectItem>
                </Select>

                <Input
                    isRequired
                    className="max-w-full sm:max-w-xs"
                    errorMessage="Insira uma matrícula válida de 6 dígitos"
                    label="Matrícula"
                    onChange={formik.handleChange}
                    value={formik.values.matricula}
                    labelPlacement="outside"
                    name="matricula"
                    placeholder="Matrícula..."
                    type="text"
                    maxLength={6}
                    minLength={6}
                    classNames={{
                        label: '!text-white',
                    }}
                />

                <Select
                    isRequired
                    onChange={(e) => formik.setFieldValue('id_turma', parseInt(e.target.value))}
                    value={formik.values.id_turma}
                    className="max-w-full sm:max-w-xs"
                    label="Selecione a turma"
                >
                    <SelectItem key={1} className="text-black">1° ano</SelectItem>
                    <SelectItem key={2} className="text-black">2° ano</SelectItem>
                    <SelectItem key={3} className="text-black">3° ano</SelectItem>
                </Select>
                {
                    usuario?.tipo_usuario_id === 1 ?
                    <Select
                        isRequired
                        onChange={(e) => formik.setFieldValue('id_escola', parseInt(e.target.value))}
                        value={formik.values.id_escola}
                        className="max-w-full sm:max-w-xs"
                        label="Selecione a escola"
                    >
                        {escolas.map((escola) => (
                            <SelectItem className="text-black" key={escola.id}>{escola.nome}</SelectItem>
                        ))}
                    </Select>
                    : null
                }


                <div className="w-full flex flex-wrap sm:flex-nowrap justify-start items-center gap-5">
                    <label className="w-[10%] sm:w-1/10 p-2">Avatar</label>
                    <div className="flex w-full sm:w-1/5 justify-center items-center flex-col gap-3 sm:gap-5">
                        {avatares[contador] ? (
                            <img className="w-[50%] sm:w-[100%] rounded-full" src={avatares[contador].caminho} alt="" />
                        ) : (
                            <div>Carregando Avatar...</div>
                        )}
                        <div className="flex justify-center items-center w-full gap-3 sm:gap-5">
                            <button
                                type="button"
                                onClick={() => setContador(contador > 0 ? contador - 1 : 0)}
                                className="w-[30%] sm:w-2/5 bg-cyan-400 text-black flex justify-center items-center p-1 rounded cursor-pointer text-xs border-none"
                            >
                                <FaArrowLeft />
                            </button>
                            <button
                                type="button"
                                onClick={selecionarAvatarAleatorio}
                                className="w-[30%] sm:w-2/5 bg-cyan-400 text-black flex justify-center items-center p-1 rounded cursor-pointer text-xs border-none"
                            >
                                <strong>?</strong>
                            </button>
                            <button
                                type="button"
                                onClick={() => setContador(contador < avatares.length - 1 ? contador + 1 : avatares.length - 1)}
                                className="w-[30%] sm:w-2/5 bg-cyan-400 text-black flex justify-center items-center p-1 rounded cursor-pointer text-xs border-none"
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>

                    <div className="w-full sm:w-[40%] bg-yellow-400 flex justify-around items-center text-black text-sm sm:text-lg p-2 rounded cursor-pointer transition-transform duration-300 ease-in-out">
                        {avatares[contador] ? (
                            <img className="w-1/5 rounded-full" src={avatares[contador].caminho} alt="" />
                        ) : (
                            <img src="/src/assets/userDefault.png" alt="" />
                        )}
                        <p>{formik.values.nome ? formik.values.nome : 'Nome aluno'}</p>
                        <p>Lvl 1</p>
                    </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-center">
                    <Button size="lg" color="primary" type="submit">
                        Enviar
                    </Button>
                    <Button size="lg" type="reset" variant="flat">
                        Limpar
                    </Button>
                </div>
            </Form>
        </div>

    );
}
