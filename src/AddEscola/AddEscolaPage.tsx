import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import { Form, Input, Button } from "@heroui/react";
import { useFormik } from 'formik';


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

export function AddEscolaPage() {
    const navigate = useNavigate();
    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();



    useEffect(() => {
        async function pegaUsuarios() {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user?.id}`, {
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

    const formik = useFormik({
        initialValues: {
            nome: '',
            cnpj: ''
        },
        onSubmit: async (values) => {
            console.log(values)
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/criar-escola`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: values.nome,
                    cnpj: values.cnpj
                })
            });

            if (resposta.ok) {
                navigate('/home');
            }
        }
    });

    if(usuario?.tipo_usuario_id === 2){
        navigate('/home')
    }

    return (
        <div className="size-[90vw] w-screen flex flex-col justify-start items-center gap-8">
            <h1 className="text-2xl font-bold">Adicione aqui uma escola nova</h1>
            <Form
                className="w-[80%] flex flex-col justify-center gap-4 border-2 p-10 border-white"
                onSubmit={formik.handleSubmit}
                onReset={formik.handleReset}
            >
                <Input
                    isRequired
                    errorMessage="Coloque um nome valido"
                    label="Nome"
                    labelPlacement="outside"
                    onChange={formik.handleChange}
                    value={formik.values.nome}
                    name="nome"
                    placeholder="Nome..."
                    type="text"
                    classNames={{
                        label: '!text-white'
                    }}
                />
                 <Input
                    isRequired
                    errorMessage="Coloque um cnpj valido"
                    label="Cnpj"
                    labelPlacement="outside"
                    onChange={formik.handleChange}
                    value={formik.values.cnpj}
                    name="cnpj"
                    placeholder="Cnpj..."
                    type="text"
                    classNames={{
                        label: '!text-white'
                    }}
                />
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
