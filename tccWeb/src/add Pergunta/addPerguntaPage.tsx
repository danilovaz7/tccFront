import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import { Form, Input, Button, Select, SelectItem, RadioGroup, Radio, Checkbox } from "@heroui/react";
import { useFormik } from 'formik';
import Navbar from '../components/Navbar/Navbar';

interface Usuario {
    id: number,
    nome: string,
    nivel: string,
    tipo_usuario_id: number,
    id_turma: number,
    id_materia: number,
    id_escola: number
    avatar: {
        nome: string,
        caminho: string
    }
}

export function AddPerguntaPage() {
    const navigate = useNavigate();
    const { token, user } = useTokenStore();
    const [usuario, setUsuario] = useState<Usuario>();
    const [isCheked, setIsChecked] = useState(false)


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

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            pergunta: '',
            turma_id: undefined,
            escola_id: isCheked ? 1 : usuario?.id_escola,
            materia_id: usuario?.id_materia,
            elo_id: undefined,
            alternativas: [],
            alternativaCorreta: undefined
        },
        onSubmit: async (values) => {
            if(usuario?.tipo_usuario_id === 1){
                alert('somente professores podem adicionar perguntas')
                return;
            }
            const resposta = await fetch(`http://localhost:3000/criar-pergunta`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    pergunta: values.pergunta,
                    turma_id: values.turma_id,
                    escola_id: values.escola_id,
                    elo_id: values.elo_id,
                    materia_id: values.materia_id,
                    alternativas: values.alternativas,
                    alternativaCorreta: values.alternativaCorreta
                })
            });

            if (resposta.ok) {
                navigate('/home');
            }
        }
    });

    if (!usuario) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="size-[90vw] w-screen flex flex-col justify-start items-center gap-8">
            <Navbar id={usuario?.id} nivel={usuario?.nivel} avatar={usuario?.avatar.caminho} />
            <h1 className="text-2xl font-bold">Adicione aqui uma pergunta nova</h1>
            { usuario.tipo_usuario_id === 1 ? <p>Somente professores são autorizados a criar perguntas !</p> : null}
            <Form
                className="w-[80%] flex flex-col justify-center gap-4 border-2 p-10 border-white"
                onSubmit={formik.handleSubmit}
                onReset={formik.handleReset}
            >
                
                <div className='w-full flex gap-5 '>
                    <p>Tornar pergunta pública</p>
                    <Checkbox
                        onChange={(e) => { setIsChecked(!isCheked) }}
                        className='text-white' ></Checkbox>
                </div>
                
                <Input
                    isRequired
                    errorMessage="Coloque um pergunta valido"
                    label="Pergunta"
                    labelPlacement="outside"
                    onChange={formik.handleChange}
                    value={formik.values.pergunta}
                    name="pergunta"
                    placeholder="Pergunta..."
                    type="text"
                    classNames={{
                        label: '!text-white'
                    }}
                />

                <Select
                    isRequired
                    onChange={(e) => formik.setFieldValue('turma_id', parseInt(e.target.value))}
                    value={formik.values.turma_id}
                    className="max-w-xs"
                    label="Selecione a turma"
                >
                    <SelectItem key={1} className='text-black'>1° ano</SelectItem>
                    <SelectItem key={2} className='text-black'>2° ano</SelectItem>
                    <SelectItem key={3} className='text-black'>3° ano</SelectItem>
                </Select>

                <Select
                    isRequired
                    onChange={(e) => formik.setFieldValue('elo_id', parseInt(e.target.value))}
                    value={formik.values.elo_id}
                    className="max-w-xs"
                    label="Selecione a dificuldade"
                >
                    <SelectItem key={1} className='text-black'>Aprendiz</SelectItem>
                    <SelectItem key={2} className='text-black'>Regular</SelectItem>
                    <SelectItem key={3} className='text-black'>Estudioso</SelectItem>
                    <SelectItem key={4} className='text-black'>Exemplar</SelectItem>
                    <SelectItem key={5} className='text-black'>Avançadp</SelectItem>
                    <SelectItem key={6} className='text-black'>Brilhante</SelectItem>
                </Select>


                <Input
                    isRequired
                    errorMessage="Coloque uma alternativa valida"
                    label="Alternativa 1"
                    labelPlacement="outside"
                    onChange={formik.handleChange}
                    value={formik.values.alternativas[0]}
                    name="alternativas.0"
                    placeholder="Alternativa 1..."
                    type="text"
                    classNames={{
                        label: '!text-white'
                    }}
                />

                <Input
                    isRequired
                    errorMessage="Coloque uma alternativa valida"
                    label="Alternativa 2"
                    labelPlacement="outside"
                    onChange={formik.handleChange}
                    value={formik.values.alternativas[1]}
                    name="alternativas.1"
                    placeholder="Alternativa 2..."
                    type="text"
                    classNames={{
                        label: '!text-white'
                    }}
                />

                <Input
                    isRequired
                    errorMessage="Coloque uma alternativa valida"
                    label="Alternativa 3"
                    labelPlacement="outside"
                    onChange={formik.handleChange}
                    value={formik.values.alternativas[2]}
                    name="alternativas.2"
                    placeholder="Alternativa 3..."
                    type="text"
                    classNames={{
                        label: '!text-white'
                    }}
                />

                <Input
                    isRequired
                    errorMessage="Coloque uma alternativa valida"
                    label="Alternativa 4"
                    labelPlacement="outside"
                    onChange={formik.handleChange}
                    value={formik.values.alternativas[3]}
                    name="alternativas.3"
                    placeholder="Alternativa 4..."
                    type="text"
                    classNames={{
                        label: '!text-white'
                    }}
                />

                <Select
                    isRequired
                    onChange={(e) => formik.setFieldValue('alternativaCorreta', parseInt(e.target.value))}
                    value={formik.values.alternativaCorreta}
                    className="max-w-xs"
                    label="Selecione a alternativa correta"
                >
                    <SelectItem key={0} className='text-black'>Alternativa 1</SelectItem>
                    <SelectItem key={1} className='text-black'>Alternativa 2</SelectItem>
                    <SelectItem key={2} className='text-black'>Alternativa 3</SelectItem>
                    <SelectItem key={3} className='text-black'>Alternativa 4</SelectItem>
                </Select>

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
