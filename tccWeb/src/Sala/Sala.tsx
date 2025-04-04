import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import { useSocket } from '../hooks/useSocket';
import Navbar from '../components/Navbar/Navbar';
import { Form, Input, Button, Select, SelectItem } from "@heroui/react";
import { useFormik } from 'formik';
import UserCard from '../components/UserCard/UserCard';

interface Usuario {
  id: number;
  nome: string;
  nivel: string;
  tipo_usuario_id: number;
  id_turma: number;
  id_escola: number;
  avatar: { nome: string; caminho: string; };
}

interface Pergunta {
  id: number;
  materia_id: number;
  pergunta: string;
  alternativas: Alternativa[];
  respostaCorreta: string;
}

interface Alternativa {
  id: number;
  pergunta_id: number;
  alternativa: string;
  correta: boolean;
}

interface Sala {
  id: number;
  codigo: string;
  host_id: number;
  status: string;
}

interface ChatMessage { /* ... */ }

interface Estatisticas {
  total_disputas: number;
  total_disputas_ganhas: number;
  total_perguntas: number;
  total_perguntas_acertadas: number;
}

interface Score {
  userId: number;
  userName: string;
  pontos: number;
}

export function Sala() {
  let { codigo } = useParams();
  const navigate = useNavigate();
  const { token, user } = useTokenStore();
  const socket = useSocket();

  const [usuarioNavBar, setUsuarioNavBar] = useState<Usuario>();
  const [sala, setSala] = useState<Sala>();
  const [alunos, setAlunos] = useState<Usuario[]>([]);
  const [materias, setMaterias] = useState<any[]>([]);
  const [selectedMaterias, setSelectedMaterias] = useState<number[]>([]);
  const [perguntasMaterias, setPerguntasMaterias] = useState<Pergunta[]>([]);
  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
  const [alternativasAtuais, setAlternativasAtuais] = useState<Alternativa[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState<string>("");
  const [dados, setDados] = useState<Estatisticas | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [quizStarted, setQuizStarted] = useState(false);
  const [readyPlayers, setReadyPlayers] = useState<number[]>([]);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [vencedor, setVencedor] = useState<string | null>(null);
  const [jaRespondeu, setJaRespondeu] = useState(false);
  const [scoreboard, setScoreboard] = useState<Score[]>([]);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // BUSCA DAS MATÉRIAS
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
    initialValues: { materias: [] },
    onSubmit: async (values) => {
      const response = await fetch(
        `http://localhost:3000/sala/perguntas/1/3/${values.materias[0]}/${values.materias[1]}/${values.materias[2]}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const perguntas = await response.json();
      setPerguntasMaterias(perguntas);
      socket?.emit("enviarPerguntas", { roomId: sala?.id, perguntas });
    },
  });

  // BUSCA INFORMAÇÕES DO USUÁRIO
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
    async function carregarDados() {
      const response = await fetch(`http://localhost:3000/estatisticas/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const estaticasUsuario = await response.json();
      setDados(estaticasUsuario);
      setCarregando(false);
    }
    carregarDados();
  }, [user, token])


  // RECEBE EVENTO "countdown"
  useEffect(() => {
    if (!socket) return;
    const handleCountdown = ({ countdown }: { countdown: number }) => {
      setCountdown(countdown);
    };
    socket.on("countdown", handleCountdown);
    return () => {
      socket.off("countdown", handleCountdown);
    }
  }, [socket]);

  // RECEBE EVENTO "startQuestion"
  useEffect(() => {
    if (!socket) return;
    const handleStartQuestion = ({ pergunta, tempo }: { pergunta: Pergunta, tempo: number }) => {
      setCountdown(null);
      setPerguntaAtual(pergunta);
      setAlternativasAtuais(pergunta.alternativas);
      setTempoRestante(tempo);
      setVencedor(null);
      setJaRespondeu(false);
    };
    socket.on("startQuestion", handleStartQuestion);
    return () => {
      socket.off("startQuestion", handleStartQuestion);
    }
  }, [socket]);

  // RECEBE ATUALIZAÇÃO DO TIMER
  useEffect(() => {
    if (!socket) return;
    const handleUpdateTimer = ({ remainingTime }: { remainingTime: number }) => {
      setTempoRestante(remainingTime);
    };
    socket.on("updateTimer", handleUpdateTimer);
    return () => {
      socket.off("updateTimer", handleUpdateTimer);
    }
  }, [socket]);


  // RECEBE RESULTADO DA PERGUNTA
  useEffect(() => {
    if (!socket) return;
    const handleResultadoPergunta = ({ vencedor, respostaCorreta, scoreboard }: { vencedor: string | null, respostaCorreta: string, scoreboard: Score[] }) => {
      setVencedor(vencedor);
      setScoreboard(scoreboard);
    };
    socket.on("resultadoPergunta", handleResultadoPergunta);
    return () => {
      socket.off("resultadoPergunta", handleResultadoPergunta);
    }
  }, [socket]);

  // RECEBE EVENTO "quizFinalizado"
  useEffect(() => {
    if (!socket) return;
    const handleQuizFinalizado = ({ scoreboard, vencedorFinal }: { scoreboard: Score[], vencedorFinal: string }) => {
      setScoreboard(scoreboard);
      console.log('vencedorFinal', vencedorFinal)
      atualizarSala("encerrada", parseInt(vencedorFinal))
      setQuizFinalizado(true);
      setQuizStarted(false);
    };
    socket.on("quizFinalizado", handleQuizFinalizado);
    return () => {
      socket.off("quizFinalizado", handleQuizFinalizado);
    }
  }, [socket, sala]);

  // CHAT
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = ({ message, sender }: { message: string; sender: string }) => {
      setChatMessages(prev => [...prev, { message, sender }]);
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    }
  }, [socket]);

  // MATÉRIAS SELECIONADAS
  useEffect(() => {
    if (!socket) return;
    const handleMateriasSelecionadas = (materiasSelecionadas: number[]) => {
      setSelectedMaterias(materiasSelecionadas);
      formik.setFieldValue("materias", materiasSelecionadas);
    };
    socket.on("materiasSelecionadas", handleMateriasSelecionadas);
    return () => {
      socket.off("materiasSelecionadas", handleMateriasSelecionadas);
    }
  }, [socket, formik]);

  // ATUALIZAÇÃO DA LISTA DE JOGADORES PRONTOS
  useEffect(() => {
    if (!socket) return;
    const handleUpdateReady = (data: { readyUserIds: number[] }) => {
      setReadyPlayers(data.readyUserIds);
    };
    socket.on("updateReady", handleUpdateReady);
    return () => {
      socket.off("updateReady", handleUpdateReady);
    }
  }, [socket]);



  // INICIA O QUIZ
  useEffect(() => {
    if (!socket) return;
    const handleIniciarQuiz = () => {
      atualizarSala("em andamento", null)
      setQuizStarted(true);
      setQuizFinalizado(false);
    };
    socket.on("iniciarQuiz", handleIniciarQuiz);
    return () => {
      socket.off("iniciarQuiz", handleIniciarQuiz);
    }
  }, [socket, sala]);

  async function atualizarSala(status: string, vencedorId: number | null) {
    const resposta = await fetch(`http://localhost:3000/sala/${sala?.codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: status,
        vencedor_id: vencedorId
      })
    });

    if (resposta.ok) {
      console.log('sala em andamneto')
    } else {
      console.log('erro ao atualizar sala')
    }
  }

  // RECEBE PERGUNTAS (caso venha algum evento extra)
  useEffect(() => {
    if (!socket) return;
    const handleReceberPerguntas = (perguntas) => {
      console.log("Perguntas recebidas via Socket:", perguntas);
      setPerguntasMaterias(perguntas);
    };
    socket.on("receberPerguntas", handleReceberPerguntas);
    return () => {
      socket.off("receberPerguntas", handleReceberPerguntas);
    }
  }, [socket]);

  // Ao clicar em uma alternativa, envia a resposta (apenas uma por pergunta)
  function handleSelecionarAlternativa(alternativa: Alternativa) {
    if (jaRespondeu) return;
    setJaRespondeu(true);
    socket?.emit("responderPergunta", {
      roomId: sala?.id,
      userId: user?.id,
      respostaId: alternativa.id,
      userName: usuarioNavBar?.nome,
    });
  }

  // Envia mensagem no chat
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (socket && sala?.id && chatText.trim() !== "") {
      socket.emit("message", { roomId: sala.id, message: chatText, userName: usuarioNavBar?.nome });
    }
    setChatText('');
  };

  // Atualiza a seleção de matérias (para o host)
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

  // Botão "Pronto"
  const handlePronto = () => {
    if (socket && sala?.id && user) {
      socket.emit("pronto", { roomId: sala.id, userId: user.id });
    }
  };

  // Evento para o host solicitar a próxima pergunta
  const handleNextQuestion = () => {
    socket?.emit("nextQuestion", { roomId: sala?.id });
  };

  // BUSCA DA SALA
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

  // BUSCA DOS JOGADORES NA SALA
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
  }, [sala, token, socket]);

  useEffect(() => {
    if (!socket) return;
    const handlePlayersUpdated = (players: Array<{ userId: number; userName: string }>) => {
      const alunosFormatados = players.map(player => ({
        usuario: {
          id: player.userId,
          nome: player.userName,
          nivel: "",
          tipo_usuario_id: 0,
          id_turma: 0,
          id_escola: 0,
          avatar: { nome: "", caminho: "" },
        }
      }));
      setAlunos(alunosFormatados);
    };
    socket.on("playersUpdated", handlePlayersUpdated);
    return () => {
      socket.off("playersUpdated", handlePlayersUpdated);
    }
  }, [socket]);

  useEffect(() => {
    if (socket && user && sala?.id) {
      socket.emit("joinRoom", { roomId: sala.id, userName: usuarioNavBar?.nome, userId: usuarioNavBar?.id });
    }
  }, [socket, user, sala, usuarioNavBar]);

  async function atualizeXP(xp: number) {
    try {
      const response = await fetch(`http://localhost:3000/usuarios/${user?.id}/atualizaexperiencia`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ xpGanho: xp })
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar usuário: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
    }
  }

  async function handleVoltar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const userIndex = scoreboard.findIndex(scoreUser => scoreUser.userId === usuarioNavBar?.id);

    const xpToUpdate = userIndex === 0 ? 1200 : 200;
    xpToUpdate === 1200 ? atualizeXP(1200) : atualizeXP(200);

    const vitorias = userIndex === 0 ? 1 : 0;

    const pontos = scoreboard[userIndex]?.pontos || 0;

    const totalPerguntas = (dados?.total_perguntas || 0) + 12;
    const totalPerguntasAcertadas = (dados?.total_perguntas_acertadas || 0) + pontos;
    const totalDisputas = (dados?.total_disputas || 0) + 1;
    const totalDisputasGanhas = (dados?.total_disputas_ganhas || 0) + vitorias;

    const resposta = await fetch(`http://localhost:3000/estatisticas/${user?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        total_perguntas: totalPerguntas,
        total_perguntas_acertadas: totalPerguntasAcertadas,
        total_disputas: totalDisputas,
        total_disputas_ganhas: totalDisputasGanhas
      })
    });

    if (resposta.ok) {
      alert('Usuário atualizado com sucesso');
      navigate('/home');
    } else {
      alert("Erro ao atualizar usuário");
    }
  }



  function renderScoreboard() {
    if (scoreboard.length === 0) return null;
    const sorted = [...scoreboard].sort((a, b) => b.pontos - a.pontos);
    return (
      <div className="w-[90%] p-5 border rounded-md mt-5">
        <h2 className="text-xl font-bold mb-3">Placar</h2>
        {sorted.map(({ userId, userName, pontos }) => (
          <div key={userId} className="flex justify-between border-b py-1">
            <span>{userName}</span>
            <span>{pontos} ponto{pontos !== 1 && 's'}</span>
          </div>
        ))}
      </div>
    );
  }

  if (!usuarioNavBar) {
    return <p>Carregando...</p>;
  }
  if (!sala || !sala.codigo) return;
  if (carregando && usuarioNavBar?.tipo_usuario_id === 2) return <p>Carregando estatísticas...</p>;
  if (!dados && usuarioNavBar?.tipo_usuario_id === 2) return <p>Erro ao carregar estatísticas.</p>;

  return (
    <>
      {quizFinalizado ?
        <div className="w-screen flex pb-10 flex-col justify-start items-center min-h-screen gap-12 mb-40">
          <Navbar id={usuarioNavBar.id} nivel={usuarioNavBar.nivel} avatar={usuarioNavBar.avatar.caminho || ''} />
          <h1 className="text-3xl font-bold">Quiz Finalizado!</h1>
          <div className='w-[80%] flex justify-around items-start gap-5'>
            <div className="w-[40%] p-5 border rounded-md">
              <h2 className="text-2xl font-bold mb-3">Placar Final</h2>
              {scoreboard.sort((a, b) => b.pontos - a.pontos).map(({ userId, userName, pontos }) => (
                <div key={userId} className="flex justify-between border-b py-1">
                  <span>{userName}</span>
                  <span>{pontos} ponto{pontos !== 1 && 's'}</span>
                </div>
              ))}
            </div>
            <div className="w-[40%] border p-5 flex flex-col gap-5">
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
                <Input value={chatText} onChange={(e) => setChatText(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1" />
                <Button type="submit" color="primary">Enviar</Button>
              </form>
            </div>

          </div>

          <Button size="lg" onClick={handleVoltar} color="primary">Encerrar sala</Button>
        </div>
        : quizStarted ?
          <div className="w-screen flex pb-10 flex-col justify-center items-center min-h-screen gap-12 mb-40">
            <Navbar id={usuarioNavBar.id} nivel={usuarioNavBar.nivel} avatar={usuarioNavBar.avatar.caminho || ''} />
            {countdown !== null ?
              <div className="text-4xl font-bold">Iniciando em {countdown}...</div>
              :
              <div className="w-[90%] pb-20 p-10 flex flex-col justify-center items-center gap-10">
                <h1 className="text-2xl">Pergunta</h1>
                <div className="w-[90%] h-fit p-10 flex flex-col justify-center items-center gap-4 border-2 rounded-md border-cyan-500">
                  <p className="text-2xl">{perguntaAtual?.pergunta}</p>
                </div>
                <div>
                  <p>Tempo restante: {tempoRestante} segundos</p>
                </div>
                <div className="w-[90%] p-5 flex flex-wrap justify-center items-center gap-5">
                  {alternativasAtuais.map((alternativa, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelecionarAlternativa(alternativa)}
                      className={`w-[45%] hover:bg-cyan-900 rounded-lg p-5 flex justify-start items-center gap-4 border-2 border-cyan-300 cursor-pointer ${jaRespondeu ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <p>{alternativa.alternativa}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {vencedor ? `Vencedor da rodada: ${vencedor}` : ""}
                  </p>
                </div>
                {renderScoreboard()}
                {vencedor !== null && user?.id === sala?.host_id && (
                  <Button onClick={handleNextQuestion} color="primary">
                    Próxima Pergunta
                  </Button>
                )}
              </div>
            }
          </div>
          :
          <div className="w-screen flex pb-10 flex-col justify-start items-center min-h-screen gap-12 mb-40">
            <Navbar id={usuarioNavBar.id} nivel={usuarioNavBar.nivel} avatar={usuarioNavBar.avatar.caminho || ''} />
            <div className="w-[95%] border flex justify-center items-start gap-10 p-5">
              <div className="w-[25%] border flex flex-col gap-10 p-5">
                <div className="w-[100%] border flex flex-col gap-5 p-5">
                  <p>Código de sala {codigo}</p>
                  <p>Prontos: {readyPlayers.length} / {alunos.length}</p>
                </div>
                {user?.id === sala?.host_id ?
                  <>
                    <h1>Selecione 3 disciplinas</h1>
                    <Form className="w-[100%] flex flex-col justify-center items-center gap-4" onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
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
                        <Button size="sm" color="primary" type="submit">Enviar</Button>
                        <Button size="sm" type="reset" variant="flat">Limpar</Button>
                      </div>
                    </Form>
                  </>
                  :
                  <div className="w-[100%] flex flex-col justify-center items-center gap-4">
                    <h2>Matérias Selecionadas:</h2>
                    {selectedMaterias && selectedMaterias.length > 0 ?
                      selectedMaterias.map((materiaId, index) => {
                        const materia = materias.find(m => m.id === materiaId);
                        return <p key={index} className="text-lg font-semibold">{materia ? materia.nome : 'Matéria não encontrada'}</p>;
                      })
                      :
                      <p>Nenhuma matéria selecionada</p>
                    }
                  </div>
                }
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
                        classe="w-[60%] bg-gray-400 flex justify-between items-center text-black p-2.5 cursor-pointer rounded-md"
                      />
                    ))}
                  </div>
                </>
                <Button size="lg" onClick={handlePronto} color="primary">Pronto</Button>
                <div className="text-4xl font-bold">Iniciando em {countdown}...</div>
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
                  <Input value={chatText} onChange={(e) => setChatText(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1" />
                  <Button type="submit" color="primary">Enviar</Button>
                </form>
              </div>
            </div>
          </div>
      }
    </>
  );
}
