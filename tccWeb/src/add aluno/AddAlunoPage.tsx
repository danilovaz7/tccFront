import { FormEvent, useEffect, useState } from 'react';
import './addAlunoPage.css';
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
        <>
        <div className='containerAddAluno'>
        <h1>Adicione aqui um aluno novo</h1>
            <form className='formAluno' onSubmit={handleSubmit}>
                <div className='inputAreaAluno'>
                    <label htmlFor="">Nome</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => { setNome(e.target.value) }}
                        required
                    />
                </div>
                <div className='inputAreaAluno'>
                    <label htmlFor="">Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        required
                    />
                </div>
                <div className='inputAreaAluno'>
                    <label htmlFor="">Senha temporária</label>
                    <input
                        type="text"
                        value={senha}
                        onChange={(e) => { setSenha(e.target.value) }}
                        required
                    />
                </div>
                <div className='inputAreaAluno'>
                    <label htmlFor="">Gênero</label>
                    <select name="genero" required value={genero} onChange={(e) => { setGenero(e.target.value) }}>
                        <option value="">Selecione...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>
                </div>
                <div className='inputAreaAluno'>
                    <label htmlFor="">Matrícula</label>
                    <input
                        type="text"
                        maxLength={6}
                        value={matricula}
                        onChange={(e) => { setMatricula(e.target.value.replace(/[^0-9]/g, '')) }}
                        required
                    />
                </div>
                <div className='inputAreaAluno'>
                    <label htmlFor="">Turma</label>
                    <select name="turma" required value={turma} onChange={(e) => { setTurma(e.target.value) }}>
                        <option value="">Selecione...</option>
                        <option value="1">1 ano</option>
                        <option value="2">2 ano</option>
                        <option value="3">3 ano</option>
                    </select>
                </div>
                <div className='inputAreaAluno'>
                    <label htmlFor="">Escola</label>
                    <select name="escola" required value={escola} onChange={(e) => { setEscola(e.target.value) }}>
                        <option value="">Selecione...</option>
                        {
                            escolas.map((escola, index) => {
                                return (
                                    <option value={index + 1}>{escola.nome}</option>
                                );
                            })
                        }
                    </select>
                </div>
                <div className='inputAreaAluno'>
                    <label htmlFor="">Avatar</label>
                    <div className='avatarPreview'>
                        {avatares[contador] ? (
                            <img className='avatarPreviewImg' src={avatares[contador].caminho} alt="" />
                        ) : (
                            <div>Carregando Avatar...</div>
                        )}
                        <div className='btnAvatar'>
                            <button type="button" onClick={() => setContador(contador => (contador > 0 ? contador - 1 : 0))}>
                                <FaArrowLeft />
                            </button>
                            <button type='button' onClick={selecionarAvatarAleatorio}><strong>?</strong></button>
                            <button type="button" onClick={() => setContador(contador => (contador < avatares.length - 1 ? contador + 1 : avatares.length - 1))}>
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>

                <h2>Previsualização</h2>
                <div className='alunoDefault'>
                    {avatares[contador] ? (
                        <img className='avatarPreviewImg' src={avatares[contador].caminho} alt="" />
                    ) : (
                        <img src="/src/assets/userDefault.png" alt="" />
                    )}

                    <p>{nome ? nome : 'Nome aluno'}</p>
                    <p>Lvl 1</p>
                </div>
                <button>Mandar</button>
            </form>
        </div>
           
        </>
    );
}
