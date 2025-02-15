import { FormEvent, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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
    const { token, user } = useTokenStore();
    const [avatares, setAvatares] = useState<Avatar[]>([]);
    const [escolas, setEscolas] = useState<Escola[]>([]);
    const [contador, setContador] = useState(0);

    const [nome, setNome] = useState("");
    const [id_avatar, setIdAvatar] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [matricula, setMatricula] = useState("");
    const [turma, setTurma] = useState("");
    const [escola, setEscola] = useState("");
    const [genero, setGenero] = useState("");

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

        const resposta = await fetch(`http://localhost:3000/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha,
                id_avatar: contador + 1,
                matricula: matricula,
                id_turma: parseInt(turma),
                id_escola: parseInt(escola),
                genero: genero,
                tipo_usuario_id: 2
            })
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
        <div className="w-[100%] flex flex-col justify-center items-center gap-8">
            <h1 className="text-2xl font-bold">Adicione aqui um aluno novo</h1>
            <form className="w-full p-5 border border-white flex flex-col justify-center items-center gap-5 mb-10" onSubmit={handleSubmit}>
                <div className="w-full flex justify-start items-center gap-5">
                    <label className="w-1/10 p-2">Nome</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => { setNome(e.target.value) }}
                        className="w-4/5 p-2 border-1 "
                        required
                    />
                </div>
                <div className="w-full flex justify-start items-center gap-5">
                    <label className="w-1/10 p-2 ">Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        className="w-4/5 p-2 border-1 "
                        required
                    />
                </div>
                <div className="w-full flex justify-start items-center gap-5">
                    <label className="w-1/10 p-2">Senha temporária</label>
                    <input
                        type="text"
                        value={senha}
                        onChange={(e) => { setSenha(e.target.value) }}
                        className="w-4/5 p-2 border-1"
                        required
                    />
                </div>
                <div className="w-full flex justify-start items-center gap-5">
                    <label className="w-1/10 p-2">Gênero</label>
                    <select name="genero" required value={genero} onChange={(e) => { setGenero(e.target.value) }} className="w-1/5 p-2 text-base">
                        <option value="">Selecione...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>
                </div>
                <div className="w-full flex justify-start items-center gap-5">
                    <label className="w-1/10 p-2">Matrícula</label>
                    <input
                        type="text"
                        maxLength={6}
                        value={matricula}
                        onChange={(e) => { setMatricula(e.target.value.replace(/[^0-9]/g, '')) }}
                        className="w-1/5 p-2 border-1"
                        required
                    />
                </div>
                <div className="w-full flex justify-start items-center gap-5">
                    <label className="w-1/10 p-2">Turma</label>
                    <select name="turma" required value={turma} onChange={(e) => { setTurma(e.target.value) }} className="w-1/5 p-2 text-base">
                        <option value="">Selecione...</option>
                        <option value="1">1 ano</option>
                        <option value="2">2 ano</option>
                        <option value="3">3 ano</option>
                    </select>
                </div>
                <div className="w-full flex justify-start items-center gap-5">
                    <label className="w-1/10 p-2">Escola</label>
                    <select name="escola" required value={escola} onChange={(e) => { setEscola(e.target.value) }} className="w-1/5 p-2 text-base">
                        <option value="">Selecione...</option>
                        {
                            escolas.map((escola, index) => {
                                return (
                                    <option key={index} value={index + 1}>{escola.nome}</option>
                                );
                            })
                        }
                    </select>
                </div>
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
                </div>
    
                <h2 className="text-xl font-bold">Previsualização</h2>
                <div className="w-1/4 bg-yellow-400 flex justify-around items-center text-black text-lg p-2 rounded cursor-pointer transition-transform duration-300 ease-in-out">
                    {avatares[contador] ? (
                        <img className="w-1/5 rounded-full" src={avatares[contador].caminho} alt="" />
                    ) : (
                        <img src="/src/assets/userDefault.png" alt="" />
                    )}
    
                    <p>{nome ? nome : 'Nome aluno'}</p>
                    <p>Lvl 1</p>
                </div>
                <button className="bg-cyan-400 text-black p-2 rounded cursor-pointer">Mandar</button>
            </form>
        </div>
    );
}
