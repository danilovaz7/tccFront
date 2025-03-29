import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import { useSocket } from '../hooks/useSocket';
import Navbar from '../components/Navbar/Navbar';
import { Form, Input, Button, Select, SelectItem } from "@heroui/react";
import { useFormik } from 'formik';
import UserCard from '../components/UserCard/UserCard';

interface Usuario { /* ... */ }
interface Aluno { /* ... */ }
interface Sala { /* ... */ }
interface ChatMessage { /* ... */ }
interface Pergunta { /* ... */ }
interface Alternativa { /* ... */ }

export function Sala() {
    let { codigo } = useParams();
    const navigate = useNavigate();
    const { token, user } = useTokenStore();
    const socket = useSocket();

    const [usuarioNavBar, setUsuarioNavBar] = useState<Usuario>();
    const [sala, setSala] = useState<Sala>();
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [materias, setMaterias] = useState<any[]>([]);
    const [selectedMaterias, setSelectedMaterias] = useState<number[]>([]);
    const [perguntasMaterias, setPerguntasMaterias] = useState<Pergunta[]>([]);
    const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
    const [alternativasAtuais, setAlternativasAtuais] = useState<Alternativa[]>([]);
    const [perguntasExibidas, setPerguntasExibidas] = useState<Set<number>>(new Set());
    const [contagem, setContagem] = useState(0);
    const [respostas, setRespostas] = useState<[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatText, setChatText] = useState<string>("");

    const [quizStarted, setQuizStarted] = useState(false);
    const [readyPlayers, setReadyPlayers] = useState<number[]>([]);

    // Busca as matérias
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
    }, [token]);

    const formik = useFormik({
        initialValues: {
            materias: []
        },
        onSubmit: async (values) => {

            const response = await fetch(
                `http://localhost:3000/sala/perguntas/1/3/${values.materias[0]}/${values.materias[1]}/${values.materias[2]}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            const perguntas = await response.json();
            setPerguntasMaterias(perguntas);

            socket?.emit("enviarPerguntas", { roomId: sala?.id, perguntas });
        }
    });
    console.log(formik.values.materias)
    console.log(perguntaAtual)
    console.log('perguntasMaterias', perguntasMaterias)

    // Busca informações do usuário
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
        if (user?.id) {
            pegaUsuarioNav();
        }
    }, [user, token]);



    useEffect(() => {
        async function pegaAlternativas() {
            const response = await fetch(`http://localhost:3000/materias/perguntas/${perguntaAtual?.id}/alternativas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const alternativas = await response.json();
            setAlternativasAtuais(alternativas);
        }
        pegaAlternativas();
    }, [perguntaAtual]);


    function handleSelecionarAlternativa(alternativa: Alternativa) {
        setRespostas((prevRespostas) => {
            const jaRespondida = prevRespostas.some(
                (resposta) => resposta.pergunta.id === perguntaAtual?.id
            );

            if (jaRespondida) return prevRespostas;

            return [
                ...prevRespostas,
                {
                    pergunta: perguntaAtual!,
                    respostaCorreta: alternativasAtuais.find((alt) => alt.correta)?.alternativa || '',
                    respostaUsuario: alternativa.alternativa,
                },
            ];
        });

        // Carrega a próxima pergunta
        const novaPergunta = obterPerguntaAleatoria();
        if (novaPergunta) {
            setPerguntaAtual(novaPergunta);
            setAlternativasAtuais(novaPergunta.alternativas || []);
            setPerguntasExibidas((prevExibidas) =>
                new Set([...prevExibidas, perguntasMaterias.indexOf(novaPergunta)])
            );
        } else {
            console.log("Quiz finalizado!");
            setQuizStarted(false); // Finaliza o quiz
        }
    }

    useEffect(() => {
        if (quizStarted && perguntasMaterias.length > 0) {
            const primeiraPergunta = obterPerguntaAleatoria(); // Pega a primeira pergunta
            if (primeiraPergunta) {
                setPerguntaAtual(primeiraPergunta);
                setAlternativasAtuais(primeiraPergunta.alternativas || []); // Configura as alternativas
            }
        }
    }, [quizStarted, perguntasMaterias]);


    function obterPerguntaAleatoria(): Pergunta | null {
        const perguntasRestantes = perguntasMaterias.filter((_, index) => !perguntasExibidas.has(index));
        if (perguntasRestantes.length === 0) {
            return null;
        }
        const indiceAleatorio = Math.floor(Math.random() * perguntasRestantes.length);
        return perguntasRestantes[indiceAleatorio];
    }

    // Busca a sala pelo código
    useEffect(() => {
        async function pegaSala() {
            const response = await fetch(`http://localhost:3000/sala/${codigo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const salaData = await response.json();
            setSala(salaData);
        }
        if (codigo) {
            pegaSala();
        }
    }, [codigo, token]);

    // Busca os jogadores na sala
    useEffect(() => {
        async function pegaSalaAlunos() {
            const response = await fetch(`http://localhost:3000/sala-alunos/${sala?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const salaAlunos = await response.json();
            setAlunos(salaAlunos);
        }
        if (sala?.id) {
            pegaSalaAlunos();
        }
    }, [sala, token]);

    // Ao entrar na sala, emite joinRoom
    useEffect(() => {
        if (socket && user && sala?.id) {
            socket.emit("joinRoom", { roomId: sala.id, userName: usuarioNavBar?.nome });
        }
    }, [socket, user, sala?.id, usuarioNavBar?.nome]);

    // Atualiza a lista de jogadores via socket
    useEffect(() => {
        if (!socket) return;
        const handleAtualizarSala = ({ alunosAtualizados }: { alunosAtualizados: Aluno[] }) => {
            setAlunos(alunosAtualizados);
        };
        socket.on("atualizar_sala", handleAtualizarSala);
        return () => {
            socket.off("atualizar_sala", handleAtualizarSala);
        };
    }, [socket]);

    // Chat: escuta novas mensagens
    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = ({ message, sender }: { message: string; sender: string }) => {
            setChatMessages(prev => [...prev, { message, sender }]);
        };
        socket.on("newMessage", handleNewMessage);
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket]);

    // Escuta atualização de matérias selecionadas via socket
    useEffect(() => {
        if (!socket) return;
        const handleMateriasSelecionadas = (materiasSelecionadas: number[]) => {
            setSelectedMaterias(materiasSelecionadas);
            formik.setFieldValue("materias", materiasSelecionadas);
        };
        socket.on("materiasSelecionadas", handleMateriasSelecionadas);
        return () => {
            socket.off("materiasSelecionadas", handleMateriasSelecionadas);
        };
    }, [socket, formik]);

    // Listener para receber atualização do número de jogadores prontos
    useEffect(() => {
        if (!socket) return;
        const handleUpdateReady = (data: { readyUserIds: number[] }) => {
            setReadyPlayers(data.readyUserIds);
        };
        socket.on("updateReady", handleUpdateReady);
        return () => {
            socket.off("updateReady", handleUpdateReady);
        };
    }, [socket]);

    // Listener para iniciar o quiz (após todos clicarem "Pronto")
    useEffect(() => {
        if (!socket) return;
        const handleIniciarQuiz = () => {
            setTimeout(() => {
                setQuizStarted(true);
                const primeiraPergunta = obterPerguntaAleatoria();
                if (primeiraPergunta) {
                    setPerguntaAtual(primeiraPergunta);
                    setPerguntasExibidas(new Set([perguntasMaterias.indexOf(primeiraPergunta)]));
                }
            }, 3000);
        };
        socket.on("iniciarQuiz", handleIniciarQuiz);
        return () => {
            socket.off("iniciarQuiz", handleIniciarQuiz);
        };
    }, [socket]);

    // Função para enviar mensagem no chat
    const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (socket && sala?.id && chatText.trim() !== "") {
            socket.emit("message", { roomId: sala.id, message: chatText, userName: usuarioNavBar?.nome });
        }
        setChatText('');
    };

    // Função para atualizar seleção de matérias (somente para o host)
    const handleSelectMateria = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const value = parseInt(e.target.value);
        const updatedMaterias = [...selectedMaterias];
        updatedMaterias[index] = value;
        setSelectedMaterias(updatedMaterias);
        formik.setFieldValue("materias", updatedMaterias);
        if (socket && sala?.id) {
            socket.emit("materiasSelecionadas", { roomId: sala.id, selectedMaterias: updatedMaterias });
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleReceberPerguntas = (perguntas) => {
            console.log("Perguntas recebidas via Socket:", perguntas);
            setPerguntasMaterias(perguntas); // Atualiza o estado com as perguntas
        };

        socket.on("receberPerguntas", handleReceberPerguntas);

        return () => {
            socket.off("receberPerguntas", handleReceberPerguntas); // Limpeza do listener
        };
    }, [socket]);


    // Função para sinalizar que o usuário está pronto
    const handlePronto = () => {
        if (socket && sala?.id && user) {
            socket.emit("pronto", { roomId: sala.id, userId: user.id });
        }
    };

    if (!usuarioNavBar) {
        return <p>Carregando...</p>;
    }


    return (
        <>
            <div className="w-screen flex pb-10 flex-col justify-start items-center min-h-screen gap-12 mb-40">
                <Navbar id={usuarioNavBar.id} nivel={usuarioNavBar.nivel} avatar={usuarioNavBar.avatar.caminho || ''} />
                <div className="w-[95%] border flex justify-center items-start gap-10 p-5">
                    <div className="w-[25%] border flex flex-col gap-10 p-5">
                        <div className="w-[100%] border flex flex-col gap-5 p-5">
                            <p>Código de sala {codigo}</p>
                            <p>
                                Prontos: {readyPlayers.length} / {alunos.length}
                            </p>
                        </div>
                        {user?.id === sala?.host_id ? (
                            <>
                                <h1>Selecione 3 disciplinas</h1>
                                <Form
                                    className="w-[100%] flex flex-col justify-center items-center gap-4"
                                    onSubmit={formik.handleSubmit}
                                    onReset={formik.handleReset}
                                >
                                    {['materia1', 'materia2', 'materia3'].map((materiaKey, index) => (
                                        <Select
                                            key={materiaKey}
                                            onChange={(e) => handleSelectMateria(e, index)}
                                            value={selectedMaterias[index] || ''}
                                            className="max-w-[70%]"
                                            label={`Selecione a matéria ${index + 1}`}
                                        >
                                            {materias.map((materia) => (
                                                <SelectItem className="text-black" key={`${materia.id}-${index}`} value={materia.id}>
                                                    {materia.nome}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    ))}
                                    <div className="flex gap-2">
                                        <Button size="sm" color="primary" type="submit">
                                            Enviar
                                        </Button>
                                        <Button size="sm" type="reset" variant="flat">
                                            Limpar
                                        </Button>
                                    </div>
                                </Form>
                            </>
                        ) : (
                            <div className="w-[100%] flex flex-col justify-center items-center gap-4">
                                <h2>Matérias Selecionadas:</h2>
                                {selectedMaterias && selectedMaterias.length > 0 ? (
                                    selectedMaterias.map((materiaId, index) => {
                                        const materia = materias.find(m => m.id === materiaId);
                                        return (
                                            <p key={index} className="text-lg font-semibold">
                                                {materia ? materia.nome : 'Matéria não encontrada'}
                                            </p>
                                        );
                                    })
                                ) : (
                                    <p>Nenhuma matéria selecionada</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="w-[40%] border p-5 flex flex-col items-center justify-around gap-5">
                        <>
                            <h1>Lista de jogadores</h1>
                            <div className="flex w-[100%] pb-10 flex-col items-center justify-center gap-5">
                                {alunos.map((aluno) => (
                                    <UserCard
                                        key={aluno.usuario.id}
                                        id={aluno.usuario.id}
                                        nivel={aluno.usuario.nivel}
                                        nome={aluno.usuario.nome}
                                        classe="w-[60%] bg-gray-400 flex justify-around items-center text-black p-2.5 cursor-pointer rounded-md"
                                    />
                                ))}
                            </div>
                        </>
                        <Button size="lg" onClick={handlePronto} color="primary">
                            Pronto
                        </Button>
                    </div>

                    <div className="w-[25%] border p-5 flex flex-col gap-5">
                        <h1>Chat</h1>
                        <div className="flex flex-col gap-2 border p-2 h-80 overflow-y-auto">
                            {chatMessages.map((msg, index) => (
                                <div key={index} className="p-1 border-b">
                                    <strong>{msg.sender}: </strong>
                                    <span>{msg.message}</span>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                value={chatText}
                                onChange={(e) => setChatText(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                className="flex-1"
                            />
                            <Button type="submit" color="primary">
                                Enviar
                            </Button>
                        </form>
                    </div>

                    {quizStarted && perguntaAtual ? (
                        <div className="w-[90%] pb-20 p-10 flex flex-col justify-center items-center gap-10">
                            <h1 className="text-2xl">Pergunta</h1>
                            <div className="w-[90%] h-fit p-10 flex flex-col justify-center items-center gap-4 border-2 rounded-md border-cyan-500">
                                <p className="text-2xl">{perguntaAtual.pergunta}</p>
                            </div>
                            <div className="w-[90%] p-5 flex flex-wrap justify-center items-center gap-5">
                                {alternativasAtuais.map((alternativa, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSelecionarAlternativa(alternativa)}
                                        className="w-[45%] hover:bg-cyan-900 rounded-lg p-5 flex justify-start items-center gap-4 border-2 border-cyan-300"
                                    >
                                        <p>{alternativa.alternativa}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}
