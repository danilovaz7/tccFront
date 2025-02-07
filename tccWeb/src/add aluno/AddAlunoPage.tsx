import { FormEvent, useState } from 'react';
import './addAlunoPage.css';
import { NavLink, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import imageCompression from 'browser-image-compression';  // Importando a biblioteca

export function AddAlunoPage() {
    const navigate = useNavigate();
    const { token, user } = useTokenStore();

    const [foto, setFoto] = useState<string | null>(null);
    const [nome, setNome] = useState("");
    const [id_avatar, setIdAvatar] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [matricula, setMatricula] = useState("");
    const [turma, setTurma] = useState("");
    const [escola, setEscola] = useState("");
    const [genero, setGenero] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result as string;
                setFoto(base64Image); // Armazenando a imagem em Base64
            };
            reader.readAsDataURL(file); // Lê o arquivo como Base64
        } else {
            setFoto(null); // Limpar a imagem quando não houver arquivo
        }
    };

    // Função para lidar com o envio do formulário
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
                id_avatar: id_avatar,
                matricula: matricula,
                id_turma: parseInt(turma),
                id_escola: parseInt(escola),
                genero: genero,
                tipo_usuario_id: 2
            })
        })

        if (resposta.ok) {
            alert('Usuario salvo com sucesso')
            navigate('/home');
        } else {
            alert("Erro ao salvar usuario")
        }


    }

    return (
        <>
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
                        <option value="1">Escola X</option>
                        <option value="2">Escola Z</option>
                    </select>
                </div>
                <div className='inputAreaAluno'>
                    <label htmlFor="">Avatar</label>
                    <div className='avatarPreview'>
                        <div className='avatarPreviewImg'></div>
                        <div className='btnAvatar'>
                            <button>a</button>
                            <button>b</button>
                        </div>
                    </div>

                </div>

                <div className='inputAreaAluno'>
                    <label>Foto</label>
                    <div className="custom-file-upload">
                        <label className="file-upload-label">
                            Escolher arquivo
                            <input
                                type="file"
                                onChange={handleFileChange}
                            />
                        </label>
                        <span className="file-name">
                            {foto ? "Imagem carregada" : "Nenhum arquivo selecionado"}
                        </span>
                    </div>
                </div>

                <h2>Previsualização</h2>
                <div className='alunoDefault'>
                    <img src={foto ? foto : "/src/assets/userDefault.png"} alt="" />
                    <p>{nome ? nome : 'Nome aluno'}</p>
                    <p>Lvl 0</p>
                </div>

                <button>Mandar</button>
            </form>
        </>
    );
}
