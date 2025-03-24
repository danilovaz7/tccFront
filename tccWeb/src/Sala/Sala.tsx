import { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import Navbar from '../components/Navbar/Navbar';
import { Form, Input, Button, Select, SelectItem } from "@heroui/react";
import { useFormik } from 'formik';
import UserCard from '../components/UserCard/UserCard';


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


export function Sala() {
    const [usuarioNavBar, setUsuarioNavBar] = useState<Usuario>();
    const { token, user } = useTokenStore();
    const navigate = useNavigate();
    const [materias, setMaterias] = useState<[]>([]);
    let { codigo } = useParams();

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
    }, [usuarioNavBar]);

    const formik = useFormik({
        initialValues: {
            nome: ''
        },
        onSubmit: async (values) => {
            console.log(values)
            const resposta = await fetch(`http://localhost:3000/criar-escola`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: values.nome
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
    }, []);



if(!usuarioNavBar){
    <p>carregando...</p>
}

    return (
        <>
            <div className="w-screen flex flex-col justify-start items-center min-h-screen gap-12 mb-40">
                <Navbar id={usuarioNavBar?.id} nivel={usuarioNavBar?.nivel} avatar={usuarioNavBar?.avatar.caminho || ''} />
                <div className='w-[95%] border flex justify-center items-start gap-10 p-5'>
                    <div className='w-[25%] border flex flex-col gap-5 p-5'>
                        <h1>Selecione 3 disciplinas</h1>
                        <Form
                            className="w-[100%] flex flex-col justify-center items-center gap-4 "
                            onSubmit={formik.handleSubmit}
                            onReset={formik.handleReset}
                        >
                            <Select
                                onChange={(e) => formik.setFieldValue('id_materia', parseInt(e.target.value))}
                                value={formik.values.id_materia}
                                className="max-w-[70%]"
                                label="Selecione o a materia"
                            >
                                {materias.map((materia) => (
                                    <SelectItem className='text-black' key={materia.id}>{materia.nome}</SelectItem>
                                ))}
                            </Select>
                            <Select
                                onChange={(e) => formik.setFieldValue('id_materia', parseInt(e.target.value))}
                                value={formik.values.id_materia}
                                className="max-w-[70%]"
                                label="Selecione o a materia"
                            >
                                {materias.map((materia) => (
                                    <SelectItem className='text-black' key={materia.id}>{materia.nome}</SelectItem>
                                ))}
                            </Select>
                            <Select
                                onChange={(e) => formik.setFieldValue('id_materia', parseInt(e.target.value))}
                                value={formik.values.id_materia}
                                className="max-w-[70%]"
                                label="Selecione o a materia"
                            >
                                {materias.map((materia) => (
                                    <SelectItem className='text-black' key={materia.id}>{materia.nome}</SelectItem>
                                ))}
                            </Select>

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
                    <div className='w-[40%] border p-5'>
                        <h1>Lista de jogadores</h1>
                        <UserCard  id={1} nivel={'usuario.avatar.nivel'} nome={'usuario.avatar.nome'} avatar={'usuario.avatar.caminho'}
                            classe="w-full bg-yellow-400 flex justify-around items-center text-black p-2.5 cursor-point rounded-md transition-transform ease-in-out hover:scale-105"
                        />
                    </div>
                    <div className='w-[25%] border p-5'>

                    </div>
                </div>
            </div>
        </>
    );



}
